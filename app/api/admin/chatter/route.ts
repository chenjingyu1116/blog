import { NextResponse } from 'next/server';
import { listContent, saveContent } from '@/lib/admin-content';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ items: await listContent('chatters') });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  }
  const id = await saveContent('chatters', body);
  return NextResponse.json({ ok: true, id });
}
