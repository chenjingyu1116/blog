import { listFriends } from '@/lib/admin-data';
import FriendsClient from './FriendsClient';

export const dynamic = 'force-dynamic';

export default async function AdminFriendsPage() {
  const friends = await listFriends();
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">友链管理</h1>
        <p className="text-xs opacity-60 mt-1">管理友情链接，保存后自动写入 data/friends.ts</p>
      </header>
      <FriendsClient initialFriends={friends} />
    </div>
  );
}
