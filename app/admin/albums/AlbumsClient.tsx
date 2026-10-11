'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface Photo { url: string; caption?: string; }
interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export default function AlbumsClient({ initialAlbums }: { initialAlbums: Album[] }) {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [editing, setEditing] = useState<Album | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setAlbums(initialAlbums); }, [initialAlbums]);

  async function call(url: string, method: string, body?: any) {
    setBusy(true); setErr('');
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '操作失败');
      setAlbums(data.albums);
      router.refresh();
      return true;
    } catch (e: any) {
      setErr(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim()) { setErr('标题不能为空'); return; }
    let ok = false;
    if (isNew) {
      ok = await call('/api/admin/albums', 'POST', editing);
    } else {
      ok = await call('/api/admin/albums/' + editing.id, 'PUT', editing);
    }
    if (ok) { setEditing(null); setIsNew(false); }
  }

  async function onDelete(id: string, title: string) {
    if (!confirm('确定删除相册《' + title + '》？')) return;
    await call('/api/admin/albums/' + id, 'DELETE');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-60">共 {albums.length} 个相册</div>
        <button type="button" onClick={() => { setEditing({ id: '', title: '', description: '', cover: '', date: '', photos: [] }); setIsNew(true); setErr(''); }} className="anime-btn-ghost text-xs">
          ＋ 新增相册
        </button>
      </div>

      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{err}</div>}

      {albums.map(album => (
        <div key={album.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 shrink-0">
            {album.cover ? <img src={album.cover} alt={album.title} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-2xl">🖼️</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">{album.title}</div>
            <div className="text-xs opacity-60 truncate mt-0.5">{album.description || '—'}</div>
            <div className="text-[10px] opacity-40 mt-1">{album.date} · {album.photos.length} 张照片</div>
          </div>
          <button type="button" onClick={() => { setEditing({ ...album }); setIsNew(false); setErr(''); }} disabled={busy} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold disabled:opacity-30">编辑</button>
          <button type="button" onClick={() => onDelete(album.id, album.title)} disabled={busy} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>删除</button>
        </div>
      ))}

      {albums.length === 0 && <p className="text-center opacity-50 py-10">暂无相册</p>}

      {mounted && editing && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => { setEditing(null); setIsNew(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 600, background: '#141b4a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 18, padding: 24, color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{isNew ? '新增相册' : '编辑相册'}</h3>

            <Field label="ID（唯一标识，英数）">
              <input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} disabled={!isNew} placeholder="my-album" style={inputStyle} />
            </Field>
            <Field label="标题">
              <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="相册标题" style={inputStyle} />
            </Field>
            <Field label="简介">
              <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} placeholder="一句话描述" style={{ ...inputStyle, resize: 'none' }} />
            </Field>
            <Field label="封面图 URL">
              <input value={editing.cover} onChange={e => setEditing({ ...editing, cover: e.target.value })} placeholder="https://..." style={inputStyle} />
            </Field>
            <Field label="日期（如 2026.01）">
              <input value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} placeholder="2026.01" style={inputStyle} />
            </Field>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>照片（{editing.photos.length}）</span>
                <button type="button" onClick={() => setEditing({ ...editing, photos: [...editing.photos, { url: '', caption: '' }] })} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>＋ 加照片</button>
              </div>
              {editing.photos.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input value={p.url} onChange={e => { const next = [...editing.photos]; next[i] = { ...next[i], url: e.target.value }; setEditing({ ...editing, photos: next }); }} placeholder="图片 URL" style={{ ...inputStyle, flex: 2 }} />
                  <input value={p.caption || ''} onChange={e => { const next = [...editing.photos]; next[i] = { ...next[i], caption: e.target.value }; setEditing({ ...editing, photos: next }); }} placeholder="说明" style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={() => { const next = editing.photos.filter((_, x) => x !== i); setEditing({ ...editing, photos: next }); }} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.25)', color: '#ef4444', fontSize: 12, border: 'none', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              {editing.photos.length === 0 && <p style={{ fontSize: 12, opacity: 0.4, textAlign: 'center', padding: 10 }}>还没有照片</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" onClick={() => { setEditing(null); setIsNew(false); }} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>取消</button>
              <button type="button" onClick={save} disabled={busy} style={{ padding: '8px 20px', borderRadius: 10, background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: busy ? 0.5 : 1 }}>{busy ? '保存中...' : '保存'}</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff', fontSize: 13, outline: 'none',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
