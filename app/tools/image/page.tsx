'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

interface Result {
  name: string;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
  type: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

export default function ImageTool() {
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [results, setResults] = useState<Result[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function compress(file: File): Promise<Result> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = Math.round((maxWidth / w) * h);
            w = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(type, quality / 100);
          const b64 = dataUrl.split(',')[1] || '';
          const compressedSize = Math.round(b64.length * 3 / 4);
          resolve({
            name: file.name,
            originalSize: file.size,
            compressedSize,
            dataUrl,
            type,
          });
        };
        img.onerror = () => reject(new Error('图片读取失败'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setProcessing(true);
    const arr: Result[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue;
      try {
        arr.push(await compress(f));
      } catch {}
    }
    setResults(prev => [...arr, ...prev]);
    setProcessing(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function download(r: Result) {
    const a = document.createElement('a');
    a.href = r.dataUrl;
    a.download = r.name.replace(/\.[^.]+$/, '') + '_compressed.' + (r.type === 'image/png' ? 'png' : 'jpg');
    a.click();
  }

  function clearAll() {
    setResults([]);
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-5xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">图片压缩</h1>
        <p className="text-xs text-slate-500 mb-6">🔒 所有处理在浏览器本地完成，图片不会上传到服务器</p>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">压缩质量：{quality}%</label>
            <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-indigo-500" />
            <p className="text-[10px] text-slate-400 mt-1">数值越低，文件越小，画质越差</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">最大宽度：{maxWidth}px</label>
            <input type="range" min={320} max={4000} step={80} value={maxWidth} onChange={e => setMaxWidth(Number(e.target.value))} className="w-full accent-indigo-500" />
            <p className="text-[10px] text-slate-400 mt-1">超过此宽度的图片会按比例缩小</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={e => onFiles(e.target.files)}
              className="hidden"
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-indigo-400/50 hover:border-indigo-400 hover:bg-indigo-500/5 transition p-10 text-center"
            >
              <div className="text-4xl mb-3">📤</div>
              <div className="font-bold text-slate-700 dark:text-slate-200">点击选择图片（可多选）</div>
              <div className="text-xs text-slate-500 mt-1">支持 JPG / PNG / WebP 等</div>
            </div>
          </label>
        </div>

        {processing && (
          <div className="text-center py-6 text-indigo-500 font-bold">压缩中...</div>
        )}

        {results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">处理结果（{results.length}）</h2>
              <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold transition">
                清空全部
              </button>
            </div>
            <div className="space-y-4">
              {results.map((r, i) => {
                const saved = r.originalSize - r.compressedSize;
                const ratio = r.originalSize > 0 ? (saved / r.originalSize * 100) : 0;
                return (
                  <div key={i} className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-lg flex flex-col sm:flex-row gap-4 items-center">
                    <img src={r.dataUrl} alt={r.name} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0 w-full">
                      <div className="font-bold text-sm text-slate-800 dark:text-white truncate">{r.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        原始：{formatSize(r.originalSize)} → 压缩后：<span className="text-emerald-500 font-bold">{formatSize(r.compressedSize)}</span>
                        {saved > 0 && <span className="ml-2 text-emerald-500 font-bold">省 {ratio.toFixed(1)}%</span>}
                      </div>
                    </div>
                    <button onClick={() => download(r)} className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition shrink-0">
                      下载
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}