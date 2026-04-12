import React, { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameEvent } from '../types';
import { ui } from '../logic/ui.tokens';
import { exportGameState } from '../logic/export';
import { filterNonRevoked, filterWorldEvents, filterSystemEvents, getReverseChronologicalEvents } from '../logic/eventFilters';
import { ModalHeader } from './design-system/ModalHeader';
import { selectPlayerConfig } from '../logic/selectors';
import { formatAgeRoman } from '../logic/format';

interface TimelineViewProps {
  onClose: () => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ onClose }) => {
  const state = useGameStore(state => state);
  const [filter, setFilter] = useState<'ALL' | 'WORLD' | 'SYSTEM'>('ALL');
  const [hideRevoked, setHideRevoked] = useState(false);

  const filteredEvents = useMemo(() => {
    let evts = getReverseChronologicalEvents(state.events);
    if (hideRevoked) evts = filterNonRevoked(evts, state.revokedEventIds);
    if (filter === 'WORLD') return filterWorldEvents(evts);
    if (filter === 'SYSTEM') return filterSystemEvents(evts);
    return evts;
  }, [state.events, filter, hideRevoked, state.revokedEventIds]);

  const handleExport = () => {
    exportGameState(state, {
      includeMetadata: true,
      filename: `dawn-of-worlds-archive-${Date.now()}.json`
    });
  };

  const describeEvent = (e: GameEvent) => {
    switch (e.type) {
      case 'WORLD_CREATE': return `Created ${e.payload.kind} ${e.payload.name ? `"${e.payload.name}"` : ''}`;
      case 'WORLD_MODIFY': return `Modified ${e.payload.worldId.slice(0, 8)}`;
      case 'WORLD_DELETE': return `Deleted ${e.payload.worldId.slice(0, 8)}`;
      case 'TURN_BEGIN': return `Turn started for ${e.payload.playerId}`;
      case 'TURN_END': return `Turn finished`;
      case 'ROUND_END': return `Round ${e.payload.round} concluded`;
      case 'AGE_ADVANCE': return `Advanced to Age ${e.payload.to}`;
      case 'EVENT_REVOKE': return `Revoked action ${e.payload.targetEventIds[0]?.slice(0, 8)}`;
      default: return e.type;
    }
  };

  const getPlayerConfig = (id: string) => selectPlayerConfig(state, id);
  // ... inside render ...

  return (
    <div className="fixed inset-0 z-50 bg-[#111a22]/95 backdrop-blur-md flex flex-col font-sans animate-in slide-in-from-bottom-10 duration-200">

      {/* Header */}
      <ModalHeader
        title="Chronicles"
        subtitle={`Age ${state.age} — Round ${state.round}`}
        icon="history_edu"
        onClose={onClose}
      >
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-[10px] font-black uppercase tracking-widest hidden md:block">Filter:</span>
          <div className="flex bg-[#233648] p-1 rounded-lg border border-white/5">
            {(['ALL', 'WORLD', 'SYSTEM'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative inline-flex items-center">
              <input type="checkbox" className="sr-only peer" checked={hideRevoked} onChange={() => setHideRevoked(!hideRevoked)} />
              <div className="w-8 h-4 bg-[#233648] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <span className="text-text-muted group-hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors hidden md:block">Valid Only</span>
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all font-bold text-[10px] uppercase tracking-widest shadow-glow ml-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
        </div>
      </ModalHeader>

      {/* Table Structure */}
      <div className="flex-1 flex flex-col overflow-hidden px-10 pt-4 pb-12">
        <div className="bg-[#1a2530] border border-white/10 rounded-xl overflow-hidden flex flex-col flex-1 shadow-2xl">

          <div className="grid grid-cols-12 px-6 py-3 bg-black/40 text-[11px] uppercase tracking-widest font-bold text-text-muted border-b border-white/5">
            <div className="col-span-1">Age</div>
            <div className="col-span-1">Rnd</div>
            <div className="col-span-2">Player</div>
            <div className="col-span-6">Action Description</div>
            <div className="col-span-1 text-center">AP</div>
            <div className="col-span-1 text-center">Status</div>
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filteredEvents.map((e) => {
              const isRevoked = state.revokedEventIds.has(e.id);
              const p = getPlayerConfig(e.playerId);

              return (
                <div key={e.id} className={`grid grid-cols-12 px-6 py-4 border-b border-white/5 items-center hover:bg-primary/5 transition-all group ${isRevoked ? 'opacity-30 grayscale' : ''}`}>
                  <div className={`col-span-1 font-bold font-mono ${isRevoked ? 'text-text-muted' : 'text-primary'}`}>
                    {formatAgeRoman(e.age)}
                  </div>
                  <div className="col-span-1 text-white font-mono">{e.round}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="size-2 rounded-full shadow-glow" style={{ backgroundColor: p?.color || '#fff' }}></div>
                    <span className="text-white font-medium text-xs truncate">{p?.name || e.playerId}</span>
                  </div>
                  <div className={`col-span-6 text-sm ${isRevoked ? 'line-through text-text-muted' : 'text-white/90'}`}>
                    {describeEvent(e)}
                  </div>
                  <div className="col-span-1 text-center font-mono text-white/60">
                    {'cost' in e ? `${e.cost} AP` : '—'}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {isRevoked ? (
                      <span className="material-symbols-outlined text-red-500 text-lg">history_toggle_off</span>
                    ) : (
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                <p className="text-sm font-bold uppercase tracking-widest">No matching history found</p>
              </div>
            )}
          </div>

          <div className="bg-black/40 px-6 py-3 border-t border-white/10 flex justify-between items-center text-[10px] uppercase text-text-muted font-black tracking-widest">
            <div className="flex gap-8">
              <span>Log Integrity: Verified</span>
              <span>Total Actions: {state.events.length}</span>
            </div>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Local Storage Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
