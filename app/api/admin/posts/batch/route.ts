import { NextResponse } from 'next/server';
import { getPost, savePost, deletePost } from '@/lib/posts';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体不是 JSON' }, { status: 400 });
  }

  const { ids, action } = body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: '未选中任何文章' }, { status: 400 });
  }

  let count = 0;
  for (const id of ids) {
    try {
      if (action === 'delete') {
        await deletePost(id);
        count++;
      } else if (action === 'publish' || action === 'unpublish') {
        const p = await getPost(id);
        if (!p) continue;
        await savePost({
          id,
          title: p.title,
          content: p.content,
          excerpt: p.excerpt,
          tags: p.tags,
          cover: p.cover,
          published: action === 'publish',
        });
        count++;
      }
    } catch (e) {
      console.error('batch op failed for', id, e);
    }
  }
  return NextResponse.json({ ok: true, count });
}