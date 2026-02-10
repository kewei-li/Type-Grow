'use client';

import { ThemeProvider } from './ThemeProvider';
import { ProgressProvider } from './ProgressProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </ThemeProvider>
  );
}
