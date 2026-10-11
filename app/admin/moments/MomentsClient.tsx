'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  date: string;
  content: string;
  published: boolean;
  location?: string;
  images?: string[];
}

export default function MomentsClient({ initialItems }: { initialItems: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setItems(initialItems); }, [initialItems]);

  async function save() {
    if (!editing) return;
    if (!editing.content.trim()) { setErr('内容不能为空'); return; }
    setBusy(true); setErr('');
    try {
      const url = isNew ? '/api/admin/moments' : '/api/admin/moments/' + editing.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');
      setEditing(null);
      setIsNew(false);
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('确定删除这条说说？')) return;
    setBusy(true);
    await fetch('/api/admin/moments/' + id, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-60">共 {items.length} 条</div>
        <button type="button" onClick={() => { setEditing({ id: '', date: new Date().toISOString().slice(0, 10), content: '', published: true, location: '', images: [] }); setIsNew(true); setErr(''); }} className="anime-btn-ghost text-xs">
          ＋ 新增说说
        </button>
      </div>

      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{err}</div>}

      {items.map(item => (
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono opacity-60">{item.date}</span>
              {item.location && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">📍 {item.location}</span>}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: item.published ? 'rgba(16,185,129,0.2)' : 'rgba(156,163,175,0.2)', color: item.published ? '#10b981' : '#9ca3af' }}>
                {item.published ? '已发布' : '草稿'}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 opacity-90">{item.content}</p>
            {item.images && item.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {item.images.slice(0, 4).map((url, i) => (
                  <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-black/20"><img src={url} className="w-full h-full object-cover" /></div>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={() => { setEditing({ ...item }); setIsNew(false); setErr(''); }} disabled={busy} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold disabled:opacity-30">编辑</button>
          <button type="button" onClick={() => onDelete(item.id)} disabled={busy} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>删除</button>
        </div>
      ))}

      {items.length === 0 && <p className="text-center opacity-50 py-10">暂无说说</p>}

      {mounted && editing && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => { setEditing(null); setIsNew(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 560, background: '#141b4a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 18, padding: 24, color: '#fff', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{isNew ? '新增说说' : '编辑说说'}</h3>

            <Field label="日期">
              <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="地点（可选）">
              <input value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} placeholder="如：上海" style={inputStyle} />
            </Field>
            <Field label="内容">
              <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} rows={6} placeholder="写点什么..." style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
            <Field label="图片 URL（每行一个）">
              <textarea
                value={(editing.images || []).join('\n')}
                onChange={e => setEditing({ ...editing, images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                rows={3}
                placeholder="https://...\nhttps://..."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
              />
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })} />
              发布（取消勾选存为草稿）
            </label>

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

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, outline: 'none' };
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>{label}</label>{children}</div>;
}
