import { NextResponse } from 'next/server';
import { createShortLink } from '@/lib/shortlinks';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体不是 JSON' }, { status: 400 });
  }

  const { url, code } = body || {};
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: '缺少链接' }, { status: 400 });
  }
  if (url.length > 2000) {
    return NextResponse.json({ error: '链接过长' }, { status: 400 });
  }

  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;
  try {
    new URL(normalized);
  } catch {
    return NextResponse.json({ error: '链接格式不正确' }, { status: 400 });
  }

  try {
    const item = await createShortLink(normalized, code);
    return NextResponse.json({ code: item.code, short: '/s/' + item.code });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '生成失败' }, { status: 400 });
  }
}