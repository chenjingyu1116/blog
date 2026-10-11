import { NextResponse } from 'next/server';
import { listAlbums, saveAlbums, Album } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ albums: await listAlbums() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const albums = await listAlbums();
  const id = body.id || ('album-' + Date.now().toString(36));
  if (albums.some(a => a.id === id)) {
    return NextResponse.json({ error: '相册 ID 已存在' }, { status: 400 });
  }
  const album: Album = {
    id,
    title: body.title || '未命名相册',
    description: body.description || '',
    cover: body.cover || '',
    date: body.date || new Date().toISOString().slice(0, 7).replace('-', '.'),
    photos: body.photos || [],
  };
  albums.push(album);
  await saveAlbums(albums);
  return NextResponse.json({ ok: true, albums });
}
