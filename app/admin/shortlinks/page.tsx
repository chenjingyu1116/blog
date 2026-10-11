import { listShortLinks } from '@/lib/shortlinks';
import ShortLinksClient from '@/components/admin/ShortLinksClient';

export const dynamic = 'force-dynamic';

export default async function AdminShortLinksPage() {
  const links = await listShortLinks();

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">短链管理</h1>
        <p className="text-xs opacity-60 mt-1">
          查看所有短链、点击次数，可删除。数据保存在 <code>data/shortlinks.json</code>。
        </p>
      </header>

      <ShortLinksClient links={links} />
    </div>
  );
}