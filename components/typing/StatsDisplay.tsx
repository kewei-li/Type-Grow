'use client';

import { Gauge, Target, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  showAudio?: boolean;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
}

export default function StatsDisplay({
  wpm,
  accuracy,
  showAudio = false,
  audioEnabled = false,
  onToggleAudio,
}: StatsDisplayProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-6">
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

      {showAudio && onToggleAudio && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAudio}
          aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {audioEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );
}
