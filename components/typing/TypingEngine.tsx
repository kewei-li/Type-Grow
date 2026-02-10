'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TypingState } from '@/types';
import { calculateWpm, calculateAccuracy } from '@/lib/progress';

interface TypingEngineProps {
  passage: string;
  onComplete: (result: {
    wpm: number;
    accuracy: number;
    duration: number;
    errors: number;
    maxConsecutiveCorrect: number;
    hadLongPause: boolean;
  }) => void;
  onProgress?: (state: TypingState) => void;
  disabled?: boolean;
}

export default function TypingEngine({
  passage,
  onComplete,
  onProgress,
  disabled = false,
}: TypingEngineProps) {
  const [state, setState] = useState<TypingState>({
    passage,
    typed: '',
    currentIndex: 0,
    errors: [],
    startTime: null,
    endTime: null,
    isComplete: false,
    totalKeystrokes: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastKeystrokeTime = useRef<number>(Date.now());
  const maxConsecutiveCorrect = useRef<number>(0);
  const currentConsecutive = useRef<number>(0);
  const hadLongPause = useRef<boolean>(false);

  // Reset when passage changes
  useEffect(() => {
    setState({
      passage,
      typed: '',
      currentIndex: 0,
      errors: [],
      startTime: null,
      endTime: null,
      isComplete: false,
      totalKeystrokes: 0,
    });
    maxConsecutiveCorrect.current = 0;
    currentConsecutive.current = 0;
    hadLongPause.current = false;
    lastKeystrokeTime.current = Date.now();
  }, [passage]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Notify parent of progress
  useEffect(() => {
    onProgress?.(state);
  }, [state, onProgress]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || state.isComplete) return;

      // Prevent default for most keys
      if (e.key !== 'Tab' && e.key !== 'Escape') {
        e.preventDefault();
      }

      // Check for long pause (30+ seconds)
      const now = Date.now();
      if (state.startTime && now - lastKeystrokeTime.current > 30000) {
        hadLongPause.current = true;
      }
      lastKeystrokeTime.current = now;

      // Handle Backspace
      if (e.key === 'Backspace') {
        if (state.currentIndex > 0) {
          setState((prev) => ({
            ...prev,
            typed: prev.typed.slice(0, -1),
            currentIndex: prev.currentIndex - 1,
            errors: prev.errors.filter((i) => i !== prev.currentIndex - 1),
          }));
          currentConsecutive.current = 0;
        }
        return;
      }

      // Ignore modifier keys and special keys
      if (
        e.key.length !== 1 ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      const expectedChar = passage[state.currentIndex];
      const typedChar = e.key;
      const isCorrect = typedChar === expectedChar;

      // Start timer on first keystroke
      const startTime = state.startTime || now;

      setState((prev) => {
        const newIndex = prev.currentIndex + 1;
        const newErrors = isCorrect
          ? prev.errors
          : [...prev.errors, prev.currentIndex];

        // Track consecutive correct
        if (isCorrect) {
          currentConsecutive.current++;
          if (currentConsecutive.current > maxConsecutiveCorrect.current) {
            maxConsecutiveCorrect.current = currentConsecutive.current;
          }
        } else {
          currentConsecutive.current = 0;
        }

        const isComplete = newIndex >= passage.length;
        const endTime = isComplete ? now : null;

        return {
          ...prev,
          typed: prev.typed + typedChar,
          currentIndex: newIndex,
          errors: newErrors,
          startTime,
          endTime,
          isComplete,
          totalKeystrokes: prev.totalKeystrokes + 1,
        };
      });
    },
    [disabled, state, passage]
  );

  // Handle completion
  useEffect(() => {
    if (state.isComplete && state.startTime && state.endTime) {
      const duration = state.endTime - state.startTime;
      const correctChars = state.passage.length - state.errors.length;

      onComplete({
        wpm: calculateWpm(correctChars, duration),
        accuracy: calculateAccuracy(correctChars, state.totalKeystrokes),
        duration: Math.round(duration / 1000),
        errors: state.errors.length,
        maxConsecutiveCorrect: maxConsecutiveCorrect.current,
        hadLongPause: hadLongPause.current,
      });
    }
  }, [state.isComplete, state.startTime, state.endTime, state.passage.length, state.errors.length, state.totalKeystrokes, onComplete]);

  // Render characters with appropriate styling
  const renderPassage = () => {
    return passage.split('').map((char, index) => {
      let className = 'char-upcoming';

      if (index < state.currentIndex) {
        // Already typed
        className = state.errors.includes(index) ? 'char-error' : 'char-correct';
      } else if (index === state.currentIndex) {
        // Current position
        className = 'char-current';
      }

      // Handle spaces and special characters visually
      const displayChar = char === ' ' ? '\u00A0' : char;

      return (
        <span key={index} className={className}>
          {displayChar}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`typing-area focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
      }`}
      role="textbox"
      aria-label="Typing area"
    >
      <div className="select-none">{renderPassage()}</div>

      {/* Hidden input for mobile keyboard support */}
      <input
        type="text"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
