'use client';
import { useState } from 'react';
import Link from 'next/link';

function genUuid() {
  return crypto.randomUUID();
}

function genShort() {
  return Math.random().toString(36).slice(2, 10);
}

export default function UuidTool() {
  const [items, setItems] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [short, setShort] = useState(false);

  function gen() {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) arr.push(short ? genShort() : genUuid());
    setItems(arr);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    alert('已复制');
  }

  function copyAll() {
    navigator.clipboard.writeText(items.join('\n'));
    alert('已复制全部');
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">UUID 生成</h1>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">数量：{count}</label>
            <input type="range" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer text-sm">
            <input type="checkbox" checked={short} onChange={e => setShort(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
            使用短 ID（10 位）
          </label>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={gen} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">生成</button>
          <button onClick={copyAll} disabled={items.length === 0} className="px-5 py-3 rounded-xl bg-slate-500 hover:bg-slate-600 text-white font-bold transition disabled:opacity-50">复制全部</button>
        </div>

        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((u, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/50 rounded-xl p-3 border border-white/40 dark:border-white/10">
                <code className="flex-1 font-mono text-xs text-slate-800 dark:text-slate-200 break-all">{u}</code>
                <button onClick={() => copy(u)} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold hover:bg-indigo-500/20 transition shrink-0">复制</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}