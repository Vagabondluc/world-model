
import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { 
  Orbit, Mountain, Wind, Droplet, Clock, ChevronDown, ChevronRight,
  Thermometer, Activity, Layers, Globe, Sparkles
} from 'lucide-react';
import { PlaneId, StratumId } from '../../types';

const Section = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
  <div className="border-b border-slate-800">
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-900 transition-colors"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Icon className="w-4 h-4 text-indigo-500" />
        {title}
      </div>
      {isOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
    </button>
    {isOpen && (
      <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
        {children}
      </div>
    )}
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, unit }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-medium text-slate-500 uppercase">
      <span>{label}</span>
      <span className="text-slate-300 font-mono">{value.toFixed(step < 1 ? 2 : 0)}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
    />
  </div>
);

const Toggle = ({ label, value, onChange }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-medium text-slate-500 uppercase">{label}</span>
    <button 
      onClick={() => onChange(!value)}
      className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-indigo-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="space-y-1">
    <span className="text-[10px] font-medium text-slate-500 uppercase">{label}</span>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-800 text-slate-200 text-[10px] font-bold p-2 rounded border border-slate-700 outline-none focus:border-indigo-500"
    >
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={v as string}>{k}</option>
      ))}
    </select>
  </div>
);

export const SimulationTuner: React.FC = () => {
  const { config, updateConfig } = useWorldStore();
  const { timeScale, setTimeScale } = useTimeStore();
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'COSMOLOGY': true,
    'COSMIC': false,
    'TECTONIC': false,
  });

  const toggle = (id: string) => setOpenSections(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" /> Simulation Core
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Phase 25: Cosmology */}
        <Section title="Cosmology" icon={Sparkles} isOpen={openSections['COSMOLOGY']} onToggle={() => toggle('COSMOLOGY')}>
           <div className="p-2 bg-indigo-900/20 border border-indigo-500/20 rounded text-[9px] text-indigo-200 mb-2">
              Multi-axial generation allows exploring different planes and vertical strata of the world. Regenerate to apply changes.
           </div>
           <Select 
             label="Planar Resonance" 
             value={config.activePlane} 
             options={PlaneId} 
             onChange={(v: PlaneId) => updateConfig({ activePlane: v })} 
           />
           <Select 
             label="Vertical Stratum" 
             value={config.activeStratum} 
             options={StratumId} 
             onChange={(v: StratumId) => updateConfig({ activeStratum: v })} 
           />
        </Section>

        {/* L0: Cosmic */}
        <Section title="Cosmic & Orbital" icon={Orbit} isOpen={openSections['COSMIC']} onToggle={() => toggle('COSMIC')}>
          <Slider 
            label="Planetary Scale" value={config.scale} min={0.1} max={5.0} step={0.1} unit="R⊕"
            onChange={(v: number) => updateConfig({ scale: v })} 
          />
          <Slider 
            label="Axial Tilt" value={config.orbital.axialTilt} min={0} max={90} step={1} unit="°"
            onChange={(v: number) => updateConfig({ orbital: { ...config.orbital, axialTilt: v } })} 
          />
          <Slider 
            label="Day Length" value={config.orbital.dayLengthSeconds} min={30} max={300} step={10} unit="s"
            onChange={(v: number) => updateConfig({ orbital: { ...config.orbital, dayLengthSeconds: v } })} 
          />
        </Section>

        {/* L1: Geosphere */}
        <Section title="Geosphere" icon={Mountain} isOpen={openSections['TECTONIC']} onToggle={() => toggle('TECTONIC')}>
          <Slider 
            label="Plate Complexity" value={config.plateCount} min={4} max={40} step={1} unit=""
            onChange={(v: number) => updateConfig({ plateCount: v })} 
          />
          <Slider 
            label="Relief Scale" value={config.elevationScale} min={0.1} max={4.0} step={0.1} unit="x"
            onChange={(v: number) => updateConfig({ elevationScale: v })} 
          />
          <Toggle 
            label="Supercontinent Cycle" 
            value={config.supercontinentCycle ?? false} 
            onChange={(v: boolean) => updateConfig({ supercontinentCycle: v })} 
          />
          <div className="text-[9px] text-slate-500 leading-tight pt-1">
            Enabling Supercontinent will cluster plates. Accelerate time (Geologic) to witness separation.
          </div>
        </Section>

        {/* L2: Hydrosphere */}
        <Section title="Hydrosphere" icon={Droplet} isOpen={openSections['HYDRO']} onToggle={() => toggle('HYDRO')}>
          <Slider 
            label="Sea Level" value={config.seaLevel} min={-1.0} max={1.0} step={0.05} unit="m"
            onChange={(v: number) => updateConfig({ seaLevel: v })} 
          />
          <Slider 
            label="Global Moisture" value={config.moistureOffset} min={-1.0} max={1.0} step={0.1} unit=""
            onChange={(v: number) => updateConfig({ moistureOffset: v })} 
          />
        </Section>

        {/* L3: Atmosphere */}
        <Section title="Atmosphere" icon={Wind} isOpen={openSections['ATMOS']} onToggle={() => toggle('ATMOS')}>
          <Slider 
            label="Global Temp" value={config.tempOffset} min={-50} max={50} step={1} unit="°C"
            onChange={(v: number) => updateConfig({ tempOffset: v })} 
          />
        </Section>

        {/* Temporal */}
        <Section title="Chronos" icon={Clock} isOpen={openSections['TIME']} onToggle={() => toggle('TIME')}>
          <Slider 
            label="Time Speed" value={timeScale} min={0} max={500000} step={500} unit="x"
            onChange={setTimeScale} 
          />
        </Section>

      </div>
    </div>
  );
};
