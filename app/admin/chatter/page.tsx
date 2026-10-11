import { listContent } from '@/lib/admin-content';
import ChatterClient from './ChatterClient';

export const dynamic = 'force-dynamic';

export default async function AdminChatterPage() {
  const items = await listContent('chatters');
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">杂谈管理</h1>
        <p className="text-xs opacity-60 mt-1">
          管理杂谈，保存后写入 <code>chatters/*.md</code>。
        </p>
      </header>
      <ChatterClient initialItems={items} />
    </div>
  );
}
