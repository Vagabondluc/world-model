
import React from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { useUIStore } from '../stores/useUIStore';
import { ChevronLeft, Sun, Wind, MoveHorizontal, RefreshCcw, Gauge, Orbit, Info } from 'lucide-react';
import { TooltipTrigger } from './ui/TooltipSystem';

const ControlRow = ({ 
  label, 
  icon: Icon, 
  value, 
  min, 
  max, 
  step, 
  unit, 
  onChange,
  colorClass,
  description
}: { 
  label: string; 
  icon: any; 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  unit: string; 
  onChange: (val: number) => void;
  colorClass: string;
  description: string;
}) => (
  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 hover:border-slate-700 transition-colors group">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-800 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
          <span className="text-[9px] text-slate-600 hidden group-hover:block transition-all">{description}</span>
        </div>
      </div>
      <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
        {value.toFixed(1)} <span className="text-slate-500 text-[9px]">{unit}</span>
      </span>
    </div>
    
    <div className="flex items-center gap-3">
      <span className="text-[8px] font-mono text-slate-600">{min}</span>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
        aria-label={label}
      />
      <span className="text-[8px] font-mono text-slate-600">{max}</span>
    </div>
  </div>
);

export const CosmicPanel: React.FC = () => {
  const { isCosmicPanelOpen, toggleCosmicPanel } = useUIStore();
  const { config, updateConfig } = useWorldStore();

  if (!isCosmicPanelOpen) return null;

  const handleGravity = (v: number) => updateConfig({ scale: v });
  const handleSolar = (v: number) => updateConfig({ tempOffset: (v - 1.0) * 50 });
  const handleAtmosphere = (v: number) => updateConfig({ moistureOffset: (v - 1.0) * 0.5 });
  const handleRotation = (v: number) => {
    const speed = v === 0 ? 0.01 : v;
    const baseGameDay = 60; 
    // Ensure integer seconds for BigInt compatibility downstream
    const newDayLength = Math.floor(baseGameDay / Math.abs(speed));
    updateConfig({ orbital: { ...config.orbital, dayLengthSeconds: newDayLength } });
  };

  const currentSolar = 1.0 + (config.tempOffset / 50);
  const currentAtmos = 1.0 + (config.moistureOffset / 0.5);
  const currentRotation = 60 / config.orbital.dayLengthSeconds;

  return (
    <div className="absolute top-20 right-6 z-[60] w-80 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-950/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with clear BACK button */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <button 
            onClick={toggleCosmicPanel} 
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest pr-3 border-r border-slate-800"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1 flex items-center justify-end gap-2">
            <h2 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">Architect</h2>
            <Orbit className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-3">
          <div className="bg-indigo-900/20 border border-indigo-500/20 p-3 rounded-lg flex gap-3 items-start">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-indigo-200 leading-relaxed">
              Planetary physics override. Changes to these constants will reshape the world's climate and geology.
            </p>
          </div>

          <ControlRow 
            label="Gravity" 
            icon={MoveHorizontal} 
            value={config.scale} 
            min={0.1} max={5.0} step={0.1} unit="R⊕"
            onChange={handleGravity}
            colorClass="text-emerald-400"
            description="Affects surface area and gravity calculations."
          />

          <ControlRow 
            label="Insolation" 
            icon={Sun} 
            value={currentSolar} 
            min={0.1} max={3.0} step={0.1} unit="S₀"
            onChange={handleSolar}
            colorClass="text-amber-400"
            description="Solar flux affecting global temperature."
          />

          <ControlRow 
            label="Atmosphere" 
            icon={Wind} 
            value={currentAtmos} 
            min={0.1} max={3.0} step={0.1} unit="atm"
            onChange={handleAtmosphere}
            colorClass="text-cyan-400"
            description="Gas density affecting greenhouse effect."
          />

          <ControlRow 
            label="Spin Rate" 
            icon={RefreshCcw} 
            value={currentRotation} 
            min={0.1} max={4.0} step={0.1} unit="x"
            onChange={handleRotation}
            colorClass="text-fuchsia-400"
            description="Rotational velocity (Day/Night speed)."
          />

          <div className="pt-2 border-t border-slate-800">
             <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>LOCAL GRAVITY</span>
                <span className="text-slate-300">{(config.scale * 9.8).toFixed(2)} m/s²</span>
             </div>
             <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>ANNUAL MEAN TEMP</span>
                <span className="text-slate-300">{14 + config.tempOffset}°C</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
