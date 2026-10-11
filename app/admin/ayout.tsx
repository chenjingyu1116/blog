import Link from 'next/link';
import './anime.css';
import Petals from '@/components/admin/Petals';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg flex min-h-screen">
      <Petals count={18} />

      <aside className="anime-sidebar w-64 p-5 flex flex-col relative z-20">
        <div className="flex items-center gap-3 mb-8 pl-8">
          <div className="float-avatar w-14 h-14 rounded-full grid place-items-center text-2xl"
               style={{ background: 'radial-gradient(circle at 30% 30%, #fff5cc, #ffb7ce)', border: '3px solid #3a2e33', boxShadow: '3px 3px 0 #3a2e33' }}>
            <span style={{ color: '#3a2e33', fontWeight: 900 }}>XH</span>
          </div>
          <div>
            <h2 style={{ fontFamily: '"ZCOOL KuaiLe", sans-serif', fontWeight: 900, fontSize: '1.15rem', color: '#3a2e33' }}>
              XingHuiSama
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#8b7c82', fontWeight: 700 }}>~ Kawaii Cafe ~</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 text-sm pl-8">
          <Link className="flex items-center gap-2.5 py-2.5 px-3" href="/admin">
            <span className="text-base">★</span> 小首页
          </Link>
          <Link className="flex items-center gap-2.5 py-2.5 px-3" href="/admin/posts">
            <span className="text-base">✿</span> 文章管理
          </Link>
          <Link className="flex items-center gap-2.5 py-2.5 px-3" href="/admin/posts/new">
            <span className="text-base">✎</span> 写新文章
          </Link>
          <Link className="flex items-center gap-2.5 py-2.5 px-3" href="/" target="_blank">
            <span className="text-base">⊕</span> 看看博客
          </Link>
        </nav>

        <form action="/api/admin/logout" method="post" className="mt-4 pl-8">
          <button type="submit" className="logout-btn">
            <span className="text-base">♥</span> 退出登录
          </button>
        </form>
        <p style={{ fontSize: '10px', color: '#8b7c82', textAlign: 'center', marginTop: '1rem', fontWeight: 700 }}>
          (c) XingHuiSama 2025
        </p>
      </aside>

      <main className="flex-1 p-8 overflow-auto relative z-10">{children}</main>
    </div>
  );
}