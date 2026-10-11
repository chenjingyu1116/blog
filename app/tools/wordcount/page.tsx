'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function WordCountTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const total = text.length;
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const numbers = (text.match(/\d+/g) || []).length;
    const punctuation = (text.match(/[，。！？、；：""''（）《》\.,!?;:'"()\[\]]/g) || []).length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const spaces = (text.match(/\s/g) || []).length;
    const noSpace = total - spaces;
    const readMinutes = Math.max(1, Math.ceil((chinese + englishWords) / 400));
    return { total, chinese, englishWords, numbers, punctuation, lines, paragraphs, spaces, noSpace, readMinutes };
  }, [text]);

  function copy() { navigator.clipboard.writeText(text); }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">字数统计</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="总字符" value={stats.total} color="#6366f1" />
          <Stat label="中文字" value={stats.chinese} color="#10b981" />
          <Stat label="英文词" value={stats.englishWords} color="#f59e0b" />
          <Stat label="数字" value={stats.numbers} color="#ec4899" />
          <Stat label="标点" value={stats.punctuation} color="#8b5cf6" />
          <Stat label="不含空格" value={stats.noSpace} color="#06b6d4" />
          <Stat label="行数" value={stats.lines} color="#f43f5e" />
          <Stat label="段落" value={stats.paragraphs} color="#14b8a6" />
        </div>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500">输入文本</label>
            <span className="text-xs text-indigo-500 font-bold">预计阅读 {stats.readMinutes} 分钟</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="粘贴或输入文本，实时统计..."
            rows={14}
            className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-sm text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition resize-vertical" />
        </div>

        <div className="flex gap-2">
          <button onClick={copy} disabled={!text} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition disabled:opacity-50">复制全文</button>
          <button onClick={() => setText('')} disabled={!text} className="px-6 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 text-white font-bold transition disabled:opacity-50">清空</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-lg">
      <div className="text-[10px] font-bold text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-black" style={{ color }}>{value}</div>
    </div>
  );
}