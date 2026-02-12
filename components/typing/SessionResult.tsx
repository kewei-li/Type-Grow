'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, ArrowRight, RotateCcw } from 'lucide-react';

interface SessionResultProps {
  wpm: number;
  accuracy: number;
  duration: number;
  errors: number;
  isPersonalBest?: boolean;
  newBadges?: Array<{ id: string; name: string; icon: string; image: string }>;
  onContinue: () => void;
  onRetry: () => void;
}

export default function SessionResult({
  wpm,
  accuracy,
  duration,
  errors,
  isPersonalBest = false,
  newBadges = [],
  onContinue,
  onRetry,
}: SessionResultProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = () => {
    if (accuracy >= 95) return 'text-green-500';
    if (accuracy >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {isPersonalBest && <Trophy className="h-6 w-6 text-yellow-500" />}
          <span>Session Complete</span>
        </CardTitle>
        {isPersonalBest && (
          <Badge variant="secondary" className="mx-auto">
            Personal Best!
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold font-mono">{wpm}</div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className={`text-3xl font-bold font-mono ${getAccuracyColor()}`}>
              {accuracy}%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-xl font-mono">{formatDuration(duration)}</span>
            </div>
            <div className="text-sm text-muted-foreground">Time</div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="text-xl font-mono">{errors}</span>
            </div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
        </div>

        {/* New Badges */}
        {newBadges.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-center">Badges Earned!</div>
            <div className="flex justify-center gap-2 flex-wrap">
              {newBadges.map((badge) => (
                <Badge key={badge.id} variant="outline" className="text-lg py-1 px-3 flex items-center gap-2">
                  <div className="w-6 h-6 relative">
                    <Image
                      src={badge.image}
                      alt={badge.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onRetry}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button
            className="flex-1"
            onClick={onContinue}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
