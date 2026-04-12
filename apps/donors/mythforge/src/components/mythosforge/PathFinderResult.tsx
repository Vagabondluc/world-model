'use client';

import type { Entity } from '@/lib/types';
import type { PathResult } from '@/lib/graphUtils';

export interface PathFinderResultProps {
  result: PathResult;
  startId: string;
  startEntity: Entity | null;
  onEntityClick: (_entityId: string) => void;
}

export function PathFinderResult({ result, startId, startEntity, onEntityClick }: PathFinderResultProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-ash-500 uppercase tracking-wider font-semibold">Shortest Path</span>
        <span className="text-xs text-accent-gold bg-accent-gold/10 rounded-full px-2 py-0.5 border border-accent-gold/20">
          {result.distance} hop{result.distance !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-0">
        {/* Start node */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-accent-gold/5 border border-accent-gold/15">
          <div className="flex flex-col min-w-0 flex-1">
            <button
              onClick={() => onEntityClick(startId)}
              className="text-bone-100 text-sm font-semibold text-left hover:text-accent-gold transition-colors cursor-pointer truncate"
            >
              {startEntity?.title}
            </button>
            <span className="text-ash-600 text-xs">{startEntity?.category}</span>
          </div>
          <span className="text-[10px] text-accent-gold bg-accent-gold/15 rounded-full px-1.5 py-0.5 flex-shrink-0">
            START
          </span>
        </div>

        {/* Path steps */}
        {result.steps.map((step, index) => (
          <div key={step.relationshipId + step.entityId} className="flex items-stretch gap-0">
            {/* Connector line */}
            <div className="flex flex-col items-center ml-6 w-5 flex-shrink-0">
              <div className="w-px flex-1 bg-surface-600" />
              <div className="my-1 text-[10px] text-ash-500 bg-void-800 rounded-full px-1 py-0.5 border border-white/[0.06] whitespace-nowrap">
                {step.relationshipType}
              </div>
              <div className="w-px flex-1 bg-surface-600" />
            </div>

            {/* Step node */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-void-900 border border-white/[0.04] flex-1">
              <div className="flex flex-col min-w-0 flex-1">
                <button
                  onClick={() => onEntityClick(step.entityId)}
                  className="text-bone-100 text-sm font-medium text-left hover:text-accent-gold transition-colors cursor-pointer truncate"
                >
                  {step.entityTitle}
                </button>
                <span className="text-ash-600 text-xs">{step.entityCategory}</span>
              </div>
              <span className="text-ash-600 text-xs font-mono">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Graph hint */}
      <p className="text-ash-600 text-xs text-center italic mt-2">
        Switch to Graph view to see the highlighted path on the canvas.
      </p>
    </div>
  );
}
