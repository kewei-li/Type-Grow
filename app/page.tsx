'use client';

import { useRouter } from 'next/navigation';
import { Leaf, Keyboard, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import { useProgress } from '@/components/layout/ProgressProvider';

export default function LandingPage() {
  const router = useRouter();
  const { progress } = useProgress();

  const handleStart = () => {
    if (progress.tutorialComplete) {
      router.push('/journey');
    } else {
      router.push('/tutorial');
    }
  };

  const features = [
    {
      icon: Keyboard,
      title: 'Learn at Your Pace',
      description: 'No pressure, no timers pushing you. Type when ready.',
    },
    {
      icon: BookOpen,
      title: 'Real Stories',
      description: 'Practice with fables, poems, and beautiful literature.',
    },
    {
      icon: Trophy,
      title: 'Grow Your Skills',
      description: 'Watch your typing improve as you progress through levels.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header showNav={progress.tutorialComplete} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="quiet-container py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-500/10">
              <Leaf className="h-16 w-16 text-green-500" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Type & Grow
          </h1>

          <p className="text-xl text-muted-foreground mb-2">
            You type. You grow. Then you move on.
          </p>

          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            A calm, purposeful typing journey built to help children grow skills, not screen time.
          </p>

          <Button size="lg" onClick={handleStart} className="gap-2">
            {progress.tutorialComplete ? 'Continue Journey' : 'Start Learning'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </section>

        {/* Features Section */}
        <section className="quiet-container py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="quiet-container py-16 border-t border-border">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

          <div className="max-w-2xl mx-auto space-y-8">
            {[
              { step: '1', title: 'Start with the basics', desc: 'Learn where the keys are and get comfortable.' },
              { step: '2', title: 'Practice with stories', desc: 'Type fables, poems, and passages at your own pace.' },
              { step: '3', title: 'Grow your skills', desc: 'Progress through levels as your typing improves.' },
              { step: '4', title: 'Earn badges', desc: 'Celebrate milestones without pressure.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
