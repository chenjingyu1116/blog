'use client';
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
      setOutput(paras.join('\n\n'));
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
}