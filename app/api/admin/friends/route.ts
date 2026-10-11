import { NextResponse } from 'next/server';
import { listFriends, saveFriends, Friend } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ friends: await listFriends() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const friends = await listFriends();
  const id = body.id || ('friend-' + Date.now().toString(36));
  if (friends.some(f => f.id === id)) {
    return NextResponse.json({ error: 'ID 已存在' }, { status: 400 });
  }
  const friend: Friend = {
    id,
    name: body.name || '未命名',
    url: body.url || '',
    description: body.description || '',
    avatar: body.avatar || '',
    themeColor: body.themeColor || 'rgba(99, 102, 241, 0.5)',
  };
  friends.push(friend);
  await saveFriends(friends);
  return NextResponse.json({ ok: true, friends });
}
