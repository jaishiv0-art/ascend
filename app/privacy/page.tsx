'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 sm:px-8">
      <div className="flex items-center justify-between mb-12">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F5F5F7] text-sm font-semibold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Logo size="md" />
      </div>

      <div className="apple-card p-8 sm:p-10 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-sm sm:prose-base prose-p:text-[#6E6E73] prose-headings:text-[#1D1D1F] max-w-none space-y-6 text-[#1D1D1F] leading-relaxed">
          <p className="text-sm font-medium text-[#8E8E93]">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <p>
            Welcome to ASCEND. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our application and tell you about your privacy rights.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Data We Collect</h2>
          <p>
            When you register for an account using email/password or Google OAuth, we collect your email address and profile name for the sole purpose of providing authentication and securing your account. We also store your in-app progression data (quests, XP, level, gold, and streaks) tied securely to your account.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Data</h2>
          <p>
            Your data is used exclusively to provide the ASCEND service to you. This includes saving your progress, calculating your stats, and providing a personalized experience. We do not use your data for advertising purposes.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Data Sharing and Third Parties</h2>
          <p>
            <strong>We do not sell, rent, or share your personal data with third parties.</strong> We use trusted third-party service providers solely as data processors to run the application:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Supabase:</strong> For secure database hosting and user authentication.</li>
            <li><strong>Vercel:</strong> For securely hosting the application frontend.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Your Rights</h2>
          <p>
            You have the right to request access to your personal data or ask us to delete your account and all associated data at any time. To do so, please contact us.
          </p>
          
          <p className="mt-8 pt-6 border-t border-[#E5E5EA] text-sm text-[#8E8E93]">
            This app is a project built for a hackathon and is provided as-is.
          </p>
        </div>
      </div>
    </div>
  );
}
