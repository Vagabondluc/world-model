
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useRegionBorders } from '../hooks/useRegionBorders';

interface VectorGridProps {
  width: number;
  height: number;
}

const VectorGrid: React.FC<VectorGridProps> = ({ width, height }) => {
  const worldCache = useGameStore(state => state.worldCache);
  const players = useGameStore(state => state.config?.players);
  const paths = useRegionBorders(worldCache, players);

  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      style={{ width: `${width}px`, height: `${height}px`, zIndex: 20 }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow-nation" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {paths.map((p, i) => (
        <path
          key={`${p.id}-${i}`}
          d={p.path}
          stroke={p.color}
          strokeWidth={p.strokeWidth}
          strokeDasharray={p.strokeDasharray}
          strokeLinecap="round"
          fill="none"
          opacity={p.opacity}
          filter={p.strokeWidth > 2 ? "url(#glow-nation)" : undefined}
        />
      ))}
    </svg>
  );
};

export default VectorGrid;
