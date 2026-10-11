import { getSite } from '@/lib/admin-site';
import CatClient from './CatClient';

export const dynamic = 'force-dynamic';

export default async function AdminCatPage() {
  const site = await getSite();
  const catConfig = site.catConfig || {};
  const geminiConfig = site.geminiConfig || {};

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="anime-title text-3xl">猫猫设置</h1>
        <p className="text-xs opacity-60 mt-1">
          说话内容 + AI 人格。保存到 <code>data/site.json</code>。
        </p>
      </header>
      <CatClient initialCat={catConfig} initialGemini={geminiConfig} />
    </div>
  );
}