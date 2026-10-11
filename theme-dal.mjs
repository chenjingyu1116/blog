// theme-dal.mjs — 约会大作战 DATE A LIVE 风
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
function w(rel, c) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c, 'utf-8');
  console.log('OK  ' + rel);
}

// ============ 精灵角色立绘 ============
w('components/admin/CharacterSprite.tsx', `'use client';
export default function CharacterSprite() {
  return (
    <div className="sprite-wrap">
      <div className="sprite-hud">
        <span className="hud-corner tl" />
        <span className="hud-corner tr" />
        <span className="hud-corner bl" />
        <span className="hud-corner br" />
        <div className="hud-line h1" />
        <div className="hud-line h2" />
      </div>
      <svg viewBox="0 0 220 300" className="sprite-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hairG" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#c78bff" />
            <stop offset="100%" stopColor="#5a1fa8" />
          </radialGradient>
          <radialGradient id="faceG" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#fff5ee" />
            <stop offset="100%" stopColor="#ffd9c8" />
          </radialGradient>
          <linearGradient id="eyeG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b14aff" />
            <stop offset="100%" stopColor="#5b1fa8" />
          </linearGradient>
        </defs>

        {/* 后发 */}
        <ellipse cx="110" cy="145" rx="92" ry="115" fill="url(#hairG)" />
        <ellipse cx="110" cy="145" rx="92" ry="115" fill="none" stroke="#2a0a5a" strokeWidth="3" />

        {/* 脸 */}
        <ellipse cx="110" cy="145" rx="62" ry="72" fill="url(#faceG)" stroke="#2a0a5a" strokeWidth="3" />

        {/* 刘海 */}
        <path d="M 48 115 Q 65 55 110 52 Q 155 55 172 115 Q 152 82 110 82 Q 68 82 48 115 Z" fill="url(#hairG)" stroke="#2a0a5a" strokeWidth="3" />

        {/* 呆毛 */}
        <path d="M 110 52 Q 118 22 105 14 Q 112 32 110 52 Z" fill="#c78bff" stroke="#2a0a5a" strokeWidth="2.5" />

        {/* 眼睛 - 精灵风大眼 */}
        <ellipse cx="85" cy="152" rx="16" ry="21" fill="#fff" stroke="#2a0a5a" strokeWidth="2.5" />
        <ellipse cx="135" cy="152" rx="16" ry="21" fill="#fff" stroke="#2a0a5a" strokeWidth="2.5" />
        <ellipse cx="85" cy="154" rx="12" ry="17" fill="url(#eyeG)" />
        <ellipse cx="135" cy="154" rx="12" ry="17" fill="url(#eyeG)" />
        <ellipse cx="81" cy="148" rx="5" ry="6" fill="#fff" />
        <ellipse cx="131" cy="148" rx="5" ry="6" fill="#fff" />
        <ellipse cx="89" cy="162" rx="3" ry="3" fill="#ff4e9b" />
        <ellipse cx="139" cy="162" rx="3" ry="3" fill="#ff4e9b" />

        {/* 腮红 */}
        <ellipse cx="68" cy="175" rx="12" ry="6" fill="#ff4e9b" opacity="0.55" />
        <ellipse cx="152" cy="175" rx="12" ry="6" fill="#ff4e9b" opacity="0.55" />

        {/* 嘴 */}
        <path d="M 100 185 Q 110 195 120 185" stroke="#2a0a5a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* 精灵水晶发饰 */}
        <g transform="translate(168, 100)">
          <polygon points="0,0 12,-8 24,0 12,8" fill="#00e8c8" stroke="#2a0a5a" strokeWidth="2.5" />
          <polygon points="12,0 18,-4 24,0 18,4" fill="#fff" opacity="0.6" />
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
  '/admin/posts/new': ['开始创作吧，我会一直守护你的。', '让这段故事，成为我们的羁绊。'],
  '/admin/posts': ['这些都是你写下的记忆呢。', '再写一篇新的故事吧？'],
  '/admin': ['欢迎回来，指挥官。', '今天也和精灵们一起努力吧。', '我们的故事，还在继续。'],
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
    }, 60);
    return () => clearInterval(t);
  }, [pathname]);

  return (
    <div className="dialogue">
      <div className="dialogue-name">
        <span className="dialogue-pip" />
        TOHKA · 十香
      </div>
      <div className="dialogue-text">
        {shown}
        <span className="dialogue-cursor">▍</span>
      </div>
      <div className="dialogue-tag">RATATOSKR // SECURE CHANNEL</div>
    </div>
  );
}`);

// ============ 主题 CSS ============
w('app/admin/anime.css', `/* ===== DATE A LIVE Theme ===== */
:root {
  --dal-navy: #0a0e2e;
  --dal-deep: #050819;
  --dal-mid: #141b4a;
  --dal-purple: #9d4eff;
  --dal-purple-dark: #5a1fa8;
  --dal-cyan: #00e8c8;
  --dal-pink: #ff4e9b;
  --dal-gold: #ffd97d;
  --dal-white: #ffffff;
  --dal-text: #e0e8ff;
  --dal-text-dim: rgba(224,232,255,0.65);
  --dal-text-faint: rgba(224,232,255,0.35);
  --dal-line: rgba(157,78,255,0.4);
}

.anime-bg {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99999 !important;
  overflow-y: auto !important;
  color: var(--dal-text) !important;
  font-family: "Zen Maru Gothic", "M PLUS Rounded 1c", "PingFang SC", "HarmonyOS Sans", sans-serif;
  background:
    radial-gradient(ellipse at 15% 10%, rgba(157,78,255,0.35), transparent 55%),
    radial-gradient(ellipse at 85% 90%, rgba(0,232,200,0.22), transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(90,31,168,0.18), transparent 70%),
    linear-gradient(160deg, #050819 0%, #0a0e2e 45%, #141b4a 100%);
  background-attachment: fixed;
}

.anime-bg::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(157,78,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,232,200,0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 80%);
}

.anime-bg::after {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0 3px,
    rgba(157,78,255,0.015) 3px 4px
  );
}

.glass {
  background: linear-gradient(180deg, rgba(20,27,74,0.75), rgba(5,8,25,0.9));
  border: 1.5px solid var(--dal-line);
  border-radius: 4px;
  color: var(--dal-text);
  backdrop-filter: blur(14px);
  position: relative;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  box-shadow:
    0 0 24px rgba(157,78,255,0.12),
    inset 0 0 32px rgba(157,78,255,0.05);
}
.glass::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--dal-purple), var(--dal-cyan), transparent);
  opacity: 0.8;
}

.anime-title {
  display: inline-block;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #fff;
  text-transform: uppercase;
  text-shadow:
    0 0 8px var(--dal-purple),
    0 0 18px rgba(157,78,255,0.7),
    0 0 32px rgba(0,232,200,0.4);
  position: relative;
  padding-left: 24px;
}
.anime-title::before {
  content: "";
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 14px; height: 14px;
  background: var(--dal-cyan);
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  box-shadow: 0 0 12px var(--dal-cyan);
  animation: spin 4s linear infinite;
}
@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }

.anime-btn {
  display: inline-block;
  padding: 0.65rem 1.7rem;
  border-radius: 2px;
  border: 1.5px solid var(--dal-cyan);
  background: linear-gradient(180deg, rgba(0,232,200,0.12), rgba(157,78,255,0.15));
  color: var(--dal-cyan);
  font-weight: 800;
  font-family: inherit;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  text-shadow: 0 0 8px rgba(0,232,200,0.7);
  box-shadow: 0 0 14px rgba(0,232,200,0.25), inset 0 0 8px rgba(0,232,200,0.1);
  position: relative;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}
.anime-btn:hover {
  background: linear-gradient(180deg, rgba(0,232,200,0.28), rgba(157,78,255,0.28));
  box-shadow: 0 0 28px rgba(0,232,200,0.6), inset 0 0 14px rgba(0,232,200,0.2);
}
.anime-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.anime-btn-ghost {
  display: inline-block;
  padding: 0.5rem 1.3rem;
  border-radius: 2px;
  border: 1.5px solid var(--dal-pink);
  background: rgba(255,78,155,0.08);
  color: var(--dal-pink);
  font-weight: 800;
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  text-shadow: 0 0 8px rgba(255,78,155,0.7);
  box-shadow: 0 0 12px rgba(255,78,155,0.25);
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
}
.anime-btn-ghost:hover {
  background: rgba(255,78,155,0.2);
  box-shadow: 0 0 22px rgba(255,78,155,0.6);
}

.anime-btn-danger {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 2px;
  border: 1.5px solid #ff4e5b;
  background: rgba(255,78,91,0.1);
  color: #ff8a9b;
  font-weight: 800;
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  text-shadow: 0 0 8px rgba(255,78,91,0.6);
}
.anime-btn-danger:hover { background: rgba(255,78,91,0.25); box-shadow: 0 0 18px rgba(255,78,91,0.5); }

.anime-input {
  width: 100%;
  border-radius: 2px;
  padding: 0.75rem 1rem;
  background: rgba(5,8,25,0.8);
  border: 1.5px solid rgba(157,78,255,0.35);
  outline: none;
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: all 0.15s;
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
}
.anime-input::placeholder { color: var(--dal-text-faint); letter-spacing: 0.05em; }
.anime-input:focus {
  border-color: var(--dal-cyan);
  box-shadow: 0 0 0 2px rgba(0,232,200,0.15), 0 0 20px rgba(0,232,200,0.35);
  background: rgba(5,8,25,0.95);
}

.anime-sidebar {
  background: linear-gradient(180deg, rgba(20,27,74,0.85), rgba(5,8,25,0.95));
  border-right: 1.5px solid rgba(157,78,255,0.3);
  box-shadow: 4px 0 40px rgba(157,78,255,0.15);
  position: relative;
}
.anime-sidebar::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--dal-cyan), transparent);
  opacity: 0.5;
}
.anime-sidebar a {
  color: var(--dal-text-dim) !important;
  border-radius: 2px;
  transition: all 0.15s;
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  border: 1.5px solid transparent;
  position: relative;
}
.anime-sidebar a:hover {
  color: var(--dal-cyan) !important;
  background: rgba(0,232,200,0.06) !important;
  border-color: rgba(0,232,200,0.4);
  text-shadow: 0 0 10px rgba(0,232,200,0.7);
  box-shadow: inset 3px 0 0 var(--dal-cyan), 0 0 16px rgba(0,232,200,0.15);
}

.anime-row { transition: all 0.15s; }
.anime-row:hover {
  background: linear-gradient(90deg, rgba(157,78,255,0.08), rgba(0,232,200,0.06)) !important;
}

.sprite-wrap {
  position: fixed;
  right: 20px;
  bottom: 160px;
  width: 230px;
  height: 300px;
  z-index: 50;
  pointer-events: none;
  animation: spriteFloat 4s ease-in-out infinite;
}
@keyframes spriteFloat {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-12px); }
}
.sprite-svg {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 22px rgba(157,78,255,0.7)) drop-shadow(0 0 44px rgba(0,232,200,0.35));
}
.sprite-glow {
  position: absolute;
  bottom: -6px; left: 50%;
  transform: translateX(-50%);
  width: 180px; height: 26px;
  background: radial-gradient(ellipse, rgba(0,232,200,0.55), transparent 70%);
  filter: blur(10px);
  z-index: 1;
}
.sprite-hud {
  position: absolute;
  inset: -10px;
  z-index: 3;
  pointer-events: none;
}
.hud-corner {
  position: absolute;
  width: 18px; height: 18px;
  border: 2px solid var(--dal-cyan);
  filter: drop-shadow(0 0 6px rgba(0,232,200,0.8));
}
.hud-corner.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.hud-corner.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.hud-corner.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.hud-corner.br { bottom: 0; right: 0; border-left: none; border-top: none; }
.hud-line {
  position: absolute;
  background: var(--dal-purple);
  filter: drop-shadow(0 0 4px rgba(157,78,255,0.8));
}
.hud-line.h1 { top: 4px; left: 24px; width: 60px; height: 1.5px; }
.hud-line.h2 { bottom: 4px; right: 24px; width: 40px; height: 1.5px; }

.dialogue {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: min(760px, calc(100vw - 340px));
  padding: 22px 32px 24px;
  background: linear-gradient(180deg, rgba(5,8,25,0.94), rgba(20,27,74,0.94));
  border: 1.5px solid var(--dal-cyan);
  border-radius: 4px;
  box-shadow:
    0 0 32px rgba(0,232,200,0.35),
    inset 0 0 32px rgba(157,78,255,0.12);
  z-index: 100;
  backdrop-filter: blur(16px);
  clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
}
.dialogue-name {
  position: absolute;
  top: -14px; left: 24px;
  padding: 4px 18px;
  background: linear-gradient(180deg, var(--dal-purple), var(--dal-purple-dark));
  color: #fff;
  font-weight: 900;
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  border-radius: 2px;
  border: 1.5px solid #fff;
  box-shadow: 0 0 20px rgba(157,78,255,0.8);
  display: flex;
  align-items: center;
  gap: 8px;
}
.dialogue-pip {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--dal-cyan);
  box-shadow: 0 0 8px var(--dal-cyan);
  animation: pipPulse 1.2s ease-in-out infinite;
}
@keyframes pipPulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
.dialogue-text {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.7;
  min-height: 1.7em;
  letter-spacing: 0.04em;
  text-shadow: 0 0 10px rgba(0,232,200,0.4);
}
.dialogue-cursor {
  color: var(--dal-cyan);
  animation: blink 0.8s steps(2) infinite;
  margin-left: 4px;
}
@keyframes blink { 50% { opacity: 0; } }
.dialogue-tag {
  position: absolute;
  bottom: 6px; right: 24px;
  font-size: 0.6rem;
  color: var(--dal-cyan);
  letter-spacing: 0.25em;
  font-weight: 700;
  opacity: 0.6;
}

.tag-chip {
  display: inline-flex;
  padding: 0.15rem 0.7rem;
  border-radius: 2px;
  background: rgba(157,78,255,0.12);
  border: 1px solid var(--dal-purple);
  color: #c78bff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 0 6px rgba(157,78,255,0.6);
  transition: all 0.15s;
}
.tag-chip:hover {
  background: rgba(157,78,255,0.28);
  box-shadow: 0 0 12px rgba(157,78,255,0.6);
}

.save-status { font-size: 0.72rem; color: var(--dal-text-dim); font-weight: 700; letter-spacing: 0.05em; }
.save-status.saved { color: var(--dal-cyan); text-shadow: 0 0 8px rgba(0,232,200,0.7); }

.md-preview { color: var(--dal-text); font-size: 0.95rem; line-height: 1.85; word-break: break-word; }
.md-preview h1,.md-preview h2,.md-preview h3 { color: var(--dal-cyan); font-weight: 800; margin: 1em 0 0.5em; text-shadow: 0 0 12px rgba(0,232,200,0.5); letter-spacing: 0.04em; }
.md-preview h1 { font-size: 1.6em; border-bottom: 1px solid rgba(0,232,200,0.3); padding-bottom: 0.3em; }
.md-preview h2 { font-size: 1.35em; }
.md-preview h3 { font-size: 1.15em; }
.md-preview a { color: var(--dal-pink); text-decoration: underline; text-decoration-style: wavy; }
.md-preview code { background: rgba(157,78,255,0.15); color: var(--dal-gold); padding: 0.15em 0.45em; border-radius: 3px; border: 1px solid rgba(157,78,255,0.4); }
.md-preview pre { background: rgba(5,8,25,0.9); border: 1px solid var(--dal-line); border-radius: 4px; padding: 1em; overflow-x: auto; }
.md-preview pre code { background: transparent; border: none; padding: 0; }
.md-preview blockquote { border-left: 3px solid var(--dal-pink); padding: 0.6em 1em; background: rgba(255,78,155,0.08); color: var(--dal-text-dim); }
.md-preview th,.md-preview td { border: 1px solid var(--dal-line); padding: 0.5em 0.8em; }
.md-preview th { background: rgba(157,78,255,0.12); color: var(--dal-cyan); }

body:has(.anime-bg) > div > [class*="MusicPlayer"],
body:has(.anime-bg) > div > [class*="ChatWidget"],
body:has(.anime-bg) > div > [class*="CatMascot"],
body:has(.anime-bg) > div > [class*="BackButton"] { display: none !important; }
`);

// ============ layout.tsx ============
w('app/admin/layout.tsx', `import Link from 'next/link';
import './anime.css';
import './layout.css';
import CharacterSprite from '@/components/admin/CharacterSprite';
import DialogueBox from '@/components/admin/DialogueBox';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg">
      <div className="admin-shell">
        <aside className="anime-sidebar admin-sidebar">
          <div className="admin-brand">
            <div className="admin-logo">DAL</div>
            <div>
              <div className="admin-title-text">STELLAR</div>
              <div className="admin-sub">RATATOSKR · CONSOLE</div>
            </div>
          </div>
          <nav className="admin-nav">
            <Link href="/admin"><span className="nav-dot" /> HOME</Link>
            <Link href="/admin/posts"><span className="nav-dot" /> ARCHIVE</Link>
            <Link href="/admin/posts/new"><span className="nav-dot" /> WRITE</Link>
            <Link href="/" target="_blank"><span className="nav-dot" /> BLOG</Link>
          </nav>
          <form action="/api/admin/logout" method="post" className="admin-logout">
            <button type="submit"><span className="nav-dot" /> LOGOUT</button>
          </form>
          <p className="admin-copy">DATE A LIVE · v2.0</p>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
      <CharacterSprite />
      <DialogueBox />
    </div>
  );
}`);

// ============ layout.css ============
w('app/admin/layout.css', `.admin-shell { display:flex; min-height:100vh; position:relative; z-index:10; padding-bottom:150px; }
.admin-sidebar { width:250px; flex-shrink:0; padding:1.25rem; display:flex; flex-direction:column; }
.admin-brand { display:flex; align-items:center; gap:12px; margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid rgba(157,78,255,0.25); }
.admin-logo { width:52px; height:52px; border-radius:2px; display:grid; place-items:center; font-weight:900; font-size:0.95rem; color:#050819; background:linear-gradient(135deg,#00e8c8,#9d4eff); border:2px solid #fff; box-shadow:0 0 22px rgba(0,232,200,0.7); letter-spacing:0.05em; clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px); }
.admin-title-text { font-weight:900; font-size:1.05rem; color:#fff; text-shadow:0 0 12px rgba(157,78,255,0.7); letter-spacing:0.15em; }
.admin-sub { font-size:0.6rem; color:rgba(0,232,200,0.75); font-weight:700; letter-spacing:0.2em; margin-top:3px; }
.admin-nav { flex:1; display:flex; flex-direction:column; gap:6px; }
.admin-nav a { display:flex; align-items:center; gap:12px; padding:11px 14px; font-weight:700; }
.nav-dot { display:inline-block; width:6px; height:6px; background:rgba(0,232,200,0.5); box-shadow:0 0 6px rgba(0,232,200,0.8); transition:all 0.15s; flex-shrink:0; }
.admin-nav a:hover .nav-dot { background:var(--dal-cyan); box-shadow:0 0 12px var(--dal-cyan); transform:scale(1.4); }
.admin-logout { margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(157,78,255,0.2); }
.admin-logout button { width:100%; text-align:left; padding:11px 14px; font-weight:700; font-size:0.82rem; color:rgba(224,232,255,0.6); background:transparent; border:1.5px solid transparent; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:12px; transition:all 0.15s; letter-spacing:0.08em; border-radius:2px; }
.admin-logout button:hover { color:#ff8a9b; border-color:rgba(255,78,91,0.4); background:rgba(255,78,91,0.08); text-shadow:0 0 10px rgba(255,78,91,0.6); }
.admin-logout button:hover .nav-dot { background:#ff4e5b; box-shadow:0 0 12px #ff4e5b; }
.admin-copy { font-size:9px; color:rgba(157,78,255,0.55); text-align:center; margin-top:1rem; font-weight:700; letter-spacing:0.25em; }
.admin-main { flex:1; padding:2rem; overflow-y:auto; position:relative; z-index:10; }`);

console.log('\\n◆ DATE A LIVE 主题已部署');
console.log('下一步: 1) Ctrl+C 停 dev  2) npm run dev  3) Ctrl+Shift+R 硬刷新');