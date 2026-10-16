'use client';

// ==============================================================================
// ASCEND - SIGNUP AUTHENTICATION
// Clean Minimalist Theme
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useGame } from '@/lib/context/game-context';
import { ArrowRight, ArrowLeft, UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ARCHETYPE_LIST } from '@/lib/progression/archetypes';
import { Archetype } from '@/types/rpg';
import { PageMascot } from '@/components/PageMascot';
import { signupAction } from '@/app/auth/actions';

export default function SignupPage() {
  const router = useRouter();
  const { loginAsDemoUser, isDemoUser, isLoaded } = useGame();

  // Redirect already-authenticated users away from this page
  useEffect(() => {
    if (isLoaded && !isDemoUser) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isDemoUser, router]);

  // Show spinner while checking auth to avoid a flash of the sign-in form
  if (!isLoaded || !isDemoUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
      </div>
    );
  }

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [archetype, setArchetype] = useState<Archetype>('Cyber Mage');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('provider is not enabled') || error.message.toLowerCase().includes('not configured')) {
          setErrorMsg('Google Sign-In is not currently configured.');
        } else {
          setErrorMsg(error.message);
        }
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to initialize Google Sign-In.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      {/* Top Back Navigation */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F5F5F7] text-xs font-mono font-bold shadow-sm transition-all cursor-pointer group"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600 group-hover:-translate-x-1 transition-transform" />
          <span>BACK</span>
        </button>
      </div>

      <div className="p-8 sm:p-10 bg-white border border-[#E5E5E7] rounded-3xl shadow-sm text-center relative overflow-hidden">
        {/* Top Studying & Goal Achievement Mascot Animation */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 via-indigo-400/20 to-blue-400/20 rounded-full blur-lg" />
            <PageMascot animationType="studying" size={105} position="inline" />
          </div>
          <span className="mt-1 text-[11px] font-mono font-bold text-purple-600 bg-purple-50 border border-purple-200/60 px-3 py-0.5 rounded-full uppercase tracking-wider">
            Begin Your Ascension
          </span>
        </div>

        {/* Top Logo */}
        <div className="flex justify-center mb-3">
          <Link href="/" className="inline-flex hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Create Your Hero</h1>
        <p className="text-sm font-medium text-[#86868B] mt-1">Begin your real-life RPG progression journey</p>

        {errorMsg && (
          <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-medium text-left flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-[#F5F5F7] border border-[#E5E5EA] hover:border-[#D1D1D6] text-[#1D1D1F] font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E5EA]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#86868B] font-mono font-medium">Or register with email</span>
          </div>
        </div>

        <form action={async (formData) => {
          setIsLoading(true);
          setErrorMsg(null);
          
          const result = await signupAction(formData);
          
          if (result?.error) {
            setErrorMsg(result.error);
            setIsLoading(false);
          }
        }} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Hero Codename / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. Kaelen Vance"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl text-[#1D1D1F] text-sm placeholder-[#86868B] focus:outline-none focus:border-[#FF5E3A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="hero@ascend.rpg"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl text-[#1D1D1F] text-sm placeholder-[#86868B] focus:outline-none focus:border-[#FF5E3A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl text-[#1D1D1F] text-sm placeholder-[#86868B] focus:outline-none focus:border-[#FF5E3A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Starting Archetype
            </label>
            <select
              name="archetype"
              value={archetype}
              onChange={(e) => setArchetype(e.target.value as Archetype)}
              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:border-[#FF5E3A] focus:bg-white transition-all cursor-pointer"
            >
              {ARCHETYPE_LIST.map((arch) => (
                <option key={arch.id} value={arch.id}>
                  {arch.name} ({arch.role})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#FF5E3A] to-[#FF2A6D] text-white font-semibold text-sm rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Creating Hero...' : 'Forge Hero Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-xs text-[#86868B]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#FF5E3A] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
