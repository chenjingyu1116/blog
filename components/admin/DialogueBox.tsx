'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINES: Record<string, string[]> = {
  '/admin/posts/new': ['开始创作吧，我会一直守护你的。', '让这段故事，成为我们的羁绊。'],
  '/admin/posts': ['这些都是你写下的记忆呢。', '再写一篇新的故事吧？'],
  '/admin': ['欢迎回来，指挥官。', '今天也和精灵们一起努力吧。', '我们的故事，还在继续。'],
};

export default function DialogueBox() {
  const pathname = usePathname() || '/admin';
  const [shown, setShown] = useState('');

  useEffect(() => {
    const key = Object.keys(LINES).find(k => pathname.startsWith(k)) || '/admin';
    const pool = LINES[key];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setShown('');
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(pick.slice(0, i));
      if (i >= pick.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [pathname]);

  return (
    <div className="dialogue">
      <div className="dialogue-name">
        <span className="dialogue-pip" />
        TOHKA · 十香
      </div>
      <div className="dialogue-text">
        {shown}
        <span className="dialogue-cursor">▍</span>
      </div>
      <div className="dialogue-tag">RATATOSKR // SECURE CHANNEL</div>
    </div>
  );
}