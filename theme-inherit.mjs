// theme-inherit.mjs — 后台继承博客前台风格
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
function w(rel, c) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c, 'utf-8');
  console.log('OK  ' + rel);
}

// ============ 清空 anime.css，只留最小结构样式 ============
w('app/admin/anime.css', `/* ===== 后台融入前台风格（继承博客 globals.css） ===== */

/* 后台容器：不再全屏覆盖，让前台背景透过来 */
.anime-bg {
  min-height: 100vh;
  color: inherit;
  font-family: inherit;
}

/* 后台布局骨架 */
.admin-shell {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}

/* 侧边栏：半透明玻璃，能透过前台背景 */
.anime-sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.admin-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 0.85rem;
  color: #fff;
  background: linear-gradient(135deg, #9d4eff, #00e8c8);
  box-shadow: 0 6px 20px rgba(157, 78, 255, 0.5);
}
.admin-title-text {
  font-weight: 900;
  font-size: 1rem;
  color: inherit;
  letter-spacing: 0.05em;
}
.admin-sub {
  font-size: 0.65rem;
  opacity: 0.6;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-top: 2px;
}
.admin-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.admin-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  color: inherit;
  text-decoration: none;
  opacity: 0.75;
  transition: all 0.15s;
}
.admin-nav a:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}
.admin-logout {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.admin-logout button {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  color: inherit;
  opacity: 0.75;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.15s;
}
.admin-logout button:hover {
  opacity: 1;
  background: rgba(255, 100, 100, 0.15);
}
.admin-copy {
  font-size: 9px;
  opacity: 0.4;
  text-align: center;
  margin-top: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}
.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  z-index: 10;
  padding-bottom: 160px;
}

/* 玻璃卡片：半透明白，不管什么背景都协调 */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  color: inherit;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

/* 标题：继承前台字体，只做轻微强调 */
.anime-title {
  display: inline-block;
  font-weight: 900;
  color: inherit;
  letter-spacing: 0.02em;
}
.anime-title::before {
  content: "◆ ";
  color: #00e8c8;
  margin-right: 6px;
}

/* 按钮：胶囊 + 半透明 */
.anime-btn {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, rgba(157, 78, 255, 0.7), rgba(0, 232, 200, 0.6));
  color: #fff;
  font-weight: 800;
  font-family: inherit;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(157, 78, 255, 0.4);
}
.anime-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(157, 78, 255, 0.6);
}
.anime-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.anime-btn-ghost {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font-weight: 700;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.anime-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.anime-btn-danger {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 100, 100, 0.5);
  background: rgba(255, 60, 80, 0.15);
  color: #ff8a9b;
  font-weight: 700;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.anime-btn-danger:hover { background: rgba(255, 60, 80, 0.3); }

.anime-input {
  width: 100%;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  outline: none;
  color: inherit;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.15s;
}
.anime-input::placeholder { opacity: 0.4; }
.anime-input:focus {
  border-color: rgba(0, 232, 200, 0.6);
  background: rgba(0, 0, 0, 0.45);
  box-shadow: 0 0 0 3px rgba(0, 232, 200, 0.15);
}

.anime-row { transition: all 0.15s; }
.anime-row:hover { background: rgba(255, 255, 255, 0.06) !important; }

.tag-chip {
  display: inline-flex;
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  background: rgba(0, 232, 200, 0.12);
  border: 1px solid rgba(0, 232, 200, 0.4);
  color: #00e8c8;
  font-size: 0.72rem;
  font-weight: 700;
}

.save-status { font-size: 0.72rem; opacity: 0.5; font-weight: 700; }
.save-status.saved { color: #00e8c8; opacity: 1; }

/* Markdown 预览 */
.md-preview { color: inherit; font-size: 0.95rem; line-height: 1.85; word-break: break-word; }
.md-preview h1,.md-preview h2,.md-preview h3 { font-weight: 800; margin: 1em 0 0.5em; color: inherit; }
.md-preview h1 { font-size: 1.6em; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 0.3em; }
.md-preview h2 { font-size: 1.35em; }
.md-preview h3 { font-size: 1.15em; }
.md-preview a { color: #00e8c8; text-decoration: underline; }
.md-preview code { background: rgba(0,0,0,0.4); color: #ffd97d; padding: 0.15em 0.45em; border-radius: 4px; }
.md-preview pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1em; overflow-x: auto; }
.md-preview pre code { background: transparent; padding: 0; }
.md-preview blockquote { border-left: 3px solid #00e8c8; padding: 0.5em 1em; background: rgba(0,232,200,0.06); }
.md-preview th,.md-preview td { border: 1px solid rgba(255,255,255,0.15); padding: 0.5em 0.8em; }

/* ===== 立绘：占位，放图 public/admin/character.png ===== */
.sprite-wrap {
  position: fixed;
  right: 40px;
  bottom: 0;
  width: 360px;
  height: 600px;
  z-index: 40;
  pointer-events: none;
  animation: spriteFloat 5s ease-in-out infinite;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
@keyframes spriteFloat {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}
.sprite-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(157,78,255,0.5));
  user-select: none;
  -webkit-user-drag: none;
}
.sprite-glow {
  position: absolute;
  bottom: -10px; left: 50%;
  transform: translateX(-50%);
  width: 220px; height: 30px;
  background: radial-gradient(ellipse, rgba(0,232,200,0.4), transparent 70%);
  filter: blur(12px);
  z-index: -1;
}

/* ===== 对话框 ===== */
.dialogue {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: min(720px, calc(100vw - 320px));
  padding: 20px 28px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 232, 200, 0.4);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 232, 200, 0.2);
  z-index: 100;
}
.dialogue-name {
  position: absolute;
  top: -12px; left: 20px;
  padding: 3px 14px;
  background: linear-gradient(135deg, #9d4eff, #00e8c8);
  color: #fff;
  font-weight: 900;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  border-radius: 999px;
}
.dialogue-text {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  min-height: 1.6em;
}
.dialogue-cursor {
  color: #00e8c8;
  animation: blink 0.8s steps(2) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* 隐藏博客前台挂件（在 admin 页内） */
body:has(.anime-bg) > div > [class*="MusicPlayer"],
body:has(.anime-bg) > div > [class*="ChatWidget"],
body:has(.anime-bg) > div > [class*="CatMascot"],
body:has(.anime-bg) > div > [class*="BackButton"] { display: none !important; }
`);

// ============ layout.tsx ============
w('app/admin/layout.tsx', `import Link from 'next/link';
import './anime.css';

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
    </div>
  );
}`);

// ============ 立绘组件 ============
w('components/admin/CharacterSprite.tsx', `'use client';
import { useState } from 'react';

export default function CharacterSprite() {
  const [err, setErr] = useState(false);
  if (err) return null;
  return (
    <div className="sprite-wrap">
      <img
        src="/admin/character.png"
        alt=""
        className="sprite-img"
        onError={() => setErr(true)}
      />
      <div className="sprite-glow" />
    </div>
  );
}`);

console.log('\\n◆ 后台已改为继承前台风格');
console.log('步骤:');
console.log('  1. 放图到 public/admin/character.png（可选）');
console.log('  2. 想显示立绘，把 <CharacterSprite /> 加到 app/admin/layout.tsx');
console.log('  3. Ctrl+C 停 dev → npm run dev → Ctrl+Shift+R 硬刷新');