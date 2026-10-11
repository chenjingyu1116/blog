'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownPreview from './MarkdownPreview';
import AIAssistant from './AIAssistant';

const DRAFT_KEY = 'xh-post-draft';

interface Props {
  id?: string;
  initial?: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    cover?: string;
    published: boolean;
  };
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

  // ⭐ 获取 textarea 里选中的文字
  function getSelected(): string {
    const ta = contentRef.current;
    if (!ta) return '';
    return content.slice(ta.selectionStart, ta.selectionEnd);
  }

  // ⭐ 把 AI 结果插入到光标处
  function insertAtCursor(text: string) {
    const ta = contentRef.current;
    if (!ta) {
      setContent(c => c + '\n\n' + text);
      return;
    }
    const pos = ta.selectionStart;
    const next = content.slice(0, pos) + '\n\n' + text + '\n\n' + content.slice(pos);
    setContent(next);
  }

  // ⭐ 替换 textarea 里选中的文字
  function replaceSelection(text: string) {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = content.slice(0, start) + text + content.slice(end);
    setContent(next);
  }

  // 自动保存草稿
  useEffect(() => {
    if (id) return;
    const t = setInterval(() => {
      if (title || content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          title, content, excerpt, tags, cover, published, ts: Date.now(),
        }));
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
    const body = {
      title, content, excerpt,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      cover, published,
    };
    const res = await fetch(id ? '/api/admin/posts/' + id : '/api/admin/posts', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

  async function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = await uploadFile(file);
    if (url && contentRef.current) {
      const ta = contentRef.current;
      const pos = ta.selectionStart;
      const insert = '\n![' + file.name + '](' + url + ')\n';
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

  const wordCount = content.replace(/\s/g, '').length;
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
          <input className="anime-input" placeholder="标签，逗号分隔" value={tags} onChange={e=>setTags(e.target.value)} />
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

        <div className="flex items-center justify-between pt-3 border-t border-[color:var(--aurora)]/10">
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

      {/* ⭐ 猫猫写作助手 */}
      <AIAssistant
        content={content}
        onInsert={insertAtCursor}
        onReplaceSelection={replaceSelection}
        getSelected={getSelected}
      />
    </div>
  );
}