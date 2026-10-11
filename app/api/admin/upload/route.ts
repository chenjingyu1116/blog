import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
export const runtime = 'nodejs';
const DIR = path.join(process.cwd(), 'public', 'uploads');
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: '未选择文件' }, { status: 400 });
  await fs.mkdir(DIR, { recursive: true });
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  await fs.writeFile(path.join(DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: '/uploads/' + name });
}