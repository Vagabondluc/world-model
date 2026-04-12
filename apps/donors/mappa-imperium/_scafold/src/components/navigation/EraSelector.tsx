import React from 'react';
import { eras } from '../../data/eras';
import EraButton from '../shared/EraButton';
import type { EraStatus } from '../../types';

interface EraSelectorProps {
    currentEraId: number; // Represents the highest unlocked (progression) era
    viewedEraId: number;  // Represents the era currently being displayed
    onEraSelect: (eraId: number) => void;
    isEraNavigationUnlocked: boolean;
}

const EraSelector = ({ currentEraId, viewedEraId, onEraSelect, isEraNavigationUnlocked }: EraSelectorProps) => {
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
    <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      {eras.map(era => (
        <EraButton
          key={era.id}
          era={era}
          status={getEraStatus(era.id)}
          onClick={onEraSelect}
        />
      ))}
    </div>
  );
};

export default EraSelector;