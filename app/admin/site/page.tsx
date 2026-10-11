import { getSite } from '@/lib/admin-site';
import SiteClient from './SiteClient';

export const dynamic = 'force-dynamic';

export default async function AdminSitePage() {
  const site = await getSite();
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">站点设置</h1>
        <p className="text-xs opacity-60 mt-1">
          修改后写入 <code>data/site.json</code>，前台通过 <code>siteConfig</code> 读取。
        </p>
      </header>
      <SiteClient initial={site} />
    </div>
  );
}
