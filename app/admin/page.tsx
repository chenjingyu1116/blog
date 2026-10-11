import Link from 'next/link';
import { listAllPosts } from '@/lib/posts';
import { listContent } from '@/lib/admin-content';
import { listAlbums, listFriends } from '@/lib/admin-data';
import { listTools } from '@/lib/tools';
import { listShortLinks } from '@/lib/shortlinks';
import { getAnalytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // 并发拉取所有数据
  const [posts, moments, chatters, albums, friends, tools, links, analytics] = await Promise.all([
    listAllPosts().catch(() => []),
    listContent('moments').catch(() => []),
    listContent('chatters').catch(() => []),
    listAlbums().catch(() => []),
    listFriends().catch(() => []),
    listTools().catch(() => []),
    listShortLinks().catch(() => []),
    getAnalytics().catch(() => ({ total: { pv: 0, uv: 0 }, daily: {}, postViews: {} })),
  ]);

  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts = posts.length - publishedPosts;

  const today = new Date().toISOString().slice(0, 10);
  const todayPv = analytics.daily?.[today]?.pv || 0;
  const totalPv = analytics.total?.pv || 0;
  const totalUv = analytics.total?.uv || 0;

  const totalPhotos = albums.reduce((sum, a) => sum + a.photos.length, 0);
  const totalLinks = links.reduce((sum, l) => sum + l.hits, 0);

  // 混合最近动态
  const recentActivities = [
    ...posts.map(p => ({
      type: '文章',
      icon: '📝',
      title: p.title,
      date: p.updatedAt || p.date,
      path: '/admin/posts/' + p.id + '/edit',
      color: '#6366f1',
    })),
    ...moments.map(m => ({
      type: '说说',
      icon: '💬',
      title: m.content.slice(0, 30) + (m.content.length > 30 ? '...' : ''),
      date: m.date,
      path: '/admin/moments',
      color: '#10b981',
    })),
    ...chatters.map(c => ({
      type: '杂谈',
      icon: '📖',
      title: c.title || '无标题',
      date: c.date,
      path: '/admin/chatter',
      color: '#f59e0b',
    })),
  ]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 8);

  return (
    <div className="space-y-8 max-w-6xl">

      {/* 欢迎 */}
      <header className="glass p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="anime-title text-3xl">欢迎回来，指挥官</h1>
          <p className="text-xs opacity-60 mt-1.5">
            今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            {todayPv > 0 && <span className="ml-3 text-emerald-500 font-bold">· 今日已有 {todayPv} 次访问</span>}
          </p>
        </div>
      </header>

      {/* 数据总览（4 行） */}
      <section>
        <SectionTitle icon="📊" title="内容总览" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="文章总数" value={posts.length} sub={`${publishedPosts} 已发布 / ${draftPosts} 草稿`} color="#6366f1" gradient="linear-gradient(135deg, #6366f1, #a78bfa)" href="/admin/posts" />
          <StatCard label="说说" value={moments.length} sub="条动态" color="#10b981" gradient="linear-gradient(135deg, #10b981, #34d399)" href="/admin/moments" />
          <StatCard label="杂谈" value={chatters.length} sub="篇随笔" color="#f59e0b" gradient="linear-gradient(135deg, #f59e0b, #fbbf24)" href="/admin/chatter" />
          <StatCard label="相册" value={albums.length} sub={`${totalPhotos} 张照片`} color="#ec4899" gradient="linear-gradient(135deg, #ec4899, #f472b6)" href="/admin/albums" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard label="友链" value={friends.length} sub="位朋友" color="#8b5cf6" gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)" href="/admin/friends" />
          <StatCard label="工具" value={tools.length} sub="个在线工具" color="#06b6d4" gradient="linear-gradient(135deg, #06b6d4, #22d3ee)" href="/admin/tools" />
          <StatCard label="短链" value={links.length} sub={`${totalLinks} 次点击`} color="#f43f5e" gradient="linear-gradient(135deg, #f43f5e, #fb7185)" href="/admin/shortlinks" />
          <StatCard label="访问量" value={totalPv} sub={`UV ${totalUv}`} color="#14b8a6" gradient="linear-gradient(135deg, #14b8a6, #2dd4bf)" href="/admin/stats" />
        </div>
      </section>

      {/* 快捷入口 */}
      <section>
        <SectionTitle icon="⚡" title="快捷操作" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <QuickLink href="/admin/posts/new" icon="✍️" label="写文章" />
          <QuickLink href="/admin/moments" icon="💬" label="发说说" />
          <QuickLink href="/admin/chatter" icon="📖" label="写杂谈" />
          <QuickLink href="/admin/uploads" icon="☁️" label="传图片" />
          <QuickLink href="/admin/tools" icon="🧰" label="工具管理" />
          <QuickLink href="/admin/site" icon="⚙️" label="站点设置" />
        </div>
      </section>

      {/* 最近动态 */}
      <section className="glass p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="anime-title text-xl">最近动态</h2>
          <span className="text-xs opacity-50">最新 8 条</span>
        </div>
        <div className="space-y-2">
          {recentActivities.map((act, i) => (
            <Link
              key={i}
              href={act.path}
              className="flex items-center gap-3 p-3 rounded-xl transition hover:bg-white/10 group"
            >
              <span className="text-lg shrink-0">{act.icon}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                style={{ background: act.color + '22', color: act.color }}
              >
                {act.type}
              </span>
              <span className="flex-1 truncate text-sm group-hover:text-indigo-400 transition-colors">
                {act.title}
              </span>
              <span className="text-[10px] opacity-40 font-mono shrink-0">{act.date}</span>
            </Link>
          ))}
          {recentActivities.length === 0 && (
            <p className="text-center opacity-50 py-8 text-sm">还没有任何内容</p>
          )}
        </div>
      </section>

      {/* 提示 */}
      <div className="text-center text-[10px] opacity-40 py-4">
        XingHuiSama Admin · v2.0
      </div>
    </div>
  );
}

// ============ 组件 ============

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="text-sm font-black tracking-wider mb-3 flex items-center gap-2 opacity-80">
      <span className="text-base">{icon}</span>
      {title}
    </h2>
  );
}

function StatCard({
  label, value, sub, color, gradient, href,
}: {
  label: string; value: number; sub: string; color: string; gradient: string; href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: gradient }}
      />
      <div className="relative z-10">
        <div className="text-[11px] opacity-60 font-bold mb-1">{label}</div>
        <div className="text-3xl font-black" style={{ color }}>{value}</div>
        <div className="text-[10px] opacity-50 mt-1">{sub}</div>
      </div>
      <span
        className="absolute top-3 right-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color }}
      >
        →
      </span>
    </Link>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-bold opacity-80">{label}</span>
    </Link>
  );
}