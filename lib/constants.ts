import { LevelConfig, Badge } from '@/types';

export const LEVELS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    name: 'L1',
    title: 'Typing Seedling',
    duration: 10,
    passagesRequired: 8,
    totalPassages: 10,
    accuracyRequired: 85,
  },
  2: {
    id: 2,
    name: 'L2',
    title: 'Typing Explorer',
    duration: 15,
    passagesRequired: 12,
    totalPassages: 15,
    accuracyRequired: 88,
  },
  3: {
    id: 3,
    name: 'L3',
    title: 'Typing Builder',
    duration: 15,
    passagesRequired: 16,
    totalPassages: 20,
    accuracyRequired: 90,
  },
  4: {
    id: 4,
    name: 'L4',
    title: 'Typing Artisan',
    duration: 20,
    passagesRequired: 20,
    totalPassages: 25,
    accuracyRequired: 92,
  },
  5: {
    id: 5,
    name: 'L5',
    title: 'Typing Master',
    duration: 25,
    passagesRequired: 24,
    totalPassages: 30,
    accuracyRequired: 95,
  },
};

export const BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete the Tutorial',
    icon: '🌱',
    image: '/badges/first-steps.png',
  },
  {
    id: 'focused-mind',
    name: 'Focused Mind',
    description: 'Finish a session without pausing for 30+ seconds',
    icon: '🧘',
    image: '/badges/focused-mind.png',
  },
  {
    id: 'rhythm-finder',
    name: 'Rhythm Finder',
    description: '50+ consecutive correct keystrokes',
    icon: '🎵',
    image: '/badges/rhythm-finder.png',
  },
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Practice for 3 consecutive days',
    icon: '🔥',
    image: '/badges/streak-3.png',
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Practice for 7 consecutive days',
    icon: '⭐',
    image: '/badges/streak-7.png',
  },
  {
    id: 'level-1-complete',
    name: 'Level 1 Champion',
    description: 'Complete all required passages in Level 1',
    icon: '🏆',
    image: '/badges/level-1-complete.png',
  },
  {
    id: 'level-2-complete',
    name: 'Level 2 Champion',
    description: 'Complete all required passages in Level 2',
    icon: '🏆',
    image: '/badges/level-2-complete.png',
  },
  {
    id: 'level-3-complete',
    name: 'Level 3 Champion',
    description: 'Complete all required passages in Level 3',
    icon: '🏆',
    image: '/badges/level-3-complete.png',
  },
  {
    id: 'level-4-complete',
    name: 'Level 4 Champion',
    description: 'Complete all required passages in Level 4',
    icon: '🏆',
    image: '/badges/level-4-complete.png',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'Complete Level 5',
    icon: '🎓',
    image: '/badges/graduation.png',
  },
];

export const ANIMALS = [
  'Fox', 'Owl', 'Bear', 'Wolf', 'Deer', 'Hawk', 'Lion', 'Tiger',
  'Panda', 'Eagle', 'Koala', 'Otter', 'Rabbit', 'Dolphin', 'Falcon',
  'Penguin', 'Sparrow', 'Turtle', 'Beaver', 'Badger',
];

export const GRADES = [
  { value: 0, label: 'K' },
  { value: 1, label: 'G1' },
  { value: 2, label: 'G2' },
  { value: 3, label: 'G3' },
  { value: 4, label: 'G4' },
  { value: 5, label: 'G5' },
  { value: 6, label: 'G6' },
  { value: 7, label: 'G7' },
];

export function getGradeLabel(value: number): string {
  return GRADES.find((g) => g.value === value)?.label || `G${value}`;
}

export const STORAGE_KEY = 'type-and-grow-progress';
export const PAGE_VIEWS_KEY = 'type-and-grow-page-views';
