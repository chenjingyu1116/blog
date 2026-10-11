'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: string;
  desc: string;
  category: string;
  enabled: boolean;
}

const EMPTY: Partial<Tool> = {
  id: '',
  name: '',
  path: '/tools/',
  icon: '🧰',
  desc: '',
  category: '其他',
  enabled: true,
};

export default function ToolsClient({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Tool> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function call(action: string, payload: any) {
    setBusy(action + ':' + (payload.id || ''));
    setErr('');
    try {
      const res = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '操作失败');
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    if (isNew) {
      await call('create', { data: editing });
    } else {
      await call('update', { id: editing.id, data: editing });
    }
    setEditing(null);
    setIsNew(false);
  }

  function onDelete(tool: Tool) {
    if (!confirm('确定删除《' + tool.name + '》？\n\n注意：只从列表移除，对应的页面文件不会被删除。')) return;
    call('delete', { id: tool.id });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-60">共 {tools.length} 个工具</div>
        <button
          type="button"
          onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); setErr(''); }}
          className="anime-btn-ghost text-xs"
        >
          ＋ 新增工具
        </button>
      </div>

      {err && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          {err}
        </div>
      )}

      {tools.map((tool, i) => {
        const on = tool.enabled !== false;
        return (
          <div
            key={tool.id}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div className="text-2xl w-8 text-center">{tool.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{tool.name}</div>
              <div className="text-xs opacity-60 truncate">{tool.desc || '—'}</div>
              <div className="text-[10px] opacity-40 font-mono truncate">{tool.path}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold shrink-0">
              {tool.category}
            </span>

            <button
              type="button"
              onClick={() => call('move', { id: tool.id, direction: 'up' })}
              disabled={i === 0 || !!busy}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-30 shrink-0"
            >↑</button>
            <button
              type="button"
              onClick={() => call('move', { id: tool.id, direction: 'down' })}
              disabled={i === tools.length - 1 || !!busy}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-30 shrink-0"
            >↓</button>

            <button
              type="button"
              onClick={() => { setEditing({ ...tool }); setIsNew(false); setErr(''); }}
              disabled={!!busy}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold disabled:opacity-30 shrink-0"
            >编辑</button>

            <button
              type="button"
              onClick={() => onDelete(tool)}
              disabled={!!busy}
              className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30 shrink-0"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
            >删除</button>

            <button
              type="button"
              onClick={() => call('toggle', { id: tool.id, enabled: !on })}
              disabled={!!busy}
              className="px-4 py-2 rounded-lg text-xs font-bold transition shrink-0"
              style={{
                background: on ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                color: on ? '#10b981' : '#ef4444',
                border: '1px solid ' + (on ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'),
              }}
            >{on ? '已启用' : '已禁用'}</button>
          </div>
        );
      })}

      {tools.length === 0 && (
        <p className="text-center opacity-50 py-10">暂无工具，点右上角新增</p>
      )}

      {mounted && editing && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 2147483647,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={() => { setEditing(null); setIsNew(false); }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 520,
              background: '#141b4a',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 18,
              padding: 24,
              color: '#fff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              {isNew ? '新增工具' : '编辑工具'}
            </h3>

            <Field label="ID（唯一标识，英数）">
              <input
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                value={editing.id || ''}
                onChange={e => setEditing({ ...editing, id: e.target.value })}
                disabled={!isNew}
                placeholder="my-tool"
              />
            </Field>

            <Field label="名称">
              <input
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                value={editing.name || ''}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                placeholder="我的工具"
              />
            </Field>

            <Field label="图标（emoji 或符号）">
              <input
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                value={editing.icon || ''}
                onChange={e => setEditing({ ...editing, icon: e.target.value })}
                placeholder="🧰"
              />
            </Field>

            <Field label="路径">
              <input
                className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                value={editing.path || ''}
                onChange={e => setEditing({ ...editing, path: e.target.value })}
                placeholder="/tools/xxx"
              />
            </Field>

            <Field label="分类">
              <input
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                value={editing.category || ''}
                onChange={e => setEditing({ ...editing, category: e.target.value })}
                placeholder="开发 / 设计 / 图片"
              />
            </Field>

            <Field label="描述">
              <textarea
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                value={editing.desc || ''}
                onChange={e => setEditing({ ...editing, desc: e.target.value })}
                placeholder="一句话介绍"
              />
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                checked={editing.enabled !== false}
                onChange={e => setEditing({ ...editing, enabled: e.target.checked })}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 14, cursor: 'pointer' }}
                onClick={() => setEditing({ ...editing, enabled: editing.enabled === false })}>
                启用
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >取消</button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={!!busy}
                className="px-5 py-2 rounded-lg text-sm font-bold"
                style={{ background: '#6366f1', color: '#fff', opacity: busy ? 0.5 : 1 }}
              >{busy ? '保存中...' : '保存'}</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}