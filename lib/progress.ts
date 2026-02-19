import { UserProgress, Level, SessionResult } from '@/types';
import { LEVELS, BADGES } from './constants';
import { getProgress, saveProgress } from './storage';

export function calculateWpm(
  correctChars: number,
  durationMs: number
): number {
  if (durationMs <= 0) return 0;
  const minutes = durationMs / 1000 / 60;
  const words = correctChars / 5; // Standard: 5 chars = 1 word
  return Math.round(words / minutes);
}

export function calculateAccuracy(
  correctChars: number,
  totalKeystrokes: number
): number {
  if (totalKeystrokes <= 0) return 0;
  return Math.round((correctChars / totalKeystrokes) * 100);
}

export function canUnlockNextLevel(progress: UserProgress): boolean {
  const currentLevel = progress.currentLevel;
  if (currentLevel >= 5) return false;

  const config = LEVELS[currentLevel];
  const passageIds = Object.keys(progress.passages).filter(
    (id) => id.startsWith(`l${currentLevel}-`)
  );

  const completedCount = passageIds.filter(
    (id) => progress.passages[id]?.completed
  ).length;

  const avgAccuracy = passageIds.length > 0
    ? passageIds.reduce((sum, id) => sum + (progress.passages[id]?.bestAccuracy || 0), 0) / passageIds.length
    : 0;

  return completedCount >= config.passagesRequired && avgAccuracy >= config.accuracyRequired;
}

export function getLevelProgress(progress: UserProgress, level: Level): {
  completed: number;
  total: number;
  avgWpm: number;
  avgAccuracy: number;
} {
  const config = LEVELS[level];
  const passageIds = Object.keys(progress.passages).filter(
    (id) => id.startsWith(`l${level}-`)
  );

  const completed = passageIds.filter(
    (id) => progress.passages[id]?.completed
  ).length;

  const withStats = passageIds.filter(
    (id) => progress.passages[id]?.bestWpm > 0
  );

  const avgWpm = withStats.length > 0
    ? Math.round(withStats.reduce((sum, id) => sum + progress.passages[id].bestWpm, 0) / withStats.length)
    : 0;

  const avgAccuracy = withStats.length > 0
    ? Math.round(withStats.reduce((sum, id) => sum + progress.passages[id].bestAccuracy, 0) / withStats.length)
    : 0;

  return {
    completed,
    total: config.totalPassages,
    avgWpm,
    avgAccuracy,
  };
}

export function awardBadge(badgeId: string): { awarded: boolean; badge?: typeof BADGES[0] } {
  const progress = getProgress();

  if (progress.badges.includes(badgeId)) {
    return { awarded: false };
  }

  const badge = BADGES.find((b) => b.id === badgeId);
  if (!badge) {
    return { awarded: false };
  }

  progress.badges.push(badgeId);
  saveProgress(progress);

  return { awarded: true, badge };
}

export function checkBadgeConditions(
  result: SessionResult,
  consecutiveCorrect: number,
  hadPause: boolean
): string[] {
  const newBadges: string[] = [];
  const progress = getProgress();

  // Focused Mind: No 30s+ pause
  if (!hadPause && !progress.badges.includes('focused-mind')) {
    newBadges.push('focused-mind');
  }

  // Rhythm Finder: 50+ consecutive correct
  if (consecutiveCorrect >= 50 && !progress.badges.includes('rhythm-finder')) {
    newBadges.push('rhythm-finder');
  }

  // Streak badges
  if (progress.streak.current >= 3 && !progress.badges.includes('streak-3')) {
    newBadges.push('streak-3');
  }
  if (progress.streak.current >= 7 && !progress.badges.includes('streak-7')) {
    newBadges.push('streak-7');
  }

  return newBadges;
}

export function completePassage(
  passageId: string,
  wpm: number,
  accuracy: number
): UserProgress {
  const progress = getProgress();

  const existing = progress.passages[passageId] || {
    completed: false,
    bestWpm: 0,
    bestAccuracy: 0,
    attempts: 0,
  };

  progress.passages[passageId] = {
    completed: true,
    bestWpm: Math.max(existing.bestWpm, wpm),
    bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
    attempts: existing.attempts + 1,
    lastAttempt: new Date().toISOString(),
  };

  // Check for level completion badges
  const completedLevel = parseInt(passageId.split('-')[0].replace('l', ''), 10);
  if (completedLevel >= 1 && completedLevel <= 4) {
    const levelBadgeId = `level-${completedLevel}-complete`;
    if (!progress.badges.includes(levelBadgeId)) {
      const levelConfig = LEVELS[completedLevel];
      const levelPassageIds = Object.keys(progress.passages).filter(
        (id) => id.startsWith(`l${completedLevel}-`)
      );
      const levelCompleted = levelPassageIds.filter(
        (id) => progress.passages[id]?.completed
      ).length;
      if (levelCompleted >= levelConfig.passagesRequired) {
        progress.badges.push(levelBadgeId);
      }
    }
  }

  // Check for level up
  if (canUnlockNextLevel(progress) && progress.currentLevel < 5) {
    progress.currentLevel = (progress.currentLevel + 1) as Level;
  }

  // Check for graduation
  if (progress.currentLevel === 5) {
    const l5Progress = getLevelProgress(progress, 5);
    if (l5Progress.completed >= LEVELS[5].passagesRequired && !progress.badges.includes('graduation')) {
      progress.badges.push('graduation');
    }
  }

  saveProgress(progress);
  return progress;
}
