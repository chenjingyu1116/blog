import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: '文件过大（最大 10MB）' }, { status: 400 });
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: '只支持图片文件' }, { status: 400 });

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, name), buf);

    return NextResponse.json({ url: '/uploads/' + name });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '上传失败' }, { status: 500 });
  }
}