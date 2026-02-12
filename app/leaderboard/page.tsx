'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Medal, Award, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Header from '@/components/layout/Header';
import { useProgress } from '@/components/layout/ProgressProvider';
import { getLeaderboard, LeaderboardResult } from '@/lib/db';
import { LEVELS } from '@/lib/constants';
import { Level, LeaderboardEntry } from '@/types';

const GRADES = [
  { value: 1, label: 'Grade 1' },
  { value: 2, label: 'Grade 2' },
  { value: 3, label: 'Grade 3' },
  { value: 4, label: 'Grade 4' },
  { value: 5, label: 'Grade 5' },
  { value: 6, label: 'Grade 6' },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const { progress, isLoading, updateGrade } = useProgress();

  const [selectedGrade, setSelectedGrade] = useState<number>(progress.grade || 3);
  const [selectedLevel, setSelectedLevel] = useState<Level>(1);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGradeDialog, setShowGradeDialog] = useState(false);

  // Redirect to tutorial if not complete
  useEffect(() => {
    if (!isLoading && !progress.tutorialComplete) {
      router.push('/tutorial');
    }
  }, [isLoading, progress.tutorialComplete, router]);

  // Show grade selection if not set
  useEffect(() => {
    if (!isLoading && progress.tutorialComplete && !progress.grade) {
      setShowGradeDialog(true);
    }
  }, [isLoading, progress.tutorialComplete, progress.grade]);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(selectedGrade, selectedLevel, progress.anonymousId || undefined);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, selectedLevel, progress.anonymousId]);

  useEffect(() => {
    if (progress.tutorialComplete && selectedGrade) {
      fetchLeaderboard();
    }
  }, [progress.tutorialComplete, selectedGrade, selectedLevel, fetchLeaderboard]);

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    updateGrade(grade);
    setShowGradeDialog(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center font-mono">{rank}</span>;
    }
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry) => (
    <div
      key={`${entry.anonymousId}-${entry.rank}`}
      className={`flex items-center gap-4 p-3 rounded-lg ${
        entry.isCurrentUser
          ? 'bg-primary/10 border border-primary/30'
          : 'bg-muted/30 hover:bg-muted/50'
      } transition-colors`}
    >
      <div className="w-8 flex justify-center">
        {getRankIcon(entry.rank)}
      </div>

      <div className="flex-1 flex items-center gap-2">
        {entry.isCurrentUser && <User className="h-4 w-4 text-primary" />}
        <span className={entry.isCurrentUser ? 'font-medium' : ''}>
          {entry.anonymousId}
        </span>
        {entry.isCurrentUser && (
          <span className="text-xs text-primary">(You)</span>
        )}
      </div>

      <div className="text-right">
        <div className="font-mono font-medium">{entry.bestWpm} WPM</div>
        <div className="text-xs text-muted-foreground">{entry.bestAccuracy}%</div>
      </div>
    </div>
  );

  if (isLoading || !progress.tutorialComplete) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header showNav={true} />

      {/* Grade Selection Dialog */}
      <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Your Grade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This helps us show you the right leaderboard. Your choice is private and only used for ranking.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {GRADES.map((grade) => (
                <Button
                  key={grade.value}
                  variant="outline"
                  className="h-12"
                  onClick={() => handleGradeSelect(grade.value)}
                >
                  {grade.label}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1 quiet-container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you compare with others at your level
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* Grade Selector */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                Grade {selectedGrade}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Grade</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {GRADES.map((grade) => (
                  <Button
                    key={grade.value}
                    variant={selectedGrade === grade.value ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedGrade(grade.value);
                      updateGrade(grade.value);
                    }}
                  >
                    {grade.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Level Selector */}
          <div className="flex gap-2">
            {([1, 2, 3] as Level[]).map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                onClick={() => setSelectedLevel(level)}
              >
                {LEVELS[level].name}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top 20 - Grade {selectedGrade}, {LEVELS[selectedLevel].name}</span>
              {leaderboardData && (
                <span className="text-sm font-normal text-muted-foreground">
                  {leaderboardData.totalEntries} participants
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading leaderboard...
              </div>
            ) : !leaderboardData || leaderboardData.entries.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="mb-2">No entries yet for this grade and level.</p>
                <p className="text-sm">Be the first to set a score!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboardData.entries.map(renderLeaderboardEntry)}

                {/* User's rank if not in top 20 */}
                {leaderboardData.userEntry &&
                  leaderboardData.userRank &&
                  leaderboardData.userRank > 20 && (
                    <>
                      <div className="text-center py-2 text-muted-foreground">
                        • • •
                      </div>
                      {renderLeaderboardEntry(leaderboardData.userEntry)}
                    </>
                  )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Leaderboard uses anonymous IDs only. No personal information is shared.
          </p>
        </div>
      </main>
    </div>
  );
}
