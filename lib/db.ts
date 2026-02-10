// Database utilities for Vercel Postgres
// Note: This uses mock data for development. Connect to real Vercel Postgres in production.

import { LeaderboardEntry, Level } from '@/types';

// Mock data for development (will be replaced with real DB in production)
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, anonymousId: 'Eagle-4521', grade: 3, level: 1, bestWpm: 45, bestAccuracy: 98 },
  { rank: 2, anonymousId: 'Fox-2341', grade: 3, level: 1, bestWpm: 42, bestAccuracy: 96 },
  { rank: 3, anonymousId: 'Owl-8834', grade: 3, level: 1, bestWpm: 40, bestAccuracy: 95 },
  { rank: 4, anonymousId: 'Bear-1123', grade: 3, level: 1, bestWpm: 38, bestAccuracy: 94 },
  { rank: 5, anonymousId: 'Wolf-5567', grade: 3, level: 1, bestWpm: 36, bestAccuracy: 93 },
  { rank: 6, anonymousId: 'Deer-9012', grade: 3, level: 1, bestWpm: 35, bestAccuracy: 92 },
  { rank: 7, anonymousId: 'Hawk-3344', grade: 3, level: 1, bestWpm: 34, bestAccuracy: 91 },
  { rank: 8, anonymousId: 'Panda-7788', grade: 3, level: 1, bestWpm: 33, bestAccuracy: 90 },
  { rank: 9, anonymousId: 'Tiger-2244', grade: 3, level: 1, bestWpm: 32, bestAccuracy: 89 },
  { rank: 10, anonymousId: 'Lion-5533', grade: 3, level: 1, bestWpm: 31, bestAccuracy: 88 },
];

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  userRank: number | null;
  userEntry: LeaderboardEntry | null;
  totalEntries: number;
}

export async function getLeaderboard(
  grade: number,
  level: Level,
  anonymousId?: string
): Promise<LeaderboardResult> {
  // In production, this would query Vercel Postgres:
  // const { rows } = await sql`
  //   SELECT * FROM leaderboard_entries
  //   WHERE grade = ${grade} AND level = ${level}
  //   ORDER BY best_wpm DESC
  //   LIMIT 20
  // `;

  // Mock implementation for development
  const filteredData = mockLeaderboardData
    .filter((e) => e.grade === grade && e.level === level)
    .sort((a, b) => b.bestWpm - a.bestWpm)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // Find user's entry and rank
  let userRank: number | null = null;
  let userEntry: LeaderboardEntry | null = null;

  if (anonymousId) {
    const userIndex = filteredData.findIndex((e) => e.anonymousId === anonymousId);
    if (userIndex >= 0) {
      userRank = userIndex + 1;
      userEntry = { ...filteredData[userIndex], isCurrentUser: true };
    }
  }

  return {
    entries: filteredData.slice(0, 20),
    userRank,
    userEntry,
    totalEntries: filteredData.length,
  };
}

export async function submitScore(
  anonymousId: string,
  grade: number,
  level: Level,
  wpm: number,
  accuracy: number
): Promise<{ success: boolean; newRank?: number }> {
  // In production, this would insert/update in Vercel Postgres:
  // await sql`
  //   INSERT INTO leaderboard_entries (anonymous_id, grade, level, best_wpm, best_accuracy)
  //   VALUES (${anonymousId}, ${grade}, ${level}, ${wpm}, ${accuracy})
  //   ON CONFLICT (anonymous_id, grade, level)
  //   DO UPDATE SET
  //     best_wpm = GREATEST(leaderboard_entries.best_wpm, ${wpm}),
  //     best_accuracy = GREATEST(leaderboard_entries.best_accuracy, ${accuracy}),
  //     updated_at = NOW()
  // `;

  // Mock implementation for development
  console.log('Score submitted:', { anonymousId, grade, level, wpm, accuracy });

  return { success: true, newRank: Math.floor(Math.random() * 20) + 1 };
}

// SQL schema for reference (run in Vercel Postgres console):
/*
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id VARCHAR(12) NOT NULL,
  grade SMALLINT NOT NULL,
  level SMALLINT NOT NULL,
  best_wpm DECIMAL(5,1) DEFAULT 0,
  best_accuracy DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(anonymous_id, grade, level)
);

CREATE INDEX idx_grade_level ON leaderboard_entries(grade, level);
CREATE INDEX idx_best_wpm ON leaderboard_entries(best_wpm DESC);
*/
