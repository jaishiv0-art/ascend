// ==============================================================================
// ASCEND - SUPABASE BROWSER CLIENT
// ==============================================================================

import { createBrowserClient } from '@supabase/ssr';
import {
  getCleanSupabaseConfig,
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from './config';

export {
  getCleanSupabaseConfig,
  getCleanSupabaseConfig as getCleanSupabaseEnv,
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
};

export function createClient() {
  const { url, key } = getCleanSupabaseConfig();
  return createBrowserClient(url, key);
}


