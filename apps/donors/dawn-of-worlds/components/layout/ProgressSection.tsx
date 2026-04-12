
import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const ProgressSection: React.FC = () => {
  const age = useGameStore(state => state.age);
  const round = useGameStore(state => state.round);

  return (
    <div className="flex items-center gap-6" aria-live="polite" aria-atomic="true">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-text-muted font-bold tracking-tighter mb-0.5">Progression</span>
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="text-primary-light">Age {age === 1 ? 'I' : age === 2 ? 'II' : 'III'}</span>
          <span className="text-white/20" aria-hidden="true">/</span>
          <span>Round {round}</span>
        </div>
      </div>
    </div>
  );
};
