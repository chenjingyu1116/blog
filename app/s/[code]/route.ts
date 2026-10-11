import { NextResponse } from 'next/server';
import { getShortLink, hitShortLink } from '@/lib/shortlinks';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const item = await getShortLink(code);
  if (!item) {
    return new NextResponse('短链不存在', { status: 404 });
  }
  hitShortLink(code).catch(() => {});
  return NextResponse.redirect(item.url, { status: 302 });
}