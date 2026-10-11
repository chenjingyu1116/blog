import { NextResponse } from 'next/server';
import { getPost, savePost, deletePost } from '@/lib/posts';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);   // ⭐ URL 编码 → 原始中文
  const p = await getPost(id);
  if (!p) return NextResponse.json({ error: '不存在' }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);   // ⭐
  const body = await req.json();
  const newId = await savePost({ ...body, id });
  return NextResponse.json({ id: newId });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);   // ⭐
  await deletePost(id);
  return NextResponse.json({ ok: true });
}