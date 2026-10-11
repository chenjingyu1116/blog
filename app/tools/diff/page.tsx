'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// 简单的行级 diff（基于最长公共子序列）
function diffLines(a: string, b: string) {
  const A = a.split('\n');
  const B = b.split('\n');
  const m = A.length, n = B.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (A[i] === B[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: { type: 'same' | 'add' | 'del'; text: string }[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) {
      result.push({ type: 'same', text: A[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'del', text: A[i] });
      i++;
    } else {
      result.push({ type: 'add', text: B[j] });
      j++;
    }
  }
  while (i < m) { result.push({ type: 'del', text: A[i++] }); }
  while (j < n) { result.push({ type: 'add', text: B[j++] }); }
  return result;
}

export default function DiffTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = useMemo(() => {
    if (!left && !right) return [];
    return diffLines(left, right);
  }, [left, right]);

  const addCount = diff.filter(d => d.type === 'add').length;
  const delCount = diff.filter(d => d.type === 'del').length;

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-6xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">文本对比</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">原文（A）</label>
            <textarea
              value={left}
              onChange={e => setLeft(e.target.value)}
              placeholder="粘贴第一段文本..."
              className="w-full h-[300px] p-4 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white font-mono text-sm outline-none focus:border-indigo-400 transition resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">对比（B）</label>
            <textarea
              value={right}
              onChange={e => setRight(e.target.value)}
              placeholder="粘贴第二段文本..."
              className="w-full h-[300px] p-4 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-slate-800 dark:text-white font-mono text-sm outline-none focus:border-indigo-400 transition resize-none"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-4 text-xs font-bold">
          <span className="text-emerald-500">+ {addCount} 新增</span>
          <span className="text-red-500">- {delCount} 删除</span>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-lg overflow-x-auto">
          <pre className="font-mono text-sm leading-6">
            {diff.map((d, i) => (
              <div
                key={i}
                className={
                  d.type === 'add' ? 'text-emerald-500 bg-emerald-500/10 px-2 -mx-2 rounded' :
                  d.type === 'del' ? 'text-red-500 bg-red-500/10 px-2 -mx-2 rounded line-through opacity-70' :
                  'text-slate-700 dark:text-slate-300 px-2 -mx-2'
                }
              >
                {d.type === 'add' ? '+ ' : d.type === 'del' ? '- ' : '  '}
                {d.text || ' '}
              </div>
            ))}
            {diff.length === 0 && (
              <span className="text-slate-400">输入两段文本开始对比...</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}