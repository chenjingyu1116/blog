import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'shortlinks.json');

// 系统保留字，不允许用作短码
const RESERVED = [
  'admin', 'api', 's', 'tools', 'posts', 'chatter', 'moments',
  'about', 'timeline', 'tree', 'photowall', 'music', 'friends',
  'login', 'logout', 'static', 'public', 'uploads',
];

export interface ShortLink {
  code: string;
  url: string;
  createdAt: string;
  hits: number;
}

async function readAll(): Promise<ShortLink[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAll(list: ShortLink[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function randomCode(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

export async function createShortLink(url: string, customCode?: string): Promise<ShortLink> {
  const list = await readAll();
  let code = '';

  const trimmed = (customCode || '').trim();

  if (trimmed) {
    // 校验格式
    if (!/^[a-zA-Z0-9_-]{2,32}$/.test(trimmed)) {
      throw new Error('短码只能包含字母、数字、- 和 _，长度 2-32');
    }
    if (RESERVED.includes(trimmed.toLowerCase())) {
      throw new Error('「' + trimmed + '」是系统保留字，换一个吧');
    }
    if (list.some(l => l.code === trimmed)) {
      throw new Error('短码「' + trimmed + '」已被占用');
    }
    code = trimmed;
  } else {
    code = randomCode();
    while (list.some(l => l.code === code)) code = randomCode();
  }

  const item: ShortLink = {
    code,
    url,
    createdAt: new Date().toISOString(),
    hits: 0,
  };
  list.push(item);
  await writeAll(list);
  return item;
}

export async function getShortLink(code: string): Promise<ShortLink | null> {
  const list = await readAll();
  return list.find(l => l.code === code) || null;
}

export async function hitShortLink(code: string) {
  const list = await readAll();
  const item = list.find(l => l.code === code);
  if (item) {
    item.hits += 1;
    await writeAll(list);
  }
}

export async function listShortLinks(): Promise<ShortLink[]> {
  const list = await readAll();
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteShortLink(code: string) {
  const list = await readAll();
  await writeAll(list.filter(l => l.code !== code));
}