'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function QrcodeTool() {
  const [text, setText] = useState('https://www.example.com');
  const [size, setSize] = useState(300);
  const [color, setColor] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L'|'M'|'Q'|'H'>('M');
  const [dataUrl, setDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) { setDataUrl(''); return; }
    QRCode.toDataURL(text, {
      width: size,
      color: { dark: color, light: bg },
      errorCorrectionLevel: errorLevel,
      margin: 2,
    })
      .then(url => setDataUrl(url))
      .catch(() => setDataUrl(''));
  }, [text, size, color, bg, errorLevel]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-5xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">二维码生成</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
              <label className="text-xs font-bold text-slate-500 mb-2 block">内容（文本 / 链接 / 任意文字）</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                placeholder="输入要生成二维码的内容..."
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-400 transition resize-none"
              />
            </div>

            <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">尺寸：{size}px</label>
                <input type="range" min={128} max={800} step={16} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">前景色</label>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">背景色</label>
                  <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">纠错级别（越高越抗损）</label>
                <div className="flex gap-2">
                  {(['L','M','Q','H'] as const).map(lv => (
                    <button
                      key={lv}
                      onClick={() => setErrorLevel(lv)}
                      className={
                        'flex-1 py-2 rounded-xl text-xs font-bold transition ' +
                        (errorLevel === lv ? 'bg-indigo-500 text-white' : 'bg-white/40 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300')
                      }
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={download} disabled={!dataUrl} className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition disabled:opacity-50">
              下载 PNG
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 border border-white/40 shadow-lg">
              {dataUrl ? (
                <img src={dataUrl} alt="qrcode" style={{ width: Math.min(size, 400), height: Math.min(size, 400) }} />
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center text-slate-400 text-sm">
                  输入内容后显示二维码
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}