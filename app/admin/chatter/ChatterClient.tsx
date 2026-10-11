'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  title: string;
  date: string;
  content: string;
  published: boolean;
  tags: string[];
  mood: string;
  cover: string;
}

export default function ChatterClient({ initialItems }: { initialItems: Item[] }) {
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
    if (!editing.title.trim() || !editing.content.trim()) { setErr('标题和内容不能为空'); return; }
    setBusy(true); setErr('');
    try {
      const url = isNew ? '/api/admin/chatter' : '/api/admin/chatter/' + editing.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');
      setEditing(null); setIsNew(false); router.refresh();
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function onDelete(id: string, title: string) {
    if (!confirm('确定删除《' + title + '》？')) return;
    setBusy(true);
    await fetch('/api/admin/chatter/' + id, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-60">共 {items.length} 条</div>
        <button type="button" onClick={() => { setEditing({ id: '', title: '', date: new Date().toISOString().slice(0, 10), content: '', published: true, tags: [], mood: '', cover: '' }); setIsNew(true); setErr(''); }} className="anime-btn-ghost text-xs">
          ＋ 新增杂谈
        </button>
      </div>

      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{err}</div>}

      {items.map(item => (
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{item.title}</span>
              <span className="text-[10px] font-mono opacity-60">{item.date}</span>
              {item.mood && <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">✨ {item.mood}</span>}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: item.published ? 'rgba(16,185,129,0.2)' : 'rgba(156,163,175,0.2)', color: item.published ? '#10b981' : '#9ca3af' }}>
                {item.published ? '已发布' : '草稿'}
              </span>
            </div>
            <p className="text-xs opacity-70 line-clamp-2">{item.content}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {item.tags.slice(0, 5).map((t, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">#{t}</span>)}
              </div>
            )}
          </div>
          <button type="button" onClick={() => { setEditing({ ...item }); setIsNew(false); setErr(''); }} disabled={busy} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold disabled:opacity-30">编辑</button>
          <button type="button" onClick={() => onDelete(item.id, item.title)} disabled={busy} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>删除</button>
        </div>
      ))}

      {items.length === 0 && <p className="text-center opacity-50 py-10">暂无杂谈</p>}

      {mounted && editing && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => { setEditing(null); setIsNew(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 600, background: '#141b4a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 18, padding: 24, color: '#fff', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{isNew ? '新增杂谈' : '编辑杂谈'}</h3>

            <Field label="标题">
              <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="标题" style={inputStyle} />
            </Field>
            <Field label="日期">
              <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="心情（可选）">
              <input value={editing.mood} onChange={e => setEditing({ ...editing, mood: e.target.value })} placeholder="如：开心 / 疲惫" style={inputStyle} />
            </Field>
            <Field label="标签（逗号分隔）">
              <input value={(editing.tags || []).join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="标签1, 标签2" style={inputStyle} />
            </Field>
            <Field label="封面 URL（可选）">
              <input value={editing.cover} onChange={e => setEditing({ ...editing, cover: e.target.value })} placeholder="https://..." style={inputStyle} />
            </Field>
            <Field label="正文（Markdown）">
              <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} rows={12} placeholder="写点什么..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
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
