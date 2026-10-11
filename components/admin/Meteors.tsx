'use client';
import { useEffect, useState } from 'react';

interface M { id: number; left: number; top: number; delay: number; duration: number; }

export default function Meteors({ count = 5 }: { count?: number }) {
  const [list, setList] = useState<M[]>([]);
  useEffect(() => {
    const arr: M[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 80,
      top: Math.random() * 40,
      delay: Math.random() * 10,
      duration: 2 + Math.random() * 2,
    }));
    setList(arr);
  }, [count]);
  return (
    <>
      {list.map(m => (
        <div key={m.id} className="meteor" style={{
          left: m.left + '%',
          top: m.top + '%',
          animationDelay: m.delay + 's',
          animationDuration: m.duration + 's',
        }} />
      ))}
    </>
  );
}