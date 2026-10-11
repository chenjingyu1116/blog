'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function LoanTool() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(3.85);
  const [years, setYears] = useState(30);
  const [type, setType] = useState<'equal-payment' | 'equal-principal'>('equal-payment');

  const result = useMemo(() => {
    const totalMonths = years * 12;
    const monthlyRate = rate / 100 / 12;
    if (amount <= 0 || totalMonths <= 0) return null;

    if (type === 'equal-payment') {
      const factor = monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
      const denom = Math.pow(1 + monthlyRate, totalMonths) - 1;
      const monthly = (amount * factor) / denom;
      const total = monthly * totalMonths;
      const interest = total - amount;
      return {
        monthly: monthly.toFixed(2),
        firstMonth: monthly.toFixed(2),
        lastMonth: monthly.toFixed(2),
        total: total.toFixed(2),
        interest: interest.toFixed(2),
      };
    } else {
      const principal = amount / totalMonths;
      let totalInterest = 0;
      for (let i = 0; i < totalMonths; i++) {
        totalInterest += (amount - principal * i) * monthlyRate;
      }
      const firstMonth = principal + amount * monthlyRate;
      const lastMonth = principal + principal * monthlyRate;
      const total = amount + totalInterest;
      return {
        monthly: (total / totalMonths).toFixed(2),
        firstMonth: firstMonth.toFixed(2),
        lastMonth: lastMonth.toFixed(2),
        total: total.toFixed(2),
        interest: totalInterest.toFixed(2),
      };
    }
  }, [amount, rate, years, type]);

  function fmt(n: string) {
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">房贷计算器</h1>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">贷款金额（元）</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">年利率（%）</label>
            <input type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">贷款年限（年）</label>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">还款方式</label>
            <div className="flex gap-2">
              {([['equal-payment','等额本息'],['equal-principal','等额本金']] as const).map(([v,l]) => (
                <button key={v} type="button" onClick={() => setType(v)}
                  className={'flex-1 py-2.5 rounded-xl text-sm font-bold transition ' + (type === v ? 'bg-indigo-500 text-white' : 'bg-white/40 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 shadow-lg">
              <div className="text-xs font-bold text-slate-500 mb-1">月供</div>
              <div className="text-4xl font-black text-indigo-500">¥ {fmt(result.monthly)}</div>
              <div className="text-xs text-slate-500 mt-2">
                首月 ¥{fmt(result.firstMonth)} · 末月 ¥{fmt(result.lastMonth)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
                <div className="text-xs font-bold text-slate-500 mb-1">总还款</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">¥ {fmt(result.total)}</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
                <div className="text-xs font-bold text-slate-500 mb-1">总利息</div>
                <div className="text-2xl font-black text-rose-500">¥ {fmt(result.interest)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}