import { listAllPosts } from '@/lib/posts';
import PostsClient from '@/components/admin/PostsClient';

export default async function PostsPage() {
  const posts = await listAllPosts();
  return <PostsClient posts={posts} />;
}