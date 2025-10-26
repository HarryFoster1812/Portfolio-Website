'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const Tracker = () => {
  const pathname = usePathname();
  const lastSentRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSentRef.current === pathname) return;
    lastSentRef.current = pathname;

    // fire after paint
    const id = requestIdleCallback?.(() => {
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({ path: pathname || '/' }),
        });
      } catch {}
    }) as unknown as number;

    return () => {
      if (cancelIdleCallback && id) cancelIdleCallback(id);
    };
  }, [pathname]);

  return null;
}
