'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <aside className="anime-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">XH</div>
          <div>
            <div className="admin-title-text">星辉小屋</div>
            <div className="admin-sub">ADMIN CONSOLE</div>
          </div>
        </div>
        <nav className="admin-nav">
          <Link href="/admin"><span>◆</span> 主页</Link>
          <Link href="/admin/posts"><span>◆</span> 文章</Link>
          <Link href="/admin/posts/new"><span>◆</span> 写作</Link>
          <Link href="/" target="_blank"><span>◆</span> 博客</Link>
        </nav>
        <form action="/api/admin/logout" method="post" className="admin-logout">
          <button type="submit"><span>◆</span> 退出</button>
        </form>
        <p className="admin-copy">XINGHUISAMA · 2025</p>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}