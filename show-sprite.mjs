// show-sprite.mjs — 让立绘显示
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();

// 1. 重写 layout.tsx，加上 CharacterSprite
fs.writeFileSync(path.join(ROOT, 'app/admin/layout.tsx'), `import Link from 'next/link';
import './anime.css';
import CharacterSprite from '@/components/admin/CharacterSprite';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg">
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
      <CharacterSprite />
    </div>
  );
}`, 'utf-8');
console.log('OK  app/admin/layout.tsx (已加入 CharacterSprite)');

// 2. 加一段遮罩减淡 CSS，让前台背景更清晰
const cssPath = path.join(ROOT, 'app/admin/anime.css');
let css = fs.readFileSync(cssPath, 'utf-8');

if (!css.includes('/* 让前台背景更清晰 */')) {
  css += `

/* 让前台背景更清晰 */
.anime-bg {
  background: transparent !important;
}
`;
  fs.writeFileSync(cssPath, css, 'utf-8');
  console.log('OK  app/admin/anime.css (背景透明)');
}
console.log('\\n下一步：');
console.log('  1. 放一张动漫 PNG 到 public/admin/character.png');
console.log('  2. Ctrl+C 停 dev → npm run dev → Ctrl+Shift+R 硬刷新');