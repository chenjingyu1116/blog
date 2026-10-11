import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
function w(rel, c) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c, 'utf-8');
  console.log('OK  ' + rel);
}

// ============ 1. 正则测试 ============
w('app/tools/regex/page.tsx', `'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function RegexTool() {
  const [pattern, setPattern] = useState('\\\\d+');
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
                placeholder="\\\\d+" />
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
}`);

// ============ 2. Lorem Ipsum ============
w('app/tools/lorem/page.tsx', `'use client';
import { useState } from 'react';
import Link from 'next/link';

const ZH_WORDS = ['天地','玄黄','宇宙','洪荒','日月','盈昃','辰宿','列张','寒来','暑往','秋收','冬藏','闰余','成岁','律吕','调阳','云腾','致雨','露结','为霜','金生','丽水','玉出','昆冈','剑号','巨阙','珠称','夜光','果珍','李柰','菜重','芥姜','海咸','河淡','鳞潜','羽翔','龙师','火帝','鸟官','人皇','始制','文字','乃服','衣裳','推位','让国','有虞','陶唐','吊民','伐罪','周发','殷汤','坐朝','问道','垂拱','平章','爱育','黎首','臣伏','戎羌','遐迩','一体','率宾','归王'];
const EN_WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];

function pick(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function genSentence(lang: 'zh' | 'en', wordCount: number) {
  const words = lang === 'zh' ? ZH_WORDS : EN_WORDS;
  const arr: string[] = [];
  for (let i = 0; i < wordCount; i++) arr.push(pick(words));
  return lang === 'zh' ? arr.join('') + '。' : arr.join(' ') + '.';
}

function genParagraph(lang: 'zh' | 'en', sentenceCount: number) {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(genSentence(lang, 5 + Math.floor(Math.random() * 10)));
  }
  return lang === 'zh' ? sentences.join('') : sentences.join(' ');
}

export default function LoremTool() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [mode, setMode] = useState<'paragraph' | 'sentence' | 'word'>('paragraph');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  function gen() {
    if (mode === 'paragraph') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) paras.push(genParagraph(lang, 3 + Math.floor(Math.random() * 4)));
      setOutput(paras.join('\\n\\n'));
    } else if (mode === 'sentence') {
      const arr: string[] = [];
      for (let i = 0; i < count; i++) arr.push(genSentence(lang, 5 + Math.floor(Math.random() * 10)));
      setOutput(arr.join(lang === 'zh' ? '' : ' '));
    } else {
      const words = lang === 'zh' ? ZH_WORDS : EN_WORDS;
      const arr: string[] = [];
      for (let i = 0; i < count; i++) arr.push(pick(words));
      setOutput(arr.join(lang === 'zh' ? '' : ' '));
    }
  }

  function copy() { navigator.clipboard.writeText(output); }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">Lorem Ipsum 生成</h1>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">语言</label>
            <div className="flex gap-2">
              {([['zh','中文'],['en','English']] as const).map(([v,l]) => (
                <button key={v} type="button" onClick={() => setLang(v)}
                  className={'flex-1 py-2 rounded-xl text-xs font-bold transition ' + (lang === v ? 'bg-indigo-500 text-white' : 'bg-white/40 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">生成单位</label>
            <div className="flex gap-2">
              {([['paragraph','段落'],['sentence','句子'],['word','单词']] as const).map(([v,l]) => (
                <button key={v} type="button" onClick={() => setMode(v)}
                  className={'flex-1 py-2 rounded-xl text-xs font-bold transition ' + (mode === v ? 'bg-indigo-500 text-white' : 'bg-white/40 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">数量：{count}</label>
            <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={gen} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">生成</button>
          <button onClick={copy} disabled={!output} className="px-6 py-3 rounded-xl bg-slate-500 hover:bg-slate-600 text-white font-bold transition disabled:opacity-50">复制</button>
        </div>

        {output && (
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
            <textarea value={output} readOnly rows={12}
              className="w-full px-3 py-2 rounded-lg bg-white/40 dark:bg-slate-900/30 border border-white/40 dark:border-white/10 text-sm text-slate-800 dark:text-white outline-none resize-vertical" />
          </div>
        )}
      </div>
    </div>
  );
}`);

// ============ 3. 房贷计算器 ============
w('app/tools/loan/page.tsx', `'use client';
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
}`);

// ============ 4. 字数统计 ============
w('app/tools/wordcount/page.tsx', `'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function WordCountTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const total = text.length;
    const chinese = (text.match(/[\\u4e00-\\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const numbers = (text.match(/\\d+/g) || []).length;
    const punctuation = (text.match(/[，。！？、；：""''（）《》\\.,!?;:'"()\\[\\]]/g) || []).length;
    const lines = text.split('\\n').length;
    const paragraphs = text.split(/\\n\\s*\\n/).filter(p => p.trim()).length;
    const spaces = (text.match(/\\s/g) || []).length;
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
}`);

console.log('\\n✅ 4 个新工具文件生成完成');
console.log('接下来到后台 /admin/tools 添加这 4 个工具（或执行下一步脚本自动添加）');