import { NextResponse } from 'next/server';
import { trackPostView } from '@/lib/analytics';

export const runtime = 'nodejs';

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try { await trackPostView(slug); } catch {}
  return NextResponse.json({ ok: true });
}
