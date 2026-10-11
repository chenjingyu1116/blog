import { listContent } from '@/lib/admin-content';
import MomentsClient from './MomentsClient';

export const dynamic = 'force-dynamic';

export default async function AdminMomentsPage() {
  const items = await listContent('moments');
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">说说管理</h1>
        <p className="text-xs opacity-60 mt-1">
          管理说说，保存后写入 <code>moments/*.md</code>。
        </p>
      </header>
      <MomentsClient initialItems={items} />
    </div>
  );
}
