import { listTools } from '@/lib/tools';
import ToolsClient from '@/components/admin/ToolsClient';

export const dynamic = 'force-dynamic';

export default async function AdminToolsPage() {
  const tools = await listTools();

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="anime-title text-3xl">工具管理</h1>
        <p className="text-xs opacity-60 mt-1">
          新增、编辑、删除、开关、排序。数据保存在 <code>data/tools.json</code>。
        </p>
      </header>

      <ToolsClient tools={tools} />
    </div>
  );
}