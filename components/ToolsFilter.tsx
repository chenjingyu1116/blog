'use client';
import { useState } from 'react';

export default function ToolsFilter({
  categories,
  onFilter,
}: {
  categories: string[];
  onFilter: (cat: string | null, q: string) => void;
}) {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState('');

  function update(newCat: string | null, newQ: string) {
    setCat(newCat);
    setQ(newQ);
    onFilter(newCat, newQ);
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="🔍 搜索工具..."
        value={q}
        onChange={e => update(cat, e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update(null, q)}
          className={
            'px-3 py-1.5 rounded-full text-xs font-bold transition ' +
            (cat === null
              ? 'bg-indigo-500 text-white'
              : 'bg-white/40 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white/60')
          }
        >
          全部
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => update(c, q)}
            className={
              'px-3 py-1.5 rounded-full text-xs font-bold transition ' +
              (cat === c
                ? 'bg-indigo-500 text-white'
                : 'bg-white/40 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white/60')
            }
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}