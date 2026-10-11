import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true });
}

export async function GET() {
  await ensureDir();
  const names = (await fs.readdir(DIR)).filter(n => !n.startsWith('.'));
  const files = await Promise.all(
    names.map(async name => {
      const stat = await fs.stat(path.join(DIR, name));
      return {
        name,
        url: '/uploads/' + name,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
      };
    })
  );
  files.sort((a, b) => b.mtime.localeCompare(a.mtime));
  return NextResponse.json({ files });
}

export async function POST(req: Request) {
  const { action, name } = await req.json();
  if (action === 'delete' && name) {
    // 防止路径穿越
    if (name.includes('/') || name.includes('\\') || name.includes('..')) {
      return NextResponse.json({ error: '非法文件名' }, { status: 400 });
    }
    try {
      await fs.unlink(path.join(DIR, name));
    } catch {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: '参数错误' }, { status: 400 });
}