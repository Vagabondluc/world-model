'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import { Button } from '@/components/ui/button';

// ─── Enhanced Draft Card ─────────────────────────────────────────────────────
export function DraftCardComponent({
  data,
}: {
  data: {
    title: string;
    category: string;
    summary: string;
    markdownPreview?: string;
    attributes?: Record<string, unknown>;
    tags?: string[];
  };
}) {
  const addEntity = useWorldStore((s) => s.addEntity);
  const [saved, setSaved] = useState(false);

  // Pick a few notable attributes to display
  const attrEntries = Object.entries(data.attributes || {}).slice(0, 4);

  const handleSave = useCallback(() => {
    const newEntity = addEntity(
      data.title,
      data.category,
      data.markdownPreview || data.summary,
      data.attributes || {},
    );
    // Apply tags after entity is created
    if (data.tags && data.tags.length > 0 && newEntity) {
      const store = useWorldStore.getState();
      for (const tag of data.tags) {
        store.addTag(newEntity.id, tag);
      }
    }
    setSaved(true);
  }, [addEntity, data]);

  return (
    <div data-testid="draft-card" className="mt-2 rounded-lg border border-accent-gold/20 bg-surface-700/60 overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-accent-gold truncate">{data.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block text-[10px] uppercase tracking-wider text-ash-500 bg-surface-600 rounded px-1.5 py-0.5">
              {data.category}
            </span>
            {data.tags && data.tags.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-ash-500">
                {data.tags.slice(0, 3).map((t) => (
                  <span key={t} className="bg-surface-600 rounded px-1 py-px">{t}</span>
                ))}
                {data.tags.length > 3 && (
                  <span className="text-ash-600">+{data.tags.length - 3}</span>
                )}
              </span>
            )}
          </div>
        </div>
        {!saved && (
          <Button
            data-testid="draft-card-save"
            size="sm"
            variant="outline"
            className="flex-shrink-0 h-7 text-xs border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 hover:text-accent-gold"
            onClick={handleSave}
          >
            <Plus className="size-3" />
            Create Draft Card
          </Button>
        )}
        {saved && (
          <span className="flex-shrink-0 flex items-center gap-1 text-[10px] text-accent-arcane font-semibold">
            <CheckCircle2 className="size-3" />
            Added to World
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="px-3 text-xs text-bone-400 leading-relaxed">{data.summary}</p>

      {/* Attributes preview */}
      {attrEntries.length > 0 && (
        <div className="mx-3 mt-2 p-2 bg-void-900/50 rounded border border-white/[0.04]">
          <p className="text-[9px] uppercase tracking-wider text-ash-600 mb-1">Attributes</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {attrEntries.map(([key, val]) => (
              <div key={key} className="flex items-baseline gap-1 min-w-0">
                <span className="text-[10px] text-ash-600 truncate">{key}:</span>
                <span className="text-[10px] text-bone-300 font-mono truncate">
                  {Array.isArray(val) ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Markdown preview (truncated) */}
      {data.markdownPreview && (
        <details className="mx-3 mt-2">
          <summary className="text-[10px] text-ash-600 cursor-pointer hover:text-bone-300 transition-colors">
            View lore preview
          </summary>
          <div className="mt-1 text-[10px] text-ash-500 leading-relaxed max-h-24 overflow-y-auto">
            {data.markdownPreview.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('#') ? 'text-bone-300 font-semibold mt-1' : ''}>
                {line.replace(/^#+\s+/, '')}
              </p>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
