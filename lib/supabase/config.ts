// ==============================================================================
// ASCEND - SUPABASE CENTRALIZED CONFIGURATION
// ==============================================================================
// You can provide your Supabase credentials in either of two ways:
//
// OPTION 1: Set them in your .env.local file:
//   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
//
// OPTION 2: Directly replace the strings below in this file:
// ==============================================================================

// Replace with your Project URL (from Supabase Dashboard -> Project Settings -> API)
export const SUPABASE_URL: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gnbmheligzanxmyhaarh.supabase.co';

// Replace with your Anon Key (from Supabase Dashboard -> Project Settings -> API)
export const SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hqXW2m-lbLrTn1XCwePYwg_2h0W4v7J';

// Optional: Service Role Key (keep secret)
export const SUPABASE_SERVICE_ROLE_KEY: string =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Sanitizes and extracts clean bare origin URL and key, stripping
 * whitespace, enclosing quotes, or accidental /rest/v1 paths.
 */
export function getCleanSupabaseConfig() {
  let rawUrl = (SUPABASE_URL || 'https://placeholder.supabase.co')
    .trim()
    .replace(/^["']|["']$/g, '');
  const rawKey = (SUPABASE_ANON_KEY || 'placeholder-key')
    .trim()
    .replace(/^["']|["']$/g, '');

  try {
    const parsed = new URL(rawUrl);
    rawUrl = parsed.origin;
  } catch {
    // Preserve as-is if parsing fails
  }

  return {
    url: rawUrl,
    key: rawKey,
    serviceRoleKey: (SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/^["']|["']$/g, ''),
  };
}

/**
 * Returns true if real, valid Supabase credentials are configured
 * (not the placeholder strings).
 */
export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getCleanSupabaseConfig();
  if (!url || !key) return false;
  if (
    url.includes('placeholder') ||
    url.includes('your-project-id') ||
    url.includes('your-project') ||
    url === 'https://.supabase.co' ||
    key === 'placeholder-key' ||
    key.includes('your-anon-public-key') ||
    key.length < 20
  ) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};
