import { NextResponse } from 'next/server';
import { trackVisit } from '@/lib/analytics';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { path: pathname, visitorId } = await req.json();
    if (visitorId && pathname) {
      await trackVisit(pathname, visitorId);
    }
  } catch {}
  return NextResponse.json({ ok: true });
}
