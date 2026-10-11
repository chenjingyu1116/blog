import { listAlbums } from '@/lib/admin-data';
import AlbumsClient from './AlbumsClient';

export const dynamic = 'force-dynamic';

export default async function AdminAlbumsPage() {
  const albums = await listAlbums();
  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="anime-title text-3xl">相册管理</h1>
        <p className="text-xs opacity-60 mt-1">管理照片墙的相册和照片，保存后自动写入 data/albums.ts</p>
      </header>
      <AlbumsClient initialAlbums={albums} />
    </div>
  );
}
