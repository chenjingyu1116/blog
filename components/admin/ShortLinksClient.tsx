'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ShortLink {
  code: string;
  url: string;
  createdAt: string;
  hits: number;
}

export default function ShortLinksClient({ links }: { links: ShortLink[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const filtered = links.filter(l =>
    !q || l.code.toLowerCase().includes(q.toLowerCase()) || l.url.toLowerCase().includes(q.toLowerCase())
  );

  async function onDelete(code: string) {
    if (!confirm('确定删除短链 /s/' + code + ' ？')) return;
    setBusy(code);
    await fetch('/api/admin/shortlinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', code }),
    });
    setBusy(null);
    router.refresh();
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-4">
      <input
        className="anime-input"
        placeholder="搜索短码或原始链接..."
        value={q}
        onChange={e => setQ(e.target.value)}
      />

      <div className="text-xs opacity-60">共 {filtered.length} / {links.length} 条</div>

      {filtered.length === 0 ? (
        <p className="text-center opacity-50 py-10">暂无短链</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(link => (
            <div
              key={link.code}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-indigo-300">/s/{link.code}</span>
                  <button
                    onClick={() => copy(window.location.origin + '/s/' + link.code)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
                  >复制</button>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {link.hits} 次点击
                  </span>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs opacity-70 hover:opacity-100 truncate block font-mono"
                >{link.url}</a>
                <div className="text-[10px] opacity-40 mt-1">
                  {new Date(link.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
              <button
                onClick={() => onDelete(link.code)}
                disabled={busy === link.code}
                className="px-3 py-2 rounded-lg text-xs font-bold shrink-0"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
              >{busy === link.code ? '删除中' : '删除'}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}