
import React from 'react';
import { WorldObject } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { triggerHaptic } from '../../logic/haptics';

interface WorldObjectCardProps {
  object: WorldObject;
  detailed?: boolean;
}

export const WorldObjectCard: React.FC<WorldObjectCardProps> = ({ object }) => {
  const activePlayerId = useGameStore(state => state.activePlayerId);
  const startCombat = useGameStore(state => state.startCombat);
  const age = useGameStore(state => state.age);

  const isHostile = age >= 3 && object.createdBy && object.createdBy !== activePlayerId;

  const handleAttack = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('confirm');
    startCombat(activePlayerId, object.id);
  };

  return (
    <div className="bg-bg-input rounded-lg p-3 border border-white/5 mb-2">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">circle</span>
            <span className="text-xs font-bold text-white">{object.name || object.kind}</span>
          </div>
          <span className="text-[10px] text-text-muted uppercase">{object.kind} · {object.createdBy || 'Nature'}</span>
        </div>
        {isHostile && (
          <button 
            onClick={handleAttack}
            className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[10px]">swords</span>
            Attack
          </button>
        )}
      </div>
    </div>
  );
};
