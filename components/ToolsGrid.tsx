'use client';
import { useState, useMemo } from 'react';
import ToolsFilter from './ToolsFilter';
import ToolsList from './ToolsList';

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: string;
  desc: string;
  category: string;
}

export default function ToolsGrid({ tools, categories }: { tools: Tool[]; categories: string[] }) {
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return tools.filter(t => {
      if (filterCat && t.category !== filterCat) return false;
      if (query) {
        const s = query.toLowerCase();
        if (!t.name.toLowerCase().includes(s) && !t.desc.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [tools, filterCat, query]);

  return (
    <div className="space-y-6">
      <ToolsFilter
        categories={categories}
        onFilter={(cat, q) => { setFilterCat(cat); setQuery(q); }}
      />
      <ToolsList tools={filtered} />
    </div>
  );
}