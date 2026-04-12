
import React from 'react';
import { BiomeType } from '../types';

interface BiomeOption {
  type: BiomeType;
  icon: string;
  label: string;
  color: string;
  glow: string;
}

const BIOME_OPTIONS: BiomeOption[] = [
  { type: 'plains', icon: 'filter_hdr', label: 'Plains', color: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' },
  { type: 'forest', icon: 'forest', label: 'Forest', color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]' },
  { type: 'water', icon: 'water', label: 'Water', color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
  { type: 'mountain', icon: 'terrain', label: 'Mountain', color: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
  { type: 'desert', icon: 'wb_sunny', label: 'Desert', color: 'text-orange-300', glow: 'shadow-[0_0_15px_rgba(253,186,116,0.3)]' },
  { type: 'swamp', icon: 'humidity_mid', label: 'Swamp', color: 'text-teal-600', glow: 'shadow-[0_0_15px_rgba(13,148,136,0.3)]' },
  { type: 'city', icon: 'location_city', label: 'City', color: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
];

interface BiomeToolbarProps {
  activeBiome: BiomeType | null;
  onSelectBiome: (type: BiomeType | null) => void;
}

const BiomeToolbar: React.FC<BiomeToolbarProps> = ({ activeBiome, onSelectBiome }) => {
  return (
    <div className="max-w-[90vw] overflow-x-auto no-scrollbar bg-bg-panel/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
      <div className="flex items-center gap-1.5 min-w-max">
        {/* Selection Tool (Default) */}
        <button
          onClick={() => onSelectBiome(null)}
          className={`group relative flex items-center justify-center size-11 rounded-xl transition-all duration-300 ${
            activeBiome === null 
              ? 'bg-primary text-white shadow-[0_0_20px_rgba(127,19,236,0.5)]' 
              : 'text-text-muted hover:bg-white/5 hover:text-white'
          }`}
          title="Selection Cursor"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">near_me</span>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-bg-dark border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl scale-90 group-hover:scale-100 hidden md:block">
            Selection
          </div>
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-1.5"></div>

        <div className="flex items-center gap-1.5">
          {BIOME_OPTIONS.map((biome) => (
            <button
              key={biome.type}
              onClick={() => onSelectBiome(biome.type)}
              className={`group relative flex items-center justify-center size-11 rounded-xl transition-all duration-300 ${
                activeBiome === biome.type 
                  ? `bg-white/10 ${biome.color} ${biome.glow} border border-white/10 scale-105` 
                  : 'text-text-muted hover:bg-white/5 hover:text-white hover:-translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
                {biome.icon}
              </span>
              
              {/* Tooltip (Desktop only to prevent mobile overlap) */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-bg-dark border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl scale-90 group-hover:scale-100 hidden md:block">
                {biome.label}
              </div>
              
              {/* Active Indicator */}
              {activeBiome === biome.type && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current ${biome.color}`}></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiomeToolbar;
