import { notFound } from 'next/navigation';
import { getPost } from '@/lib/posts';
import PostEditor from '@/components/admin/PostEditor';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);  // ⭐ URL 编码 → 原始中文
  const post = await getPost(id);
  if (!post) notFound();
  return <PostEditor id={id} initial={post} />;
}