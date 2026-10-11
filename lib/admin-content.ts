import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface ContentItem {
  id: string;
  title?: string;
  date: string;
  content: string;
  published: boolean;
  // 说说专用
  location?: string;
  images?: string[];
  // 杂谈专用
  tags?: string[];
  mood?: string;
  cover?: string;
}

function dirOf(kind: 'moments' | 'chatters') {
  return path.join(process.cwd(), kind);
}

function slugify(s: string) {
  const base = s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
  return (base || 'item') + '-' + Date.now().toString(36);
}

function normalize(kind: 'moments' | 'chatters', data: any, content: string, id: string): ContentItem {
  const base: ContentItem = {
    id,
    date: data.date ? String(data.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    content,
    published: data.published !== false && data.draft !== true,
  };
  if (kind === 'moments') {
    base.location = data.location || '';
    base.images = Array.isArray(data.images) ? data.images : [];
  } else {
    base.title = data.title || '';
    base.tags = Array.isArray(data.tags) ? data.tags : [];
    base.mood = data.mood || '';
    base.cover = data.cover || '';
  }
  return base;
}

export async function listContent(kind: 'moments' | 'chatters'): Promise<ContentItem[]> {
  const dir = dirOf(kind);
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
  try {
    const files = (await fs.readdir(dir)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    const arr = await Promise.all(files.map(async f => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8');
      const { data, content } = matter(raw);
      return normalize(kind, data, content, f.replace(/\.md$/, ''));
    }));
    return arr.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export async function getContent(kind: 'moments' | 'chatters', id: string): Promise<ContentItem | null> {
  try {
    const raw = await fs.readFile(path.join(dirOf(kind), id + '.md'), 'utf-8');
    const { data, content } = matter(raw);
    return normalize(kind, data, content, id);
  } catch {
    return null;
  }
}

export async function saveContent(kind: 'moments' | 'chatters', input: Partial<ContentItem> & { content: string }) {
  const dir = dirOf(kind);
  await fs.mkdir(dir, { recursive: true });
  const id = input.id || slugify(input.title || input.date || 'item');
  const file = path.join(dir, id + '.md');
  const fm: any = {
    date: input.date || new Date().toISOString().slice(0, 10),
    published: input.published !== false,
  };
  if (kind === 'moments') {
    if (input.location) fm.location = input.location;
    if (input.images && input.images.length > 0) fm.images = input.images;
  } else {
    fm.title = input.title || '';
    if (input.tags && input.tags.length > 0) fm.tags = input.tags;
    if (input.mood) fm.mood = input.mood;
    if (input.cover) fm.cover = input.cover;
  }
  await fs.writeFile(file, matter.stringify(input.content || '', fm), 'utf-8');
  return id;
}

export async function deleteContent(kind: 'moments' | 'chatters', id: string) {
  await fs.unlink(path.join(dirOf(kind), id + '.md'));
}
