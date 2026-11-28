'use client';

import { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

interface TimerProps {
  durationMinutes: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

/**
 * A quiet session meter, not a countdown.
 * It keeps the session length (so screen time stays short) but never
 * shows ticking seconds or warning colors that push a child to hurry.
 */
export default function Timer({ durationMinutes, isRunning, onTimeUp }: TimerProps) {
  const total = durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(total);

  useEffect(() => {
    setRemainingSeconds(durationMinutes * 60);
  }, [durationMinutes]);

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

  const minutesLeft = Math.max(1, Math.ceil(remainingSeconds / 60));
  const used = total > 0 ? 1 - remainingSeconds / total : 0;
  const label = minutesLeft <= 1 ? 'Almost time for a break' : `About ${minutesLeft} min left`;

  return (
    <div
      className="flex flex-col items-end gap-1.5 text-muted-foreground w-40"
      role="status"
      aria-label={label}
    >
      <div className="flex items-center gap-2 text-sm">
        <Sprout className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/40 transition-[width] duration-1000 ease-linear"
          style={{ width: `${used * 100}%` }}
        />
      </div>
    </div>
  );
}
