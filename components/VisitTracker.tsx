'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    let vid = '';
    try {
      vid = localStorage.getItem('xh-visitor-id') || '';
      if (!vid) {
        vid = 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('xh-visitor-id', vid);
      }
    } catch {}
    if (!vid) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, visitorId: vid }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
