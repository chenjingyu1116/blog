import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, AUTH_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const okUser = (process.env.ADMIN_USERNAME || 'admin').trim();
  const hash = (process.env.ADMIN_PASSWORD_HASH || '').trim();

  console.log('[login] user=', username, 'hashLen=', hash.length, 'tail=', JSON.stringify(hash.slice(-6)));

  if (!hash) {
    return NextResponse.json({ error: '服务端未配置 ADMIN_PASSWORD_HASH' }, { status: 500 });
  }
  if (username !== okUser || !(await bcrypt.compare(password, hash))) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  const token = await signToken({ username });
  console.log('[login] token长度=', token?.length, '前12位=', token?.slice(0, 12));

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  console.log('[login] 已设置 Set-Cookie, token 前12位=', token?.slice(0, 12));
  return res;
}