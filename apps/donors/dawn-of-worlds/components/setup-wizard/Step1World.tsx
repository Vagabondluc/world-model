import React, { useState } from 'react';
import { GameSessionConfig } from '../../types';
import { SUGGESTED_NAMES } from '../../logic/wizard-data';
import { MapPreview } from './MapPreview';
import { triggerHaptic } from '../../logic/haptics';

interface Step1WorldProps {
  config: GameSessionConfig;
  setConfig: (config: GameSessionConfig) => void;
}

export const Step1World: React.FC<Step1WorldProps> = ({ config, setConfig }) => {
  const [zoom, setZoom] = useState(0.4);

  const updateGen = (key: keyof typeof config.worldGen, val: number) => {
    setConfig({
      ...config,
      worldGen: { ...config.worldGen, [key]: val }
    });
  };

  const randomizeSeed = () => {
    triggerHaptic('tap');
    updateGen('seed', Math.floor(Math.random() * 1000000));
  };

  const randomizeName = () => {
    triggerHaptic('tap');
    const name = SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
    setConfig({...config, worldName: name});
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 h-full animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Left Column: Form Controls */}
      <div className="space-y-8 flex flex-col justify-start max-w-md">
        
        {/* World Designation */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block">Designation</label>
          <div className="flex items-center gap-6 group">
            <input 
              type="text" 
              value={config.worldName}
              onChange={(e) => setConfig({...config, worldName: e.target.value})}
              placeholder="Name your world..."
              autoFocus
              className="flex-1 bg-transparent border-b-2 border-white/10 py-3 text-4xl font-display font-black text-white placeholder:text-white/5 focus:border-primary focus:outline-none transition-all"
            />
            <button 
              onClick={randomizeName} 
              className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/50 transition-all active:scale-95 shadow-lg"
              title="Randomize Name"
            >
              <span className="material-symbols-outlined text-2xl font-variation-fill">casino</span>
            </button>
          </div>
          <p className="text-[10px] text-text-muted italic opacity-60">This unique identifier will label your chronological records.</p>
        </div>

        {/* Spatial Dimensions */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block">Dimensions</label>
          <div className="grid grid-cols-3 gap-4">
            {(['SMALL', 'STANDARD', 'GRAND'] as const).map(size => (
              <button
                key={size}
                onClick={() => setConfig({...config, mapSize: size})}
                className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all relative overflow-hidden group ${
                  config.mapSize === size 
                    ? 'bg-primary/20 border-primary text-white shadow-glow' 
                    : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
                  {size === 'SMALL' ? 'grid_view' : size === 'STANDARD' ? 'map' : 'public'}
                </span>
                <span className="text-[9px] font-black tracking-[0.1em] uppercase">{size}</span>
                {config.mapSize === size && <div className="absolute top-2 right-2 size-1.5 rounded-full bg-primary animate-pulse"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Topography Parameters */}
        <div className="space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
           <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block">Topography Dials</label>
           
           <div className="space-y-6">
              {/* Range: Water */}
              <div className="space-y-3">
                 <div className="flex justify-between text-[11px] uppercase font-bold">
                    <span className="text-white/80">Oceanic Depth</span>
                    <span className="text-cyan-400 font-mono">{Math.round(config.worldGen.waterLevel * 100)}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="1" step="0.05" 
                   value={config.worldGen.waterLevel}
                   onChange={e => updateGen('waterLevel', parseFloat(e.target.value))}
                   className="w-full accent-cyan-500 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer"
                 />
              </div>

              {/* Range: Mountains */}
              <div className="space-y-3">
                 <div className="flex justify-between text-[11px] uppercase font-bold">
                    <span className="text-white/80">Tectonic Density</span>
                    <span className="text-purple-400 font-mono">{Math.round(config.worldGen.mountainDensity * 100)}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="1" step="0.05" 
                   value={config.worldGen.mountainDensity}
                   onChange={e => updateGen('mountainDensity', parseFloat(e.target.value))}
                   className="w-full accent-purple-500 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer"
                 />
              </div>
           </div>
        </div>

        {/* Seed & Entropy */}
        <div className="space-y-3">
           <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Primordial Seed</label>
              <button 
                onClick={randomizeSeed} 
                className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary-light hover:text-white hover:bg-primary/20 transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg"
              >
                 <span className="material-symbols-outlined text-xs">refresh</span>
                 Generate New
              </button>
           </div>
           <div className="relative group">
              <input 
                type="number" 
                value={config.worldGen.seed}
                onChange={e => updateGen('seed', parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-mono text-xl focus:border-primary focus:bg-black/60 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/10 group-focus-within:text-primary transition-colors">fingerprint</span>
           </div>
        </div>
      </div>

      {/* Right Column: Visualization */}
      <div className="flex flex-col gap-4 h-full">
         <div className="flex justify-between items-end bg-black/20 p-4 rounded-2xl border border-white/5">
            <div>
               <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1">Preview Protocol</label>
               <p className="text-[9px] text-text-muted uppercase font-bold opacity-50">Real-time Procedural Mesh</p>
            </div>
            <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
               <span className="material-symbols-outlined text-xs text-text-muted">zoom_in</span>
               <input 
                  type="range" min="0.1" max="1.5" step="0.05"
                  value={zoom}
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="w-32 accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
               />
               <span className="text-[10px] font-mono text-white/40 w-8 text-right">{Math.round(zoom * 100)}%</span>
            </div>
         </div>
         <div className="flex-1 min-h-0 relative group">
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
               <MapPreview config={config} zoom={zoom} />
            </div>
            {/* Legend Overlays */}
            <div className="absolute top-4 left-4 pointer-events-none flex gap-2">
               <div className="flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded text-[9px] font-black uppercase text-cyan-400 border border-cyan-500/20">
                  <span className="size-1.5 bg-cyan-600 rounded-full"></span> Water
               </div>
               <div className="flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded text-[9px] font-black uppercase text-purple-400 border border-purple-500/20">
                  <span className="size-1.5 bg-purple-600 rounded-full"></span> Mountain
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};