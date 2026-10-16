// ==============================================================================
// ASCEND - PUBLIC LEADERBOARD API
// Exposes ONLY non-sensitive progression metrics via the leaderboard_view.
// ZERO private fields exposed (no email, no gold, no transactions)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { LeaderboardEntry, LeaderboardResponse, Archetype } from '@/types/rpg';

// Allowed public fields — anything else is stripped before sending
const ALLOWED_FIELDS = new Set([
  'rank', 'user_id', 'username', 'archetype', 'avatar_url',
  'level', 'total_xp', 'title', 'achievement_count', 'is_current_user',
]);

function sanitizeEntry(raw: Record<string, unknown>, isCurrentUser: boolean): LeaderboardEntry {
  const entry: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in raw) entry[key] = raw[key];
  }
  return {
    rank: Number(entry.rank ?? 0),
    user_id: String(entry.user_id ?? ''),
    username: String(entry.username ?? 'Ascendant'),
    archetype: (entry.archetype ?? 'Cyber Mage') as Archetype,
    avatar_url: entry.avatar_url ? String(entry.avatar_url) : undefined,
    level: Number(entry.level ?? 1),
    total_xp: Number(entry.total_xp ?? 0),
    title: String(entry.title ?? 'Initiate Seeker'),
    achievement_count: Number(entry.achievement_count ?? 0),
    is_current_user: isCurrentUser,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

    // If Supabase is not configured, return an honest empty result
    if (!isSupabaseConfigured()) {
      const response: LeaderboardResponse = {
        leaderboard: [],
        currentUserEntry: null,
        totalParticipants: 0,
      };
      return NextResponse.json(response);
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Query the leaderboard_view directly — it already computes rank, joins
    // profiles + user_achievements, and projects only safe public fields.
    const { data: rawRows, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) {
      // Fallback: if the view doesn't exist yet, query profiles directly
      // Note: We cannot join user_achievements directly because they both link to auth.users,
      // not to each other. We omit the achievement count in the fallback to prevent crashes.
      const { data: profileRows, error: profileError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          username,
          archetype,
          avatar_url,
          level,
          xp,
          title
        `)
        .order('level', { ascending: false })
        .order('xp', { ascending: false })
        .limit(limit);

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }

      const entries: LeaderboardEntry[] = (profileRows || []).map((row, idx) => {
        const isMe = user ? row.user_id === user.id : false;
        return sanitizeEntry({
          rank: idx + 1,
          user_id: row.user_id,
          username: row.username,
          archetype: row.archetype,
          avatar_url: row.avatar_url,
          level: row.level,
          total_xp: row.xp,
          title: row.title,
          achievement_count: 0,
        }, isMe);
      });

      // Find current user's entry (may be outside top N if we had more data)
      let currentUserEntry: LeaderboardEntry | null = null;
      if (user) {
        currentUserEntry = entries.find((e) => e.user_id === user.id) || null;
      }

      const response: LeaderboardResponse = {
        leaderboard: entries,
        currentUserEntry,
        totalParticipants: entries.length,
      };

      const res = NextResponse.json(response);
      res.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
      return res;
    }

    // Happy path: leaderboard_view exists
    const allEntries: LeaderboardEntry[] = (rawRows || []).map((row) => {
      const isMe = user ? row.user_id === user.id : false;
      return sanitizeEntry(row as Record<string, unknown>, isMe);
    });

    let currentUserEntry: LeaderboardEntry | null = null;
    if (user) {
      // Check if user is in the fetched rows
      currentUserEntry = allEntries.find((e) => e.user_id === user.id) || null;

      // If the user is not in the top N, fetch their rank separately
      if (!currentUserEntry) {
        const { data: userRow } = await supabase
          .from('leaderboard_view')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (userRow) {
          currentUserEntry = sanitizeEntry(userRow as Record<string, unknown>, true);
        }
      }
    }

    // Get total count for display
    const { count } = await supabase
      .from('profiles')
      .select('user_id', { count: 'exact', head: true });

    const response: LeaderboardResponse = {
      leaderboard: allEntries,
      currentUserEntry,
      totalParticipants: count || allEntries.length,
    };

    const res = NextResponse.json(response);
    res.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res;
  } catch (err: unknown) {
    console.error('[ASCEND API Leaderboard] Unhandled error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
