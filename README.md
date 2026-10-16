# ⚡ ASCEND: Life RPG Productivity Protocol ⚡

> Transform real-life tasks, fitness workouts, coding sprints, and daily habits into an epic Cyberpunk Life RPG with non-linear math, server-authoritative progression, calendar streaks, achievements, and an in-game economy.

---

## 🎮 Core Game Loop

```
Real-Life Action → Forge Quest → Server Verification → Authoritative XP / Gold / Attribute XP → Level Up → Daily Streak Multiplier → Unlock Trophies → Guild Shop Purchases → Visible Hero Growth
```

---

## 🌟 Key Features

### 1. Server-Authoritative Progression Engine
- **Non-Linear Leveling Formula**:
  $$\text{XP}(N) = 100 \times N^{1.5}$$
  - Level 1: 0 XP
  - Level 2: 282 XP
  - Level 3: 801 XP
  - Level 4: 1,601 XP
  - Functions: `calculateLevelFromXP`, `calculateXPForLevel`, `calculateXPToNextLevel`, `calculateLevelProgress`.
- **Authoritative Server Security**: Quests are verified and calculated server-side (`/api/quests/[id]/complete`). The client cannot spoof level, gold, or XP rewards.
- **Double-Completion Protection**: Guard checks prevent repeated reward claiming.

### 2. 6-Attribute RPG Mastery
Every task contributes directly to one of six core life attributes:
- **Intellect (INT)**: Deep work, coding, research, reading (*Work, Learning*).
- **Strength (STR)**: Heavy lifting, resistance training, physical power (*Fitness*).
- **Vitality (VIT)**: Recovery, sleep hygiene, hydration, cardio (*Fitness, Habit*).
- **Discipline (DIS)**: Habit consistency, impulse control, daily routines (*Habit, Work*).
- **Creativity (CRT)**: UI/UX design, writing, arts, divergent thinking (*Creative*).
- **Charisma (CHA)**: Networking, leadership, public speaking (*Social, Leadership*).

### 3. Character Archetypes & Perks
- **Cyber Mage**: +15% Intellect mastery and deep work XP bonus.
- **Iron Titan**: +15% Strength & Vitality growth on fitness quests.
- **Shadow Rogue**: +20% bonus Gold loot on medium and hard quests.
- **Bio Hacker**: +20% Vitality growth and extended streak buffer.
- **Astral Sage**: +20% bonus XP for creative and social endeavors.
- **Nova Paladin**: +25% Charisma growth on leadership quests.

### 4. Calendar Daily Streak & Freeze System
- **1-Increment-Per-Calendar-Day**: Strict UTC/timezone handling so completing 10 tasks in one day maintains that day's combo without duplicate streak inflation.
- **Consecutive Day Rollover**: Tracks yesterday vs today vs missed days.
- **Streak Freeze Relics**: Protects your combo if a day is missed. Can be purchased in the Guild Shop.

### 5. Guild Shop & Economy
- **Cosmetics & Themes**: Obsidian Void, Solar Flare, Emerald Matrix, Crimson Vanguard, and Cyberpunk Neon.
- **Badges & Crests**: Novice Slayer, Neural Architect, Iron Will, Titan of the Grid, Ascendant Singularity.
- **Display Titles**: The Relentless, Neural Overlord, Shadow Operator, Grand Ascendant.
- **Avatar Frames**: Neon Hexagon, Plasma Holo-Ring, Celestial Aureole.
- **Consumables**: Streak Freeze Relics and Focus Elixirs.

### 6. Trophy Hall of Fame (Achievements)
- Real-time server condition evaluation across quests cleared, streak milestones (3, 7, 30, 100 days), attribute mastery, and treasury wealth.
- Floating unlock celebration notifications with sound fanfares and claimable gold rewards.

### 7. Procedural Web Audio SFX Engine
- Built-in zero-latency procedural synthesizer using Web Audio API (no external audio files required).
- Generates tactile cyber clicks, ascending quest completion chords, gold clinks, and heroic level-up fanfares.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16+ (App Router with TypeScript, Turbopack)
- **Styling**: Tailwind CSS + Apple-Inspired Design System (Vibrant Purple-to-Blue Gradients, Sleek Cards, Responsive Grid)
- **Motion & Polish**: Framer Motion, Canvas Confetti, Lucide Icons
- **Database & Auth**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Audio Engine**: Synthesized Procedural Web Audio API
- **Testing**: Built-in TypeScript Progression & Security Test Suite (`scripts/test-progression.ts`)

---

## 🗄️ Database Architecture (PostgreSQL + RLS)

ASCEND enforces **Row Level Security (RLS)** across all PostgreSQL tables:

1. `profiles`: `id`, `user_id`, `username`, `archetype`, `avatar_url`, `level`, `xp`, `gold`, `title`, `theme`, `sound_enabled`
2. `attributes`: `id`, `user_id`, `intellect_xp`, `strength_xp`, `vitality_xp`, `discipline_xp`, `creativity_xp`, `charisma_xp`
3. `streaks`: `id`, `user_id`, `current_streak`, `longest_streak`, `last_completed_date`, `streak_freeze_count`
4. `quests`: `id`, `user_id`, `title`, `description`, `category`, `difficulty`, `attribute`, `xp_reward`, `gold_reward`, `status`, `is_recurring`
5. `quest_completions`: `id`, `user_id`, `quest_id`, `xp_earned`, `gold_earned`, `attribute_earned`, `completion_date`
6. `items`: `id`, `name`, `description`, `category`, `price`, `icon`, `rarity`, `effect_type`, `effect_value`
7. `inventory`: `id`, `user_id`, `item_id`, `is_equipped`, `quantity`, `acquired_at`
8. `achievements`: `id`, `code`, `title`, `description`, `category`, `reward_xp`, `reward_gold`, `threshold`
9. `user_achievements`: `id`, `user_id`, `achievement_id`, `is_claimed`, `unlocked_at`
10. `transactions`: `id`, `user_id`, `type`, `amount`, `currency`, `description`

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/eayushsingh/hackathon-ASCEND.git
cd hackathon-ASCEND
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: If Supabase credentials are not configured, ASCEND automatically runs in **Instant Demo Guest Mode** with full local persistence, allowing complete evaluation out of the box!

### 3. Apply Supabase Database Schema (Optional if using Supabase)
In your Supabase SQL Editor:
1. Run `supabase/schema.sql` (Creates tables, triggers, and RLS policies).
2. Run `supabase/seed.sql` (Populates shop catalog and achievements).

### 4. Run the Progression Test Suite
```bash
npx tsx scripts/test-progression.ts
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo Walkthrough

1. **Landing Page (`/`)**: Test the interactive quest sandbox in the hero section.
2. **Onboarding (`/onboarding`)**: Choose your archetype (e.g. *Cyber Mage* or *Iron Titan*) to generate tailored starting quests.
3. **Command Center (`/dashboard`)**:
   - Check off a quest to trigger the synthesized chime and watch your XP bar, Gold, and Streak update in real-time.
   - Experience the **Level Up Celebration Modal** and confetti.
4. **Quest Board (`/quests`)**: Filter by category, difficulty, or search terms, and forge new real-life task bounties.
5. **Guild Shop (`/shop`)**: Purchase a new UI Theme (e.g. *Obsidian Void* or *Solar Flare*) or Crest with your earned gold.
6. **Inventory (`/inventory`)**: Equip your purchased theme and title.
7. **Trophy Hall (`/achievements`)**: Claim gold and XP bonuses for unlocked achievements.
8. **Settings (`/settings`)**: Switch themes on the fly and test audio toggles.

---

## 🔒 Security & Best Practices

- **Row Level Security**: Users can only read and mutate their own quests, stats, inventory, and completions.
- **Server Authority**: All XP, leveling formulas, and gold deductions are verified server-side.
- **Zero Committed Secrets**: `.env.local` is ignored in `.gitignore`, with template variables provided in `.env.example`.

---

## 📜 License
MIT © 2026 ASCEND Team. Built for the ASCEND Hackathon.
