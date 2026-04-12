
import React from 'react';
import { PlayerConfig } from '../../types';

interface PlayerListProps {
  players: PlayerConfig[];
  myPlayerId: string | null;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, myPlayerId }) => {
  return (
    <div className="space-y-3">
      {players.map(p => (
        <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${p.isReady ? 'bg-primary/10 border-primary/50' : 'bg-white/5 border-white/5'}`}>
          <div className="size-12 rounded-full flex items-center justify-center bg-black/20 relative">
            <span className="material-symbols-outlined text-2xl text-white/80">{p.avatar}</span>
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-[#0a0a0c]" style={{ backgroundColor: p.color }}></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{p.name}</span>
              {p.id === myPlayerId && <span className="text-[9px] bg-white/20 px-1.5 rounded text-white/80">YOU</span>}
            </div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">{p.domain}</span>
          </div>
          <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${p.isReady ? 'text-primary bg-primary/20' : 'text-white/20'}`}>
            {p.isReady ? 'Ready' : 'Waiting'}
          </div>
        </div>
      ))}
      {players.length === 0 && (
        <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/20 italic text-sm">
          Waiting for architects to join...
        </div>
      )}
    </div>
  );
};
