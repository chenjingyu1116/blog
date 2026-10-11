import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
 if (
   pathname === '/admin/login' ||
   pathname === '/api/admin/login' ||
   pathname === '/api/admin/logout'
 ) {
   return NextResponse.next();
 }
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

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };