'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface Friend { id: string; name: string; url: string; description: string; avatar: string; themeColor: string; }

export default function FriendsClient({ initialFriends }: { initialFriends: Friend[] }) {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [editing, setEditing] = useState<Friend | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setFriends(initialFriends); }, [initialFriends]);

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
      setFriends(data.friends);
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
    if (!editing.name.trim()) { setErr('名称不能为空'); return; }
    let ok = false;
    if (isNew) ok = await call('/api/admin/friends', 'POST', editing);
    else ok = await call('/api/admin/friends/' + editing.id, 'PUT', editing);
    if (ok) { setEditing(null); setIsNew(false); }
  }

  async function onDelete(id: string, name: string) {
    if (!confirm('确定删除友链《' + name + '》？')) return;
    await call('/api/admin/friends/' + id, 'DELETE');
  }

  async function move(idx: number, dir: 'up' | 'down') {
    const next = [...friends];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setFriends(next);
    // 逐个更新顺序（简单做法：直接覆盖每个的索引顺序——这里用批量替换）
    // 简化：直接调一次 PUT 无效，用一个特殊接口。为了简单，我这里不改顺序存储，仅提示。
    alert('排序功能暂未启用，保存后顺序按添加时间。');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-60">共 {friends.length} 条友链</div>
        <button type="button" onClick={() => { setEditing({ id: '', name: '', url: '', description: '', avatar: '', themeColor: 'rgba(99, 102, 241, 0.5)' }); setIsNew(true); setErr(''); }} className="anime-btn-ghost text-xs">
          ＋ 新增友链
        </button>
      </div>

      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{err}</div>}

      {friends.map(f => (
        <div key={f.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="w-14 h-14 rounded-full overflow-hidden bg-black/20 shrink-0">
            {f.avatar ? <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xl">🔗</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">{f.name}</div>
            <div className="text-xs opacity-60 truncate mt-0.5">{f.description || '—'}</div>
            <div className="text-[10px] opacity-40 mt-1 font-mono truncate">{f.url}</div>
          </div>
          <button type="button" onClick={() => { setEditing({ ...f }); setIsNew(false); setErr(''); }} disabled={busy} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold disabled:opacity-30">编辑</button>
          <button type="button" onClick={() => onDelete(f.id, f.name)} disabled={busy} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>删除</button>
        </div>
      ))}

      {friends.length === 0 && <p className="text-center opacity-50 py-10">暂无友链</p>}

      {mounted && editing && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => { setEditing(null); setIsNew(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 540, background: '#141b4a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 18, padding: 24, color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{isNew ? '新增友链' : '编辑友链'}</h3>

            <Field label="ID（唯一标识）">
              <input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} disabled={!isNew} placeholder="my-friend" style={inputStyle} />
            </Field>
            <Field label="名称">
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="友链名称" style={inputStyle} />
            </Field>
            <Field label="链接 URL">
              <input value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })} placeholder="https://..." style={inputStyle} />
            </Field>
            <Field label="简介">
              <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} placeholder="一句话介绍" style={{ ...inputStyle, resize: 'none' }} />
            </Field>
            <Field label="头像 URL">
              <input value={editing.avatar} onChange={e => setEditing({ ...editing, avatar: e.target.value })} placeholder="https://..." style={inputStyle} />
            </Field>
            <Field label="主题色（rgba 或 hex）">
              <input value={editing.themeColor} onChange={e => setEditing({ ...editing, themeColor: e.target.value })} placeholder="rgba(99, 102, 241, 0.5)" style={inputStyle} />
            </Field>

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
