import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  cover?: string;
  published: boolean;
  date: string;
  updatedAt: string;
}

async function ensureDir() { await fs.mkdir(POSTS_DIR, { recursive: true }); }

// ⭐ 新文章用纯英文数字文件名，彻底避开中文编码问题
function slugify(s: string) {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return (base || 'post') + '-' + Date.now().toString(36);
}

// ⭐ 生成所有可能的 id 候选（处理 URL 编码 + NFC/NFD 差异）
function idCandidates(id: string): string[] {
  const set = new Set<string>([id]);
  try { set.add(id.normalize('NFC')); } catch {}
  try { set.add(id.normalize('NFD')); } catch {}
  try { set.add(decodeURIComponent(id)); } catch {}
  try { set.add(decodeURIComponent(id).normalize('NFC')); } catch {}
  try { set.add(decodeURIComponent(id).normalize('NFD')); } catch {}
  return Array.from(set);
}

// ⭐ 核心：遍历目录逐个对比（不管什么编码都能找到）
async function resolveFilePath(id: string): Promise<{ fullPath: string; realId: string } | null> {
  await ensureDir();

  let files: string[] = [];
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch {
    return null;
  }

  const candidates = idCandidates(id);

  // 遍历实际文件，做归一化后对比
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const realId = f.replace(/\.md$/, '');

    for (const c of candidates) {
      if (realId === c) {
        return { fullPath: path.join(POSTS_DIR, f), realId };
      }
      try {
        if (realId.normalize('NFC') === c.normalize('NFC')) {
          return { fullPath: path.join(POSTS_DIR, f), realId };
        }
      } catch {}
    }
  }

  // 双保险：直接尝试访问
  for (const c of candidates) {
    const p = path.join(POSTS_DIR, c + '.md');
    try {
      await fs.access(p);
      return { fullPath: p, realId: c };
    } catch {}
  }

  return null;
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

export async function listAllPosts(): Promise<Post[]> {
  return listPosts({ includeDrafts: true });
}

export async function getPost(id: string): Promise<Post | null> {
  const resolved = await resolveFilePath(id);
  if (!resolved) return null;
  try {
    const raw = await fs.readFile(resolved.fullPath, 'utf-8');
    const { data, content } = matter(raw);
    return normalize(data, content, resolved.realId);
  } catch {
    return null;
  }
}

export async function savePost(input: Partial<Post> & { title: string; content: string }) {
  await ensureDir();

  let realId = input.id;
  let existingPath: string | null = null;

  // 有 id → 先找有没有已存在的文件（处理中文/编码问题）
  if (input.id) {
    const resolved = await resolveFilePath(input.id);
    if (resolved) {
      realId = resolved.realId;
      existingPath = resolved.fullPath;
    }
  }

  // 新建（无 id 或找不到文件）
  if (!realId) {
    realId = slugify(input.title);
    existingPath = path.join(POSTS_DIR, realId + '.md');
  } else if (!existingPath) {
    existingPath = path.join(POSTS_DIR, realId + '.md');
  }

  let oldData: any = {};
  try {
    oldData = matter(await fs.readFile(existingPath, 'utf-8')).data || {};
  } catch {}

  // ⭐ 清理历史遗留的 publishAt 字段
  delete oldData.publishAt;

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

  await fs.writeFile(existingPath, matter.stringify(input.content, fm), 'utf-8');
  return realId;
}

export async function deletePost(id: string) {
  const resolved = await resolveFilePath(id);
  if (!resolved) throw new Error('文章不存在');
  await fs.unlink(resolved.fullPath);
}