'use client';
import { useEffect, useState } from 'react';

interface P { id: number; left: number; dur: number; delay: number; size: number; }

export default function Petals({ count = 18 }: { count?: number }) {
  const [list, setList] = useState<P[]>([]);
  useEffect(() => {
    setList(Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 9 + Math.random() * 8,
      delay: Math.random() * 10,
      size: 12 + Math.random() * 12,
    })));
  }, [count]);
  return (
    <>
      {list.map(p => (
        <div key={p.id} className="petal" style={{
          left: p.left + '%',
          width: p.size,
          height: p.size,
          animationDuration: p.dur + 's',
          animationDelay: p.delay + 's',
        }} />
      ))}
    </>
  );
}