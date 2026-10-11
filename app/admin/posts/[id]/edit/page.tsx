import { notFound } from 'next/navigation';
import { getPost } from '@/lib/posts';
import PostEditor from '@/components/admin/PostEditor';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <PostEditor id={id} initial={post} />;
}