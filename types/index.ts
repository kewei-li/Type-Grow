// Core typing state
export interface TypingState {
  passage: string;
  typed: string;
  currentIndex: number;
  errors: number[];
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  totalKeystrokes: number;
}

// Level definitions
export type Level = 1 | 2 | 3 | 4 | 5;

export interface LevelConfig {
  id: Level;
  name: string;
  title: string;
  duration: number; // in minutes
  passagesRequired: number;
  totalPassages: number;
  accuracyRequired: number;
}

// Passage content
export interface Passage {
  id: string;
  level: Level;
  title: string;
  content: string;
  author?: string;
  hasAudio: boolean;
}

// User progress stored in localStorage
export interface PassageProgress {
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
  lastAttempt?: string;
}

export interface UserProgress {
  tutorialComplete: boolean;
  currentLevel: Level;
  passages: Record<string, PassageProgress>;
  badges: string[];
  streak: {
    current: number;
    lastPracticeDate: string | null;
  };
  totalPracticeMinutes: number;
  anonymousId: string | null;
  grade: number | null;
  theme: 'dark' | 'light';
}

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  earnedAt?: string;
}

// Session results
export interface SessionResult {
  passageId: string;
  wpm: number;
  accuracy: number;
  duration: number; // in seconds
  errors: number;
  completedAt: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  anonymousId: string;
  grade: number;
  level: Level;
  bestWpm: number;
  bestAccuracy: number;
  isCurrentUser?: boolean;
}
