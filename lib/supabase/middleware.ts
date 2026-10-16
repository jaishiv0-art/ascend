// ==============================================================================
// ASCEND - SUPABASE MIDDLEWARE AUTH SESSION REFRESHER
// ==============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getCleanSupabaseEnv, isSupabaseConfigured } from './client';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If using placeholder or Supabase is not configured, pass through directly
  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  const { url: supabaseUrl, key: supabaseKey } = getCleanSupabaseEnv();

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === 'production'
            })
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Protect authenticated routes
    const protectedRoutes = ['/dashboard', '/onboarding', '/character', '/quests', '/inventory', '/calendar', '/achievements'];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch {
    // If Supabase is offline/unreachable in local dev, allow request to continue
  }

  return supabaseResponse;
}
