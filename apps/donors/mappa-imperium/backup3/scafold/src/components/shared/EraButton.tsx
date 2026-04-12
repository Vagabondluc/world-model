import React from 'react';
import type { EraButtonProps, EraStatus } from '../../types';

const EraButton = ({ era, status, onClick }: EraButtonProps) => {
  const statusClasses: { [key in EraStatus]: string } = {
    completed: "btn-era-completed",
    current: "btn-era-current",
    locked: "btn-era-locked",
    available: "btn-era-available"
  };

  return (
    <button
      className={`btn-era ${statusClasses[status]}`}
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
