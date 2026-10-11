import Link from 'next/link';
import { listAllPosts } from '@/lib/posts';

export default async function Dashboard() {
  const posts = await listAllPosts();
  const published = posts.filter(p => p.published).length;
  const drafts = posts.length - published;
  const latest = posts.slice(0, 5);

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="glass p-6 relative">
        <div className="tape" />
        <h1 className="anime-title text-4xl">欢迎回来！</h1>
        <p style={{ color: '#8b7c82', fontWeight: 700, marginTop: '0.5rem' }}>
          今天也要元气满满哦 (๑•̀ㅂ•́)و✧
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat ch="A" label="全部文章" value={posts.length} bg="#b8e6d5" />
        <Stat ch="B" label="已发布" value={published} bg="#ffc9d4" />
        <Stat ch="C" label="草稿箱" value={drafts} bg="#fff5cc" />
      </div>

      <section className="glass p-6 relative">
        <div className="tape" style={{ left: 20, right: 'auto' }} />
        <div className="flex items-center justify-between mb-4">
          <h2 className="anime-title text-2xl">最近更新</h2>
          <Link href="/admin/posts" className="anime-btn-ghost">查看全部</Link>
        </div>
        <ul className="space-y-2">
          {latest.map(p => (
            <li key={p.id} className="anime-row flex items-center justify-between rounded-2xl px-4 py-3 bg-white border-2"
                style={{ borderColor: '#3a2e33', boxShadow: '3px 3px 0 #3a2e33' }}>
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ fontWeight: 900, color: p.published ? '#e1628b' : '#a78bfa' }}>
                  {p.published ? '★' : '☆'}
                </span>
                <span className="truncate" style={{ fontWeight: 700 }}>{p.title}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#8b7c82', fontWeight: 700 }}>
                {new Date(p.updatedAt).toLocaleDateString()}
              </span>
            </li>
          ))}
          {latest.length === 0 && <li style={{ textAlign: 'center', color: '#8b7c82', padding: '1.5rem', fontWeight: 700 }}>还没有文章哦 ~</li>}
        </ul>
      </section>
    </div>
  );
}

function Stat({ ch, label, value, bg }: { ch: string; label: string; value: number; bg: string }) {
  return (
    <div className="stat-card" style={{ background: bg }}>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3a2e33' }}>{ch}</div>
      <div style={{ fontSize: '0.75rem', color: '#5a4a50', fontWeight: 800, marginTop: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3a2e33', marginTop: '0.25rem', fontFamily: '"ZCOOL KuaiLe", sans-serif' }}>{value}</div>
    </div>
  );
}