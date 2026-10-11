import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import { listEnabledTools } from '@/lib/tools';
import { siteConfig } from '../../siteConfig';
import ToolsGrid from '@/components/ToolsGrid';

export const metadata = {
  title: '工具箱 | ' + siteConfig.title,
  description: '免费在线小工具集合',
};

export const dynamic = 'force-dynamic';

export default async function ToolsPage() {
  const tools = await listEnabledTools();
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />
      <PageTransition>
        <main className="w-[95%] md:w-[90%] max-w-5xl mx-auto mt-24 md:mt-28 relative z-10">
          <header className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-wider mb-3">
              🧰 工具箱
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              免费在线小工具 · 无需登录 · 用完就走
            </p>
          </header>

          <ToolsGrid tools={tools} categories={categories} />
        </main>
      </PageTransition>
    </div>
  );
}