import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

async function readDirFiles(dir: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  try {
    const names = await fs.readdir(dir);
    for (const name of names) {
      if (name.startsWith('.')) continue;
      const full = path.join(dir, name);
      const stat = await fs.stat(full);
      if (stat.isDirectory()) continue;
      if (!name.endsWith('.md') && !name.endsWith('.json')) continue;
      result[name] = await fs.readFile(full, 'utf-8');
    }
  } catch {}
  return result;
}

export async function GET() {
  const posts = await readDirFiles(path.join(process.cwd(), 'posts'));
  const chatters = await readDirFiles(path.join(process.cwd(), 'chatters'));
  const moments = await readDirFiles(path.join(process.cwd(), 'moments'));
  const data = await readDirFiles(path.join(process.cwd(), 'data'));

  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    posts,
    chatters,
    moments,
    data,
  };

  const filename = 'blog-backup-' + new Date().toISOString().slice(0, 10) + '.json';

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="' + filename + '"',
    },
  });
}