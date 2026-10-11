import { NextResponse } from 'next/server';
import { listAlbums, saveAlbums } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const albums = await listAlbums();
  const idx = albums.findIndex(a => a.id === id);
  if (idx === -1) return NextResponse.json({ error: '相册不存在' }, { status: 404 });
  albums[idx] = { ...albums[idx], ...body, id };
  await saveAlbums(albums);
  return NextResponse.json({ ok: true, albums });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albums = await listAlbums();
  const next = albums.filter(a => a.id !== id);
  await saveAlbums(next);
  return NextResponse.json({ ok: true, albums: next });
}
