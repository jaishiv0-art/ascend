'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Prevent login if Supabase is not configured (e.g. placeholder env vars)
  if (!isSupabaseConfigured()) {
    return { error: 'Authentication is not configured. Please add your Supabase credentials in .env.local.' };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Incorrect email or password. Please try again.' };
    } else if (error.message.includes('Email not confirmed')) {
      return { error: 'Please confirm your email address before signing in.' };
    }
    return { error: error.message };
  }

  // Redirect on successful login
  redirect('/dashboard');
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const archetype = formData.get('archetype') as string;

  if (!email || !password || !username) {
    return { error: 'All fields are required' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Authentication is not configured. Please add your Supabase credentials in .env.local.' };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        archetype,
      },
    },
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      return { error: 'An account with this email already exists. Please sign in.' };
    }
    if (error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('email')) {
      return {
        error: 'Supabase email limit exceeded (free tier allows only 3 emails/hr). To fix this permanently: In Supabase -> Authentication -> Providers -> Email, turn OFF "Confirm email" and click Save.'
      };
    }
    return { error: error.message };
  }

  redirect('/dashboard');
}
