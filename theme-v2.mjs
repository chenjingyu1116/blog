// theme-v2.mjs — 星海夜航主题 + 8 项新功能
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
function w(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  console.log('OK  ' + rel);
}

// ==================== 1. 全新主题 CSS ====================
w('app/admin/anime.css', `/* ===== 星海夜航 Starry Voyage ===== */
:root {
  --bg-deep: #06080f;
  --bg-mid: #0a0e27;
  --bg-soft: #131a3a;
  --aurora: #7fffd4;
  --aurora-dim: rgba(127, 255, 212, 0.35);
  --star-gold: #ffd97d;
  --nebula: #a78bfa;
  --ink: #e8f0ff;
  --ink-dim: rgba(232, 240, 255, 0.65);
  --ink-faint: rgba(232, 240, 255, 0.4);
  --glass-bg: rgba(15, 22, 50, 0.55);
  --glass-border: rgba(127, 255, 212, 0.22);
}

.anime-bg {
  position: relative;
  min-height: 100vh;
  color: var(--ink) !important;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(127, 255, 212, 0.12), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.15), transparent 50%),
    radial-gradient(ellipse at 60% 90%, rgba(255, 217, 125, 0.08), transparent 50%),
    linear-gradient(180deg, #06080f 0%, #0a0e27 40%, #131a3a 100%);
  overflow-x: hidden;
}

.anime-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(1px 1px at 10% 20%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 30% 60%, #fff, transparent),
    radial-gradient(1px 1px at 50% 30%, #fff, transparent),
    radial-gradient(2px 2px at 70% 50%, #7fffd4, transparent),
    radial-gradient(1px 1px at 85% 80%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 15% 90%, #ffd97d, transparent),
    radial-gradient(1px 1px at 60% 15%, #fff, transparent),
    radial-gradient(1px 1px at 90% 40%, #a78bfa, transparent);
  opacity: 0.6;
  animation: twinkle 5s ease-in-out infinite alternate;
}
@keyframes twinkle { from { opacity: 0.3; } to { opacity: 0.85; } }

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 0 24px rgba(127,255,212,0.05);
  color: var(--ink);
}

.anime-title {
  font-weight: 700;
  color: var(--ink);
  display: inline-block;
  position: relative;
  letter-spacing: 0.02em;
}
.anime-title::after {
  content: '✦';
  margin-left: 10px;
  color: var(--aurora);
  display: inline-block;
  text-shadow: 0 0 12px var(--aurora);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity: 0.6; transform: scale(1); }
  50%     { opacity: 1; transform: scale(1.2); }
}

.anime-btn {
  border-radius: 10px;
  padding: 0.6rem 1.25rem;
  font-weight: 600;
  color: #06080f;
  background: linear-gradient(135deg, #7fffd4 0%, #ffd97d 100%);
  box-shadow: 0 0 20px rgba(127,255,212,0.4);
  transition: all 0.25s;
  letter-spacing: 0.02em;
  border: none;
  cursor: pointer;
}
.anime-btn:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(127,255,212,0.7), 0 8px 20px rgba(0,0,0,0.3); }
.anime-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.anime-btn-ghost {
  border-radius: 10px;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  color: var(--aurora);
  background: rgba(127, 255, 212, 0.06);
  border: 1px solid rgba(127, 255, 212, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}
.anime-btn-ghost:hover {
  background: rgba(127, 255, 212, 0.15);
  box-shadow: 0 0 16px rgba(127, 255, 212, 0.3);
}

.anime-btn-danger {
  border-radius: 10px;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  color: #ff8a9b;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}
.anime-btn-danger:hover { background: rgba(255, 71, 87, 0.2); }

.anime-input {
  width: 100%;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  background: rgba(6, 10, 25, 0.6);
  border: 1px solid rgba(127, 255, 212, 0.2);
  outline: none;
  color: var(--ink);
  transition: all 0.2s;
  font-family: inherit;
  font-size: 0.95rem;
}
.anime-input::placeholder { color: var(--ink-faint); }
.anime-input:focus {
  border-color: var(--aurora);
  box-shadow: 0 0 0 3px rgba(127, 255, 212, 0.15), 0 0 20px rgba(127, 255, 212, 0.25);
}

.anime-sidebar {
  background: linear-gradient(180deg, rgba(10, 14, 39, 0.95), rgba(19, 26, 58, 0.95));
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(127, 255, 212, 0.15);
  box-shadow: 4px 0 40px rgba(127, 255, 212, 0.08);
}
.anime-sidebar a {
  color: var(--ink-dim) !important;
  border-radius: 10px;
  transition: all 0.2s;
  font-weight: 500;
}
.anime-sidebar a:hover {
  background: rgba(127, 255, 212, 0.1) !important;
  color: var(--aurora) !important;
  transform: translateX(4px);
}
.anime-sidebar .active {
  background: rgba(127, 255, 212, 0.15) !important;
  color: var(--aurora) !important;
  box-shadow: inset 3px 0 0 var(--aurora);
}

.anime-row { transition: background 0.2s; }
.anime-row:hover { background: rgba(127, 255, 212, 0.06); }

/* 流星 */
.meteor {
  position: fixed;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px 1px #fff, 0 0 20px 2px rgba(127,255,212,0.6);
  pointer-events: none;
  z-index: 1;
  transform: rotate(35deg);
  animation: meteorFall linear infinite;
}
.meteor::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  transform: translateX(-120px);
}
@keyframes meteorFall {
  0%   { transform: translate(0, 0) rotate(35deg); opacity: 1; }
  100% { transform: translate(400px, 600px) rotate(35deg); opacity: 0; }
}

/* 猫爪加载 */
.cat-paw { position: relative; width: 80px; height: 80px; animation: pawBounce 1.2s ease-in-out infinite; }
.cat-paw .pad { position:absolute; left:50%; bottom:6px; transform:translateX(-50%); width:56px; height:44px; background: linear-gradient(135deg, #7fffd4, #ffd97d); border-radius:50% 50% 55% 55% / 55% 55% 45% 45%; box-shadow: 0 0 24px rgba(127,255,212,0.6); }
.cat-paw .toe { position:absolute; width:18px; height:18px; background: linear-gradient(135deg, #7fffd4, #ffd97d); border-radius:50%; box-shadow: 0 0 12px rgba(127,255,212,0.5); }
.cat-paw .t1 { top:6px; left:4px; }
.cat-paw .t2 { top:-2px; left:22px; }
.cat-paw .t3 { top:-2px; left:40px; }
.cat-paw .t4 { top:6px; left:58px; }
@keyframes pawBounce {
  0%,100% { transform: translateY(0) scale(1); }
  50%     { transform: translateY(-10px) scale(1.06); }
}

.float-avatar { animation: floatY 3s ease-in-out infinite; }
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

/* Markdown 预览 */
.md-preview {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.8;
  word-break: break-word;
}
.md-preview h1, .md-preview h2, .md-preview h3 {
  color: var(--aurora);
  margin: 1.2em 0 0.6em;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(127,255,212,0.3);
}
.md-preview h1 { font-size: 1.6em; border-bottom: 1px solid rgba(127,255,212,0.2); padding-bottom: 0.3em; }
.md-preview h2 { font-size: 1.35em; }
.md-preview h3 { font-size: 1.15em; }
.md-preview p { margin: 0.8em 0; }
.md-preview a { color: var(--aurora); text-decoration: underline; }
.md-preview code {
  background: rgba(127,255,212,0.1);
  color: var(--star-gold);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'JetBrains Mono', Consolas, monospace;
}
.md-preview pre {
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(127,255,212,0.2);
  border-radius: 10px;
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
}
.md-preview pre code { background: transparent; padding: 0; color: var(--ink); }
.md-preview blockquote {
  border-left: 3px solid var(--aurora);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--ink-dim);
  background: rgba(127,255,212,0.04);
  border-radius: 4px;
  padding: 0.5em 1em;
}
.md-preview ul, .md-preview ol { padding-left: 1.6em; margin: 0.8em 0; }
.md-preview li { margin: 0.3em 0; }
.md-preview img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
.md-preview table { border-collapse: collapse; margin: 1em 0; width: 100%; }
.md-preview th, .md-preview td { border: 1px solid rgba(127,255,212,0.2); padding: 0.5em 0.8em; text-align: left; }
.md-preview th { background: rgba(127,255,212,0.08); color: var(--aurora); }

/* 标签芯片 */
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.65rem;
  border-radius: 9999px;
  background: rgba(127,255,212,0.1);
  border: 1px solid rgba(127,255,212,0.3);
  color: var(--aurora);
  font-size: 0.75rem;
  transition: all 0.2s;
}
.tag-chip:hover { background: rgba(127,255,212,0.2); box-shadow: 0 0 12px rgba(127,255,212,0.3); }

/* 自动保存状态 */
.save-status {
  font-size: 0.75rem;
  color: var(--ink-faint);
  transition: color 0.3s;
}
.save-status.saved { color: var(--aurora); }
`);

// ==================== 2. Markdown 预览组件 ====================
w('components/admin/MarkdownPreview.tsx', `'use client';
import { useEffect, useState } from 'react';

function simpleMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, (_, code) => '<pre><code>' + code + '</code></pre>');
  html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
  html = html.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
  html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank">$1</a>');
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\\s\\S]*?<\\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/\\n\\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  return html;
}

export default function MarkdownPreview({ content }: { content: string }) {
  const [html, setHtml] = useState('');
  useEffect(() => { setHtml(simpleMarkdown(content)); }, [content]);
  if (!content.trim()) {
    return (
      <div className="md-preview h-full grid place-items-center opacity-40 text-sm">
        <div className="text-center">
          <div className="text-4xl mb-2">🌌</div>
          <p>开始输入，预览会出现在这里</p>
        </div>
      </div>
    );
  }
  return <div className="md-preview" dangerouslySetInnerHTML={{ __html: html }} />;
}`);

// ==================== 3. PostEditor（带全部新功能） ====================
w('components/admin/PostEditor.tsx', `'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownPreview from './MarkdownPreview';

const DRAFT_KEY = 'xh-post-draft';

interface Props {
  id?: string;
  initial?: { title: string; content: string; excerpt?: string; tags?: string[]; cover?: string; published: boolean; };
}

export default function PostEditor({ id, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [tags, setTags] = useState((initial?.tags || []).join(', '));
  const [cover, setCover] = useState(initial?.cover || '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dragging, setDragging] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 自动保存草稿
  useEffect(() => {
    if (id) return;
    const t = setInterval(() => {
      if (title || content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, excerpt, tags, cover, published, ts: Date.now() }));
        setLastSaved(new Date());
      }
    }, 3000);
    return () => clearInterval(t);
  }, [id, title, content, excerpt, tags, cover, published]);

  // 恢复草稿
  useEffect(() => {
    if (id) return;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved && !title && !content) {
      try {
        const d = JSON.parse(saved);
        const ago = Math.round((Date.now() - d.ts) / 60000);
        if (confirm('检测到 ' + ago + ' 分钟前的草稿，是否恢复？')) {
          setTitle(d.title || ''); setContent(d.content || '');
          setExcerpt(d.excerpt || ''); setTags(d.tags || '');
          setCover(d.cover || ''); setPublished(d.published !== false);
        }
      } catch {}
    }
  }, []);

  const save = useCallback(async () => {
    if (!title.trim() || !content.trim()) { alert('标题和内容不能为空'); return; }
    setSaving(true);
    const body = { title, content, excerpt, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), cover, published };
    const res = await fetch(id ? '/api/admin/posts/' + id : '/api/admin/posts', {
      method: id ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) { const e = await res.json().catch(()=>({})); alert(e.error || '保存失败'); return; }
    localStorage.removeItem(DRAFT_KEY);
    router.push('/admin/posts'); router.refresh();
  }, [id, title, content, excerpt, tags, cover, published, router]);

  // Ctrl+S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  async function uploadFile(file: File) {
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) return data.url;
    return null;
  }

  async function onPickCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await uploadFile(file);
    if (url) setCover(url);
  }

  // 拖拽上传图片到正文
  async function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = await uploadFile(file);
    if (url && contentRef.current) {
      const ta = contentRef.current;
      const pos = ta.selectionStart;
      const insert = '\\n![' + file.name + '](' + url + ')\\n';
      const next = content.slice(0, pos) + insert + content.slice(pos);
      setContent(next);
    }
  }

  async function remove() {
    if (!id) return;
    if (!confirm('确定删除这篇文章吗？')) return;
    await fetch('/api/admin/posts/' + id, { method: 'DELETE' });
    localStorage.removeItem(DRAFT_KEY);
    router.push('/admin/posts'); router.refresh();
  }

  const wordCount = content.replace(/\\s/g, '').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 400));
  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

  if (saving) return (
    <div className="glass rounded-2xl p-10 max-w-4xl grid place-items-center">
      <div className="cat-paw"><span className="pad"/><span className="toe t1"/><span className="toe t2"/><span className="toe t3"/><span className="toe t4"/></div>
      <p className="mt-4 opacity-70 text-sm">正在保存你的作品...</p>
    </div>
  );

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="anime-title text-3xl">{id ? '编辑文章' : '写新文章'}</h1>
        <div className="flex items-center gap-3">
          <span className={'save-status' + (lastSaved ? ' saved' : '')}>
            {lastSaved ? '✓ 草稿已自动保存 ' + lastSaved.toLocaleTimeString() : '未保存'}
          </span>
          <button onClick={() => setShowPreview(v => !v)} className="anime-btn-ghost text-sm">
            {showPreview ? '关闭预览' : '开启预览'}
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <input className="anime-input text-lg" placeholder="给文章起个标题～" value={title} onChange={e=>setTitle(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="anime-input" placeholder="摘要（可选）" value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
          <div className="flex items-center gap-2">
            <input className="anime-input" placeholder="标签，逗号分隔" value={tags} onChange={e=>setTags(e.target.value)} />
          </div>
        </div>

        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagList.map((t, i) => <span key={i} className="tag-chip">#{t}</span>)}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="anime-btn-ghost cursor-pointer text-sm">🖼️ 上传封面<input type="file" accept="image/*" onChange={onPickCover} hidden /></label>
          {cover && <img src={cover} alt="cover" className="h-16 rounded-lg ring-1 ring-[color:var(--aurora)]/40 shadow-lg" />}
        </div>

        <div className={'grid gap-4 ' + (showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
          <div
            onDrop={onDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={'relative transition ' + (dragging ? 'ring-2 ring-[color:var(--aurora)] rounded-lg' : '')}
          >
            <textarea
              ref={contentRef}
              className="anime-input font-mono text-sm"
              rows={22}
              placeholder="正文（支持 Markdown）。可以直接把图片拖到这里上传。"
              value={content}
              onChange={e=>setContent(e.target.value)}
            />
            {dragging && (
              <div className="absolute inset-0 grid place-items-center bg-[color:var(--aurora)]/10 rounded-lg pointer-events-none">
                <span className="text-[color:var(--aurora)] font-bold">松开上传图片</span>
              </div>
            )}
          </div>
          {showPreview && (
            <div className="border border-[color:var(--aurora)]/20 rounded-lg p-4 bg-black/20 max-h-[560px] overflow-y-auto">
              <MarkdownPreview content={content} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[color:var(--aurora)]/10">
          <div className="flex items-center gap-4 text-xs">
            <span className="opacity-60">📊 {wordCount} 字 · 约 {readTime} 分钟阅读</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} className="w-4 h-4 accent-[color:var(--aurora)]" />
              {published ? '🌸 发布' : '🌙 草稿'}
            </label>
          </div>
          <div className="space-x-3">
            {id && <button onClick={remove} className="anime-btn-danger">删除</button>}
            <button onClick={save} className="anime-btn">保存 (Ctrl+S)</button>
          </div>
        </div>
      </div>
    </div>
  );
}`);

// ==================== 4. 文章列表（含搜索/过滤） ====================
w('components/admin/PostsClient.tsx', `'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Post {
  id: string; title: string; excerpt?: string; tags?: string[]; published: boolean; updatedAt: string;
}

export default function PostsClient({ posts }: { posts: Post[] }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all'|'published'|'draft'>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="anime-title text-3xl">文章管理</h1>
        <Link href="/admin/posts/new" className="anime-btn">＋ 新建文章</Link>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <input className="anime-input" placeholder="🔍 搜索标题或摘要..." value={q} onChange={e=>setQ(e.target.value)} />
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs opacity-60">状态:</span>
          {[
            { k: 'all', l: '全部' },
            { k: 'published', l: '🌸 已发布' },
            { k: 'draft', l: '🌙 草稿' },
          ].map(o => (
            <button key={o.k} onClick={()=>setStatus(o.k as any)}
              className={'px-3 py-1 rounded-full text-xs transition ' + (status===o.k ? 'bg-[color:var(--aurora)]/20 text-[color:var(--aurora)] border border-[color:var(--aurora)]/40' : 'text-[color:var(--ink-dim)] border border-transparent hover:bg-white/5')}>
              {o.l}
            </button>
          ))}
          {allTags.length > 0 && <>
            <span className="text-xs opacity-60 ml-2">标签:</span>
            <button onClick={()=>setTagFilter(null)} className={'px-3 py-1 rounded-full text-xs ' + (!tagFilter ? 'text-[color:var(--aurora)]' : 'opacity-60')}>全部</button>
            {allTags.map(t => (
              <button key={t} onClick={()=>setTagFilter(tagFilter===t?null:t)}
                className={'tag-chip ' + (tagFilter===t ? '!bg-[color:var(--aurora)]/25' : '')}>
                #{t}
              </button>
            ))}
          </>}
        </div>
        <p className="text-xs opacity-50">共 {filtered.length} / {posts.length} 篇</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/20 text-left">
            <tr>
              <th className="p-4">标题</th>
              <th className="p-4 w-40">标签</th>
              <th className="p-4 w-24">状态</th>
              <th className="p-4 w-40">更新时间</th>
              <th className="p-4 w-24 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="anime-row border-t border-[color:var(--aurora)]/10">
                <td className="p-4 truncate max-w-xs">{p.title}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(p.tags || []).slice(0, 3).map((t, i) => <span key={i} className="tag-chip">#{t}</span>)}
                  </div>
                </td>
                <td className="p-4">
                  {p.published
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-[color:var(--aurora)]/15 text-[color:var(--aurora)]">已发布</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-[color:var(--ink-dim)]">草稿</span>}
                </td>
                <td className="p-4 opacity-60 text-xs">{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <Link href={'/admin/posts/'+p.id+'/edit'} className="text-[color:var(--aurora)] hover:underline">编辑 →</Link>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={5} className="p-10 text-center opacity-50">🌌 没有匹配的文章</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}`);

w('app/admin/posts/page.tsx', `import { listPosts } from '@/lib/posts';
import PostsClient from '@/components/admin/PostsClient';

export default async function PostsPage() {
  const posts = await listPosts();
  return <PostsClient posts={posts} />;
}`);

// ==================== 5. 侧边栏 layout（加流星 + 新配色） ====================
w('app/admin/layout.tsx', `import Link from 'next/link';
import './anime.css';
import Meteors from '@/components/admin/Meteors';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg flex min-h-screen">
      <Meteors />
      <aside className="anime-sidebar w-60 p-5 flex flex-col relative z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="float-avatar w-12 h-12 rounded-full grid place-items-center text-2xl relative"
               style={{ background: 'radial-gradient(circle at 30% 30%, #7fffd4, #131a3a)', boxShadow: '0 0 24px rgba(127,255,212,0.6)' }}>
            🌌
          </div>
          <div>
            <h2 className="text-[color:var(--ink)] text-lg font-bold">星海夜航</h2>
            <p className="text-[color:var(--ink-faint)] text-xs">Starry Voyage</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 text-sm">
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/admin"><span>🛰️</span> 舰桥</Link>
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/admin/posts"><span>📡</span> 日志管理</Link>
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/admin/posts/new"><span>✍️</span> 写新日志</Link>
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/" target="_blank"><span>🌠</span> 访问博客 ↗</Link>
        </nav>

        <form action="/api/admin/logout" method="post" className="mt-4">
          <button className="w-full text-left py-2.5 px-3 rounded-lg text-[color:var(--ink-dim)] hover:bg-[color:var(--aurora)]/10 hover:text-[color:var(--aurora)] transition">
            <span>🚀</span> 返回地面
          </button>
        </form>
        <p className="text-[color:var(--ink-faint)] text-[10px] text-center mt-4">© Xinghuisama · Starry Voyage</p>
      </aside>

      <main className="flex-1 p-8 overflow-auto relative z-10">{children}</main>
    </div>
  );
}`);

// ==================== 6. 流星组件 ====================
w('components/admin/Meteors.tsx', `'use client';
import { useEffect, useState } from 'react';

interface M { id: number; left: number; top: number; delay: number; duration: number; }

export default function Meteors({ count = 5 }: { count?: number }) {
  const [list, setList] = useState<M[]>([]);
  useEffect(() => {
    const arr: M[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 80,
      top: Math.random() * 40,
      delay: Math.random() * 10,
      duration: 2 + Math.random() * 2,
    }));
    setList(arr);
  }, [count]);
  return (
    <>
      {list.map(m => (
        <div key={m.id} className="meteor" style={{
          left: m.left + '%',
          top: m.top + '%',
          animationDelay: m.delay + 's',
          animationDuration: m.duration + 's',
        }} />
      ))}
    </>
  );
}`);

// ==================== 7. 仪表盘（新配色） ====================
w('app/admin/page.tsx', `import Link from 'next/link';
import { listPosts } from '@/lib/posts';

export default async function Dashboard() {
  const posts = await listPosts();
  const published = posts.filter(p => p.published).length;
  const drafts = posts.length - published;
  const totalWords = posts.reduce((s, p) => s + (p.content || '').replace(/\\s/g, '').length, 0);
  const latest = posts.slice(0, 5);

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h1 className="anime-title text-3xl">欢迎登舰，指挥官</h1>
        <p className="text-[color:var(--ink-dim)] text-sm mt-1">星海辽阔，日志已就绪 ✦</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat emoji="📡" label="全部日志" value={posts.length} color="aurora" />
        <Stat emoji="🌟" label="已发布" value={published} color="gold" />
        <Stat emoji="🌙" label="草稿箱" value={drafts} color="nebula" />
        <Stat emoji="✍️" label="总字数" value={totalWords} color="aurora" />
      </div>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="anime-title text-lg">最近更新</h2>
          <Link href="/admin/posts" className="anime-btn-ghost text-xs">查看全部</Link>
        </div>
        <ul className="space-y-2">
          {latest.map(p => (
            <li key={p.id} className="anime-row flex items-center justify-between rounded-lg px-4 py-3 bg-black/20">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[color:var(--aurora)]">{p.published ? '✦' : '☾'}</span>
                <span className="truncate">{p.title}</span>
                <div className="flex gap-1">
                  {(p.tags || []).slice(0, 2).map((t, i) => <span key={i} className="tag-chip">#{t}</span>)}
                </div>
              </div>
              <span className="text-xs opacity-50 shrink-0">{new Date(p.updatedAt).toLocaleDateString()}</span>
            </li>
          ))}
          {latest.length === 0 && <li className="text-center opacity-50 py-6">还没有日志，去写第一篇吧 ✍️</li>}
        </ul>
      </section>
    </div>
  );
}

function Stat({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  const grad = {
    aurora: 'linear-gradient(135deg, rgba(127,255,212,0.15), rgba(127,255,212,0.02))',
    gold:   'linear-gradient(135deg, rgba(255,217,125,0.15), rgba(255,217,125,0.02))',
    nebula: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.02))',
  }[color] || '';
  return (
    <div className="glass rounded-2xl p-5" style={{ background: grad }}>
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-xs text-[color:var(--ink-dim)]">{label}</div>
      <div className="text-3xl font-bold mt-1 text-[color:var(--ink)]">{value}</div>
    </div>
  );
}`);

// ==================== 8. 登录页（新配色） ====================
w('app/admin/login/page.tsx', `'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../anime.css';
import Meteors from '@/components/admin/Meteors';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json().catch(()=>({})); setErr(d.error || '登录失败'); return; }
    router.replace(params.get('from') || '/admin');
  }

  return (
    <div className="anime-bg fixed inset-0 z-50 grid place-items-center">
      <Meteors count={6} />
      <form onSubmit={onSubmit} className="glass rounded-2xl p-8 space-y-5 relative z-10 w-[22rem]">
        <div className="text-center">
          <div className="float-avatar text-5xl mb-2">🌌</div>
          <h1 className="anime-title text-2xl">星海夜航</h1>
          <p className="text-xs text-[color:var(--ink-faint)] mt-1">请验证指挥官身份</p>
        </div>
        <input className="anime-input" placeholder="用户名" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="anime-input" type="password" placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-400 text-center">✖ {err}</p>}
        <button disabled={loading} className="anime-btn w-full">{loading ? '验证中...' : '✦ 启动引擎'}</button>
        <p className="text-center text-[10px] text-[color:var(--ink-faint)]">✦ Starry Voyage · Admin ✦</p>
      </form>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="anime-bg min-h-screen grid place-items-center text-[color:var(--ink)]">加载中...</div>}><LoginForm /></Suspense>;
}`);

console.log('\n✨ 星海夜航主题已部署完毕！');
console.log('现在: 1) Ctrl+C 停掉 dev   2) npm run dev   3) 刷新浏览器');