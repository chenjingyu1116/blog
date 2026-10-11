'use client';
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: string;
  desc: string;
  category: string;
}

export default function ToolsList({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return <p className="text-center text-slate-500 py-10">没有匹配的工具</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {tools.map(tool => (
        <Link
          key={tool.id}
          href={tool.path}
          target={tool.path.startsWith('http') ? '_blank' : undefined}
          className="group block bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {tool.icon}
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {tool.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {tool.desc}
          </p>
          <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold">
            {tool.category}
          </span>
        </Link>
      ))}
    </div>
  );
}