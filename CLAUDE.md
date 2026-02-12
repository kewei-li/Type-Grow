# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

Type & Grow is a children's typing learning app (K-6) built with Next.js 16 App Router (React 19), Tailwind CSS 4, and shadcn/ui components. All pages are client components (`'use client'`). Dark theme is the default.

### Core Flow

1. **Tutorial** (`/tutorial`) → 4-step first-time onboarding (intro → home row → practice → complete)
2. **Journey** (`/journey`) → Level selection and progress overview
3. **Practice** (`/practice/[level]`) → Main typing sessions (L1-L5, dynamic route uses `use()` hook for params)
4. **Gallery** (`/gallery`) → Earned badges and certificates
5. **Leaderboard** (`/leaderboard`) → Grade/level-based rankings (currently uses mock data in `lib/db.ts`)

### State Management

All user progress is stored in localStorage via a React Context pattern — no backend:

- `lib/storage.ts` - Low-level localStorage read/write with `STORAGE_KEY = 'type-and-grow-progress'`
- `lib/progress.ts` - Business logic for WPM/accuracy calculation, level unlocking, badge awarding
- `components/layout/ProgressProvider.tsx` - React Context that wraps the app, provides `useProgress()` hook

The `UserProgress` type in `types/index.ts` defines the complete progress schema. Key fields: `passages` (Record keyed by passage ID), `badges` (string[]), `streak`, `audioEnabled`, `grade`, `anonymousId`.

### Typing Engine

`components/typing/TypingEngine.tsx` is the core typing component:
- Captures keystrokes via `onKeyDown` on a focused div
- Tracks correct/error characters, consecutive correct keystrokes, and 30-second pause detection
- Plays keystroke sounds via Web Audio API (`playCorrectSound`/`playErrorSound` from `lib/speech.ts`)
- Reports completion via `onComplete` callback with: `wpm`, `accuracy`, `duration`, `errors`, `maxConsecutiveCorrect`, `hadLongPause`

Supporting components in `components/typing/`: `Timer.tsx` (countdown with color changes), `StatsDisplay.tsx` (live WPM/accuracy), `SessionResult.tsx` (post-session results with badge display).

### Level System

Levels are configured in `lib/constants.ts` (`LEVELS` object, Record<number, LevelConfig>):
- L1: 10 passages, 8 required, 85% accuracy
- L2: 15 passages, 12 required, 88% accuracy
- L3: 20 passages, 16 required, 90% accuracy
- L4: 25 passages, 20 required, 92% accuracy (config exists but progression capped at L3)
- L5: 30 passages, 24 required, 95% accuracy (config exists but progression capped at L3)

**Important**: `canUnlockNextLevel()` in `lib/progress.ts` currently returns `false` at Level 3+. L4-L5 configs exist but passage content and unlock logic are not yet implemented.

### Content

Passages are defined in `content/passages.ts`: 45 total (10 L1, 15 L2, 20 L3). Helpers: `getPassagesByLevel()`, `getPassageById()`, `getNextPassage()`. L1 passages are simple sentences with `hasAudio: true`. L2-L3 are progressively longer with author attribution for literary content.

### Badge System

8 badges defined in `BADGES` array in `lib/constants.ts`, with PNG images in `public/badges/`:
- `first-steps` — Complete tutorial
- `focused-mind` — No 30+ second pauses in a session
- `rhythm-finder` — 50+ consecutive correct keystrokes
- `listener-typist` — Complete a Listen & Type passage
- `streak-3` / `streak-7` — Consecutive day streaks
- `level-up` — Advance to a new level
- `graduation` — Complete Level 5

Badge conditions are checked in `checkBadgeConditions()` in `lib/progress.ts`.

### Audio

`lib/speech.ts` wraps Web Speech API for text-to-speech and Web Audio API for keystroke tones:
- Voice selection prefers "Natural" or "Samantha" English voices
- Includes Chrome workaround for 15-second speech cutoff (pause/resume interval)
- Silent warmup on first enable for browser autoplay policy compliance

### Layout Providers

`app/layout.tsx` → `components/layout/Providers.tsx` wraps the app in ThemeProvider (dark/light via class on root element) + ProgressProvider.

## Key Conventions

- Passage IDs follow `l{level}-{index}` with zero-padded index (e.g., `l1-01`, `l2-05`, `l3-20`)
- Badge IDs must match between `lib/constants.ts` BADGES array and `progress.badges[]`
- Anonymous user IDs use `{Animal}-{4digits}` format (e.g., "Owl-4821"), generated from ANIMALS array in constants
- Theme follows "Quiet Tech" aesthetic: calm, low-noise, generous whitespace
- `lib/db.ts` contains SQL schema comments for future Vercel Postgres migration; currently returns mock data
