// theme-galgame.mjs — Galgame 视觉小说风后台
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
function w(rel, c) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c, 'utf-8');
  console.log('OK  ' + rel);
}

// ============ Q 版角色立绘 ============
w('components/admin/CharacterSprite.tsx', `'use client';
export default function CharacterSprite() {
  return (
    <div className="sprite-wrap">
      <svg viewBox="0 0 200 260" className="sprite-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hairG" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#d78bff" />
            <stop offset="100%" stopColor="#7b3aab" />
          </radialGradient>
          <radialGradient id="faceG" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#fff0e8" />
            <stop offset="100%" stopColor="#ffd9c8" />
          </radialGradient>
        </defs>
        {/* 后发 */}
        <ellipse cx="100" cy="120" rx="82" ry="100" fill="url(#hairG)" />
        <ellipse cx="100" cy="120" rx="82" ry="100" fill="none" stroke="#5a2070" strokeWidth="3" />
        {/* 脸 */}
        <ellipse cx="100" cy="120" rx="58" ry="68" fill="url(#faceG)" stroke="#5a2070" strokeWidth="3" />
        {/* 刘海 */}
        <path d="M 42 92 Q 60 40 100 38 Q 140 40 158 92 Q 140 68 100 68 Q 60 68 42 92 Z" fill="url(#hairG)" stroke="#5a2070" strokeWidth="3" />
        {/* 呆毛 */}
        <path d="M 100 38 Q 105 15 95 8 Q 100 22 100 38 Z" fill="#d78bff" stroke="#5a2070" strokeWidth="2.5" />
        {/* 眼睛 */}
        <ellipse cx="78" cy="128" rx="14" ry="18" fill="#1a0a2a" />
        <ellipse cx="122" cy="128" rx="14" ry="18" fill="#1a0a2a" />
        <ellipse cx="74" cy="122" rx="5" ry="6" fill="#fff" />
        <ellipse cx="118" cy="122" rx="5" ry="6" fill="#fff" />
        <ellipse cx="82" cy="136" rx="3" ry="3" fill="#ff4e9b" />
        <ellipse cx="126" cy="136" rx="3" ry="3" fill="#ff4e9b" />
        {/* 腮红 */}
        <ellipse cx="60" cy="148" rx="11" ry="6" fill="#ff4e9b" opacity="0.6" />
        <ellipse cx="140" cy="148" rx="11" ry="6" fill="#ff4e9b" opacity="0.6" />
        {/* 嘴 */}
        <path d="M 90 158 Q 100 168 110 158" stroke="#5a2070" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* 蝴蝶结 */}
        <g transform="translate(148, 75)">
          <polygon points="0,0 22,-12 22,12" fill="#ff4e9b" stroke="#5a2070" strokeWidth="2.5" />
          <polygon points="22,0 44,-12 44,12" fill="#ff4e9b" stroke="#5a2070" strokeWidth="2.5" />
          <circle cx="22" cy="0" r="5" fill="#fff" stroke="#5a2070" strokeWidth="2" />
        </g>
      </svg>
      <div className="sprite-glow" />
    </div>
  );
}`);

// ============ 对话框 ============
w('components/admin/DialogueBox.tsx', `'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINES: Record<string, string[]> = {
  '/admin/posts/new': ['开始创作吧～我会一直陪着你的！', '加油哦 (๑•̀ㅂ•́)و✧'],
  '/admin/posts': ['这些都是你写的故事呢～', '想再写一篇吗？'],
  '/admin': ['欢迎回来，主人～', '今天也要元气满满哦！', '看到你的博客越来越丰富，我好开心♪'],
};

export default function DialogueBox() {
  const pathname = usePathname() || '/admin';
  const [shown, setShown] = useState('');

  useEffect(() => {
    const key = Object.keys(LINES).find(k => pathname.startsWith(k)) || '/admin';
    const pool = LINES[key];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setShown('');
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(pick.slice(0, i));
      if (i >= pick.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [pathname]);

  return (
    <div className="dialogue">
      <div className="dialogue-name">星辉酱</div>
      <div className="dialogue-text">
        {shown}
        <span className="dialogue-cursor">▍</span>
      </div>
    </div>
  );
}`);

// ============ Galgame 主题 CSS ============
w('app/admin/anime.css', `/* ========= Galgame 视觉小说风 ========= */
:root {
  --neon-pink: #ff4e9b;
  --neon-cyan: #00e8c8;
  --neon-purple: #b14aff;
  --neon-blue: #5b4bff;
  --gold: #ffd97d;
  --bg-0: #0a0a1a;
  --bg-1: #1a1a4a;
  --text: #ffffff;
  --text-dim: rgba(255,255,255,0.7);
  --line: rgba(0,232,200,0.4);
}

.anime-bg {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99999 !important;
  overflow-y: auto !important;
  color: var(--text) !important;
  font-family: "M PLUS Rounded 1c", "Zen Maru Gothic", "PingFang SC", "HarmonyOS Sans", sans-serif;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(177,74,255,0.4), transparent 55%),
    radial-gradient(ellipse at 80% 100%, rgba(0,232,200,0.28), transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(91,75,255,0.2), transparent 70%),
    linear-gradient(180deg, #0a0a1a 0%, #1a1a4a 60%, #0a0a1a 100%);
  background-attachment: fixed;
}

/* 赛博网格 */
.anime-bg::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(0,232,200,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,232,200,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
}

/* 卡片：暗玻璃 + 霓虹描边 */
.glass {
  background: linear-gradient(180deg, rgba(26,26,74,0.75), rgba(10,10,26,0.85));
  border: 2px solid var(--line);
  border-radius: 14px;
  box-shadow:
    0 0 24px rgba(0,232,200,0.15),
    inset 0 0 24px rgba(177,74,255,0.08);
  color: var(--text);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
}
.glass::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-pink), transparent);
  opacity: 0.7;
}

/* 霓虹标题 */
.anime-title {
  display: inline-block;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #fff;
  text-shadow:
    0 0 8px var(--neon-cyan),
    0 0 16px rgba(0,232,200,0.6),
    0 0 24px var(--neon-purple);
  position: relative;
}
.anime-title::before { content: "◆ "; color: var(--neon-pink); font-size: 0.7em; vertical-align: middle; }
.anime-title::after  { content: " ◆"; color: var(--neon-cyan); font-size: 0.7em; vertical-align: middle; }

/* 霓虹按钮 */
.anime-btn {
  display: inline-block;
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  border: 2px solid var(--neon-cyan);
  background: linear-gradient(180deg, rgba(0,232,200,0.15), rgba(91,75,255,0.2));
  color: var(--neon-cyan);
  font-weight: 800;
  font-family: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
  text-shadow: 0 0 8px rgba(0,232,200,0.6);
  box-shadow: 0 0 12px rgba(0,232,200,0.3), inset 0 0 8px rgba(0,232,200,0.1);
}
.anime-btn:hover {
  background: linear-gradient(180deg, rgba(0,232,200,0.3), rgba(91,75,255,0.3));
  box-shadow: 0 0 24px rgba(0,232,200,0.6), inset 0 0 12px rgba(0,232,200,0.2);
  transform: translateY(-2px);
}
.anime-btn:active { transform: translateY(0); }
.anime-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.anime-btn-ghost {
  display: inline-block;
  padding: 0.5rem 1.3rem;
  border-radius: 8px;
  border: 2px solid var(--neon-pink);
  background: rgba(255,78,155,0.08);
  color: var(--neon-pink);
  font-weight: 800;
  font-family: inherit;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
  text-shadow: 0 0 8px rgba(255,78,155,0.6);
  box-shadow: 0 0 12px rgba(255,78,155,0.25);
}
.anime-btn-ghost:hover {
  background: rgba(255,78,155,0.2);
  box-shadow: 0 0 20px rgba(255,78,155,0.5);
}

.anime-btn-danger {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: 2px solid #ff4e5b;
  background: rgba(255,78,91,0.1);
  color: #ff8a9b;
  font-weight: 800;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  text-shadow: 0 0 8px rgba(255,78,91,0.5);
}
.anime-btn-danger:hover { background: rgba(255,78,91,0.25); box-shadow: 0 0 16px rgba(255,78,91,0.5); }

/* 输入框 */
.anime-input {
  width: 100%;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  background: rgba(10,10,26,0.7);
  border: 2px solid rgba(0,232,200,0.3);
  outline: none;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.15s;
}
.anime-input::placeholder { color: rgba(255,255,255,0.35); }
.anime-input:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 0 3px rgba(0,232,200,0.15), 0 0 20px rgba(0,232,200,0.3);
  background: rgba(10,10,26,0.9);
}

/* 侧边栏 */
.anime-sidebar {
  background: linear-gradient(180deg, rgba(26,26,74,0.9), rgba(10,10,26,0.95));
  border-right: 2px solid rgba(0,232,200,0.25);
  box-shadow: 4px 0 30px rgba(0,232,200,0.15);
}
.anime-sidebar a {
  color: var(--text-dim) !important;
  border-radius: 8px;
  transition: all 0.15s;
  font-weight: 700;
  letter-spacing: 0.03em;
  border: 2px solid transparent;
}
.anime-sidebar a:hover {
  color: var(--neon-cyan) !important;
  background: rgba(0,232,200,0.08) !important;
  border-color: rgba(0,232,200,0.4);
  text-shadow: 0 0 8px rgba(0,232,200,0.5);
  box-shadow: inset 3px 0 0 var(--neon-cyan);
}

.anime-row { transition: all 0.15s; }
.anime-row:hover {
  background: linear-gradient(90deg, rgba(0,232,200,0.06), rgba(255,78,155,0.06)) !important;
}

/* 角色立绘 */
.sprite-wrap {
  position: fixed;
  right: 20px;
  bottom: 130px;
  width: 220px;
  height: 280px;
  z-index: 50;
  pointer-events: none;
  animation: spriteFloat 3.5s ease-in-out infinite;
}
@keyframes spriteFloat {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}
.sprite-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(177,74,255,0.6)) drop-shadow(0 0 40px rgba(0,232,200,0.4));
}
.sprite-glow {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0,232,200,0.6), transparent 70%);
  filter: blur(8px);
}

/* 对话框 */
.dialogue {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: min(720px, calc(100vw - 320px));
  padding: 20px 28px 22px;
  background: linear-gradient(180deg, rgba(10,10,26,0.92), rgba(26,26,74,0.92));
  border: 2px solid var(--neon-cyan);
  border-radius: 14px;
  box-shadow:
    0 0 24px rgba(0,232,200,0.4),
    inset 0 0 24px rgba(177,74,255,0.15);
  z-index: 100;
  backdrop-filter: blur(12px);
}
.dialogue::before {
  content: "";
  position: absolute;
  top: -8px; left: 24px;
  width: 0; height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 8px solid var(--neon-cyan);
}
.dialogue-name {
  position: absolute;
  top: -16px; left: 20px;
  padding: 4px 16px;
  background: linear-gradient(180deg, var(--neon-pink), var(--neon-purple));
  color: #fff;
  font-weight: 900;
  font-size: 0.85rem;
  border-radius: 8px;
  border: 2px solid #fff;
  box-shadow: 0 0 16px rgba(255,78,155,0.7);
  letter-spacing: 0.08em;
}
.dialogue-text {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.6;
  min-height: 1.6em;
  letter-spacing: 0.03em;
  text-shadow: 0 0 8px rgba(0,232,200,0.4);
}
.dialogue-cursor {
  color: var(--neon-cyan);
  animation: blink 0.8s steps(2) infinite;
  margin-left: 4px;
}
@keyframes blink { 50% { opacity: 0; } }

/* 标签芯片 */
.tag-chip {
  display: inline-flex;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  background: rgba(0,232,200,0.1);
  border: 1.5px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-shadow: 0 0 6px rgba(0,232,200,0.5);
  transition: all 0.15s;
}
.tag-chip:hover {
  background: rgba(0,232,200,0.25);
  box-shadow: 0 0 12px rgba(0,232,200,0.6);
}

.save-status { font-size: 0.72rem; color: var(--text-dim); font-weight: 700; }
.save-status.saved { color: var(--neon-cyan); text-shadow: 0 0 8px rgba(0,232,200,0.6); }

/* Markdown 预览 */
.md-preview { color: var(--text); font-size: 0.95rem; line-height: 1.85; word-break: break-word; }
.md-preview h1,.md-preview h2,.md-preview h3 { color: var(--neon-cyan); font-weight: 800; margin: 1em 0 0.5em; text-shadow: 0 0 12px rgba(0,232,200,0.5); }
.md-preview h1 { font-size: 1.6em; border-bottom: 1px solid rgba(0,232,200,0.3); padding-bottom: 0.3em; }
.md-preview h2 { font-size: 1.35em; }
.md-preview h3 { font-size: 1.15em; }
.md-preview a { color: var(--neon-pink); text-decoration: underline; text-decoration-style: wavy; }
.md-preview code { background: rgba(0,232,200,0.12); color: var(--gold); padding: 0.15em 0.45em; border-radius: 6px; border: 1px solid rgba(0,232,200,0.3); }
.md-preview pre { background: rgba(10,10,26,0.9); border: 1px solid var(--line); border-radius: 10px; padding: 1em; overflow-x: auto; }
.md-preview pre code { background: transparent; border: none; padding: 0; }
.md-preview blockquote { border-left: 4px solid var(--neon-pink); padding: 0.6em 1em; background: rgba(255,78,155,0.08); border-radius: 0 10px 10px 0; color: var(--text-dim); }
.md-preview th,.md-preview td { border: 1px solid var(--line); padding: 0.5em 0.8em; }
.md-preview th { background: rgba(0,232,200,0.1); color: var(--neon-cyan); }

/* 隐藏博客挂件 */
body:has(.anime-bg) > div > [class*="MusicPlayer"],
body:has(.anime-bg) > div > [class*="ChatWidget"],
body:has(.anime-bg) > div > [class*="CatMascot"],
body:has(.anime-bg) > div > [class*="BackButton"] { display: none !important; }
`);

// ============ layout ============
w('app/admin/layout.tsx', `import Link from 'next/link';
import './anime.css';
import CharacterSprite from '@/components/admin/CharacterSprite';
import DialogueBox from '@/components/admin/DialogueBox';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg">
      <div className="admin-shell">
        <aside className="anime-sidebar admin-sidebar">
          <div className="admin-brand">
            <div className="admin-logo">XH</div>
            <div>
              <div className="admin-title">星辉小屋</div>
              <div className="admin-sub">STELLAR CONSOLE</div>
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
          <p className="admin-copy">v2.0 · Galgame Edition</p>
        </aside>
        <main className="admin-main">{children}</main>
      </div>

      <CharacterSprite />
      <DialogueBox />
    </div>
  );
}`);

// ============ 布局 CSS ============
w('app/admin/layout.css', `.admin-shell { display:flex; min-height:100vh; position:relative; z-index:10; padding-bottom:140px; }
.admin-sidebar { width:240px; flex-shrink:0; padding:1.25rem; display:flex; flex-direction:column; }
.admin-brand { display:flex; align-items:center; gap:12px; margin-bottom:2rem; }
.admin-logo { width:52px; height:52px; border-radius:12px; display:grid; place-items:center; font-weight:900; font-size:1.1rem; color:#0a0a1a; background:linear-gradient(135deg,#00e8c8,#b14aff); border:2px solid #fff; box-shadow:0 0 20px rgba(0,232,200,0.6); }
.admin-title { font-weight:900; font-size:1.05rem; color:#fff; text-shadow:0 0 12px rgba(0,232,200,0.6); letter-spacing:0.05em; }
.admin-sub { font-size:0.65rem; color:rgba(0,232,200,0.7); font-weight:700; letter-spacing:0.15em; margin-top:2px; }
.admin-nav { flex:1; display:flex; flex-direction:column; gap:6px; }
.admin-nav a { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; font-weight:700; font-size:0.875rem; }
.admin-logout { margin-top:1rem; }
.admin-logout button { width:100%; text-align:left; padding:10px 14px; border-radius:8px; font-weight:700; font-size:0.875rem; color:rgba(255,255,255,0.7); background:transparent; border:2px solid transparent; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:10px; transition:all 0.15s; }
.admin-logout button:hover { color:#ff8a9b; border-color:rgba(255,78,91,0.4); background:rgba(255,78,91,0.08); text-shadow:0 0 8px rgba(255,78,91,0.5); }
.admin-copy { font-size:10px; color:rgba(0,232,200,0.5); text-align:center; margin-top:1rem; font-weight:700; letter-spacing:0.1em; }
.admin-main { flex:1; padding:2rem; overflow-y:auto; position:relative; z-index:10; }`);

console.log('\\n🎮 Galgame 风已部署！');
console.log('下一步: 1) Ctrl+C 停 dev  2) npm run dev  3) Ctrl+Shift+R 硬刷新');