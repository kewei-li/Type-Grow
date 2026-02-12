'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProgress, Level } from '@/types';
import { getProgress, saveProgress, updateStreak } from '@/lib/storage';
import { completePassage, awardBadge, getLevelProgress, canUnlockNextLevel } from '@/lib/progress';
import { BADGES } from '@/lib/constants';
import { toast } from 'sonner';

interface ProgressContextType {
  progress: UserProgress;
  isLoading: boolean;
  completeTutorial: () => void;
  recordPassageComplete: (passageId: string, wpm: number, accuracy: number) => string[];
  earnBadge: (badgeId: string) => boolean;
  updateGrade: (grade: number) => void;
  getLevelStats: (level: Level) => {
    completed: number;
    total: number;
    avgWpm: number;
    avgAccuracy: number;
  };
  canAccessLevel: (level: Level) => boolean;
  refreshProgress: () => void;
}

const defaultProgress: UserProgress = {
  tutorialComplete: false,
  currentLevel: 1,
  passages: {},
  badges: [],
  streak: { current: 0, lastPracticeDate: null },
  totalPracticeMinutes: 0,
  anonymousId: null,
  grade: null,
  theme: 'dark',
};

const defaultContext: ProgressContextType = {
  progress: defaultProgress,
  isLoading: true,
  completeTutorial: () => {},
  recordPassageComplete: () => [],
  earnBadge: () => false,
  updateGrade: () => {},
  getLevelStats: () => ({ completed: 0, total: 0, avgWpm: 0, avgAccuracy: 0 }),
  canAccessLevel: () => false,
  refreshProgress: () => {},
};

const ProgressContext = createContext<ProgressContextType>(defaultContext);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getProgress();
    setProgress(stored);
    setIsLoading(false);
  }, []);

  const refreshProgress = useCallback(() => {
    setProgress(getProgress());
  }, []);

  const completeTutorial = useCallback(() => {
    const current = getProgress();
    const updated = { ...current, tutorialComplete: true };
    if (!updated.badges.includes('first-steps')) {
      updated.badges.push('first-steps');
      const badge = BADGES.find((b) => b.id === 'first-steps');
      if (badge) {
        toast.success(`Badge earned: ${badge.icon} ${badge.name}`);
      }
    }
    saveProgress(updated);
    setProgress(updated);
  }, []);

  const recordPassageComplete = useCallback(
    (passageId: string, wpm: number, accuracy: number): string[] => {
      const currentProgress = getProgress();

      // Update streak
      updateStreak();

      // Complete the passage and check for level up
      const updated = completePassage(passageId, wpm, accuracy);
      setProgress(updated);

      // Return any new badges earned
      const newBadges: string[] = [];

      // Check streak badges
      if (updated.streak.current >= 3 && !updated.badges.includes('streak-3')) {
        const result = awardBadge('streak-3');
        if (result.awarded && result.badge) {
          newBadges.push('streak-3');
          toast.success(`Badge earned: ${result.badge.icon} ${result.badge.name}`);
        }
      }
      if (updated.streak.current >= 7 && !updated.badges.includes('streak-7')) {
        const result = awardBadge('streak-7');
        if (result.awarded && result.badge) {
          newBadges.push('streak-7');
          toast.success(`Badge earned: ${result.badge.icon} ${result.badge.name}`);
        }
      }

      // Check if leveled up
      if (updated.badges.includes('level-up') && !currentProgress.badges.includes('level-up')) {
        const badge = BADGES.find((b) => b.id === 'level-up');
        if (badge) {
          newBadges.push('level-up');
          toast.success(`Badge earned: ${badge.icon} ${badge.name}`);
        }
      }

      // Check graduation
      if (updated.badges.includes('graduation') && !currentProgress.badges.includes('graduation')) {
        const badge = BADGES.find((b) => b.id === 'graduation');
        if (badge) {
          newBadges.push('graduation');
          toast.success(`Badge earned: ${badge.icon} ${badge.name}`);
        }
      }

      refreshProgress();
      return newBadges;
    },
    [refreshProgress]
  );

  const earnBadge = useCallback(
    (badgeId: string): boolean => {
      const result = awardBadge(badgeId);
      if (result.awarded && result.badge) {
        toast.success(`Badge earned: ${result.badge.icon} ${result.badge.name}`);
        refreshProgress();
        return true;
      }
      return false;
    },
    [refreshProgress]
  );

  const updateGrade = useCallback(
    (grade: number) => {
      const current = getProgress();
      const updated = { ...current, grade };
      saveProgress(updated);
      setProgress(updated);
    },
    []
  );

  const getLevelStats = useCallback(
    (level: Level) => {
      return getLevelProgress(progress, level);
    },
    [progress]
  );

  const canAccessLevel = useCallback(
    (level: Level): boolean => {
      if (!progress.tutorialComplete) return false;
      if (level === 1) return true;
      if (level <= progress.currentLevel) return true;
      return canUnlockNextLevel(progress) && level === progress.currentLevel + 1;
    },
    [progress]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLoading,
        completeTutorial,
        recordPassageComplete,
        earnBadge,
        updateGrade,
        getLevelStats,
        canAccessLevel,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
