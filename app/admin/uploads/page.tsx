import fs from 'fs/promises';
import path from 'path';
import UploadsClient from '@/components/admin/UploadsClient';

export const dynamic = 'force-dynamic';

async function listFiles() {
  const dir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.mkdir(dir, { recursive: true });
    const names = (await fs.readdir(dir)).filter(n => !n.startsWith('.'));
    const files = await Promise.all(
      names.map(async name => {
        const stat = await fs.stat(path.join(dir, name));
        return {
          name,
          url: '/uploads/' + name,
          size: stat.size,
          mtime: stat.mtime.toISOString(),
        };
      })
    );
    return files.sort((a, b) => b.mtime.localeCompare(a.mtime));
  } catch {
    return [];
  }
}

export default async function AdminUploadsPage() {
  const files = await listFiles();

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="anime-title text-3xl">图床管理</h1>
        <p className="text-xs opacity-60 mt-1">
          查看所有上传图片，可删除。文件保存在 <code>public/uploads/</code>。
        </p>
      </header>

      <UploadsClient files={files} />
    </div>
  );
}