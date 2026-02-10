# Type & Grow - Technical Design Document

> Date: 2026-02-10
> Status: Approved for Implementation

## Overview

**Type & Grow** is a calm, focused typing learning app for children (K-6). It prioritizes skill building over gamification, using quality literature and a distraction-free interface.

## Technical Decisions

| Aspect | Decision |
|--------|----------|
| **Scope** | Landing + Tutorial + L1-L3 + Gallery + Badges + Leaderboard |
| **Stack** | Next.js 14 App Router + Server Actions |
| **UI** | Tailwind CSS + shadcn/ui |
| **Data** | localStorage (progress) + Vercel Postgres (leaderboard) |
| **Audio** | Browser Web Speech API |
| **Content** | Placeholder passages (45 total) |
| **Theme** | Dark (default) + Light, "Quiet Tech" aesthetic |
| **Deploy** | Vercel |

## Architecture

```
type-and-grow/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Landing page
│   ├── tutorial/             # Tutorial flow
│   ├── practice/             # Main typing practice
│   │   └── [level]/          # L1, L2, L3 routes
│   ├── journey/              # Progress overview
│   ├── gallery/              # Badges & certificates
│   ├── leaderboard/          # Anonymous rankings
│   └── api/                  # Server actions for leaderboard
├── components/
│   ├── typing/               # Core typing engine
│   ├── ui/                   # shadcn components
│   └── layout/               # Header, navigation
├── lib/
│   ├── storage.ts            # Local storage helpers
│   ├── progress.ts           # Level/badge logic
│   ├── speech.ts             # Web Speech API wrapper
│   └── db.ts                 # Vercel Postgres (leaderboard only)
├── content/
│   └── passages.ts           # Placeholder texts by level
└── types/
    └── index.ts              # TypeScript definitions
```

## Core Typing Engine

### State Management

```typescript
interface TypingState {
  passage: string;           // Current text to type
  typed: string;             // What user has typed
  currentIndex: number;      // Current character position
  errors: number[];          // Indices where errors occurred
  startTime: number | null;  // When typing began
  isComplete: boolean;
}
```

### Visual Feedback

- **Correct**: Green/dimmed text (already typed)
- **Error**: Red highlight, stays until Backspace
- **Current**: Highlighted cursor position
- **Upcoming**: Default text color

### Input Rules

- Capture keystrokes via `onKeyDown`
- Only allow typing current character (no skipping)
- Backspace removes last typed character
- No copy/paste allowed
- Auto-focus on mount

### Metrics

- **WPM**: `(correctChars / 5) / minutesElapsed`
- **Accuracy**: `correctChars / totalKeystrokes * 100`
- **Time**: Countdown per level (10/15/15 min)

## Level Progression

### Unlock Requirements

| Level | Requirement |
|-------|-------------|
| Tutorial → L1 | Complete Tutorial |
| L1 → L2 | 8/10 passages + 85% accuracy |
| L2 → L3 | 12/15 passages + 88% accuracy |

### Progress Storage (localStorage)

```typescript
interface UserProgress {
  tutorialComplete: boolean;
  currentLevel: 1 | 2 | 3;
  passages: {
    [passageId: string]: {
      completed: boolean;
      bestWpm: number;
      bestAccuracy: number;
      attempts: number;
    }
  };
  badges: string[];
  streak: {
    current: number;
    lastPracticeDate: string;
  };
  totalPracticeMinutes: number;
}
```

## Badge System

| Badge | Trigger |
|-------|---------|
| `first-steps` | Complete Tutorial |
| `focused-mind` | Finish session without 30s+ pause |
| `rhythm-finder` | 50+ consecutive correct keystrokes |
| `listener-typist` | Complete a Listen→Type passage |
| `streak-3` | 3 consecutive days |
| `streak-7` | 7 consecutive days |
| `level-up` | Reach L2 or L3 |
| `graduation` | Complete L3 |

## Screen Flow

| Screen | Route | Purpose |
|--------|-------|---------|
| Landing | `/` | Hero, value prop, "Start" CTA |
| Tutorial | `/tutorial` | 3-step guided intro |
| Journey | `/journey` | Level cards, progress bars |
| Practice | `/practice/[level]` | Main typing screen |
| Gallery | `/gallery` | Badges + certificates |
| Leaderboard | `/leaderboard` | Anonymous rankings |

## Leaderboard Database

### Schema (Vercel Postgres)

```sql
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id VARCHAR(12) NOT NULL,
  grade SMALLINT NOT NULL,
  level SMALLINT NOT NULL,
  best_wpm DECIMAL(5,1),
  best_accuracy DECIMAL(5,2),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_grade_level ON leaderboard_entries(grade, level);
```

### Anonymous ID Format

- Pattern: `[Animal]-[4 digits]` (e.g., "Owl-4821")
- Generated once, stored in localStorage
- No personal information collected

### Display Rules

- Filter by same grade + same level
- Show Top 20 + user's own position
- Rolling 7-day best scores

## UI Theme

### "Quiet Tech" Aesthetic

- Calm, focused, low-noise
- No flashy animations or gamification
- Clean typography, generous whitespace

### Dark Theme (Default)

- Deep blue / charcoal background
- High contrast for readability
- Reduced eye strain

### Light Theme

- Paper-like warmth
- Suitable for younger children
- Daytime friendly

## Privacy Principles

- No email or real name required
- Anonymous IDs only
- Local storage first
- Minimal server data (leaderboard only)
- No tracking cookies
- Parent gate for settings
