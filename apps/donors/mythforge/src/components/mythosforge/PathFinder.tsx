'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, ArrowRight, ArrowLeftRight, X } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import type { Entity } from '@/lib/types';
import { findShortestPath } from '@/lib/graphUtils';
import type { PathStep, PathResult } from '@/lib/graphUtils';
import { PathFinderResult } from '@/components/mythosforge/PathFinderResult';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

interface PathFinderProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  onPathFound: (_path: PathStep[] | null) => void;
}

export function PathFinder({ open, onOpenChange, onPathFound }: PathFinderProps) {
  const { entities, relationships, setActiveEntity } = useWorldStore();
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [startId, setStartId] = useState<string | null>(null);
  const [endId, setEndId] = useState<string | null>(null);
  const [result, setResult] = useState<PathResult | null | undefined>(undefined);

  const entityMap = useMemo(() => new Map(entities.map((e) => [e.id, e])), [entities]);

  const searchResults = useCallback((query: string, selectedId: string | null) => {
    if (!query.trim() || selectedId) return [];
    const q = query.toLowerCase();
    return entities
      .filter((e) => e.title.toLowerCase().includes(q) || e.uuid_short.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
      .slice(0, 8);
  }, [entities]);

  const startResults = useMemo(() => searchResults(startQuery, startId), [searchResults, startQuery, startId]);
  const endResults = useMemo(() => searchResults(endQuery, endId), [searchResults, endQuery, endId]);

  const selectEntity = useCallback((id: string, setQuery: (_v: string) => void, setId: (_v: string | null) => void) => {
    const entity = entityMap.get(id);
    setId(id);
    setQuery(entity?.title ?? '');
  }, [entityMap]);

  const handleFind = useCallback(() => {
    if (!startId || !endId) return;
    const path = findShortestPath(entityMap, relationships, startId, endId);
    setResult(path);
    onPathFound(path?.steps ?? null);
  }, [startId, endId, entityMap, relationships, onPathFound]);

  const handleClear = useCallback(() => { setResult(undefined); onPathFound(null); }, [onPathFound]);
  const handleClose = useCallback(() => { handleClear(); onOpenChange(false); }, [handleClear, onOpenChange]);

  const canSearch = startId !== null && endId !== null && startId !== endId;
  const startEntity = startId ? entityMap.get(startId) ?? null : null;
  const endEntity = endId ? entityMap.get(endId) ?? null : null;

  const inputCls = "h-9 pl-3 pr-8 text-sm bg-void-900 border-white/[0.06] text-bone-300 placeholder:text-ash-600 focus-visible:ring-accent-gold/30";
  const clearBtnCls = "absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-ash-500 hover:text-bone-300 cursor-pointer";
  const entityBadge = (e: Entity) => (
    <div className="text-xs text-bone-400 bg-surface-600/50 rounded-md px-2.5 py-1.5 border border-white/[0.04]">
      <span className="text-accent-gold">{e.title}</span>
      <span className="text-ash-600 ml-1.5">{e.category}</span>
    </div>
  );

  const renderSearchDropdown = (results: Entity[], onSelect: (_id: string) => void) => {
    if (results.length === 0) return null;
    return (
      <div className="absolute z-50 mt-1 w-full bg-void-800 border border-white/[0.08] rounded-lg shadow-xl max-h-40 overflow-y-auto">
        {results.map((entity) => (
          <button key={entity.id} onClick={() => onSelect(entity.id)} onMouseDown={(e) => e.preventDefault()}
            className="w-full text-left px-3 py-2 text-sm text-bone-300 hover:bg-surface-600 hover:text-bone-100 transition-colors cursor-pointer">
            <div className="text-bone-100 truncate">{entity.title}</div>
            <div className="text-ash-600 text-xs">{entity.category} · {entity.uuid_short}</div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-accent-gold">Entity Path Finder</DialogTitle>
          <DialogDescription className="text-ash-500">
            Find the shortest connection path between any two entities in your world graph.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 py-2">
          <div className="flex items-start gap-3">
            {/* Start entity */}
            <div className="flex-1 flex flex-col gap-1.5 relative">
              <label className="text-xs text-ash-500 uppercase tracking-wider font-semibold">From</label>
              <div className="relative">
                <Input value={startQuery} onChange={(e) => { setStartQuery(e.target.value); if (startId) { setStartId(null); setResult(undefined); } }}
                  placeholder="Search entity..." className={inputCls} />
                {startEntity && <button onClick={() => { setStartId(null); setStartQuery(''); }} className={clearBtnCls}><X className="w-3.5 h-3.5" /></button>}
              </div>
              {startEntity && entityBadge(startEntity)}
              {renderSearchDropdown(startResults, (id) => selectEntity(id, setStartQuery, setStartId))}
            </div>
            <div className="flex items-center pt-5 text-ash-600"><ArrowRight className="w-5 h-5" /></div>
            {/* End entity */}
            <div className="flex-1 flex flex-col gap-1.5 relative">
              <label className="text-xs text-ash-500 uppercase tracking-wider font-semibold">To</label>
              <div className="relative">
                <Input value={endQuery} onChange={(e) => { setEndQuery(e.target.value); if (endId) { setEndId(null); setResult(undefined); } }}
                  placeholder="Search entity..." className={inputCls} />
                {endEntity && <button onClick={() => { setEndId(null); setEndQuery(''); }} className={clearBtnCls}><X className="w-3.5 h-3.5" /></button>}
              </div>
              {endEntity && entityBadge(endEntity)}
              {renderSearchDropdown(endResults, (id) => selectEntity(id, setEndQuery, setEndId))}
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={handleFind} disabled={!canSearch}
              className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border border-accent-gold/30 text-xs h-8">
              <Search className="w-3.5 h-3.5 mr-1.5" />Find Path
            </Button>
            {result !== undefined && (
              <Button onClick={handleClear} variant="ghost" className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50 text-xs h-8">Clear</Button>
            )}
          </div>
          {result === null && (
            <div className="flex flex-col items-center gap-2 py-6">
              <ArrowLeftRight className="w-8 h-8 text-accent-blood/50" />
              <p className="text-ash-500 text-sm text-center">
                No path found between these entities. They are not connected through any relationship chain.
              </p>
            </div>
          )}
          {result && result.steps.length === 0 && (
            <p className="text-ash-500 text-sm text-center py-4">Same entity selected. Pick two different entities.</p>
          )}
          {result && result.steps.length > 0 && startId && (
            <PathFinderResult result={result} startId={startId} startEntity={startEntity} onEntityClick={setActiveEntity} />
          )}
        </div>
        <DialogFooter className="flex-shrink-0 border-t border-white/[0.06] pt-3">
          <Button variant="ghost" onClick={handleClose} className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Re-export PathStep for NodeGraph backward compatibility
export type { PathStep };
