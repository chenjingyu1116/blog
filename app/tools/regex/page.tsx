'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function RegexTool() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [text, setText] = useState('测试文本：abc123def456，还有 789 和 ABC。');

  const result = useMemo(() => {
    if (!pattern) return { error: '', matches: [], highlighted: text };
    const flagStr = Object.entries(flags).filter(([_, v]) => v).map(([k]) => k).join('');
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flagStr);
    } catch (e: any) {
      return { error: e.message, matches: [], highlighted: text };
    }
    const matches: { value: string; index: number; groups: string[] }[] = [];
    let m;
    if (flags.g) {
      while ((m = regex.exec(text)) !== null) {
        matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
        if (m.index === regex.lastIndex) regex.lastIndex++;
      }
    } else {
      m = regex.exec(text);
      if (m) matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
    }
    return { error: '', matches, highlighted: text };
  }, [pattern, flags, text]);

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-5xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">正则测试</h1>

        <div className="space-y-4">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
            <label className="text-xs font-bold text-slate-500 mb-2 block">正则表达式</label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-mono text-sm">/</span>
              <input value={pattern} onChange={e => setPattern(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 font-mono text-sm text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition"
                placeholder="\\d+" />
              <span className="text-slate-500 font-mono text-sm">/</span>
              {(['g','i','m','s'] as const).map(f => (
                <button key={f} type="button" onClick={() => setFlags({ ...flags, [f]: !flags[f] })}
                  className={'w-8 h-8 rounded-lg font-mono text-sm font-bold transition ' + (flags[f] ? 'bg-indigo-500 text-white' : 'bg-white/40 dark:bg-slate-900/50 text-slate-500')}>
                  {f}
                </button>
              ))}
            </div>
            {result.error && <p className="mt-2 text-xs text-red-500">语法错误：{result.error}</p>}
          </div>

          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500">测试文本</label>
              <span className="text-xs text-emerald-500 font-bold">匹配 {result.matches.length} 处</span>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
              className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 font-mono text-sm text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition resize-vertical" />
          </div>

          {result.matches.length > 0 && (
            <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
              <label className="text-xs font-bold text-slate-500 mb-3 block">匹配结果</label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {result.matches.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 w-10">#{i+1}</span>
                    <code className="flex-1 font-mono text-xs text-slate-800 dark:text-white break-all">{m.value}</code>
                    <span className="text-[10px] text-slate-400 shrink-0">@ {m.index}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}