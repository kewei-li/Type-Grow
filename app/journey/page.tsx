'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Check, ArrowRight, Flame, Target, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { useProgress } from '@/components/layout/ProgressProvider';
import { LEVELS } from '@/lib/constants';
import { Level } from '@/types';

export default function JourneyPage() {
  const router = useRouter();
  const { progress, canAccessLevel, getLevelStats, isLoading } = useProgress();

  // Redirect to tutorial if not complete
  useEffect(() => {
    if (!isLoading && !progress.tutorialComplete) {
      router.push('/tutorial');
    }
  }, [isLoading, progress.tutorialComplete, router]);

  if (isLoading || !progress.tutorialComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const levels: Level[] = [1, 2, 3, 4, 5];

  const getLevelStatus = (level: Level) => {
    const stats = getLevelStats(level);
    const config = LEVELS[level];

    if (stats.completed >= config.passagesRequired) {
      return 'complete';
    }
    if (canAccessLevel(level)) {
      return 'unlocked';
    }
    return 'locked';
  };

  const renderLevelCard = (level: Level) => {
    const config = LEVELS[level];
    const stats = getLevelStats(level);
    const status = getLevelStatus(level);
    const progressPercent = (stats.completed / config.totalPassages) * 100;

    return (
      <Card
        key={level}
        className={`relative overflow-hidden transition-all flex flex-col h-full ${
          status === 'locked'
            ? 'opacity-60'
            : status === 'complete'
            ? 'border-green-500/50 bg-green-500/5'
            : 'hover:border-primary/50'
        }`}
      >
        {status === 'complete' && (
          <div className="absolute top-3 right-3">
            <div className="bg-green-500 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        {status === 'locked' && (
          <div className="absolute top-3 right-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${
              status === 'complete' ? 'text-green-500' :
              status === 'unlocked' ? 'text-primary' :
              'text-muted-foreground'
            }`}>
              {config.name}
            </div>
            <div>
              <div className="text-lg">{config.title}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {config.duration} min sessions
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">
          {/* Content area - grows to fill space */}
          <div className="space-y-4 flex-1">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span>
                  {stats.completed} / {config.totalPassages} passages
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Stats */}
            {stats.completed > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Avg WPM</div>
                    <div className="font-semibold">{stats.avgWpm}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Accuracy</div>
                    <div className="font-semibold">{stats.avgAccuracy}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Unlock Requirements */}
            {status === 'locked' && level > 1 && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-medium mb-1">To unlock:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Complete {LEVELS[level - 1].passagesRequired} passages in L{level - 1}</li>
                  <li>Achieve {LEVELS[level - 1].accuracyRequired}% average accuracy</li>
                </ul>
              </div>
            )}
          </div>

          {/* Action Button - always at bottom */}
          <div className="pt-4 mt-auto">
            <Button
              className="w-full"
              disabled={status === 'locked'}
              onClick={() => router.push(`/practice/l${level}`)}
            >
              {status === 'complete' ? 'Review' : status === 'unlocked' ? 'Continue' : 'Locked'}
              {status !== 'locked' && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNav={true} />

      <main className="flex-1 quiet-container py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Journey</h1>
          <p className="text-muted-foreground">
            Progress through levels at your own pace
          </p>
        </div>

        {/* Streak & Quick Stats */}
        <div className="flex justify-center gap-6 mb-8">
          {progress.streak.current > 0 && (
            <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">{progress.streak.current} day streak</span>
            </div>
          )}

          {progress.badges.length > 0 && (
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <span className="text-lg">🏆</span>
              <span className="font-medium">{progress.badges.length} badges</span>
            </div>
          )}
        </div>

        {/* Current Level Badge */}
        <div className="flex justify-center mb-8">
          <Badge variant="secondary" className="text-base py-1 px-4">
            Current Level: {LEVELS[progress.currentLevel].title}
          </Badge>
        </div>

        {/* Level Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {levels.map(renderLevelCard)}
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>
            {progress.currentLevel === 1 && "You're just getting started. Keep practicing!"}
            {progress.currentLevel === 2 && "Great progress! You're becoming a skilled typist."}
            {progress.currentLevel === 3 && "Amazing! You're on your way to graduation."}
          </p>
        </div>
      </main>
    </div>
  );
}
