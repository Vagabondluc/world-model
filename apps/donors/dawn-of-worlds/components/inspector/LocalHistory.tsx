
import React from 'react';
import { GameEvent } from '../../types';

interface LocalHistoryProps {
  events: GameEvent[];
}

export const LocalHistory: React.FC<LocalHistoryProps> = ({ events }) => {
  const describeEvent = (e: GameEvent) => {
    if (e.type === 'WORLD_CREATE') return `Created ${e.payload.kind}`;
    if (e.type === 'WORLD_MODIFY') return `Modified object ${e.payload.worldId.slice(0, 4)}`;
    if (e.type === 'WORLD_DELETE') return `Deleted object`;
    if (e.type === 'COMBAT_RESOLVE') return `Combat: ${e.payload.outcome}`;
    return e.type;
  };

  return (
    <div className="relative space-y-6 pl-5 before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-[1px] before:bg-white/5">
      {events.map((e, idx) => (
        <div key={e.id} className="relative">
          <span className={`absolute -left-[20px] top-1 h-[7px] w-[7px] rounded-full ${idx === 0 ? 'bg-primary shadow-glow' : 'bg-white/20'}`}></span>
          <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] text-text-muted font-medium">Age {e.age} · R{e.round} · {e.playerId}</p>
            {'cost' in e && <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted font-mono">{e.cost} AP</span>}
          </div>
          <p className="text-xs text-white/90 font-medium">{describeEvent(e)}</p>
        </div>
      ))}
      {events.length === 0 && (
         <p className="text-[10px] text-text-muted italic">Primordial state. No recorded events.</p>
      )}
    </div>
  );
};
