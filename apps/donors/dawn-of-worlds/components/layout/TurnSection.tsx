
import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const TurnSection: React.FC = () => {
  const activePlayerId = useGameStore(state => state.activePlayerId);
  const players = useGameStore(state => state.config?.players);
  const playerData = useGameStore(state => state.playerCache[activePlayerId]);
  
  const activePlayer = players?.find(p => p.id === activePlayerId);
  const apRemaining = playerData?.currentPower || 0;
  const activeColor = activePlayer?.color || '#fff';
  const activeName = activePlayer?.name || activePlayerId;

  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-text-muted font-bold tracking-tighter mb-0.5">Turn Cycle</span>
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: activeColor }}>
          <span className="h-2 w-2 rounded-full animate-pulse shadow-glow" style={{ backgroundColor: activeColor }} aria-hidden="true"></span>
          <span>{activeName}</span>
        </div>
      </div>

      <div className="flex flex-col items-end" aria-label={`Power Reserve: ${apRemaining} action points remaining`} aria-live="polite">
        <span className="text-[10px] font-black uppercase text-text-muted mb-1 tracking-widest">Power: {apRemaining}</span>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: Math.min(10, apRemaining) }).map((_, i) => (
            <div key={i} className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow"></div>
          ))}
          {apRemaining > 10 && <span className="text-xs text-primary font-bold leading-none">+</span>}
        </div>
      </div>
    </div>
  );
};
