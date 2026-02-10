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
};

export const BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete the Tutorial',
    icon: '🌱',
  },
  {
    id: 'focused-mind',
    name: 'Focused Mind',
    description: 'Finish a session without pausing for 30+ seconds',
    icon: '🧘',
  },
  {
    id: 'rhythm-finder',
    name: 'Rhythm Finder',
    description: '50+ consecutive correct keystrokes',
    icon: '🎵',
  },
  {
    id: 'listener-typist',
    name: 'Listener → Typist',
    description: 'Complete a Listen & Type passage',
    icon: '👂',
  },
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Practice for 3 consecutive days',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Practice for 7 consecutive days',
    icon: '⭐',
  },
  {
    id: 'level-up',
    name: 'Level Up',
    description: 'Advance to a new level',
    icon: '📈',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'Complete Level 3',
    icon: '🎓',
  },
];

export const ANIMALS = [
  'Fox', 'Owl', 'Bear', 'Wolf', 'Deer', 'Hawk', 'Lion', 'Tiger',
  'Panda', 'Eagle', 'Koala', 'Otter', 'Rabbit', 'Dolphin', 'Falcon',
  'Penguin', 'Sparrow', 'Turtle', 'Beaver', 'Badger',
];

export const STORAGE_KEY = 'type-and-grow-progress';
