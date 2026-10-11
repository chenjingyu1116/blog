import fs from 'fs/promises';
import path from 'path';

export interface ToolMeta {
  id: string;
  name: string;
  path: string;
  icon: string;
  desc: string;
  category: string;
  enabled: boolean;
}

const FILE = path.join(process.cwd(), 'data', 'tools.json');

// 首次运行时自动创建的默认工具
const DEFAULT_TOOLS: ToolMeta[] = [
  { id: 'json', name: 'JSON 格式化', path: '/tools/json', icon: '{ }', desc: '格式化、压缩、校验 JSON', category: '开发', enabled: true },
  { id: 'color', name: '颜色转换', path: '/tools/color', icon: '🎨', desc: 'HEX / RGB / HSL 互转', category: '设计', enabled: true },
  { id: 'time', name: '时间戳转换', path: '/tools/time', icon: '⏰', desc: 'Unix 时间戳与日期互转', category: '开发', enabled: true },
  { id: 'password', name: '密码生成器', path: '/tools/password', icon: '🔐', desc: '生成高强度随机密码', category: '安全', enabled: true },
  { id: 'base64', name: 'Base64 编解码', path: '/tools/base64', icon: '📋', desc: '文本与 Base64 互转', category: '开发', enabled: true },
  { id: 'diff', name: '文本对比', path: '/tools/diff', icon: '🔤', desc: '对比两段文本差异', category: '文本', enabled: true },
  { id: 'qrcode', name: '二维码生成', path: '/tools/qrcode', icon: '📱', desc: '文本/链接转二维码', category: '设计', enabled: true },
  { id: 'image', name: '图片压缩', path: '/tools/image', icon: '🖼️', desc: '本地压缩图片，不上传服务器', category: '图片', enabled: true },
  { id: 'short', name: '短链生成', path: '/tools/short', icon: '🔗', desc: '长链接一键缩短', category: '实用', enabled: true },
  { id: 'upload', name: '图床', path: '/tools/upload', icon: '☁️', desc: '上传图片，获取外链', category: '图片', enabled: true },
];

async function readAll(): Promise<ToolMeta[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('invalid');
    return parsed;
  } catch {
    await writeAll(DEFAULT_TOOLS);
    return [...DEFAULT_TOOLS];
  }
}

async function writeAll(list: ToolMeta[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export async function listTools(): Promise<ToolMeta[]> {
  return await readAll();
}

export async function listEnabledTools(): Promise<ToolMeta[]> {
  const list = await readAll();
  return list.filter(t => t.enabled !== false);
}

export async function getTool(id: string): Promise<ToolMeta | null> {
  const list = await readAll();
  return list.find(t => t.id === id) || null;
}

export async function createTool(input: Partial<ToolMeta>): Promise<ToolMeta> {
  const list = await readAll();
  const id = (input.id || 'tool-' + Date.now().toString(36)).trim();
  if (!id) throw new Error('ID 不能为空');
  if (list.some(t => t.id === id)) throw new Error('工具 ID 已存在：' + id);
  const item: ToolMeta = {
    id,
    name: (input.name || '未命名工具').trim(),
    path: (input.path || '/').trim(),
    icon: (input.icon || '🧰').trim(),
    desc: (input.desc || '').trim(),
    category: (input.category || '其他').trim(),
    enabled: input.enabled !== false,
  };
  list.push(item);
  await writeAll(list);
  return item;
}

export async function updateTool(id: string, patch: Partial<ToolMeta>): Promise<ToolMeta | null> {
  const list = await readAll();
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, id };
  await writeAll(list);
  return list[idx];
}

export async function deleteTool(id: string) {
  const list = await readAll();
  await writeAll(list.filter(t => t.id !== id));
}

export async function toggleTool(id: string, enabled: boolean) {
  await updateTool(id, { enabled });
}

export async function moveTool(id: string, direction: 'up' | 'down') {
  const list = await readAll();
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return;
  const swap = direction === 'up' ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= list.length) return;
  [list[idx], list[swap]] = [list[swap], list[idx]];
  await writeAll(list);
}