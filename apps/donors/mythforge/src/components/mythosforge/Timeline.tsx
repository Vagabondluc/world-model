'use client';

import { useMemo, useCallback, useState, useRef } from 'react';
import { Clock, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import type { Entity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  extractTimelineEntries, computeYearRange, calculateTickInterval,
} from '@/lib/dateUtils';

export function Timeline({ entities: entitiesProp }: { entities?: Entity[] } = {}) {
  const storeEntities = useWorldStore((s) => s.entities);
  const entities = entitiesProp ?? storeEntities;
  const setActiveEntity = useWorldStore((s) => s.setActiveEntity);
  const entries = useMemo(() => extractTimelineEntries(entities), [entities]);
  const [pixelsPerYear, setPixelsPerYear] = useState(120);
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => setPixelsPerYear((p) => Math.min(300, p + 20)), []);
  const handleZoomOut = useCallback(() => setPixelsPerYear((p) => Math.max(40, p - 20)), []);
  const yearRange = useMemo(() => computeYearRange(entries), [entries]);

  const ticks = useMemo(() => {
    const interval = calculateTickInterval(yearRange);
    const result: number[] = [];
    for (let y = Math.ceil(yearRange.min / interval) * interval; y <= yearRange.max; y += interval) {
      result.push(y);
    }
    return result;
  }, [yearRange]);

  const totalWidth = (yearRange.max - yearRange.min) * pixelsPerYear;
  const yearToX = (year: number) => (year - yearRange.min) * pixelsPerYear;

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    const delta = direction === 'right' ? 200 : -200;
    setScrollOffset((prev) => Math.max(0, prev + delta));
  }, []);

  const categoryGroups = useMemo(() => {
    const groups: Record<string, number> = {};
    let laneIndex = 0;
    for (const entry of entries) {
      const cat = entry.entity.category;
      if (!(cat in groups)) groups[cat] = laneIndex++;
    }
    return groups;
  }, [entries]);

  const groupKeys = Object.keys(categoryGroups);
  const laneHeight = groupKeys.length * 60 + 40;

  return (
    <div className="h-full flex flex-col bg-void-900">
      {/* Toolbar */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-gold" />
          <span className="text-sm text-bone-300 font-semibold">Chronology</span>
          <span className="text-xs text-ash-600">{entries.length} event{entries.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { icon: ChevronLeft, action: () => handleScroll('left') },
            { icon: ZoomOut, action: handleZoomOut },
            { icon: ZoomIn, action: handleZoomIn },
            { icon: ChevronRight, action: () => handleScroll('right') },
          ].map(({ icon: Icon, action }, i) => (
            <Button key={i} variant="ghost" size="sm" onClick={action}
              className="h-7 w-7 p-0 text-ash-500 hover:text-bone-300 hover:bg-surface-600/50">
              <Icon className="w-3.5 h-3.5" />
            </Button>
          ))}
          <span className="text-[10px] text-ash-600 w-16 text-center font-mono">{Math.round(pixelsPerYear)}px/yr</span>
        </div>
      </div>

      {/* Timeline canvas */}
      <div className="flex-1 overflow-hidden">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Clock className="w-8 h-8 text-ash-600 mx-auto mb-3" />
              <p className="text-ash-500 text-sm">No dated events found.</p>
              <p className="text-ash-600 text-xs mt-1">
                Add a <span className="text-bone-400">Historical Event</span>,{' '}
                <span className="text-bone-400">Era</span>, or{' '}
                <span className="text-bone-400">Historical Figure</span> with a year field to populate the timeline.
              </p>
            </div>
          </div>
        ) : (
          <div ref={containerRef} className="h-full overflow-x-auto overflow-y-auto">
            <div style={{ width: totalWidth + 200, minHeight: '100%', position: 'relative', paddingLeft: scrollOffset }}>
              {/* Year axis */}
              <div className="relative h-10 border-b border-white/[0.06]">
                {ticks.map((year) => (
                  <div key={year} className="absolute top-0 h-full flex flex-col items-center" style={{ left: yearToX(year) }}>
                    <div className="w-px h-4 bg-surface-600" />
                    <span className="text-[10px] text-ash-600 font-mono mt-0.5 whitespace-nowrap">{year}</span>
                  </div>
                ))}
                {0 >= yearRange.min && 0 <= yearRange.max && (
                  <div className="absolute top-0 h-full flex flex-col items-center" style={{ left: yearToX(0) }}>
                    <div className="w-px h-4 bg-accent-blood" />
                    <span className="text-[10px] text-accent-blood font-mono mt-0.5">NOW</span>
                  </div>
                )}
              </div>
              {/* Timeline events */}
              <div className="relative" style={{ height: `${laneHeight}px` }}>
                {groupKeys.map((cat, i) => (
                  <div key={cat} className="absolute w-full border-b border-white/[0.03]" style={{ top: (i + 1) * 60 }} />
                ))}
                {entries.map((entry) => {
                  const lane = categoryGroups[entry.entity.category] ?? 0;
                  const x = yearToX(entry.year);
                  return (
                    <div key={entry.entity.id} className="absolute" style={{ left: x, top: lane * 60 + 8 }}>
                      <div className="flex flex-col items-center" style={{ marginLeft: -3 }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/50" />
                      </div>
                      <button
                        onClick={() => setActiveEntity(entry.entity.id)}
                        className="ml-[-22px] w-44 bg-surface-700/80 border border-white/[0.06] rounded-lg p-2 text-left hover:border-accent-gold/30 hover:bg-surface-600/80 transition-colors cursor-pointer group"
                        title={entry.entity.title}
                      >
                        <div className="text-bone-100 text-xs font-semibold truncate group-hover:text-accent-gold transition-colors">
                          {entry.entity.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-ash-600 text-[10px] bg-surface-600 px-1 py-px rounded">{entry.entity.category}</span>
                          <span className="text-accent-gold/60 text-[10px] font-mono">Y{entry.year}</span>
                        </div>
                        {entry.entity.markdown_content && (
                          <p className="text-ash-600 text-[10px] mt-1 line-clamp-2 leading-snug">
                            {entry.entity.markdown_content.replace(/^#+\s+.*/gm, '').replace(/\*+/g, '').trim().split('\n').find((l) => l.trim()) || ''}
                          </p>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
