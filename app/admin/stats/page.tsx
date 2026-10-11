import { getAnalytics } from '@/lib/analytics';
import StatsClient from './StatsClient';

export const dynamic = 'force-dynamic';

export default async function AdminStatsPage() {
  const data = await getAnalytics();
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">访问统计</h1>
        <p className="text-xs opacity-60 mt-1">实时记录 PV / UV 和文章阅读量</p>
      </header>
      <StatsClient data={data} />
    </div>
  );
}
