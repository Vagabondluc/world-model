import React from 'react';
import type { EraButtonProps, EraStatus } from '../../types';
import { cn } from '../../utils/cn';
import { componentStyles } from '../../design/tokens';

const EraButton = ({ era, status, onClick }: EraButtonProps) => {
  const { button: btnStyles } = componentStyles;
  
  const statusClasses: { [key in EraStatus]: string } = {
    completed: btnStyles.eraCompleted,
    current: btnStyles.eraCurrent,
    locked: btnStyles.eraLocked,
    available: btnStyles.eraAvailable
  };

  return (
    <button
      className={cn(btnStyles.eraBase, statusClasses[status])}
      disabled={status === 'locked'}
      aria-label={`${era.name} - Status: ${status}`}
      onClick={() => onClick && onClick(era.id)}
    >
      <span className="text-2xl">{era.icon}</span>
      <span className="hidden md:inline">{era.name}</span>
    </button>
  );
};

export default EraButton;
