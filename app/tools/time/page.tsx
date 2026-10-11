'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimeTool() {
  const [ts, setTs] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  function tsToDate() {
    try {
      const n = Number(ts.trim());
      if (isNaN(n)) throw new Error('不是有效数字');
      const ms = n < 10000000000 ? n * 1000 : n;
      const d = new Date(ms);
      setDateStr(d.toLocaleString('zh-CN', { hour12: false }));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  }

  function dateToTs() {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) throw new Error('无法解析日期');
      setTs(String(Math.floor(d.getTime() / 1000)));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  }

  function useNow() {
    setTs(String(Math.floor(now / 1000)));
    setDateStr(new Date(now).toLocaleString('zh-CN', { hour12: false }));
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">时间戳转换</h1>
        <p className="text-sm text-slate-500 mb-6">
          当前时间戳：<span className="font-mono text-indigo-500">{Math.floor(now / 1000)}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg">
            <label className="text-xs font-bold text-slate-500 mb-2 block">Unix 时间戳（秒或毫秒）</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ts}
                onChange={e => setTs(e.target.value)}
                placeholder="例如 1700000000"
                className="flex-1 px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 font-mono text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition"
              />
              <button onClick={tsToDate} className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition">
                → 转日期
              </button>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg">
            <label className="text-xs font-bold text-slate-500 mb-2 block">日期字符串</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                placeholder="例如 2024-01-15 12:30:00"
                className="flex-1 px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 font-mono text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition"
              />
              <button onClick={dateToTs} className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition">
                → 转时间戳
              </button>
            </div>
          </div>

          <button onClick={useNow} className="w-full py-3 rounded-xl bg-slate-500/20 hover:bg-slate-500/30 text-slate-700 dark:text-slate-200 font-bold text-sm transition">
            使用当前时间
          </button>
        </div>
      </div>
    </div>
  );
}