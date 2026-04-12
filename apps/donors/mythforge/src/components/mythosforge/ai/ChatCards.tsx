'use client';

import { useState, useCallback } from 'react';
import {
  CheckCircle2, ExternalLink, Link2, Plus, Sparkles,
} from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import { Button } from '@/components/ui/button';
import { SEVERITY_CONFIG } from './ai-config';

// ─── Consistency Issue Card ─────────────────────────────────────────────────
export function ConsistencyIssueComponent({
  data,
}: {
  data: {
    severity: string;
    title: string;
    description: string;
    entityIds: string[];
    entityTitles: string[];
  };
}) {
  const setActiveEntity = useWorldStore((s) => s.setActiveEntity);
  const config = SEVERITY_CONFIG[data.severity] || SEVERITY_CONFIG.medium;
  const SeverityIcon = config.icon;

  return (
    <div className="mt-2 rounded-lg border border-white/[0.06] bg-surface-700/40 overflow-hidden">
      <div className={`px-3 py-1.5 flex items-center gap-1.5 ${
        data.severity === 'critical' ? 'bg-accent-blood/10 border-b border-accent-blood/20' :
        data.severity === 'high' ? 'bg-red-500/10 border-b border-red-500/20' :
        'bg-transparent border-b border-white/[0.04]'
      }`}>
        <SeverityIcon className={`size-3 ${config.color}`} />
        <span className={`text-[10px] uppercase tracking-wider font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-xs font-medium text-bone-300">{data.title}</p>
        <p className="mt-1 text-[11px] text-ash-500 leading-relaxed">{data.description}</p>
        {data.entityTitles && data.entityTitles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.entityTitles.map((title: string, idx: number) => {
              const entityId = data.entityIds?.[idx];
              return (
                <button
                  key={entityId || idx}
                  onClick={() => entityId && setActiveEntity(entityId)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-600/60 text-[10px] text-accent-indigo hover:bg-surface-600 hover:text-bone-100 transition-colors cursor-pointer"
                >
                  <ExternalLink className="size-2.5" />
                  {title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Relationship Suggestion Card ──────────────────────────────────────────
export function RelationshipSuggestionComponent({
  data,
}: {
  data: {
    sourceTitle: string;
    targetTitle: string;
    relationshipType: string;
    reason: string;
  };
}) {
  const { entities, addEntity, addRelationship } = useWorldStore();
  const [added, setAdded] = useState(false);

  const sourceEntity = entities.find((e) => e.title === data.sourceTitle);
  const targetEntity = entities.find((e) => e.title === data.targetTitle);

  const handleAdd = useCallback(() => {
    const store = useWorldStore.getState();
    let srcId = sourceEntity?.id;
    let tgtId = targetEntity?.id;

    // Auto-create placeholder entities for missing targets
    if (!srcId) {
      const created = store.addEntity(data.sourceTitle, 'Lore Note', `Placeholder created from a relationship suggestion: ${data.reason}`, {});
      srcId = created.id;
    }
    if (!tgtId) {
      const created = store.addEntity(data.targetTitle, 'Lore Note', `Placeholder created from a relationship suggestion: ${data.reason}`, {});
      tgtId = created.id;
    }

    if (srcId && tgtId) {
      addRelationship(srcId, tgtId, data.relationshipType);
      setAdded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceEntity, targetEntity, data, addEntity, addRelationship]);

  const canAdd = !added;
  const needsPlaceholder = !sourceEntity || !targetEntity;

  return (
    <div className="mt-1.5 w-full rounded-lg border border-white/[0.06] bg-surface-600/40 p-2.5 hover:bg-surface-600/60 transition-colors">
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => sourceEntity && useWorldStore.getState().setActiveEntity(sourceEntity.id)}
          className="text-xs font-medium text-accent-gold hover:underline cursor-pointer"
        >
          {data.sourceTitle}
        </button>
        <span className="flex items-center gap-0.5 text-[10px] text-ash-600 bg-surface-600 rounded px-1.5 py-0.5 flex-shrink-0">
          <Link2 className="size-2.5" />
          {data.relationshipType}
        </span>
        <button
          onClick={() => targetEntity && useWorldStore.getState().setActiveEntity(targetEntity.id)}
          className="text-xs font-medium text-bone-300 hover:underline cursor-pointer"
        >
          {data.targetTitle}
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-ash-600 leading-relaxed">{data.reason}</p>
      <div className="mt-2 flex items-center gap-2">
        {canAdd && (
          <Button
            size="sm" variant="outline"
            className="h-6 text-[10px] px-2 border-accent-arcane/30 text-accent-arcane hover:bg-accent-arcane/10 hover:text-accent-arcane"
            onClick={handleAdd}
          >
            {needsPlaceholder ? (
              <>
                <Sparkles className="size-2.5" />
                Create & Link
              </>
            ) : (
              <>
                <Plus className="size-2.5" />
                Add Link
              </>
            )}
          </Button>
        )}
        {added && (
          <span className="flex items-center gap-1 text-[10px] text-accent-arcane font-semibold">
            <CheckCircle2 className="size-2.5" />
            Linked
          </span>
        )}
        {needsPlaceholder && !added && (
          <span className="text-[10px] text-amber-400/70 italic">
            {sourceEntity ? data.targetTitle : data.sourceTitle} not found — placeholder will be created
          </span>
        )}
      </div>
    </div>
  );
}
