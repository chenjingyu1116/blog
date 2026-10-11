// setup-admin.mjs — 一键生成二次元后台
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
function w(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  console.log('OK  ' + rel);
}

// ---------- lib/auth.ts ----------
w('lib/auth.ts', `import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
export const AUTH_COOKIE = 'xh_admin';
export async function signToken(p: { username: string }) {
  return await new SignJWT(p).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
}
export async function verifyToken(token: string) {
  try { const { payload } = await jwtVerify(token, secret); return payload as { username: string }; }
  catch { return null; }
}`);

// ---------- lib/posts.ts ----------
w('lib/posts.ts', `import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export interface Post {
  id: string; title: string; content: string; excerpt?: string;
  tags?: string[]; cover?: string; published: boolean;
  date: string; updatedAt: string;
}

async function ensureDir() { await fs.mkdir(POSTS_DIR, { recursive: true }); }

function slugify(s: string) {
  const base = s.toLowerCase().replace(/[^a-z0-9\\u4e00-\\u9fa5]+/g, '-').replace(/^-|-$/g, '');
  return (base || 'post') + '-' + Date.now().toString(36);
}

function normalize(data: any, content: string, id: string): Post {
  return {
    id,
    title: String(data.title || ''),
    content,
    excerpt: data.excerpt || data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover || data.image || '',
    published: data.published !== false && data.draft !== true,
    date: data.date ? String(data.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function listPosts(): Promise<Post[]> {
  await ensureDir();
  const files = (await fs.readdir(POSTS_DIR)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  const arr = await Promise.all(files.map(async f => {
    const raw = await fs.readFile(path.join(POSTS_DIR, f), 'utf-8');
    const { data, content } = matter(raw);
    return normalize(data, content, f.replace(/\\.md$/, ''));
  }));
  return arr.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, id + '.md'), 'utf-8');
    const { data, content } = matter(raw);
    return normalize(data, content, id);
  } catch { return null; }
}

export async function savePost(input: Partial<Post> & { title: string; content: string }) {
  await ensureDir();
  const id = input.id || slugify(input.title);
  const exists = input.id ? await getPost(input.id) : null;
  const file = path.join(POSTS_DIR, id + '.md');

  let oldData: any = {};
  if (exists) {
    try { oldData = matter(await fs.readFile(file, 'utf-8')).data || {}; } catch {}
  }

  const fm: any = {
    ...oldData,
    title: input.title,
    date: input.date || oldData.date || new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    tags: input.tags || [],
  };
  if (input.excerpt !== undefined) fm.excerpt = input.excerpt;
  if (input.cover !== undefined) fm.cover = input.cover;
  fm.published = input.published !== false;

  await fs.writeFile(file, matter.stringify(input.content, fm), 'utf-8');
  return id;
}

export async function deletePost(id: string) {
  await fs.unlink(path.join(POSTS_DIR, id + '.md'));
}`);

// ---------- middleware.ts ----------
w('middleware.ts', `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login' || pathname === '/api/admin/login') return NextResponse.next();

  const token = req.cookies.get('xh_admin')?.value;
  const ok = token ? await verifyToken(token) : null;
  if (!ok) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: '未登录' }, { status: 401 });
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };`);

// ---------- api/login ----------
w('app/api/admin/login/route.ts', `import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, AUTH_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const okUser = process.env.ADMIN_USERNAME || 'admin';
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return NextResponse.json({ error: '服务端未配置 ADMIN_PASSWORD_HASH' }, { status: 500 });
  if (username !== okUser || !(await bcrypt.compare(password, hash))) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }
  const token = await signToken({ username });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true, sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, path: '/',
  });
  return res;
}`);

// ---------- api/logout ----------
w('app/api/admin/logout/route.ts', `import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}`);

// ---------- api/posts ----------
w('app/api/admin/posts/route.ts', `import { NextResponse } from 'next/server';
import { listPosts, savePost } from '@/lib/posts';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json(await listPosts()); }
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title?.trim() || !body.content?.trim())
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  const id = await savePost(body);
  return NextResponse.json({ id });
}`);

// ---------- api/posts/[id] ----------
w('app/api/admin/posts/[id]/route.ts', `import { NextResponse } from 'next/server';
import { getPost, savePost, deletePost } from '@/lib/posts';
export const runtime = 'nodejs';
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPost(id);
  if (!p) return NextResponse.json({ error: '不存在' }, { status: 404 });
  return NextResponse.json(p);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const newId = await savePost({ ...body, id });
  return NextResponse.json({ id: newId });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deletePost(id);
  return NextResponse.json({ ok: true });
}`);

// ---------- api/upload ----------
w('app/api/admin/upload/route.ts', `import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
export const runtime = 'nodejs';
const DIR = path.join(process.cwd(), 'public', 'uploads');
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: '未选择文件' }, { status: 400 });
  await fs.mkdir(DIR, { recursive: true });
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  await fs.writeFile(path.join(DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: '/uploads/' + name });
}`);

// ---------- anime.css ----------
w('app/admin/anime.css', `:root {
  --sakura: #ffb7d5;
  --sakura-deep: #ff7eb3;
  --starry: #a78bfa;
  --sky: #7dd3fc;
  --ink: #4c3b6b;
  --paper: rgba(255,255,255,0.72);
}
[data-theme='night'] {
  --sakura: #c084fc;
  --sakura-deep: #a855f7;
  --starry: #818cf8;
  --sky: #38bdf8;
  --ink: #e9d5ff;
  --paper: rgba(30,27,75,0.55);
}
.anime-bg {
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 20%, rgba(255,183,213,0.55), transparent 45%),
    radial-gradient(circle at 85% 15%, rgba(167,139,250,0.45), transparent 50%),
    radial-gradient(circle at 75% 85%, rgba(125,211,252,0.45), transparent 50%),
    linear-gradient(135deg, #fdf2ff 0%, #eef2ff 50%, #f0f9ff 100%);
  position: relative;
}
[data-theme='night'] .anime-bg {
  background:
    radial-gradient(circle at 15% 20%, rgba(168,85,247,0.35), transparent 45%),
    radial-gradient(circle at 85% 15%, rgba(99,102,241,0.35), transparent 50%),
    linear-gradient(135deg, #0b1020 0%, #1e1b4b 50%, #0f172a 100%);
}
.glass {
  background: var(--paper);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1.5px solid rgba(255,255,255,0.85);
  box-shadow: 0 8px 32px rgba(167,139,250,0.18);
}
[data-theme='night'] .glass { border-color: rgba(255,255,255,0.12); }
.anime-title {
  font-weight: 700;
  color: var(--ink);
  display: inline-block;
  position: relative;
}
.anime-title::after {
  content: '✨';
  margin-left: 8px;
  display: inline-block;
  animation: sparkle 2s ease-in-out infinite;
}
@keyframes sparkle {
  0%,100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50%     { transform: scale(1.3) rotate(20deg); opacity: 0.7; }
}
.anime-btn {
  border-radius: 9999px;
  padding: 0.55rem 1.25rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--sakura-deep), var(--starry));
  box-shadow: 0 6px 18px rgba(255,126,179,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.anime-btn:hover { transform: translateY(-2px) scale(1.03); }
.anime-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.anime-btn-ghost {
  border-radius: 9999px;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  color: var(--ink);
  background: rgba(255,255,255,0.6);
  border: 1.5px dashed var(--sakura-deep);
}
.anime-btn-ghost:hover { background: rgba(255,183,213,0.25); border-style: solid; }
.anime-btn-danger {
  border-radius: 9999px;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #ff6b9d, #ff4757);
}
.anime-input {
  width: 100%;
  border-radius: 14px;
  padding: 0.6rem 0.9rem;
  background: rgba(255,255,255,0.75);
  border: 1.5px solid rgba(167,139,250,0.35);
  outline: none;
  color: var(--ink);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.anime-input:focus {
  border-color: var(--sakura-deep);
  box-shadow: 0 0 0 4px rgba(255,183,213,0.3);
}
[data-theme='night'] .anime-input {
  background: rgba(15,23,42,0.6);
  border-color: rgba(168,85,247,0.45);
  color: #e9d5ff;
}
.anime-sidebar {
  background: linear-gradient(180deg, rgba(255,183,213,0.85), rgba(167,139,250,0.85));
  backdrop-filter: blur(14px);
  border-right: 1.5px solid rgba(255,255,255,0.6);
}
[data-theme='night'] .anime-sidebar {
  background: linear-gradient(180deg, rgba(76,29,149,0.85), rgba(30,27,75,0.9));
}
.anime-sidebar a {
  color: #fff;
  border-radius: 12px;
  transition: all 0.2s;
}
.anime-sidebar a:hover { background: rgba(255,255,255,0.25); transform: translateX(4px); }
.anime-row:hover { background: rgba(255,183,213,0.15); }
[data-theme='night'] .anime-row:hover { background: rgba(168,85,247,0.15); }

/* 樱花 */
.sakura-petal {
  position: fixed;
  top: -40px;
  background: radial-gradient(circle at 30% 30%, #ffd1e3, #ff9ec4 60%, #ff7eb3);
  border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
  pointer-events: none;
  z-index: 1;
  animation-name: petalFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes petalFall {
  0%   { transform: translate3d(0,-40px,0) rotate(0deg); }
  50%  { transform: translate3d(40px,50vh,0) rotate(180deg); }
  100% { transform: translate3d(-30px,105vh,0) rotate(360deg); }
}

/* 猫爪加载 */
.cat-paw { position: relative; width: 80px; height: 80px; animation: pawBounce 1.2s ease-in-out infinite; }
.cat-paw .pad { position:absolute; left:50%; bottom:6px; transform:translateX(-50%); width:56px; height:44px; background:linear-gradient(135deg,#ffd1e3,#ff7eb3); border-radius:50% 50% 55% 55% / 55% 55% 45% 45%; }
.cat-paw .toe { position:absolute; width:18px; height:18px; background:linear-gradient(135deg,#ffd1e3,#ff9ec4); border-radius:50%; }
.cat-paw .t1 { top:6px; left:4px; }
.cat-paw .t2 { top:-2px; left:22px; }
.cat-paw .t3 { top:-2px; left:40px; }
.cat-paw .t4 { top:6px; left:58px; }
@keyframes pawBounce {
  0%,100% { transform: translateY(0) scale(1); }
  50%     { transform: translateY(-10px) scale(1.06); }
}

/* 漂浮 */
.float-avatar { animation: floatY 3s ease-in-out infinite; }
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
`);

// ---------- app/admin/layout.tsx ----------
w('app/admin/layout.tsx', `import Link from 'next/link';
import './anime.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg flex min-h-screen">
      <aside className="anime-sidebar w-60 p-5 flex flex-col relative z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="float-avatar w-12 h-12 rounded-full bg-white/90 grid place-items-center text-2xl shadow-lg">🌸</div>
          <div>
            <h2 className="text-white text-lg font-bold drop-shadow">星辉小屋</h2>
            <p className="text-white/70 text-xs">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2 text-sm">
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/admin"><span>🏠</span> 仪表盘</Link>
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/admin/posts"><span>📚</span> 文章管理</Link>
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/admin/posts/new"><span>✏️</span> 写新文章</Link>
          <Link className="flex items-center gap-2 py-2.5 px-3" href="/" target="_blank"><span>🌐</span> 查看博客 ↗</Link>
        </nav>
        <form action="/api/admin/logout" method="post" className="mt-4">
          <button className="w-full text-left py-2.5 px-3 rounded-xl text-white/90 hover:bg-white/25 transition">💫 退出登录</button>
        </form>
        <p className="text-white/60 text-[10px] text-center mt-4">© Xinghuisama · 二次元后台</p>
      </aside>
      <main className="flex-1 p-8 overflow-auto relative z-10">{children}</main>
    </div>
  );
}`);

// ---------- app/admin/page.tsx ----------
w('app/admin/page.tsx', `import Link from 'next/link';
import { listPosts } from '@/lib/posts';

export default async function Dashboard() {
  const posts = await listPosts();
  const published = posts.filter(p => p.published).length;
  const drafts = posts.length - published;
  const latest = posts.slice(0, 5);
  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h1 className="anime-title text-3xl">欢迎回来，管理员大人</h1>
        <p className="opacity-60 text-sm mt-1">今天也是元气满满的一天哦～</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { emoji:'📖', label:'全部文章', value: posts.length, bg:'from-[#ffb7d5]/70 to-[#ff7eb3]/50' },
          { emoji:'🌟', label:'已发布', value: published, bg:'from-[#c4b5fd]/70 to-[#a78bfa]/50' },
          { emoji:'🌙', label:'草稿箱', value: drafts, bg:'from-[#bae6fd]/70 to-[#7dd3fc]/50' },
        ].map((c,i) => (
          <div key={i} className={'glass rounded-3xl p-6 bg-gradient-to-br ' + c.bg}>
            <div className="text-3xl mb-2">{c.emoji}</div>
            <div className="text-xs opacity-70">{c.label}</div>
            <div className="text-4xl font-bold mt-1">{c.value}</div>
          </div>
        ))}
      </div>
      <section className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="anime-title text-lg">最近更新</h2>
          <Link href="/admin/posts" className="anime-btn-ghost text-xs">查看全部</Link>
        </div>
        <ul className="space-y-2">
          {latest.map(p => (
            <li key={p.id} className="anime-row flex items-center justify-between rounded-2xl px-4 py-3 bg-white/50">
              <div className="flex items-center gap-2 min-w-0"><span>{p.published ? '🌸' : '🌙'}</span><span className="truncate">{p.title}</span></div>
              <span className="text-xs opacity-50 shrink-0">{new Date(p.updatedAt).toLocaleDateString()}</span>
            </li>
          ))}
          {latest.length === 0 && <li className="text-center opacity-50 py-6">还没有文章，去写第一篇吧 ✍️</li>}
        </ul>
      </section>
    </div>
  );
}`);

// ---------- app/admin/login/page.tsx ----------
w('app/admin/login/page.tsx', `'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../anime.css';

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
      <Sakura />
      <form onSubmit={onSubmit} className="glass w-[22rem] rounded-3xl p-8 space-y-5 relative z-10">
        <div className="text-center">
          <div className="float-avatar text-5xl mb-2">🌸</div>
          <h1 className="anime-title text-2xl">星辉后台</h1>
          <p className="text-xs opacity-60 mt-1">ようこそ！请登录你的管理员账号</p>
        </div>
        <input className="anime-input" placeholder="用户名" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="anime-input" type="password" placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-500 text-center">💔 {err}</p>}
        <button disabled={loading} className="anime-btn w-full">{loading ? '登录中...' : '✨ 进入后台'}</button>
        <p className="text-center text-[10px] opacity-50">✦ 二次元主题 · 星辉小屋 ✦</p>
      </form>
    </div>
  );
}

function Sakura() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({length:18}).map((_,i)=>(
        <div key={i} className="sakura-petal" style={{
          left: Math.random()*100 + '%',
          width: (12+Math.random()*14) + 'px',
          height: (12+Math.random()*14) + 'px',
          opacity: 0.5 + Math.random()*0.5,
          animationDuration: (8+Math.random()*8) + 's',
          animationDelay: (Math.random()*8) + 's',
        }} />
      ))}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="anime-bg min-h-screen grid place-items-center">加载中...</div>}><LoginForm /></Suspense>;
}`);

// ---------- app/admin/posts/page.tsx ----------
w('app/admin/posts/page.tsx', `import Link from 'next/link';
import { listPosts } from '@/lib/posts';

export default async function PostsPage() {
  const posts = await listPosts();
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <h1 className="anime-title text-3xl">文章管理</h1>
        <Link href="/admin/posts/new" className="anime-btn">＋ 新建文章</Link>
      </div>
      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/40 text-left">
            <tr><th className="p-4">标题</th><th className="p-4 w-28">状态</th><th className="p-4 w-44">更新时间</th><th className="p-4 w-32 text-right">操作</th></tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="anime-row border-t border-white/60">
                <td className="p-4 truncate max-w-xs"><span className="mr-2">{p.published?'🌸':'🌙'}</span>{p.title}</td>
                <td className="p-4">
                  {p.published
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-[#ffb7d5]/60 text-[#7a2e52]">已发布</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-[#c4b5fd]/60">草稿</span>}
                </td>
                <td className="p-4 opacity-60">{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="p-4 text-right"><Link href={'/admin/posts/'+p.id+'/edit'} className="text-[color:var(--sakura-deep)] hover:underline">编辑 →</Link></td>
              </tr>
            ))}
            {posts.length===0 && <tr><td colSpan={4} className="p-10 text-center opacity-50">🌱 空空如也，点右上角开始写作～</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}`);

// ---------- app/admin/posts/new/page.tsx ----------
w('app/admin/posts/new/page.tsx', `import PostEditor from '@/components/admin/PostEditor';
export default function Page() { return <PostEditor />; }`);

// ---------- app/admin/posts/[id]/edit/page.tsx ----------
w('app/admin/posts/[id]/edit/page.tsx', `import { notFound } from 'next/navigation';
import { getPost } from '@/lib/posts';
import PostEditor from '@/components/admin/PostEditor';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <PostEditor id={id} initial={post} />;
}`);

// ---------- components/admin/PostEditor.tsx ----------
w('components/admin/PostEditor.tsx', `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id?: string;
  initial?: { title: string; content: string; excerpt?: string; tags?: string[]; cover?: string; published: boolean; };
}

export default function PostEditor({ id, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [tags, setTags] = useState((initial?.tags || []).join(', '));
  const [cover, setCover] = useState(initial?.cover || '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim() || !content.trim()) { alert('标题和内容不能为空哦～'); return; }
    setSaving(true);
    const body = { title, content, excerpt, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), cover, published };
    const res = await fetch(id ? '/api/admin/posts/' + id : '/api/admin/posts', {
      method: id ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) { const e = await res.json().catch(()=>({})); alert(e.error || '保存失败'); return; }
    router.push('/admin/posts'); router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setCover(data.url);
  }

  async function remove() {
    if (!id) return;
    if (!confirm('确定要删除这篇文章吗？')) return;
    await fetch('/api/admin/posts/' + id, { method: 'DELETE' });
    router.push('/admin/posts'); router.refresh();
  }

  if (saving) return (
    <div className="glass rounded-3xl p-10 max-w-4xl grid place-items-center">
      <div className="cat-paw"><span className="pad"/><span className="toe t1"/><span className="toe t2"/><span className="toe t3"/><span className="toe t4"/></div>
      <p className="mt-4 opacity-70 text-sm">正在保存你的作品...</p>
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <h1 className="anime-title text-3xl">{id ? '编辑文章' : '写新文章'}</h1>
      <div className="glass rounded-3xl p-6 space-y-4">
        <input className="anime-input text-lg" placeholder="给文章起个可爱的标题～" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="anime-input" placeholder="摘要（可选）" value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
        <input className="anime-input" placeholder="标签，用英文逗号分隔" value={tags} onChange={e=>setTags(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="anime-btn-ghost cursor-pointer text-sm">📷 上传封面<input type="file" accept="image/*" onChange={onUpload} hidden /></label>
          {cover && <img src={cover} alt="cover" className="h-16 rounded-xl ring-2 ring-white shadow-md" />}
        </div>
        <textarea className="anime-input font-mono text-sm" rows={18} placeholder="正文（支持 Markdown）" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} className="w-4 h-4" />
            {published ? '🌸 发布' : '🌙 存为草稿'}
          </label>
          <div className="space-x-3">
            {id && <button onClick={remove} className="anime-btn-danger">删除</button>}
            <button onClick={save} className="anime-btn">✨ 保存</button>
          </div>
        </div>
      </div>
    </div>
  );
}`);

console.log('\n所有后台文件已生成完毕！');
console.log('接下来执行: npm run dev  然后访问 http://localhost:3000/admin');