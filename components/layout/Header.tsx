'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Leaf, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { useProgress } from './ProgressProvider';
import { warmUpSpeech, stopSpeaking } from '@/lib/speech';

interface HeaderProps {
  showNav?: boolean;
}

export default function Header({ showNav = true }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { progress, toggleAudio } = useProgress();

  const navItems = [
    { href: '/journey', label: 'Journey' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  const handleAudioToggle = async () => {
    if (!progress.audioEnabled) {
      // Warm up speech engine when enabling
      await warmUpSpeech();
    } else {
      // Stop any playing speech when disabling
      stopSpeaking();
    }
    toggleAudio();
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="quiet-container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Leaf className="h-6 w-6 text-green-500" />
          <span className="font-semibold text-lg">Type & Grow</span>
        </Link>

        <div className="flex items-center gap-6">
          {showNav && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors hover:text-foreground ${
                    pathname === item.href
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1">
            {/* Audio Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAudioToggle}
              aria-label={progress.audioEnabled ? 'Disable audio' : 'Enable audio'}
              title={progress.audioEnabled ? 'Audio On' : 'Audio Off'}
            >
              {progress.audioEnabled ? (
                <Volume2 className="h-5 w-5 text-green-500" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
