'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  durationMinutes: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export default function Timer({ durationMinutes, isRunning, onTimeUp }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);

  // Reset timer when duration changes
  useEffect(() => {
    setRemainingSeconds(durationMinutes * 60);
  }, [durationMinutes]);

  // Countdown logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimeColor = () => {
    const percentage = remainingSeconds / (durationMinutes * 60);
    if (percentage <= 0.1) return 'text-red-500';
    if (percentage <= 0.25) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <div className={`flex items-center gap-2 ${getTimeColor()}`}>
      <Clock className="h-5 w-5" />
      <span className="timer-display">{formatTime(remainingSeconds)}</span>
    </div>
  );
}
