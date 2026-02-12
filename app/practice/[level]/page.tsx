'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import TypingEngine from '@/components/typing/TypingEngine';
import Timer from '@/components/typing/Timer';
import StatsDisplay from '@/components/typing/StatsDisplay';
import SessionResult from '@/components/typing/SessionResult';
import VirtualKeyboard from '@/components/typing/VirtualKeyboard';
import { useProgress } from '@/components/layout/ProgressProvider';
import { getPassagesByLevel } from '@/content/passages';
import { LEVELS, BADGES } from '@/lib/constants';
import { Level, Passage, TypingState } from '@/types';

interface PracticePageProps {
  params: Promise<{ level: string }>;
}

type SessionState = 'ready' | 'typing' | 'complete' | 'timeup';

export default function PracticePage({ params }: PracticePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { progress, isLoading, canAccessLevel, recordPassageComplete, earnBadge, getLevelStats } = useProgress();

  const levelNum = parseInt(resolvedParams.level.replace('l', ''), 10) as Level;
  const levelConfig = LEVELS[levelNum];

  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [passageIndex, setPassageIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [nextChar, setNextChar] = useState<string | null>(null);
  const [sessionResult, setSessionResult] = useState<{
    wpm: number;
    accuracy: number;
    duration: number;
    errors: number;
    isPersonalBest: boolean;
    newBadges: Array<{ id: string; name: string; icon: string; image: string }>;
  } | null>(null);

  // Check level access
  useEffect(() => {
    if (isLoading) return;
    if (!progress.tutorialComplete) {
      router.push('/tutorial');
      return;
    }
    if (!canAccessLevel(levelNum)) {
      router.push('/journey');
    }
  }, [isLoading, progress.tutorialComplete, canAccessLevel, levelNum, router]);

  // Load passages for this level
  const passages = getPassagesByLevel(levelNum);

  // Find next uncompleted passage or first one
  useEffect(() => {
    const completedIds = Object.keys(progress.passages).filter(
      (id) => progress.passages[id]?.completed && id.startsWith(`l${levelNum}-`)
    );

    const nextPassage = passages.find((p) => !completedIds.includes(p.id)) || passages[0];
    const index = passages.findIndex((p) => p.id === nextPassage.id);

    setCurrentPassage(nextPassage);
    setPassageIndex(index);
  }, [levelNum, passages, progress.passages]);

  // Handle typing progress updates
  const handleTypingProgress = useCallback((state: TypingState) => {
    // Update next character for virtual keyboard
    if (state.currentIndex < state.passage.length) {
      setNextChar(state.passage[state.currentIndex]);
    } else {
      setNextChar(null);
    }

    if (!state.startTime || state.currentIndex === 0) return;

    const elapsed = Date.now() - state.startTime;
    const correctChars = state.currentIndex - state.errors.length;
    const wpm = Math.round((correctChars / 5) / (elapsed / 1000 / 60));
    const accuracy = Math.round((correctChars / state.totalKeystrokes) * 100) || 100;

    setLiveWpm(wpm);
    setLiveAccuracy(accuracy);

    // Start timer on first keystroke
    if (!timerRunning && state.currentIndex > 0) {
      setTimerRunning(true);
    }
  }, [timerRunning]);

  // Handle passage completion
  const handleComplete = useCallback((result: {
    wpm: number;
    accuracy: number;
    duration: number;
    errors: number;
    maxConsecutiveCorrect: number;
    hadLongPause: boolean;
  }) => {
    if (!currentPassage) return;

    setTimerRunning(false);

    // Record completion and get new badges
    const previousBest = progress.passages[currentPassage.id];
    const newBadges = recordPassageComplete(currentPassage.id, result.wpm, result.accuracy);

    // Check for rhythm finder badge
    if (result.maxConsecutiveCorrect >= 50) {
      earnBadge('rhythm-finder');
      if (!newBadges.includes('rhythm-finder')) {
        const badge = BADGES.find((b) => b.id === 'rhythm-finder');
        if (badge) newBadges.push('rhythm-finder');
      }
    }

    // Check for focused mind badge
    if (!result.hadLongPause) {
      earnBadge('focused-mind');
      if (!newBadges.includes('focused-mind')) {
        const badge = BADGES.find((b) => b.id === 'focused-mind');
        if (badge) newBadges.push('focused-mind');
      }
    }

    const isPersonalBest = !previousBest || result.wpm > previousBest.bestWpm;

    setSessionResult({
      wpm: result.wpm,
      accuracy: result.accuracy,
      duration: result.duration,
      errors: result.errors,
      isPersonalBest,
      newBadges: newBadges.map((id) => {
        const badge = BADGES.find((b) => b.id === id);
        return badge ? { id, name: badge.name, icon: badge.icon, image: badge.image } : { id, name: id, icon: '🏆', image: '' };
      }),
    });
    setSessionState('complete');
  }, [currentPassage, progress.passages, recordPassageComplete, earnBadge]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setTimerRunning(false);
    setSessionState('timeup');
  }, []);

  // Start session
  const startSession = useCallback(() => {
    setSessionState('typing');
    setLiveWpm(0);
    setLiveAccuracy(100);
    setSessionResult(null);
    // Set initial next char for virtual keyboard
    if (currentPassage) {
      setNextChar(currentPassage.content[0] || null);
    }
  }, [currentPassage]);

  // Continue to next passage
  const handleContinue = useCallback(() => {
    const nextIndex = passageIndex + 1;
    if (nextIndex < passages.length) {
      setCurrentPassage(passages[nextIndex]);
      setPassageIndex(nextIndex);
      setSessionState('ready');
      setSessionResult(null);
      setTimerRunning(false);
    } else {
      router.push('/journey');
    }
  }, [passageIndex, passages, router]);

  // Retry same passage
  const handleRetry = useCallback(() => {
    setSessionState('ready');
    setSessionResult(null);
    setTimerRunning(false);
  }, []);

  if (!levelConfig || !currentPassage) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const levelStats = getLevelStats(levelNum);

  return (
    <div className="flex-1 flex flex-col">
      <Header showNav={true} />

      <main className="flex-1 quiet-container py-8">
        {/* Level Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push('/journey')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Journey
          </Button>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">{levelConfig.name}</div>
            <div className="font-semibold">{levelConfig.title}</div>
          </div>

          {sessionState === 'typing' && (
            <Timer
              durationMinutes={levelConfig.duration}
              isRunning={timerRunning}
              onTimeUp={handleTimeUp}
            />
          )}
          {sessionState !== 'typing' && <div className="w-24" />}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Passage {passageIndex + 1} of {passages.length}</span>
            <span>{levelStats.completed} / {levelConfig.passagesRequired} required</span>
          </div>
          <Progress value={(levelStats.completed / levelConfig.totalPassages) * 100} className="h-2" />
        </div>

        {/* Session States */}
        {sessionState === 'ready' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentPassage.title}</span>
                {currentPassage.author && (
                  <span className="text-sm font-normal text-muted-foreground">
                    by {currentPassage.author}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg max-h-64 overflow-y-auto">
                <p className="text-lg leading-relaxed break-words">{currentPassage.content}</p>
              </div>

              <Button onClick={startSession} size="lg" className="w-full">
                Start Typing
              </Button>
            </CardContent>
          </Card>
        )}

        {sessionState === 'typing' && (
          <div className="max-w-3xl mx-auto flex flex-col" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <Card className="flex flex-col min-h-0 flex-1">
              <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-lg">
                  {currentPassage.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-0 flex-1">
                <TypingEngine
                  passage={currentPassage.content}
                  onComplete={handleComplete}
                  onProgress={handleTypingProgress}
                />
              </CardContent>
            </Card>

            <div className="shrink-0 mt-4">
              <StatsDisplay
                wpm={liveWpm}
                accuracy={liveAccuracy}
              />
            </div>

            <div className="shrink-0 mt-3">
              <VirtualKeyboard nextChar={nextChar} />
            </div>
          </div>
        )}

        {sessionState === 'complete' && sessionResult && (
          <SessionResult
            wpm={sessionResult.wpm}
            accuracy={sessionResult.accuracy}
            duration={sessionResult.duration}
            errors={sessionResult.errors}
            isPersonalBest={sessionResult.isPersonalBest}
            newBadges={sessionResult.newBadges}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}

        {sessionState === 'timeup' && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="text-4xl">⏰</div>
              <h2 className="text-xl font-semibold">Time&apos;s Up!</h2>
              <p className="text-muted-foreground">
                Your {levelConfig.duration}-minute session has ended. Great practice!
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleRetry}>
                  Try Again
                </Button>
                <Button className="flex-1" onClick={() => router.push('/journey')}>
                  Back to Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
