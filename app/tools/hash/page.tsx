'use client';
import { useState } from 'react';
import Link from 'next/link';

async function hashText(text: string, algo: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const h = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const ALGOS = [
  { id: 'SHA-256', label: 'SHA-256' },
  { id: 'SHA-1', label: 'SHA-1' },
  { id: 'SHA-384', label: 'SHA-384' },
  { id: 'SHA-512', label: 'SHA-512' },
];

export default function HashTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  async function run() {
    setError('');
    const out: Record<string, string> = {};
    try {
      for (const a of ALGOS) out[a.id] = await hashText(input, a.id);
      setResults(out);
    } catch (e: any) { setError(e.message); }
  }

  function copy(text: string) { navigator.clipboard.writeText(text); }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-4xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">哈希计算</h1>
        <p className="text-xs text-slate-500 mb-6">🔒 本地计算，不联网（MD5 浏览器不支持，可用 SHA 系列替代）</p>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-4">
          <label className="text-xs font-bold text-slate-500 mb-2 block">输入文本</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder="输入要计算哈希的文本..."
            className="w-full p-4 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white font-mono text-sm outline-none focus:border-indigo-400 transition resize-none" />
        </div>

        <button onClick={run} disabled={!input} className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition disabled:opacity-50 mb-6">计算</button>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>}

        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            {ALGOS.map(a => (
              <div key={a.id} className="bg-white/60 dark:bg-slate-800/50 rounded-xl p-4 border border-white/40 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">{a.label}</span>
                  <button onClick={() => copy(results[a.id])} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-bold">复制</button>
                </div>
                <code className="block font-mono text-xs break-all text-slate-800 dark:text-slate-200">{results[a.id]}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}