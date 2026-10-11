'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  published: boolean;
  updatedAt: string;
}

export default function PostsClient({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (status === 'published' && !p.published) return false;
      if (status === 'draft' && p.published) return false;
      if (tagFilter && !(p.tags || []).includes(tagFilter)) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!p.title.toLowerCase().includes(s) && !(p.excerpt || '').toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [posts, q, status, tagFilter]);

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  }

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(''), 2500);
  }

  async function onDelete(id: string, title: string) {
    if (!confirm('确定删除《' + title + '》？此操作不可恢复！')) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/posts/' + id, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        alert('删除失败 (' + res.status + ')：' + (txt || '服务器无响应'));
        return;
      }
      setSelected(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      router.refresh();
      flash('已删除 1 篇文章');
    } catch (e: any) {
      alert('网络错误：' + (e?.message || '请求失败'));
    } finally {
      setBusy(false);
    }
  }

  async function onBatch(action: 'delete' | 'publish' | 'unpublish') {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const label = action === 'delete' ? '删除' : action === 'publish' ? '发布' : '取消发布';
    if (!confirm('确定' + label + '选中的 ' + ids.length + ' 篇文章？')) return;

    setBusy(true);
    try {
      const res = await fetch('/api/admin/posts/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action }),
      });

      if (!res.ok) {
        const txt = await res.text();
        alert('操作失败 (' + res.status + ')：' + (txt || '服务器无响应'));
        return;
      }

      const data = await res.json().catch(() => ({ count: ids.length }));
      setSelected(new Set());
      router.refresh();
      flash('已' + label + ' ' + (data.count || ids.length) + ' 篇文章');
    } catch (e: any) {
      alert('网络错误：' + (e?.message || '请求失败'));
    } finally {
      setBusy(false);
    }
  }

  async function onDuplicate(p: Post) {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/posts/' + p.id);
      if (!res.ok) {
        alert('读取原文章失败');
        return;
      }
      const full = await res.json();

      const saveRes = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: full.title + ' (副本)',
          content: full.content,
          excerpt: full.excerpt || '',
          tags: full.tags || [],
          cover: full.cover || '',
          published: false,
        }),
      });
      if (!saveRes.ok) {
        alert('复制失败');
        return;
      }
      router.refresh();
      flash('已复制为草稿');
    } catch (e: any) {
      alert('网络错误：' + (e?.message || '请求失败'));
    } finally {
      setBusy(false);
    }
  }

  function onExport() {
    const data = JSON.stringify(posts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    flash('已导出 ' + posts.length + ' 篇 JSON 备份');
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="anime-title text-3xl">文章管理</h1>
        <div className="flex gap-3">
          <button onClick={onExport} className="anime-btn-ghost" disabled={posts.length === 0}>
            导出备份
          </button>
          <Link href="/admin/posts/new" className="anime-btn">＋ 新建文章</Link>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <input
          className="anime-input"
          placeholder="搜索标题或摘要..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs opacity-60">状态:</span>
          {[
            { k: 'all', l: '全部' },
            { k: 'published', l: '已发布' },
            { k: 'draft', l: '草稿' },
          ].map(o => (
            <button
              key={o.k}
              onClick={() => setStatus(o.k as any)}
              className={'px-3 py-1 rounded-full text-xs transition ' + (status === o.k ? 'bg-[color:var(--aurora)]/20 text-[color:var(--aurora)] border border-[color:var(--aurora)]/40' : 'text-[color:var(--ink-dim)] border border-transparent hover:bg-white/5')}
              style={status === o.k ? { color: '#00e8c8', background: 'rgba(0,232,200,0.15)', borderColor: 'rgba(0,232,200,0.5)' } : {}}
            >
              {o.l}
            </button>
          ))}
          {allTags.length > 0 && (
            <>
              <span className="text-xs opacity-60 ml-2">标签:</span>
              <button
                onClick={() => setTagFilter(null)}
                className={'px-3 py-1 rounded-full text-xs ' + (!tagFilter ? 'text-[color:var(--aurora)]' : 'opacity-60')}
                style={!tagFilter ? { color: '#00e8c8' } : {}}
              >
                全部
              </button>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => setTagFilter(tagFilter === t ? null : t)}
                  className={'tag-chip ' + (tagFilter === t ? 'ring-2 ring-[color:var(--aurora)]' : '')}
                >
                  #{t}
                </button>
              ))}
            </>
          )}
        </div>
        <p className="text-xs opacity-50">共 {filtered.length} / {posts.length} 篇</p>
      </div>

      {selected.size > 0 && (
        <div className="glass rounded-2xl p-3 flex items-center justify-between flex-wrap gap-3"
             style={{ background: 'rgba(0,232,200,0.1)', borderColor: 'rgba(0,232,200,0.5)' }}>
          <span className="text-sm font-bold" style={{ color: '#00e8c8' }}>
            已选中 {selected.size} 篇
          </span>
          <div className="flex gap-2">
            <button onClick={() => onBatch('publish')} disabled={busy} className="anime-btn-ghost text-xs">
              批量发布
            </button>
            <button onClick={() => onBatch('unpublish')} disabled={busy} className="anime-btn-ghost text-xs">
              取消发布
            </button>
            <button onClick={() => onBatch('delete')} disabled={busy} className="anime-btn-danger text-xs">
              批量删除
            </button>
            <button onClick={() => setSelected(new Set())} disabled={busy} className="anime-btn-ghost text-xs">
              取消选择
            </button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/20 text-left">
            <tr>
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 cursor-pointer accent-cyan-400"
                />
              </th>
              <th className="p-4">标题</th>
              <th className="p-4 w-44">标签</th>
              <th className="p-4 w-24">状态</th>
              <th className="p-4 w-36">更新时间</th>
              <th className="p-4 w-56 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="anime-row border-t border-[color:var(--aurora)]/10"
                  style={selected.has(p.id) ? { background: 'rgba(0,232,200,0.08)' } : {}}>
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    className="w-4 h-4 cursor-pointer accent-cyan-400"
                  />
                </td>
                <td className="p-4 truncate max-w-xs">{p.title}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(p.tags || []).slice(0, 3).map((t, i) => (
                      <span key={i} className="tag-chip">#{t}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  {p.published ? (
                    <span className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: 'rgba(0,232,200,0.15)', color: '#00e8c8' }}>
                      已发布
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10"
                          style={{ color: 'rgba(224,232,255,0.65)' }}>
                      草稿
                    </span>
                  )}
                </td>
                <td className="p-4 opacity-60 text-xs">
                  {new Date(p.updatedAt).toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={'/admin/posts/' + p.id + '/edit'}
                      className="text-xs px-3 py-1 rounded-full border transition hover:underline"
                      style={{ color: '#00e8c8', borderColor: 'rgba(0,232,200,0.5)' }}
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => onDuplicate(p)}
                      disabled={busy}
                      className="text-xs px-3 py-1 rounded-full border transition"
                      style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.5)' }}
                    >
                      复制
                    </button>
                    <button
                      onClick={() => onDelete(p.id, p.title)}
                      disabled={busy}
                      className="text-xs px-3 py-1 rounded-full border transition"
                      style={{ color: '#ff8a9b', borderColor: 'rgba(255,78,91,0.5)' }}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center opacity-50">
                  没有匹配的文章
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {msg && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-2xl z-50"
          style={{
            background: 'rgba(0,232,200,0.15)',
            border: '1px solid rgba(0,232,200,0.5)',
            color: '#00e8c8',
            fontWeight: 700,
            backdropFilter: 'blur(12px)',
          }}
        >
          {msg}
        </div>
      )}
    </div>
  );
}