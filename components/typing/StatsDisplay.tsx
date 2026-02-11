'use client';

import { Gauge, Target } from 'lucide-react';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
}

export default function StatsDisplay({ wpm, accuracy }: StatsDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-8 py-3 px-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">WPM:</span>
        <span className="font-mono font-medium tabular-nums">{wpm}</span>
      </div>

      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Accuracy:</span>
        <span className={`font-mono font-medium tabular-nums ${
          accuracy >= 95 ? 'text-green-500' :
          accuracy >= 85 ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {accuracy}%
        </span>
      </div>
    </div>
  );
}
