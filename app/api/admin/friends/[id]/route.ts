import { NextResponse } from 'next/server';
import { listFriends, saveFriends } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const friends = await listFriends();
  const idx = friends.findIndex(f => f.id === id);
  if (idx === -1) return NextResponse.json({ error: '友链不存在' }, { status: 404 });
  friends[idx] = { ...friends[idx], ...body, id };
  await saveFriends(friends);
  return NextResponse.json({ ok: true, friends });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const friends = await listFriends();
  const next = friends.filter(f => f.id !== id);
  await saveFriends(next);
  return NextResponse.json({ ok: true, friends: next });
}
