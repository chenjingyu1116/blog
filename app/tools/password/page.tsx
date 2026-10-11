'use client';
import { useState } from 'react';
import Link from 'next/link';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digit: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{};:,.<>?',
};

export default function PasswordTool() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigit, setUseDigit] = useState(true);
  const [useSymbol, setUseSymbol] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  function gen() {
    let pool = '';
    if (useUpper) pool += CHARS.upper;
    if (useLower) pool += CHARS.lower;
    if (useDigit) pool += CHARS.digit;
    if (useSymbol) pool += CHARS.symbol;
    if (excludeSimilar) pool = pool.replace(/[O0Il1]/g, '');
    if (!pool) { alert('至少选择一种字符类型'); return; }

    let pwd = '';
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) {
      pwd += pool[arr[i] % pool.length];
    }
    setPassword(pwd);
    setHistory(h => [pwd, ...h].slice(0, 10));
  }

  function copy() {
    if (!password) return;
    navigator.clipboard.writeText(password);
    alert('已复制到剪贴板');
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">密码生成器</h1>

        <div className="space-y-4">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg">
            <div className="text-xs font-bold text-slate-500 mb-3">密码长度：{length}</div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg space-y-3">
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              包含大写字母 (A-Z)
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              包含小写字母 (a-z)
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={useDigit} onChange={e => setUseDigit(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              包含数字 (0-9)
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={useSymbol} onChange={e => setUseSymbol(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              包含符号 (!@#$%...)
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              排除易混淆字符 (O 0 I l 1)
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={gen} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">
              生成密码
            </button>
            <button onClick={copy} disabled={!password} className="px-6 py-3 rounded-xl bg-slate-500 hover:bg-slate-600 text-white font-bold transition disabled:opacity-50">
              复制
            </button>
          </div>

          {password && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">生成结果</div>
              <div className="font-mono text-lg text-slate-800 dark:text-white break-all">{password}</div>
            </div>
          )}

          {history.length > 1 && (
            <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg">
              <div className="text-xs font-bold text-slate-500 mb-3">历史记录（最近 10 条）</div>
              <div className="space-y-2">
                {history.slice(1).map((h, i) => (
                  <div key={i} className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all">{h}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}