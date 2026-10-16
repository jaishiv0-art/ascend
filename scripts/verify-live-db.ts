import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { getCleanSupabaseConfig, isSupabaseConfigured } from '../lib/supabase/config';

// Parse .env.local manually if dotenv is not installed
const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = '';
let anonKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.slice('NEXT_PUBLIC_SUPABASE_URL='.length).replace(/['"]/g, '').trim();
      try {
        const parsed = new URL(supabaseUrl);
        supabaseUrl = parsed.origin;
      } catch {}
    }
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      anonKey = trimmed.slice('NEXT_PUBLIC_SUPABASE_ANON_KEY='.length).replace(/['"]/g, '').trim();
    }
  }
}

// Fallback to code config in lib/supabase/config.ts if not found in .env.local
if (!supabaseUrl || !anonKey) {
  const codeConfig = getCleanSupabaseConfig();
  if (isSupabaseConfigured()) {
    supabaseUrl = codeConfig.url;
    anonKey = codeConfig.key;
  }
}

if (!supabaseUrl || !anonKey) {
  console.log('No Supabase credentials configured in .env.local or lib/supabase/config.ts');
  process.exit(0);
}

async function testSupabase() {
  console.log('Testing live Supabase tables and views via REST...\n');
  const tables = [
    'profiles',
    'attributes',
    'streaks',
    'quests',
    'quest_completions',
    'items',
    'inventory',
    'achievements',
    'user_achievements',
    'transactions',
  ];

  for (const table of tables) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.log(`  Table [${table}]: Status ${res.status} — ${text}`);
      } else {
        const data = await res.json();
        console.log(`  ✅ Table [${table}]: Live & Accessible (HTTP 200, ${data.length} records returned)`);
      }
    } catch (e: any) {
      console.log(`  Table [${table}]: Fetch Error: ${e.message}`);
    }
  }

  // Test profiles query fallback
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=user_id,username,archetype,avatar_url,level,xp,title&order=level.desc,xp.desc&limit=5`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      console.log(`  Profiles Leaderboard Query: Status ${res.status} — ${text}`);
    } else {
      const data = await res.json();
      console.log(`  ✅ Profiles Leaderboard Query: HTTP 200 (${data.length} real registered players in DB)`);
    }
  } catch (e: any) {
    console.log(`  Profiles Leaderboard Query: Fetch Error: ${e.message}`);
  }
}

testSupabase();
