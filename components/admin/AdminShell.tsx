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
          <Link href="/admin/moments"><span>◆</span> 说说</Link>
          <Link href="/admin/chatter"><span>◆</span> 杂谈</Link>
          <Link href="/admin/albums"><span>◆</span> 相册</Link>
          <Link href="/admin/friends"><span>◆</span> 友链</Link>
          <Link href="/admin/tools"><span>◆</span> 工具</Link>
          <Link href="/admin/shortlinks"><span>◆</span> 短链</Link>
          <Link href="/admin/uploads"><span>◆</span> 图片</Link>
		  <Link href="/admin/cat"><span>◆</span> 猫猫设置</Link>
          <Link href="/admin/site"><span>◆</span> 站点设置</Link>
          <Link href="/admin/stats"><span>◆</span> 访问统计</Link>
          <Link href="/admin/backup"><span>◆</span> 备份</Link>
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