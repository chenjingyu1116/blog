import { NextResponse } from 'next/server';
import { getPost, savePost, deletePost } from '@/lib/posts';
export const runtime = 'nodejs';
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPost(id);
  if (!p) return NextResponse.json({ error: '不存在' }, { status: 404 });
  return NextResponse.json(p);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const newId = await savePost({ ...body, id });
  return NextResponse.json({ id: newId });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deletePost(id);
  return NextResponse.json({ ok: true });
}