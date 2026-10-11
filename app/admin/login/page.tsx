'use client';
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
    setLoading(true);
    setErr('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || '登录失败');
      return;
    }
    router.replace(params.get('from') || '/admin');
  }

  return (
    <div
      className="anime-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        padding: 0,
      }}
    >
      <form
        onSubmit={onSubmit}
        className="glass rounded-3xl p-8 space-y-5"
        style={{ width: '22rem' }}
      >
        <div className="text-center">
          <div
            className="float-avatar"
            style={{
              width: 72, height: 72, margin: '0 auto 12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd9c8, #ffc9d4)',
              display: 'grid', placeItems: 'center',
              fontWeight: 900, fontSize: '1.2rem',
              color: '#3a2e33',
              boxShadow: '0 8px 24px rgba(255,126,179,0.4)',
            }}
          >
            XH
          </div>
          <h1 className="anime-title text-3xl">欢迎回来</h1>
          <p style={{ fontSize: '0.75rem', color: '#8b7c82', marginTop: '0.5rem', fontWeight: 700 }}>
            请输入管理员账号哦 ~ (´･ω･`)
          </p>
        </div>

        <input
          className="anime-input"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="anime-input"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && (
          <p style={{ fontSize: '0.85rem', color: '#e14861', textAlign: 'center', fontWeight: 800 }}>
            ✕ {err}
          </p>
        )}

        <button disabled={loading} className="anime-btn w-full">
          {loading ? '登录中...' : '★ 进入后台 ★'}
        </button>

        <p style={{ fontSize: '10px', color: '#8b7c82', textAlign: 'center', fontWeight: 700 }}>
          (c) XingHuiSama 2025
        </p>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="anime-bg min-h-screen grid place-items-center" style={{ fontWeight: 900 }}>
          加载中...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}