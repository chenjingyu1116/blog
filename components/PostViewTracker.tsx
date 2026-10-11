'use client';
import { useEffect } from 'react';

export default function PostViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    const key = 'xh-viewed-' + slug;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch('/api/posts/' + encodeURIComponent(slug) + '/view', { method: 'POST' }).catch(() => {});
  }, [slug]);
  return null;
}
