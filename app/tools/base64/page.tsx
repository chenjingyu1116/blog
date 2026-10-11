'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function encode() {
    try {
      const bytes = new TextEncoder().encode(input);
      let binary = '';
      bytes.forEach(b => binary += String.fromCharCode(b));
      setOutput(btoa(binary));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  }

  function decode() {
    try {
      const binary = atob(input.trim());
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      setOutput(new TextDecoder().decode(bytes));
      setError('');
    } catch (e: any) {
      setError('解码失败：不是有效的 Base64');
      setOutput('');
    }
  }

  function copy() {
    if (output) navigator.clipboard.writeText(output);
  }

  function swap() {
    setInput(output);
    setOutput('');
    setError('');
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-6xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">Base64 编解码</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={encode} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition">
            编码（文本 → Base64）
          </button>
          <button onClick={decode} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition">
            解码（Base64 → 文本）
          </button>
          <button onClick={swap} disabled={!output} className="px-4 py-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-sm font-bold transition disabled:opacity-50">
            结果放入输入
          </button>
          <button onClick={copy} disabled={!output} className="px-4 py-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-sm font-bold transition disabled:opacity-50">
            复制结果
          </button>
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white text-sm font-bold transition">
            清空
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">输入</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入要编码或解码的内容..."
              className="w-full h-[400px] p-4 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white font-mono text-sm outline-none focus:border-indigo-400 transition resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">输出</label>
            <textarea
              value={output}
              readOnly
              placeholder="结果会显示在这里"
              className="w-full h-[400px] p-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white font-mono text-sm outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}