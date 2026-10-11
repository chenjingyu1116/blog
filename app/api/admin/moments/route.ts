import { NextResponse } from 'next/server';
import { listContent, saveContent } from '@/lib/admin-content';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ items: await listContent('moments') });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.content?.trim()) {
    return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
  }
  const id = await saveContent('moments', body);
  return NextResponse.json({ ok: true, id });
}
