import { NextResponse } from 'next/server';
import { getContent, saveContent, deleteContent } from '@/lib/admin-content';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getContent('chatters', id);
  if (!item) return NextResponse.json({ error: '不存在' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  }
  const newId = await saveContent('chatters', { ...body, id });
  return NextResponse.json({ ok: true, id: newId });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteContent('chatters', id);
  return NextResponse.json({ ok: true });
}
