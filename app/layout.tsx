import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/lib/context/game-context';
import { Navbar } from '@/components/layout/Navbar';
import { LevelUpModal } from '@/components/modals/LevelUpModal';
import { AchievementUnlockBanner } from '@/components/modals/AchievementUnlockBanner';
import { CharacterUnlockWatcher } from '@/components/modals/CharacterUnlockWatcher';
import { AlarmWatcher } from '@/components/layout/AlarmWatcher';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ASCEND | Turn Your Life Into an RPG',
  description: 'Transform daily tasks, workouts, learning, and habits into a rewarding life game. Earn XP, level up core attributes, maintain daily streaks, and conquer your goals.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#FAFAF8] font-sans text-[#1D1D1F] antialiased selection:bg-[#7C3AED] selection:text-white relative">
        <AmbientBackground variant="global" />
        <GameProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <LevelUpModal />
            <AchievementUnlockBanner />
            <CharacterUnlockWatcher />
            <AlarmWatcher />
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
