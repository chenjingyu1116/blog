'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-10 max-w-md text-center border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">出错了</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {error.message || '页面遇到未知错误'}
        </p>
        <button onClick={reset} className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">
          重试
        </button>
      </div>
    </div>
  );
}