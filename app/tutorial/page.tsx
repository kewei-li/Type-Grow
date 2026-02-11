'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import { useProgress } from '@/components/layout/ProgressProvider';
import TypingEngine from '@/components/typing/TypingEngine';

type TutorialStep = 'intro' | 'homerow' | 'practice' | 'complete';

const TUTORIAL_STEPS: TutorialStep[] = ['intro', 'homerow', 'practice', 'complete'];

const HOME_ROW_TEXT = 'asdf jkl;';
const FIRST_PASSAGE = 'The cat sat on the mat.';

export default function TutorialPage() {
  const router = useRouter();
  const { completeTutorial, progress } = useProgress();
  const [currentStep, setCurrentStep] = useState<TutorialStep>('intro');
  const [homeRowComplete, setHomeRowComplete] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);

  const audioEnabled = progress.audioEnabled;

  const stepIndex = TUTORIAL_STEPS.indexOf(currentStep);
  const progressPercent = (stepIndex / (TUTORIAL_STEPS.length - 1)) * 100;

  const goNext = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < TUTORIAL_STEPS.length) {
      setCurrentStep(TUTORIAL_STEPS[nextIndex]);
    }
  }, [stepIndex]);

  const goBack = useCallback(() => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(TUTORIAL_STEPS[prevIndex]);
    }
  }, [stepIndex]);

  const handleHomeRowComplete = useCallback(() => {
    setHomeRowComplete(true);
  }, []);

  const handlePracticeComplete = useCallback(() => {
    setPracticeComplete(true);
  }, []);

  const handleFinish = useCallback(() => {
    completeTutorial();
    router.push('/journey');
  }, [completeTutorial, router]);

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-6 w-6" />
                Welcome to Type & Grow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Learning to type is like learning to ride a bike. At first, you have to think about every key. But soon, your fingers will know where to go on their own.
              </p>

              <div className="space-y-4">
                <h3 className="font-semibold">In this tutorial, you will learn:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Where to place your fingers (home row)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    How to type characters one at a time
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    How to fix mistakes with Backspace
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Tip:</strong> Don&apos;t worry about speed. Focus on accuracy first. Speed comes naturally with practice.
                </p>
              </div>

              <Button onClick={goNext} className="w-full">
                Let&apos;s Begin
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'homerow':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Step 1: Home Row Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                The home row is where your fingers rest. Your left hand covers <strong>A S D F</strong> and your right hand covers <strong>J K L ;</strong>
              </p>

              {/* Keyboard Visual with Hand Outlines */}
              <div className="bg-muted/30 p-6 rounded-lg">
                {/* Keyboard */}
                <div className="flex justify-center gap-1 mb-2 text-xs text-muted-foreground">
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                    <div key={key} className="w-8 h-8 rounded border border-border flex items-center justify-center">
                      {key}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {['A', 'S', 'D', 'F'].map((key) => (
                    <div key={key} className="w-8 h-8 rounded bg-green-500/20 border-2 border-green-500 flex items-center justify-center font-bold text-green-500">
                      {key}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground">G</div>
                  <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground">H</div>
                  {['J', 'K', 'L', ';'].map((key) => (
                    <div key={key} className="w-8 h-8 rounded bg-green-500/20 border-2 border-green-500 flex items-center justify-center font-bold text-green-500">
                      {key}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-1 mb-4 text-xs text-muted-foreground">
                  {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map((key) => (
                    <div key={key} className="w-8 h-8 rounded border border-border flex items-center justify-center">
                      {key}
                    </div>
                  ))}
                </div>

                {/* Hand Outlines */}
                <div className="flex justify-center gap-6 mt-4">
                  {/* Left Hand */}
                  <div className="relative">
                    <svg width="140" height="100" viewBox="0 0 140 100" className="text-green-500">
                      {/* Palm */}
                      <ellipse cx="70" cy="70" rx="55" ry="28" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                      {/* Pinky - A */}
                      <path d="M20 65 Q18 40 20 20 Q22 15 25 20 Q27 40 28 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="22" cy="18" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="22" y="8" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">A</text>
                      {/* Ring - S */}
                      <path d="M42 60 Q40 30 42 10 Q44 5 47 10 Q49 30 50 58" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="44" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="44" y="-2" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">S</text>
                      {/* Middle - D */}
                      <path d="M64 58 Q62 25 64 5 Q66 0 69 5 Q71 25 72 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="66" cy="3" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="66" y="-7" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">D</text>
                      {/* Index - F */}
                      <path d="M86 58 Q84 30 86 12 Q88 7 91 12 Q93 30 94 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="88" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="88" y="0" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">F</text>
                      {/* Thumb */}
                      <path d="M110 75 Q115 65 120 60 Q125 58 125 65 Q120 72 112 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    </svg>
                    <div className="text-center text-xs text-muted-foreground mt-1">Left Hand</div>
                  </div>

                  {/* Right Hand */}
                  <div className="relative">
                    <svg width="140" height="100" viewBox="0 0 140 100" className="text-green-500">
                      {/* Palm */}
                      <ellipse cx="70" cy="70" rx="55" ry="28" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                      {/* Index - J */}
                      <path d="M46 56 Q48 30 46 12 Q44 7 41 12 Q39 30 38 58" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="44" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="44" y="0" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">J</text>
                      {/* Middle - K */}
                      <path d="M68 56 Q70 25 68 5 Q66 0 63 5 Q61 25 60 58" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="66" cy="3" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="66" y="-7" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">K</text>
                      {/* Ring - L */}
                      <path d="M90 58 Q92 30 90 10 Q88 5 85 10 Q83 30 82 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="88" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="88" y="-2" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">L</text>
                      {/* Pinky - ; */}
                      <path d="M112 60 Q114 40 112 20 Q110 15 107 20 Q105 40 104 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="110" cy="18" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="110" y="8" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">;</text>
                      {/* Thumb */}
                      <path d="M22 75 Q17 65 12 60 Q7 58 7 65 Q12 72 20 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    </svg>
                    <div className="text-center text-xs text-muted-foreground mt-1">Right Hand</div>
                  </div>
                </div>

                {/* Finger Labels */}
                <div className="flex justify-center gap-16 mt-3 text-xs text-muted-foreground">
                  <div className="text-center">
                    <span className="text-green-500/70">Pinky → Ring → Middle → Index</span>
                  </div>
                  <div className="text-center">
                    <span className="text-green-500/70">Index → Middle → Ring → Pinky</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Now try typing the home row keys:</p>
                <TypingEngine
                  passage={HOME_ROW_TEXT}
                  onComplete={handleHomeRowComplete}
                  disabled={homeRowComplete}
                  audioEnabled={audioEnabled}
                />
              </div>

              {homeRowComplete && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-center">
                  <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-green-500 font-medium">Great job! You&apos;ve typed the home row.</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goNext} className="flex-1" disabled={!homeRowComplete}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'practice':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Step 2: Your First Sentence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Now let&apos;s try typing a complete sentence. Watch the highlighted character and type it. Use <strong>Backspace</strong> to fix mistakes.
              </p>

              <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                <p><span className="text-green-500">Green</span> = Correct</p>
                <p><span className="text-red-500">Red</span> = Error (press Backspace)</p>
                <p><span className="bg-primary/30 px-1 rounded">Highlighted</span> = Current character</p>
              </div>

              <TypingEngine
                passage={FIRST_PASSAGE}
                onComplete={handlePracticeComplete}
                disabled={practiceComplete}
                audioEnabled={audioEnabled}
              />

              {practiceComplete && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-center">
                  <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-green-500 font-medium">Excellent! You typed your first sentence!</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goNext} className="flex-1" disabled={!practiceComplete}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'complete':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Tutorial Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-6xl mb-4">🌱</div>

              <p className="text-lg">
                Congratulations! You&apos;ve earned your first badge:
              </p>

              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full">
                <span className="text-2xl">🌱</span>
                <span className="font-semibold text-green-500">First Steps</span>
              </div>

              <p className="text-muted-foreground">
                You&apos;re ready to begin your typing journey. Start with Level 1 and practice at your own pace.
              </p>

              <Button onClick={handleFinish} size="lg" className="w-full">
                Start Level 1
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNav={false} />

      <main className="flex-1 quiet-container py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Tutorial Progress</span>
            <span>{stepIndex + 1} / {TUTORIAL_STEPS.length}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {renderStep()}
      </main>
    </div>
  );
}
