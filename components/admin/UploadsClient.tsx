'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FileItem {
  name: string;
  url: string;
  size: number;
  mtime: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

export default function UploadsClient({ files }: { files: FileItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSel(name: string) {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelected(next);
  }

  async function onDelete(name: string) {
    if (!confirm('确定删除 ' + name + '？外链将失效！')) return;
    setBusy(name);
    await fetch('/api/admin/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', name }),
    });
    setBusy(null);
    setSelected(prev => { const n = new Set(prev); n.delete(name); return n; });
    router.refresh();
  }

  async function onBatchDelete() {
    const names = Array.from(selected);
    if (names.length === 0) return;
    if (!confirm('确定批量删除 ' + names.length + ' 张图片？')) return;
    for (const name of names) {
      await fetch('/api/admin/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', name }),
      });
    }
    setSelected(new Set());
    router.refresh();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs opacity-60">共 {files.length} 张</div>
        {selected.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-300">已选 {selected.size}</span>
            <button
              onClick={onBatchDelete}
              className="px-4 py-2 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
            >批量删除</button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-4 py-2 rounded-lg bg-white/10 text-xs font-bold"
            >取消选择</button>
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-center opacity-50 py-10">暂无图片</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map(f => (
            <div
              key={f.name}
              className="relative rounded-2xl overflow-hidden group"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: selected.has(f.name) ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selected.has(f.name)}
                  onChange={() => toggleSel(f.name)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              <div
                className="aspect-square bg-black/20 cursor-pointer"
                onClick={() => setPreview(f.url)}
              >
                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-2">
                <div className="text-[10px] font-mono opacity-60 truncate">{f.name}</div>
                <div className="text-[10px] opacity-40">{formatSize(f.size)}</div>
              </div>

              <div className="absolute inset-x-0 bottom-12 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => { e.stopPropagation(); copy(f.url); }}
                  className="px-2 py-1 rounded bg-black/70 text-white text-[10px] font-bold"
                >复制链接</button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(f.name); }}
                  disabled={busy === f.name}
                  className="px-2 py-1 rounded bg-red-500/80 text-white text-[10px] font-bold"
                >删除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12 }}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white text-xl"
            onClick={() => setPreview(null)}
          >×</button>
        </div>
      )}
    </div>
  );
}