import { UserProgress } from '@/types';
import { STORAGE_KEY, ANIMALS } from './constants';

function generateAnonymousId(): string {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${animal}-${number}`;
}

const defaultProgress: UserProgress = {
  tutorialComplete: false,
  currentLevel: 1,
  passages: {},
  badges: [],
  streak: {
    current: 0,
    lastPracticeDate: null,
  },
  totalPracticeMinutes: 0,
  anonymousId: null,
  name: null,
  grade: null,
  theme: 'dark',
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return defaultProgress;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = { ...defaultProgress, anonymousId: generateAnonymousId() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(stored);
    // Migration: add name field for existing users
    if (parsed.name === undefined) {
      parsed.name = null;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function updateProgress(updates: Partial<UserProgress>): UserProgress {
  const current = getProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
}

export function updateStreak(): UserProgress {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  const lastDate = progress.streak.lastPracticeDate;

  if (!lastDate) {
    // First practice ever
    progress.streak = { current: 1, lastPracticeDate: today };
  } else if (lastDate === today) {
    // Already practiced today
    return progress;
  } else {
    const last = new Date(lastDate);
    const now = new Date(today);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      progress.streak = {
        current: progress.streak.current + 1,
        lastPracticeDate: today
      };
    } else {
      // Streak broken
      progress.streak = { current: 1, lastPracticeDate: today };
    }
  }

  saveProgress(progress);
  return progress;
}
