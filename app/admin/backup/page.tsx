'use client';
import { useState } from 'react';

export default function BackupPage() {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/backup');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blog-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="anime-title text-3xl">数据备份</h1>
        <p className="text-xs opacity-60 mt-1">
          一键导出所有文章和配置为 JSON 文件。
        </p>
      </header>

      <div className="glass p-6 rounded-2xl space-y-4">
        <div className="text-sm leading-relaxed">
          <p className="mb-3 font-bold">📦 包含内容</p>
          <ul className="space-y-1.5 text-xs opacity-80">
            <li>• 文章 posts/*.md</li>
            <li>• 杂谈 chatters/*.md</li>
            <li>• 说说 moments/*.md</li>
            <li>• 工具箱配置 data/tools.json</li>
            <li>• 短链 data/shortlinks.json</li>
          </ul>
          <p className="mt-4 text-xs opacity-60">
            ⚠️ 不包含图片文件（public/uploads/），请手动备份该目录。
          </p>
        </div>

        <button onClick={download} disabled={busy} className="anime-btn w-full">
          {busy ? '打包中...' : '下载备份 JSON'}
        </button>
      </div>
    </div>
  );
}