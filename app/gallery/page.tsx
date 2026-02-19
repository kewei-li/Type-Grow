'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, Share2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/layout/Header';
import { useProgress } from '@/components/layout/ProgressProvider';
import { BADGES, LEVELS } from '@/lib/constants';
import { toast } from 'sonner';

export default function GalleryPage() {
  const router = useRouter();
  const { progress, isLoading, getLevelStats } = useProgress();
  const [selectedBadge, setSelectedBadge] = useState<typeof BADGES[0] | null>(null);

  // Redirect to tutorial if not complete
  useEffect(() => {
    if (!isLoading && !progress.tutorialComplete) {
      router.push('/tutorial');
    }
  }, [isLoading, progress.tutorialComplete, router]);

  if (isLoading || !progress.tutorialComplete) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const earnedBadges = BADGES.filter((b) => progress.badges.includes(b.id));
  const lockedBadges = BADGES.filter((b) => !progress.badges.includes(b.id));

  // Generate certificate data
  const generateCertificate = (level: number) => {
    const config = LEVELS[level];
    const stats = getLevelStats(level as 1 | 2 | 3);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      level: config.name,
      title: config.title,
      avgWpm: stats.avgWpm,
      avgAccuracy: stats.avgAccuracy,
      date,
      anonymousId: progress.name || progress.anonymousId || 'Learner',
    };
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        toast.success('Shared successfully!');
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const completedLevels = [1, 2, 3].filter((level) => {
    const stats = getLevelStats(level as 1 | 2 | 3);
    const config = LEVELS[level];
    return stats.completed >= config.passagesRequired;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header showNav={true} />

      <main className="flex-1 quiet-container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Gallery</h1>
          <p className="text-muted-foreground">
            Badges and certificates you&apos;ve earned
          </p>
        </div>

        {/* Earned Badges */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Earned Badges ({earnedBadges.length} / {BADGES.length})
          </h2>

          {earnedBadges.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Complete activities to earn your first badge!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <Dialog key={badge.id}>
                  <DialogTrigger asChild>
                    <Card
                      className="cursor-pointer badge-card hover:border-primary/50"
                      onClick={() => setSelectedBadge(badge)}
                    >
                      <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 relative">
                          <Image
                            src={badge.image}
                            alt={badge.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {badge.description}
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                          <Image
                            src={badge.image}
                            alt={badge.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {badge.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{badge.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            handleShare(
                              `I earned the "${badge.name}" badge on Type & Grow! ${badge.icon}`
                            )
                          }
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </section>

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Badges to Earn</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lockedBadges.map((badge) => (
                <Card key={badge.id} className="opacity-50">
                  <CardContent className="pt-6 text-center relative">
                    <Lock className="h-4 w-4 absolute top-2 right-2 text-muted-foreground" />
                    <div className="w-16 h-16 mx-auto mb-2 relative grayscale">
                      <Image
                        src={badge.image}
                        alt={badge.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {badge.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Certificates</h2>

          {completedLevels.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Complete a level to earn your first certificate!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {completedLevels.map((level) => {
                const cert = generateCertificate(level);
                return (
                  <Card key={level} className="overflow-hidden">
                    <div className="bg-gradient-to-br from-primary/10 to-green-500/10 p-6 border-b border-border">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          Certificate of Completion
                        </div>
                        <div className="text-2xl font-bold">{cert.title}</div>
                        <div className="text-sm text-muted-foreground mt-2">
                          {cert.level}
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4 space-y-4">
                      <div className="text-center text-sm">
                        <p className="text-muted-foreground">Awarded to</p>
                        <p className="font-medium">{cert.anonymousId}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center text-sm">
                        <div>
                          <div className="text-muted-foreground">Avg WPM</div>
                          <div className="font-semibold text-lg">{cert.avgWpm}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Accuracy</div>
                          <div className="font-semibold text-lg">{cert.avgAccuracy}%</div>
                        </div>
                      </div>

                      <div className="text-center text-xs text-muted-foreground">
                        {cert.date}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            handleShare(
                              `I completed ${cert.title} on Type & Grow with ${cert.avgWpm} WPM and ${cert.avgAccuracy}% accuracy! 🎓`
                            )
                          }
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            toast.info('Download feature coming soon!')
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
