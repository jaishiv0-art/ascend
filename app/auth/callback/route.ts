// ==============================================================================
// ASCEND - SUPABASE OAUTH CALLBACK HANDLER (Route Handler)
// Exchanges OAuth code for session and routes to onboarding or dashboard
// ==============================================================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
      const msg = error?.message || 'no_user_returned';
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
    }

    const user = data.user;

    // Check if profile exists and whether the user has set an archetype
    const { data: profile } = await supabase
      .from('profiles')
      .select('archetype, username')
      .eq('user_id', user.id)
      .maybeSingle();

    // First-time Google OAuth users won't have an archetype yet → send to onboarding
    const hasUserMetaArchetype = Boolean(user.user_metadata?.archetype);
    const hasProfileArchetype = Boolean(profile?.archetype);

    const redirectUrl =
      !hasUserMetaArchetype || !hasProfileArchetype
        ? `${origin}/onboarding`
        : `${origin}/dashboard`;

    return NextResponse.redirect(redirectUrl);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown_error';
    console.error('[ASCEND OAuth Callback Error]:', msg);
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
  }
}
