'use client';
export default function ToolsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-10 max-w-md text-center border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="text-6xl mb-4">🧰</div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">工具箱出错了</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {error.message || '未知错误'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">
            重试
          </button>
          <a href="/tools" className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-slate-700 dark:text-slate-200 font-bold transition">
            返回工具箱
          </a>
        </div>
      </div>
    </div>
  );
}