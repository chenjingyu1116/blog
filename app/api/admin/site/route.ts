import { NextResponse } from 'next/server';
import { getSite, updateSite } from '@/lib/admin-site';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getSite());
}

export async function PUT(req: Request) {
  const body = await req.json();
  const next = await updateSite(body);
  return NextResponse.json({ ok: true, site: next });
}
