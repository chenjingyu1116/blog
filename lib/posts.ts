import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export interface Post {
  id: string; title: string; content: string; excerpt?: string;
  tags?: string[]; cover?: string; published: boolean;
  date: string; updatedAt: string;
}

async function ensureDir() { await fs.mkdir(POSTS_DIR, { recursive: true }); }

function slugify(s: string) {
  const base = s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
  return (base || 'post') + '-' + Date.now().toString(36);
}

function normalize(data: any, content: string, id: string): Post {
  return {
    id,
    title: String(data.title || ''),
    content,
    excerpt: data.excerpt || data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover || data.image || '',
    published: data.published !== false && data.draft !== true,
    date: data.date ? String(data.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

/**
 * 读取文章列表
 * @param opts.includeDrafts 默认 false —— 前台只会看到已发布的
 *                           后台传 true 才能读到草稿
 */
export async function listPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  await ensureDir();
  const files = (await fs.readdir(POSTS_DIR)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  const arr = await Promise.all(files.map(async f => {
    const raw = await fs.readFile(path.join(POSTS_DIR, f), 'utf-8');
    const { data, content } = matter(raw);
    return normalize(data, content, f.replace(/\.md$/, ''));
  }));
  const sorted = arr.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return opts.includeDrafts ? sorted : sorted.filter(p => p.published);
}

/** 后台专用：返回全部（含草稿） */
export async function listAllPosts(): Promise<Post[]> {
  return listPosts({ includeDrafts: true });
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, id + '.md'), 'utf-8');
    const { data, content } = matter(raw);
    return normalize(data, content, id);
  } catch { return null; }
}

export async function savePost(input: Partial<Post> & { title: string; content: string }) {
  await ensureDir();
  const id = input.id || slugify(input.title);
  const exists = input.id ? await getPost(input.id) : null;
  const file = path.join(POSTS_DIR, id + '.md');

  let oldData: any = {};
  if (exists) {
    try { oldData = matter(await fs.readFile(file, 'utf-8')).data || {}; } catch {}
  }

  const fm: any = {
    ...oldData,
    title: input.title,
    date: input.date || oldData.date || new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    tags: input.tags || [],
  };
  if (input.excerpt !== undefined) fm.excerpt = input.excerpt;
  if (input.cover !== undefined) fm.cover = input.cover;
  fm.published = input.published !== false;

  await fs.writeFile(file, matter.stringify(input.content, fm), 'utf-8');
  return id;
}

export async function deletePost(id: string) {
  await fs.unlink(path.join(POSTS_DIR, id + '.md'));
}