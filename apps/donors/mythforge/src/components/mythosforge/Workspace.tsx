'use client';

import { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Network, Search, Filter, Tag } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import { EntityCard } from '@/components/mythosforge/EntityCard';
import { NodeGraph } from '@/components/mythosforge/NodeGraph';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function Workspace() {
  const { entities, relationships, viewMode, setViewMode, getAllTags, getEffectiveGroups } = useWorldStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const effectiveGroups = getEffectiveGroups();
  const allCategories = [...new Set(Object.values(effectiveGroups).flat())].sort();
  const allTags = getAllTags();

  const filteredEntities = useMemo(() => {
    let result = entities;
    if (selectedCategory !== 'all') result = result.filter((e) => e.category === selectedCategory);
    if (tagFilter.length > 0) result = result.filter((e) => e.tags.some((t) => tagFilter.includes(t)));
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(query) || e.uuid_short.toLowerCase().includes(query));
    }
    return result;
  }, [entities, searchQuery, selectedCategory, tagFilter]);

  const viewButtons = [
    { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
    { mode: 'graph' as const, icon: Network, label: 'Graph' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0 gap-2">
        <div className="flex items-center gap-1 flex-shrink-0">
          {viewButtons.map(({ mode, icon: Icon, label }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm transition-colors ${
                viewMode === mode ? 'bg-surface-600 text-accent-gold' : 'text-ash-500 hover:bg-surface-600/50'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-ash-600" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entities..."
                className="h-7 pl-7 pr-3 text-xs bg-surface-700/50 border-white/[0.06] text-bone-300 placeholder:text-ash-600 focus-visible:border-accent-gold/30" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-28 h-7 text-xs bg-surface-700/50 border-white/[0.06] text-bone-300 focus:ring-accent-gold/20">
                <Filter className="size-3 text-ash-600 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-void-800 border-white/[0.08] max-h-64">
                <SelectItem value="all" className="text-xs text-bone-300">All</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs text-bone-300">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

        <span className="text-xs text-ash-600 flex-shrink-0">
          {filteredEntities.length !== entities.length
            ? `${filteredEntities.length} of ${entities.length} entities`
            : `${entities.length} ${entities.length === 1 ? 'entity' : 'entities'}`}
        </span>
      </div>

      {/* Tag filter bar (grid mode, after mount) */}
      {mounted && viewMode === 'grid' && allTags.length > 0 && (
        <div className="px-4 py-1.5 border-b border-white/[0.06] flex items-center gap-1.5 flex-shrink-0 overflow-x-auto">
          <Tag className="size-3 text-ash-600 flex-shrink-0" />
          {tagFilter.length > 0 && (
            <button onClick={() => setTagFilter([])}
              className="shrink-0 px-1.5 py-0.5 text-[10px] rounded bg-accent-blood/20 text-accent-blood hover:bg-accent-blood/30 transition-colors cursor-pointer">
              Clear
            </button>
          )}
          {allTags.map((tag) => {
            const isActive = tagFilter.includes(tag);
            return (
              <button key={tag}
                onClick={() => setTagFilter((prev) => isActive ? prev.filter((t) => t !== tag) : [...prev, tag])}
                className={`shrink-0 px-2 py-0.5 text-[10px] rounded-full transition-colors cursor-pointer ${
                  isActive ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                    : 'bg-surface-600/50 text-ash-500 border border-transparent hover:text-bone-300 hover:bg-surface-600'
                }`}>
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="h-full overflow-y-auto p-4">
            {filteredEntities.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-ash-600 text-sm">
                  {searchQuery || selectedCategory !== 'all' ? 'No entities match your search.' : 'No entities yet. Create your first world entity to begin.'}
                </p>
              </div>
            ) : (
              <div className="masonry-grid">
                {filteredEntities.map((entity) => (
                  <div key={entity.id} className="masonry-grid-item"><EntityCard entity={entity} /></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NodeGraph entities={filteredEntities} relationships={relationships} />
        )}
      </div>
    </div>
  );
}
