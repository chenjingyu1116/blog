'use client';

export default function StatsClient({ data }: { data: any }) {
  const daily = data.daily || {};
  const days = Object.keys(daily).sort().slice(-30);
  const maxPv = Math.max(1, ...days.map(d => daily[d]?.pv || 0));

  const postViews = data.postViews || {};
  const topPosts = Object.entries(postViews).sort((a: any, b: any) => b[1] - a[1]).slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="总 PV" value={data.total?.pv || 0} color="#10b981" />
        <Stat label="总 UV" value={data.total?.uv || 0} color="#6366f1" />
        <Stat label="今日 PV" value={daily[new Date().toISOString().slice(0, 10)]?.pv || 0} color="#f59e0b" />
        <Stat label="今日 UV" value={daily[new Date().toISOString().slice(0, 10)]?.uv || 0} color="#ec4899" />
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <h3 className="font-bold text-sm mb-4">最近 30 天</h3>
        {days.length === 0 ? (
          <p className="text-center opacity-50 py-8 text-sm">暂无数据</p>
        ) : (
          <div className="flex items-end gap-1 h-40 overflow-x-auto">
            {days.map(d => {
              const pv = daily[d]?.pv || 0;
              const h = Math.max(4, Math.round((pv / maxPv) * 100));
              return (
                <div key={d} className="flex flex-col items-center gap-1 shrink-0 group relative" style={{ minWidth: 24 }}>
                  <span className="text-[9px] opacity-0 group-hover:opacity-100 absolute -top-5 whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded text-white">{d}: {pv}</span>
                  <div style={{ width: 18, height: h + '%', background: 'linear-gradient(180deg, #6366f1, #a78bfa)', borderRadius: 4 }} />
                  <span className="text-[9px] opacity-40">{d.slice(5)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <h3 className="font-bold text-sm mb-4">文章阅读量 TOP 20</h3>
        {topPosts.length === 0 ? (
          <p className="text-center opacity-50 py-8 text-sm">暂无数据</p>
        ) : (
          <div className="space-y-2">
            {topPosts.map(([slug, count]: any, i: number) => (
              <div key={slug} className="flex items-center gap-3 text-xs">
                <span className="font-bold opacity-50 w-6 text-right">{i + 1}</span>
                <span className="font-mono flex-1 truncate opacity-80">{slug}</span>
                <span className="font-bold text-indigo-400">{count} 次</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="text-xs opacity-60 mb-1">{label}</div>
      <div className="text-3xl font-black" style={{ color }}>{value}</div>
    </div>
  );
}
