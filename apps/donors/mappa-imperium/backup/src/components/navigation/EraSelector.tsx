
import React from 'react';
import { eras } from '../../data/eras';
import EraButton from '../shared/EraButton';
import type { EraStatus } from '../../types';
import { useGameStore } from '../../stores/gameStore';

const EraSelector = () => {
    const { currentEraId, viewedEraId, selectEra, isEraNavigationUnlocked } = useGameStore();

    const getEraStatus = (eraId: number): EraStatus => {
        if (eraId === viewedEraId) return 'current';
        if (isEraNavigationUnlocked) {
            return eraId < currentEraId ? 'completed' : 'available';
        }
        if (eraId > currentEraId) return 'locked';
        if (eraId === currentEraId) return 'available';
        return 'completed';
    };

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap p-2">
      {eras.map(era => (
        <EraButton
          key={era.id}
          era={era}
          status={getEraStatus(era.id)}
          onClick={selectEra}
        />
      ))}
    </div>
  );
};

export default EraSelector;
