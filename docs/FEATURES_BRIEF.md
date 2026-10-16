# ⚡ ASCEND: Complete Feature & System Brief

> **ASCEND** is a full-stack Life RPG productivity platform that turns real-world tasks, workouts, learning, and daily habits into an immersive Cyberpunk RPG.

---

## 🎯 1. The Core Game Loop

```
Real-Life Action → Forge Quest → Server-Authoritative Verification → Gain XP, Gold & Attribute Points → Level Up Character → Maintain Calendar Streak → Unlock Trophy Achievements → Spend in Guild Shop → Visible Character Growth & Prestige
```

---

## 🚀 2. Complete Feature Breakdown

### 🧙‍♂️ Character Archetypes & Perks
Players choose an archetype during onboarding or via the quick-switcher in the HUD:
1. **Cyber Mage** (Intellect & Discipline): Deep work and coding focus (+15% Intellect mastery, +10% focus XP).
2. **Iron Titan** (Strength & Vitality): Fitness and athletic conditioning (+15% physical attribute growth).
3. **Shadow Rogue** (Creativity & Intellect): High-speed backlog clearance (+20% bonus gold loot on Medium/Hard quests).
4. **Bio Hacker** (Vitality & Discipline): Sleep, nutrition, and circadian optimization (+20% Vitality growth & extended streak buffer).
5. **Astral Sage** (Creativity & Charisma): Art, writing, and community initiatives (+20% bonus XP for creative and social quests).
6. **Nova Paladin** (Charisma & Strength): Leadership, team unblocking, and public speaking (+25% Charisma growth).

---

### 📈 Non-Linear Leveling & Progression Engine
- **Mathematical Formula**: $\text{XP}(N) = 100 \times N^{1.5}$
- **Rank Milestone Progression**:
  - **Novice** (Levels 1–4) — *Initiate Seeker*
  - **Apprentice** (Levels 5–9) — *Cyber Vanguard*
  - **Adept** (Levels 10–19) — *Neural Adept*
  - **Master** (Levels 20–34) — *Grid Overseer*
  - **Grandmaster** (Levels 35–49) — *Singularity Grandmaster*
  - **Ascendant** (Level 50+) — *Eternal Ascendant*
- **Level-Up Fanfare**: Triggers particle confetti, stat updates, and procedural victory audio.

---

### 🧬 6-Attribute Life Mastery System
Every quest maps to one of six real-life attributes:
1. **Intellect (INT)**: Deep work, coding, engineering, technical reading.
2. **Strength (STR)**: Weight lifting, resistance training, physical power.
3. **Vitality (VIT)**: Sleep hygiene, hydration, cardio, nutrition, stamina.
4. **Discipline (DIS)**: Daily routines, resisting procrastination, habit loops.
5. **Creativity (CRT)**: UI/UX design, writing, art, divergent thinking.
6. **Charisma (CHA)**: Leadership, presentations, networking, mentorship.

---

### 🛡️ Calendar Daily Streaks & Streak Freezes
- **1 Increment Per Calendar Day**: Strictly enforces 1 combo increment per UTC/local date regardless of how many tasks are completed that day.
- **Consecutive Day Tracking**: Automatically detects yesterday vs today vs missed days.
- **Streak Freeze Relics**: Protects streaks from resetting if a day is missed (stored in inventory).

---

### 🗡️ Quest Management Matrix (CRUD)
- **Full Quest CRUD**: Create, Edit, Complete, and Delete quests.
- **Difficulty Multipliers**:
  - **Easy**: +30 XP, +15 Gold
  - **Medium**: +60 XP, +30 Gold
  - **Hard**: +120 XP, +60 Gold
  - **Epic**: +250 XP, +120 Gold
  - **Legendary**: +500 XP, +250 Gold
- **Category & Attribute Filtering**: Filter by Work, Fitness, Learning, Habit, Creative, Social.
- **Recurring / Daily Habits**: Auto-resets daily habits for continuous streak building.
- **Live Search & Bounty Sorting**: Sort by newest, highest XP, or highest Gold.

---

### 🏪 Guild Shop & In-Game Economy
- **Cosmetic UI Themes**: Obsidian Void, Solar Flare, Emerald Matrix, Crimson Vanguard, Cyberpunk Neon.
- **Prestige Badges**: Novice Slayer, Neural Architect, Iron Will, Titan of the Grid, Ascendant Singularity.
- **Custom Player Titles**: *The Relentless, Neural Overlord, Shadow Operator, Grand Ascendant*.
- **Avatar Frames**: Neon Hexagon, Plasma Holo-Ring, Celestial Aureole.
- **Consumable Relics**: Streak Freeze Relics and Elixirs of Focus (2x XP).
- **Server Validation**: Enforces price checks, prevents negative balances, and blocks duplicate purchases of unique cosmetics.

---

### 🏆 Trophy Hall of Fame (Achievements)
- Real-time condition evaluation on the server for:
  - First Quest Completed (*The Awakening*)
  - 3, 7, 30, and 100-Day Streaks
  - Level Milestones (Level 5, 10, 25)
  - 10, 50, and 100 Quests Cleared
  - 300+ Attribute Points
  - Guild Treasury Wealth
- Unlocking triggers floating celebratory banners with claimable Gold & XP rewards.

---

### 🔊 Procedural Web Audio SFX Engine
Zero-latency procedural sound synthesizer built using the **Web Audio API** (no external audio files):
- Tactile cyber clicks
- Ascending quest completion chimes
- Realistic gold coin clinks
- Layered harmonic level-up fanfares
- Celestial trophy unlock alerts
- Instant mute/enable toggle in the top navbar.

---

### 📊 Analytics & Consistency Heatmap
- **4-Week Activity Heatmap**: Visual glowing grid of daily completion density.
- **Category Distribution**: Breakdown of tasks completed across all 6 life categories.
- **Attribute Share**: Visual comparison of attribute points distribution.
- **Velocity Metrics**: Total XP, Treasury Gold, Active Streak, and Total Cleared Quests.

---

### 🌐 Global Leaderboard (Hall of Ascension)
- **Global Competitor Rankings**: Real-time hierarchy ranked primarily by Level, tiebroken by Total XP.
- **Privacy-Guaranteed Public Read-Only View**: Backed by a secure PostgreSQL view (`leaderboard_view`) and RPC (`get_leaderboard`) joining `profiles` + `user_achievements`. Only exposes `rank`, `username`, `archetype`, `avatar_url`, `level`, `total_xp`, `title`, and `achievement_count`.
- **Zero Privacy Leaks**: Emails, gold balances, inventory, quest notes, and private transactions are strictly blocked by RLS.
- **Top 50 Pagination + User Standing Card**: Dedicated "Your Rank" card shows the current player's exact standing even if outside the top 50.
- **Podium Accents**: Custom Gold, Silver, and Bronze cyber-crest badges with Orbitron typography.
- **Filter & Search**: Instant filter by Archetype and search by username.

---

### 🎨 Themes & Customization
- **5 Dynamic Cyberpunk Themes**:
  - `Cyberpunk Neon` (Cyan & Electric Violet)
  - `Obsidian Void` (Ultraviolet & Obsidian Darkness)
  - `Solar Flare` (Radiant Amber & Magma Core)
  - `Emerald Matrix` (Terminal Green Phosphor)
  - `Crimson Vanguard` (Tactical Red & Dark Metal)
- **Data Export & Backup**: Export your complete RPG profile to a JSON file.

---

## 💻 3. Screen Overview

| Screen | Route | Key Purpose |
| :--- | :--- | :--- |
| **Landing Page** | `/` | Hero section, interactive demo sandbox, archetype showcase, feature matrix. |
| **Onboarding** | `/onboarding` | Character creation, archetype selection, and starter quest generation. |
| **Command Center** | `/dashboard` | Character HUD, non-linear XP bar, active quests, and 4-week heatmap. |
| **Quest Matrix** | `/quests` | Full quest CRUD, filters, search bar, and bounty sorting. |
| **Global Leaderboard** | `/leaderboard` | Top 50 global ranking, live podium, archetype filters, and player standing. |
| **Character Sheet** | `/character` | Rank milestone tree, non-linear math stats, and attribute deep dive. |
| **Analytics** | `/analytics` | Productivity velocity, category share, and consistency metrics. |
| **Guild Shop** | `/shop` | Item marketplace for themes, badges, titles, and consumables. |
| **Inventory** | `/inventory` | Cosmetic wardrobe to equip active themes and titles. |
| **Trophy Hall** | `/achievements` | Achievements list with progress bars and reward claim buttons. |
| **Settings** | `/settings` | Live theme customizer, sound controls, and JSON backup. |
| **Auth** | `/auth/login`, `/auth/signup` | Supabase Auth + Instant Guest Demo Mode login. |

---

## 🔒 4. Backend & Security Architecture
- **Supabase PostgreSQL Schema**: 10 tables with **Row Level Security (RLS)** policies enabled on every table.
- **Server-Authoritative APIs**:
  - `POST /api/quests` (Validated creation with difficulty rewards)
  - `POST /api/quests/[id]/complete` (Double-completion guard, server-side XP/Gold/Streak/Level-up evaluation)
  - `POST /api/shop/purchase` (Server-side price verification and inventory tracking)
  - `POST /api/achievements/claim` (Reward distribution)
  - `PATCH /api/profile` (Theme, title, and profile sync)
- **Instant Demo Mode**: Automatically works seamlessly with offline local persistence if Supabase credentials are not yet configured, and connects to Postgres when provided.
