import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), { status: 303 });
  res.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), { status: 303 });
  res.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}