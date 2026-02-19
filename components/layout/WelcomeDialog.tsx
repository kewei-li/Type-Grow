'use client';

import { useState } from 'react';
import { Leaf } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GRADES } from '@/lib/constants';

interface WelcomeDialogProps {
  open: boolean;
  onComplete: (name: string, grade: number) => void;
}

export default function WelcomeDialog({ open, onComplete }: WelcomeDialogProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number | null>(null);

  const trimmedName = name.trim();
  const isValid = trimmedName.length >= 1 && trimmedName.length <= 20 && grade !== null;

  const handleSubmit = () => {
    if (!isValid || grade === null) return;
    onComplete(trimmedName, grade);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md"
      >
        <DialogHeader className="items-center text-center">
          <div className="p-3 rounded-full bg-green-500/10 mb-2">
            <Leaf className="h-8 w-8 text-green-500" />
          </div>
          <DialogTitle className="text-xl">Welcome to Type & Grow!</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="welcome-name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="welcome-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              maxLength={20}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              {trimmedName.length}/20 characters
            </p>
          </div>

          {/* Grade Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Grade</label>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGrade(g.value)}
                  className={`h-12 rounded-lg border-2 text-sm font-semibold transition-all ${
                    grade === g.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            size="lg"
            className="w-full"
          >
            Start Learning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
