'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RadixTool() {
  const [value, setValue] = useState('255');
  const [base, setBase] = useState(10);
  const [error, setError] = useState('');

  const [results, setResults] = useState<{ base: number; label: string; value: string }[]>([]);

  useEffect(() => {
    try {
      const n = parseInt(value, base);
      if (isNaN(n)) throw new Error('不是有效的数字');
      setResults([
        { base: 2, label: '二进制', value: n.toString(2) },
        { base: 8, label: '八进制', value: n.toString(8) },
        { base: 10, label: '十进制', value: n.toString(10) },
        { base: 16, label: '十六进制', value: n.toString(16).toUpperCase() },
      ]);
      setError('');
    } catch (e: any) { setError(e.message); setResults([]); }
  }, [value, base]);

  function copy(text: string) { navigator.clipboard.writeText(text); }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">进制转换</h1>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">输入值</label>
            <input type="text" value={value} onChange={e => setValue(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white font-mono outline-none focus:border-indigo-400 transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">输入进制</label>
            <div className="flex gap-2">
              {[{b:2,l:'2'},{b:8,l:'8'},{b:10,l:'10'},{b:16,l:'16'}].map(o => (
                <button key={o.b} onClick={() => setBase(o.b)}
                  className={'flex-1 py-2 rounded-xl text-xs font-bold transition ' + (base === o.b ? 'bg-indigo-500 text-white' : 'bg-white/40 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300')}>
                  {o.l} 进制
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>}

        <div className="space-y-3">
          {results.map(r => (
            <div key={r.base} className={'flex items-center gap-3 p-4 rounded-xl border ' + (r.base === base ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-white/60 dark:bg-slate-800/50 border-white/40 dark:border-white/10')}>
              <div className="text-xs font-bold text-slate-500 w-20">{r.label}</div>
              <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-200 break-all">{r.value}</code>
              <button onClick={() => copy(r.value)} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold shrink-0">复制</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}