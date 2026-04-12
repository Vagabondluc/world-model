
import React from 'react';
import { useGameStore } from '../../store/gameStore';

interface BrandSectionProps {
  onBrandClick: () => void;
}

export const BrandSection: React.FC<BrandSectionProps> = ({ onBrandClick }) => {
  const worldName = useGameStore(state => state.config?.worldName);

  return (
    <button 
      type="button"
      className="flex items-center gap-3 cursor-pointer group" 
      onClick={onBrandClick} 
      aria-label="Open Council Dashboard"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-glow transition-transform group-hover:scale-105">
        <span className="material-symbols-outlined text-lg font-variation-fill" aria-hidden="true">public</span>
      </div>
      <div className="text-left">
        <h2 className="text-sm font-bold leading-none text-white font-display">{worldName || 'Dawn-01'}</h2>
        <span className="text-[10px] uppercase tracking-wider text-text-muted group-hover:text-primary transition-colors">Council Dashboard</span>
      </div>
    </button>
  );
};
