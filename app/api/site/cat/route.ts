import { NextResponse } from 'next/server';
import { getSite } from '@/lib/admin-site';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const site = await getSite();
    const catConfig = site.catConfig || {};
    return NextResponse.json(catConfig);
  } catch {
    return NextResponse.json({ enabled: true });
  }
}