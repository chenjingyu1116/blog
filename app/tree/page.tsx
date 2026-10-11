import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import CreativeWorkshopClient from './CreativeWorkshopClient';

// ⭐ 统一判断"是否已发布"（含定时发布判断）
function isPublished(data: any) {
  return data.published !== false
    && data.draft !== true
    && (!data.publishAt || new Date(data.publishAt) <= new Date());
}

function getLocalItems(directoryName: string, typeName: string) {
  const dirPath = path.join(process.cwd(), directoryName);
  let items: any[] = [];
  try {
    if (fs.existsSync(dirPath)) {
      const fileNames = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
      items = fileNames
        .map(fileName => {
          const fullPath = path.join(dirPath, fileName);
          const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

          // ⭐ 草稿 / 定时未到 不进星际战舰
          if (!isPublished(data)) return null;

          const realSlug = fileName.replace(/\.md$/, '');

          return {
            id: data.id || realSlug,
            slug: realSlug,
            title: data.title || '',
            type: typeName,
            date: data.date || '2026-05-01',
            cover: data.cover || data.image || null,
            content: content.trim()
          };
        })
        .filter(Boolean) as any[];
    }
  } catch (error) {
    console.error(`读取 ${directoryName} 失败:`, error);
  }
  return items;
}

export default function CreativeWorkshopPage() {
  const posts = getLocalItems('posts', 'post');
  const chatters = getLocalItems('chatters', 'chatter');
  const moments = getLocalItems('moments', 'moment');

  return (
    <CreativeWorkshopClient
      posts={posts}
      chatters={chatters}
      moments={moments}
    />
  );
}