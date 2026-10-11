// theme-kawaii.mjs — 二次元少女风（樱花粉 + 粉紫 + 天蓝）
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
function w(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  console.log('OK  ' + rel);
}

// ==================== 1. 二次元主题 CSS ====================
w('app/admin/anime.css', `/* ===== 二次元少女风 ===== */
:root {
  --sakura: #ffb7d5;
  --sakura-deep: #ff7eb3;
  --peach: #ffc9d8;
  --sky: #a8d8ff;
  --sky-deep: #7dd3fc;
  --lavender: #c4b5fd;
  --lavender-deep: #a78bfa;
  --cream: #fff5f8;
  --ink: #6b3b5c;
  --ink-dim: rgba(107, 59, 92, 0.7);
  --ink-faint: rgba(107, 59, 92, 0.45);
  --paper: rgba(255, 255, 255, 0.75);
  --paper-solid: rgba(255, 255, 255, 0.92);
}

.anime-bg {
  position: relative;
  min-height: 100vh;
  color: var(--ink) !important;
  font-family: 'Noto Sans SC', 'PingFang SC', 'HarmonyOS Sans', -apple-system, sans-serif;
  background:
    radial-gradient(circle at 10% 10%, rgba(255,183,213,0.7), transparent 40%),
    radial-gradient(circle at 90% 15%, rgba(196,181,253,0.6), transparent 45%),
    radial-gradient(circle at 20% 85%, rgba(168,216,255,0.6), transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(255,201,216,0.5), transparent 45%),
    linear-gradient(135deg, #fff0f5 0%, #f5e8ff 50%, #e8f4ff 100%);
  overflow-x: hidden;
}

/* 星星点点 */
.anime-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(2px 2px at 60% 70%, #fff, transparent),
    radial-gradient(2px 2px at 40% 80%, #fff, transparent),
    radial-gradient(2px 2px at 80% 40%, #fff, transparent),
    radial-gradient(1px 1px at 15% 50%, #fff, transparent),
    radial-gradient(1px 1px at 90% 20%, #fff, transparent);
  opacity: 0.8;
  animation: twinkle 4s ease-in-out infinite alternate;
}
@keyframes twinkle { from { opacity: 0.4; } to { opacity: 1; } }

.glass {
  background: var(--paper);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 8px 32px rgba(255, 126, 179, 0.18),
    0 2px 8px rgba(167, 139, 250, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  color: var(--ink);
  border-radius: 24px;
}

.anime-title {
  font-weight: 800;
  color: var(--ink);
  display: inline-block;
  position: relative;
  letter-spacing: 0.02em;
}
.anime-title::before {
  content: '🌸';
  margin-right: 10px;
  display: inline-block;
  animation: sway 3s ease-in-out infinite;
}
.anime-title::after {
  content: '✨';
  margin-left: 10px;
  display: inline-block;
  animation: sparkle 2s ease-in-out infinite;
}
@keyframes sparkle {
  0%,100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50%     { transform: scale(1.3) rotate(20deg); opacity: 0.7; }
}
@keyframes sway {
  0%,100% { transform: rotate(-8deg); }
  50%     { transform: rotate(8deg); }
}

.anime-btn {
  border-radius: 9999px;
  padding: 0.6rem 1.5rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ff9ec4 0%, #a78bfa 100%);
  box-shadow: 0 6px 18px rgba(255, 126, 179, 0.45), inset 0 -2px 0 rgba(0,0,0,0.08);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  cursor: pointer;
  letter-spacing: 0.02em;
}
.anime-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 26px rgba(255, 126, 179, 0.6), inset 0 -2px 0 rgba(0,0,0,0.08);
}
.anime-btn:active { transform: translateY(-1px) scale(1.02); }
.anime-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.anime-btn-ghost {
  border-radius: 9999px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  color: var(--sakura-deep);
  background: rgba(255, 183, 213, 0.2);
  border: 2px dashed var(--sakura-deep);
  cursor: pointer;
  transition: all 0.2s;
}
.anime-btn-ghost:hover {
  background: rgba(255, 183, 213, 0.35);
  border-style: solid;
  transform: translateY(-2px);
}

.anime-btn-danger {
  border-radius: 9999px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #ff8a9b, #ff4757);
  box-shadow: 0 6px 18px rgba(255, 71, 87, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.anime-btn-danger:hover { transform: translateY(-2px) scale(1.03); }

.anime-input {
  width: 100%;
  border-radius: 18px;
  padding: 0.75rem 1.1rem;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid rgba(255, 183, 213, 0.5);
  outline: none;
  color: var(--ink);
  transition: all 0.2s;
  font-family: inherit;
  font-size: 0.95rem;
}
.anime-input::placeholder { color: var(--ink-faint); }
.anime-input:focus {
  border-color: var(--sakura-deep);
  box-shadow: 0 0 0 5px rgba(255, 183, 213, 0.3);
  background: rgba(255, 255, 255, 0.95);
}

.anime-sidebar {
  background:
    linear-gradient(180deg, rgba(255, 183, 213, 0.92), rgba(196, 181, 253, 0.92), rgba(168, 216, 255, 0.92));
  backdrop-filter: blur(20px);
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 4px 0 40px rgba(255, 126, 179, 0.2);
  position: relative;
}
.anime-sidebar a {
  color: #fff !important;
  border-radius: 14px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(107, 59, 92, 0.25);
}
.anime-sidebar a:hover {
  background: rgba(255, 255, 255, 0.35) !important;
  transform: translateX(6px) scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
}

.anime-row { transition: all 0.2s; }
.anime-row:hover {
  background: rgba(255, 183, 213, 0.18) !important;
  transform: scale(1.005);
}

/* 樱花 */
.sakura-petal {
  position: fixed;
  top: -40px;
  background: radial-gradient(circle at 30% 30%, #ffe0ec, #ff9ec4 60%, #ff7eb3);
  border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
  pointer-events: none;
  z-index: 1;
  animation-name: petalFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  box-shadow: 0 2px 8px rgba(255, 126, 179, 0.4);
}
@keyframes petalFall {
  0%   { transform: translate3d(0,-40px,0) rotate(0deg); }
  50%  { transform: translate3d(60px,50vh,0) rotate(180deg); }
  100% { transform: translate3d(-40px,105vh,0) rotate(360deg); }
}

/* 爱心气泡 */
.heart-bubble {
  position: fixed;
  bottom: -30px;
  font-size: 20px;
  pointer-events: none;
  z-index: 1;
  animation: floatUp linear infinite;
  opacity: 0.7;
}
@keyframes floatUp {
  0%   { transform: translateY(0) scale(0.6); opacity: 0; }
  20%  { opacity: 0.8; }
  100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
}

/* 猫爪加载 */
.cat-paw { position: relative; width: 80px; height: 80px; animation: pawBounce 1.2s ease-in-out infinite; filter: drop-shadow(0 6px 12px rgba(255, 126, 179, 0.5)); }
.cat-paw .pad { position:absolute; left:50%; bottom:6px; transform:translateX(-50%); width:56px; height:44px; background: linear-gradient(135deg, #ffd1e3, #ff7eb3); border-radius:50% 50% 55% 55% / 55% 55% 45% 45%; }
.cat-paw .toe { position:absolute; width:18px; height:18px; background: linear-gradient(135deg, #ffd1e3, #ff9ec4); border-radius:50%; }
.cat-paw .t1 { top:6px; left:4px; }
.cat-paw .t2 { top:-2px; left:22px; }
.cat-paw .t3 { top:-2px; left:40px; }
.cat-paw .t4 { top:6px; left:58px; }
@keyframes pawBounce {
  0%,100% { transform: translateY(0) scale(1); }
  50%     { transform: translateY(-12px) scale(1.08); }
}

.float-avatar { animation: floatY 3s ease-in-out infinite; }
@keyframes floatY { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }

/* Markdown 预览 */
.md-preview {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.85;
  word-break: break-word;
}
.md-preview h1, .md-preview h2, .md-preview h3 {
  color: var(--sakura-deep);
  margin: 1.2em 0 0.6em;
  font-weight: 800;
}
.md-preview h1 { font-size: 1.6em; border-bottom: 2px dashed rgba(255, 126, 179, 0.4); padding-bottom: 0.3em; }
.md-preview h2 { font-size: 1.35em; }
.md-preview h3 { font-size: 1.15em; }
.md-preview p { margin: 0.8em 0; }
.md-preview a { color: var(--lavender-deep); text-decoration: underline; text-decoration-style: wavy; }
.md-preview code {
  background: rgba(255, 183, 213, 0.25);
  color: #c9266a;
  padding: 0.15em 0.45em;
  border-radius: 8px;
  font-size: 0.9em;
  font-family: 'JetBrains Mono', Consolas, monospace;
}
.md-preview pre {
  background: rgba(255, 245, 248, 0.9);
  border: 2px dashed rgba(255, 183, 213, 0.5);
  border-radius: 16px;
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
}
.md-preview pre code { background: transparent; padding: 0; color: var(--ink); }
.md-preview blockquote {
  border-left: 4px solid var(--sakura-deep);
  padding: 0.6em 1em;
  margin: 1em 0;
  color: var(--ink-dim);
  background: rgba(255, 183, 213, 0.12);
  border-radius: 12px;
}
.md-preview ul, .md-preview ol { padding-left: 1.6em; margin: 0.8em 0; }
.md-preview li { margin: 0.3em 0; }
.md-preview img { max-width: 100%; border-radius: 14px; margin: 0.5em 0; box-shadow: 0 4px 16px rgba(255,126,179,0.25); }
.md-preview table { border-collapse: collapse; margin: 1em 0; width: 100%; border-radius: 12px; overflow: hidden; }
.md-preview th, .md-preview td { border: 2px solid rgba(255, 183, 213, 0.35); padding: 0.5em 0.8em; text-align: left; }
.md-preview th { background: rgba(255, 183, 213, 0.25); color: var(--sakura-deep); }

/* 标签芯片 */
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.7rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(255,183,213,0.35), rgba(196,181,253,0.35));
  border: 1.5px solid rgba(255, 126, 179, 0.5);
  color: #a3377a;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}
.tag-chip:hover {
  background: linear-gradient(135deg, rgba(255,183,213,0.55), rgba(196,181,253,0.55));
  transform: translateY(-1px);
}

.save-status {
  font-size: 0.75rem;
  color: var(--ink-faint);
  transition: color 0.3s;
}
.save-status.saved { color: #d63f8d; }

/* 卡片小装饰 */
.kawaii-card {
  position: relative;
  overflow: hidden;
}
.kawaii-card::before {
  content: '';
  position: absolute;
  top: -20px; right: -20px;
  width: 80px; height: 80px;
  background: radial-gradient(circle, rgba(255,183,213,0.5), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
`);

// ==================== 2. 樱花雨组件 ====================
w('components/admin/SakuraRain.tsx', `'use client';
import { useEffect, useState } from 'react';

interface Petal { id: number; left: number; size: number; duration: number; delay: number; }

export default function SakuraRain({ count = 18 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);
  useEffect(() => {
    const arr: Petal[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 12 + Math.random() * 14,
      duration: 9 + Math.random() * 8,
      delay: Math.random() * 10,
    }));
    setPetals(arr);
  }, [count]);
  return (
    <>
      {petals.map(p => (
        <div key={p.id} className="sakura-petal" style={{
          left: p.left + '%',
          width: p.size,
          height: p.size,
          animationDuration: p.duration + 's',
          animationDelay: p.delay + 's',
        }} />
      ))}
    </>
  );
}`);

// ==================== 3. 爱心气泡组件 ====================
w('components/admin/HeartBubbles.tsx', `'use client';
import { useEffect, useState } from 'react';

const ICONS = ['💕','✨','🌸','💖','⭐','🎀','💫','🩷'];

interface B { id: number; left: number; icon: string; duration: number; delay: number; size: number; }

export default function HeartBubbles({ count = 8 }: { count?: number }) {
  const [bubbles, setBubbles] = useState<B[]>([]);
  useEffect(() => {
    const arr: B[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 12,
      size: 16 + Math.random() * 14,
    }));
    setBubbles(arr);
  }, [count]);
  return (
    <>
      {bubbles.map(b => (
        <div key={b.id} className="heart-bubble" style={{
          left: b.left + '%',
          fontSize: b.size,
          animationDuration: b.duration + 's',
          animationDelay: b.delay + 's',
        }}>{b.icon}</div>
      ))}
    </>
  );
}`);

// ==================== 4. 后台 layout ====================
w('app/admin/layout.tsx', `import Link from 'next/link';
import './anime.css';
import SakuraRain from '@/components/admin/SakuraRain';
import HeartBubbles from '@/components/admin/HeartBubbles';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg flex min-h-screen">
      <SakuraRain count={20} />
      <HeartBubbles count={10} />

      <aside className="anime-sidebar w-60 p-5 flex flex-col relative z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="float-avatar w-14 h-14 rounded-full grid place-items-center text-3xl"
               style={{ background: 'radial-gradient(circle at 30% 30%, #fff, #ffd1e3)', boxShadow: '0 6px 20px rgba(255,126,179,0.5)' }}>
            🌸
          </div>
          <div>
            <h2 className="text-white text-lg font-extrabold drop-shadow" style={{ textShadow: '0 2px 4px rgba(107,59,92,0.4)' }}>星辉小屋</h2>
            <p className="text-white/85 text-xs font-semibold">Kawaii Admin ♡</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 text-sm">
          <Link className="flex items-center gap-2.5 py-3 px-3.5" href="/admin"><span className="text-lg">🏠</span> 小首页</Link>
          <Link className="flex items-center gap-2.5 py-3 px-3.5" href="/admin/posts"><span className="text-lg">📚</span> 文章管理</Link>
          <Link className="flex items-center gap-2.5 py-3 px-3.5" href="/admin/posts/new"><span className="text-lg">✏️</span> 写新文章</Link>
          <Link className="flex items-center gap-2.5 py-3 px-3.5" href="/" target="_blank"><span className="text-lg">🌐</span> 看看博客 ↗</Link>
        </nav>

        <form action="/api/admin/logout" method="post" className="mt-4">
          <button className="w-full text-left py-3 px-3.5 rounded-2xl text-white font-semibold transition"
                  style={{ textShadow: '0 1px 2px rgba(107,59,92,0.3)' }}
                  onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                  onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            <span className="text-lg">💫</span> 退出登录
          </button>
        </form>
        <p className="text-white/80 text-[10px] text-center mt-4 font-semibold" style={{ textShadow: '0 1px 2px rgba(107,59,92,0.3)' }}>
          ♡ Xinghuisama · 二次元后台 ♡
        </p>
      </aside>

      <main className="flex-1 p-8 overflow-auto relative z-10">{children}</main>
    </div>
  );
}`);

// ==================== 5. 仪表盘 ====================
w('app/admin/page.tsx', `import Link from 'next/link';
import { listPosts } from '@/lib/posts';

export default async function Dashboard() {
  const posts = await listPosts();
  const published = posts.filter(p => p.published).length;
  const drafts = posts.length - published;
  const totalWords = posts.reduce((s, p) => s + (p.content || '').replace(/\\s/g, '').length, 0);
  const latest = posts.slice(0, 5);

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h1 className="anime-title text-3xl">欢迎回来，管理员大人</h1>
        <p className="text-[color:var(--ink-dim)] text-sm mt-1">今天也是元气满满的一天哦～ (｡･ω･｡)ﾉ♡</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat emoji="📖" label="全部文章" value={posts.length} grad="linear-gradient(135deg, rgba(255,183,213,0.55), rgba(255,201,216,0.3))" />
        <Stat emoji="🌸" label="已发布" value={published} grad="linear-gradient(135deg, rgba(255,158,196,0.55), rgba(255,183,213,0.3))" />
        <Stat emoji="🌙" label="草稿箱" value={drafts} grad="linear-gradient(135deg, rgba(196,181,253,0.55), rgba(168,216,255,0.3))" />
        <Stat emoji="💌" label="总字数" value={totalWords} grad="linear-gradient(135deg, rgba(168,216,255,0.55), rgba(196,181,253,0.3))" />
      </div>

      <section className="glass kawaii-card p-6">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h2 className="anime-title text-lg">最近更新</h2>
          <Link href="/admin/posts" className="anime-btn-ghost text-xs">查看全部 ♡</Link>
        </div>
        <ul className="space-y-2 relative z-10">
          {latest.map(p => (
            <li key={p.id} className="anime-row flex items-center justify-between rounded-2xl px-4 py-3 bg-white/50">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg">{p.published ? '🌸' : '🌙'}</span>
                <span className="truncate font-semibold">{p.title}</span>
                <div className="flex gap-1">
                  {(p.tags || []).slice(0, 2).map((t, i) => <span key={i} className="tag-chip">#{t}</span>)}
                </div>
              </div>
              <span className="text-xs opacity-60 shrink-0">{new Date(p.updatedAt).toLocaleDateString()}</span>
            </li>
          ))}
          {latest.length === 0 && <li className="text-center opacity-60 py-6">还没有文章，去写第一篇吧～ ✍️</li>}
        </ul>
      </section>
    </div>
  );
}

function Stat({ emoji, label, value, grad }: { emoji: string; label: string; value: number; grad: string }) {
  return (
    <div className="glass kawaii-card p-5 transition-transform hover:scale-105" style={{ background: grad }}>
      <div className="text-3xl mb-2 relative z-10">{emoji}</div>
      <div className="text-xs text-[color:var(--ink-dim)] font-semibold relative z-10">{label}</div>
      <div className="text-3xl font-extrabold mt-1 text-[color:var(--ink)] relative z-10">{value}</div>
    </div>
  );
}`);

// ==================== 6. 登录页 ====================
w('app/admin/login/page.tsx', `'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../anime.css';
import SakuraRain from '@/components/admin/SakuraRain';
import HeartBubbles from '@/components/admin/HeartBubbles';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json().catch(()=>({})); setErr(d.error || '登录失败'); return; }
    router.replace(params.get('from') || '/admin');
  }

  return (
    <div className="anime-bg fixed inset-0 z-50 grid place-items-center">
      <SakuraRain count={28} />
      <HeartBubbles count={14} />

      <form onSubmit={onSubmit} className="glass rounded-3xl p-8 space-y-5 relative z-10 w-[24rem]">
        <div className="text-center">
          <div className="float-avatar text-6xl mb-3">🌸</div>
          <h1 className="anime-title text-3xl" style={{ display: 'block' }}>星辉小屋</h1>
          <p className="text-xs text-[color:var(--ink-dim)] mt-2 font-semibold">ようこそ！请登录你的账号～</p>
        </div>

        <input className="anime-input" placeholder="👤 用户名" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="anime-input" type="password" placeholder="🔒 密码" value={password} onChange={e=>setPassword(e.target.value)} />

        {err && <p className="text-sm text-red-500 text-center font-semibold">(´；ω；｀) {err}</p>}

        <button disabled={loading} className="anime-btn w-full text-base">
          {loading ? '登录中...' : '✨ 进入后台 ✨'}
        </button>

        <p className="text-center text-[10px] text-[color:var(--ink-faint)] font-semibold">
          ♡ 二次元主题 · 星辉小屋 ♡
        </p>
      </form>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="anime-bg min-h-screen grid place-items-center text-[color:var(--ink)]">加载中...</div>}><LoginForm /></Suspense>;
}`);

console.log('\n🌸 二次元少女风已部署完毕！');
console.log('现在: 1) Ctrl+C 停掉 dev   2) npm run dev   3) Ctrl+Shift+R 硬刷新浏览器');