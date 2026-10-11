import { NextResponse } from 'next/server';
import { listShortLinks, deleteShortLink } from '@/lib/shortlinks';

export const runtime = 'nodejs';

export async function GET() {
  const links = await listShortLinks();
  return NextResponse.json({ links });
}

export async function POST(req: Request) {
  const { action, code } = await req.json();
  if (action === 'delete' && code) {
    await deleteShortLink(code);
    return NextResponse.json({ ok: true, links: await listShortLinks() });
  }
  return NextResponse.json({ error: '参数错误' }, { status: 400 });
}