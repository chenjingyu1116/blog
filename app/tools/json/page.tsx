'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function format(indent: number) {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, indent));
      setError('');
    } catch (e: any) {
      setError('解析失败：' + e.message);
      setOutput('');
    }
  }

  function minify() {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setError('');
    } catch (e: any) {
      setError('解析失败：' + e.message);
      setOutput('');
    }
  }

  function validate() {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✅ JSON 语法正确');
    } catch (e: any) {
      setError('❌ ' + e.message);
      setOutput('');
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
  }

  function clearAll() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-6xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">JSON 格式化</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => format(2)} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition">格式化 (2 空格)</button>
          <button onClick={() => format(4)} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition">格式化 (4 空格)</button>
          <button onClick={minify} className="px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold transition">压缩</button>
          <button onClick={validate} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition">校验</button>
          <button onClick={copy} className="px-4 py-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-sm font-bold transition">复制结果</button>
          <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white text-sm font-bold transition">清空</button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-mono">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">输入</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='粘贴 JSON 到这里...'
              className="w-full h-[500px] p-4 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white font-mono text-sm outline-none focus:border-indigo-400 transition resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">输出</label>
            <textarea
              value={output}
              readOnly
              placeholder="结果会显示在这里"
              className="w-full h-[500px] p-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white font-mono text-sm outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}