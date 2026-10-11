'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

interface Uploaded {
  url: string;
  name: string;
  size: number;
  originalSize: number;
  preview: string;
  width: number;
  height: number;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function canCompress(file: File) {
  const t = file.type;
  return t === 'image/jpeg' || t === 'image/png' || t === 'image/webp';
}

async function getImageSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve({ w: img.width, h: img.height });
      img.onerror = () => reject(new Error('图片读取失败'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File, maxWidth: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round((maxWidth / w) * h); w = maxWidth; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          blob => {
            if (!blob) return reject(new Error('压缩失败'));
            const ext = outType === 'image/png' ? 'png' : 'jpg';
            const newName = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
            resolve(new File([blob], newName, { type: outType }));
          },
          outType,
          quality
        );
      };
      img.onerror = () => reject(new Error('读取失败'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

export default function UploadTool() {
  const [items, setItems] = useState<Uploaded[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [enableCompress, setEnableCompress] = useState(true);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[] | null) {
    if (!files) return;
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setBusy(true); setError('');
    const results: Uploaded[] = [];

    for (const f of arr) {
      if (!f.type.startsWith('image/')) continue;
      try {
        const { w, h } = await getImageSize(f);
        let toUpload = f;
        if (enableCompress && canCompress(f)) {
          try { toUpload = await compressImage(f, maxWidth, quality / 100); } catch { toUpload = f; }
        }
        const fd = new FormData();
        fd.append('file', toUpload);
        const res = await fetch('/api/tools/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '上传失败');

        results.push({
          url: window.location.origin + data.url,
          name: toUpload.name,
          size: toUpload.size,
          originalSize: f.size,
          preview: data.url,
          width: w,
          height: h,
        });
      } catch (e: any) {
        setError(e.message);
      }
    }

    setItems(prev => [...results, ...prev]);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function copy(text: string, label = '已复制') {
    navigator.clipboard.writeText(text);
    alert(label);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) upload(e.dataTransfer.files);
  }

  return (
    <div className="min-h-screen relative pb-20">
      <div className="w-[95%] md:w-[90%] max-w-4xl mx-auto pt-24 md:pt-28 relative z-10">
        <div className="mb-6"><Link href="/tools" className="text-sm text-indigo-500 hover:underline">← 返回工具箱</Link></div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">图床</h1>
        <p className="text-xs text-slate-500 mb-6">上传图片，获取外链（最大 10MB，JPG/PNG/GIF/WebP/SVG）</p>

        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg mb-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={enableCompress} onChange={e => setEnableCompress(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">🗜️ 上传前压缩（JPG/PNG/WebP 有效）</span>
          </label>
          {enableCompress && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">压缩质量：{quality}%</label>
                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">最大宽度：{maxWidth}px</label>
                <input type="range" min={320} max={4000} step={80} value={maxWidth} onChange={e => setMaxWidth(Number(e.target.value))} className="w-full accent-indigo-500" />
              </div>
            </>
          )}
        </div>

        <div className="mb-6">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => upload(e.target.files)} className="hidden" />
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={
              'cursor-pointer rounded-2xl border-2 border-dashed transition p-10 text-center ' +
              (dragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-indigo-400/50 hover:border-indigo-400 hover:bg-indigo-500/5')
            }
          >
            <div className="text-4xl mb-3">{dragging ? '📥' : '☁️'}</div>
            <div className="font-bold text-slate-700 dark:text-slate-200">{dragging ? '松开鼠标上传' : '点击选择 或 拖拽图片到此'}</div>
            <div className="text-xs text-slate-500 mt-1">支持多选</div>
          </div>
        </div>

        {busy && <div className="text-center py-4 text-indigo-500 font-bold">上传中...</div>}
        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>}

        {items.length > 0 && (
          <div className="space-y-4">
            {items.map((item, i) => {
              const saved = item.originalSize - item.size;
              const ratio = item.originalSize > 0 ? (saved / item.originalSize * 100) : 0;
              const md = '![' + item.name + '](' + item.url + ')';
              const html = '<img src="' + item.url + '" alt="' + item.name + '" />';
              return (
                <div key={i} className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-lg">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={item.preview}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shrink-0 cursor-pointer hover:scale-105 transition"
                      onClick={() => setPreview(item.preview)}
                    />
                    <div className="flex-1 min-w-0 w-full">
                      <div className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-1 mb-2 flex flex-wrap gap-x-3 gap-y-1">
                        <span>📐 {item.width} × {item.height}</span>
                        {item.originalSize !== item.size ? (
                          <>
                            <span>原 {formatSize(item.originalSize)}</span>
                            <span>压缩后 <b className="text-emerald-500">{formatSize(item.size)}</b></span>
                            {saved > 0 && <span className="text-emerald-500 font-bold">省 {ratio.toFixed(1)}%</span>}
                          </>
                        ) : (<span>{formatSize(item.size)}</span>)}
                      </div>
                      <input
                        readOnly
                        value={item.url}
                        onFocus={e => e.currentTarget.select()}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 font-mono text-xs text-slate-700 dark:text-slate-300 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    <button onClick={() => copy(item.url, '已复制外链')} className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition">复制链接</button>
                    <button onClick={() => copy(md, '已复制 Markdown')} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-slate-700 dark:text-slate-200 text-xs font-bold transition">Markdown</button>
                    <button onClick={() => copy(html, '已复制 HTML')} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-slate-700 dark:text-slate-200 text-xs font-bold transition">HTML</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {preview && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85" onClick={() => setPreview(null)}>
            <img src={preview} alt="preview" className="max-w-[90vw] max-h-[90vh] rounded-xl" onClick={e => e.stopPropagation()} />
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white text-xl" onClick={() => setPreview(null)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}