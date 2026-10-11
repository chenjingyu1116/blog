import { NextResponse } from 'next/server';
import { listPosts, savePost } from '@/lib/posts';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json(await listPosts()); }
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title?.trim() || !body.content?.trim())
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  const id = await savePost(body);
  return NextResponse.json({ id });
}