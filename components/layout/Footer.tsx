'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_VIEWS_KEY } from '@/lib/constants';

export default function Footer() {
  const pathname = usePathname();
  const [pageViews, setPageViews] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(PAGE_VIEWS_KEY);
      const currentCount = stored ? parseInt(stored, 10) : 0;
      const newCount = currentCount + 1;
      localStorage.setItem(PAGE_VIEWS_KEY, String(newCount));
      setPageViews(newCount);
    } catch {
      // localStorage may be unavailable
    }
  }, [pathname]);

  return (
    <footer className="border-t border-border py-6">
      <div className="quiet-container text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Kewei Li</p>
        {pageViews > 0 && (
          <p className="mt-1">Page Views: {pageViews.toLocaleString()}</p>
        )}
      </div>
    </footer>
  );
}
