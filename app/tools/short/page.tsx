'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function ShortTool() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<{ original: string; short: string }[]>([]);
  const [qr, setQr] = useState('');
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!result) { setQr(''); return; }
    QRCode.toDataURL(result, { width: 240, margin: 2, color: { dark: '#000000', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [result]);

  useEffect(() => {
    const saved = localStorage.getItem('xh-short-history');
    if (saved) {
      try { setHistory(JSON.parse(saved).slice(0, 10)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('xh-short-history', JSON.stringify(history.slice(0, 10)));
    }
  }, [history]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('/api/tools/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: customCode.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      const full = window.location.origin + data.short;
      setResult(full);
      setHistory(h => {
        const next = [{ original: url, short: full }, ...h.filter(x => x.short !== full)].slice(0, 10);
        return next;
      });
      setUrl('');
      setCustomCode('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, label = '已复制') {
    navigator.clipboard.writeText(text);
    alert(label);
  }

  function downloadQr() {
    if (!qr) return;
    const a = document.createElement('a');
    a.href = qr;
    a.download = 'shortlink-qrcode.png';
    a.click();
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-3xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">短链生成</h1>

        <form onSubmit={onSubmit} className="space-y-4 mb-6">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-2 block">长链接</label>
              <input type="text" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url..."
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-2 block">
                自定义短码 <span className="opacity-50 font-normal">（可选）</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-500 shrink-0">/s/</span>
                <input type="text" value={customCode}
                  onChange={e => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="my-link" maxLength={32}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white font-mono outline-none focus:border-indigo-400 transition" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || !url.trim()}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition disabled:opacity-50">
            {loading ? '生成中...' : '生成短链'}
          </button>
        </form>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>}

        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-6">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">生成成功</div>
            <div className="flex items-center gap-3 mb-3">
              <input readOnly value={result}
                className="flex-1 px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-900/50 border border-emerald-500/30 font-mono text-sm text-slate-800 dark:text-white outline-none" />
              <button onClick={() => copy(result)} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition">复制</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => copy('[' + result + '](' + result + ')', '已复制 Markdown')} className="px-3 py-1 rounded-lg bg-white/20 text-xs font-bold">Markdown</button>
              <button onClick={() => copy('<a href="' + result + '">' + result + '</a>', '已复制 HTML')} className="px-3 py-1 rounded-lg bg-white/20 text-xs font-bold">HTML</button>
              <button onClick={() => setShowQr(!showQr)} className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold">
                {showQr ? '隐藏二维码' : '显示二维码'}
              </button>
            </div>
            {showQr && qr && (
              <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-3">
                <img src={qr} alt="qrcode" style={{ width: 200, height: 200 }} />
                <button onClick={downloadQr} className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-xs font-bold">下载二维码</button>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-slate-500">历史记录（最近 10 条）</div>
              <button onClick={() => { setHistory([]); localStorage.removeItem('xh-short-history'); }}
                className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold">清空</button>
            </div>
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 truncate">{h.original}</div>
                    <div className="text-sm font-mono text-indigo-500 truncate">{h.short}</div>
                  </div>
                  <button onClick={() => copy(h.short)} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold hover:bg-indigo-500/20 transition shrink-0">复制</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}