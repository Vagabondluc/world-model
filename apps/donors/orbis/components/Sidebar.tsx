
import React from 'react';
import { Settings, X, RefreshCw, Save, FolderOpen, RotateCcw, Sun, Play, Pause, FastForward, Timer, Globe, Eye, EyeOff, Cloud, Lightbulb, LightbulbOff, Hexagon, Box } from 'lucide-react';
import { useWorldStore } from '../stores/useWorldStore';
import { useUIStore } from '../stores/useUIStore';
import { useLocalStore } from '../stores/useLocalStore';
import { useTimeStore } from '../stores/useTimeStore';
import { PlanetType } from '../types';
import { ARCHETYPES } from '../services/archetypes';

interface SidebarProps {
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const { seed, config, setSeed, updateConfig, saveWorld, currentProjectName, loadArchetype } = useWorldStore();
  const { 
    isSettingsOpen, toggleSettings, setLoadModalOpen,
    globeMode, setGlobeMode, showClouds, toggleClouds, showGlobalLight, toggleGlobalLight, showGlobeElevation, toggleGlobeElevation
  } = useUIStore();
  const { resolution, updateResolution } = useLocalStore();
  const { isPaused, setPaused, timeScale, setTimeScale, autoPauseEnabled, setAutoPause } = useTimeStore();

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    const name = window.prompt("Enter Project Name:", currentProjectName || `World ${new Date().toLocaleDateString()}`);
    if (name) {
      saveWorld(name);
    }
  };

  const content = (
    <div className="space-y-8 pb-12">
      {/* Project Management Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Project Management</h3>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handleSave}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors text-slate-400 gap-1"
          >
            <Save className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase">Save</span>
          </button>
          <button 
            onClick={() => { setLoadModalOpen(true); if(isMobile) toggleSettings(); }}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-cyan-600 hover:text-white transition-colors text-slate-400 gap-1"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase">Load</span>
          </button>
          <button 
            onClick={() => { setSeed(Math.floor(Math.random() * 10000)); }}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-red-600 hover:text-white transition-colors text-slate-400 gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase">Reset</span>
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      {/* Planetary Archetypes - Phase 21 */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Globe className="w-3 h-3 text-purple-500" /> Planetary Class
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <select 
            value={config.planetType} 
            onChange={(e) => loadArchetype(e.target.value as PlanetType)}
            className="w-full bg-slate-800 text-slate-200 text-xs font-bold p-2 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none uppercase tracking-wide"
          >
            {Object.entries(ARCHETYPES).map(([key, data]) => (
              <option key={key} value={key}>{data.label}</option>
            ))}
          </select>
        </div>
        <div className="text-[9px] text-slate-500 leading-relaxed px-1">
          {config.planetType === PlanetType.LAVA && "Primordial world with active magma oceans and ash atmosphere."}
          {config.planetType === PlanetType.ICE && "Cryo-stasis world with frozen oceans and subsurface vents."}
          {config.planetType === PlanetType.DESERT && "Arid dune world with scarce water and extreme temperatures."}
          {config.planetType === PlanetType.OCEAN && "Thalassic world covered in global shallow seas."}
          {config.planetType === PlanetType.TERRA && "Goldilocks habitable world suitable for carbon-based life."}
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      {/* Viewport Settings */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Eye className="w-3 h-3 text-indigo-400" /> Viewport & Rendering
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 p-1 rounded-lg border border-slate-800 flex">
            <button 
              onClick={() => setGlobeMode('HEX')} 
              className={`flex-1 flex items-center justify-center py-1.5 rounded text-[9px] font-bold uppercase transition-all ${globeMode === 'HEX' ? 'bg-slate-700 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Hexagon className="w-3 h-3 mr-1" /> Hex
            </button>
            <button 
              onClick={() => setGlobeMode('VOXEL')} 
              className={`flex-1 flex items-center justify-center py-1.5 rounded text-[9px] font-bold uppercase transition-all ${globeMode === 'VOXEL' ? 'bg-slate-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Box className="w-3 h-3 mr-1" /> Voxel
            </button>
          </div>
          
          <button 
            onClick={toggleGlobalLight} 
            className={`flex items-center justify-center gap-2 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${showGlobalLight ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            {showGlobalLight ? <Lightbulb className="w-3 h-3" /> : <LightbulbOff className="w-3 h-3" />} Global Light
          </button>

          <button 
            onClick={toggleClouds} 
            className={`flex items-center justify-center gap-2 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${showClouds ? 'bg-blue-900/20 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            <Cloud className="w-3 h-3" /> Atmosphere
          </button>

          <button 
            onClick={toggleGlobeElevation} 
            className={`flex items-center justify-center gap-2 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${showGlobeElevation ? 'bg-amber-900/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            {showGlobeElevation ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} 3D Relief
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      {/* Celestial Cycles - Phase 19 & 22 */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sun className="w-3 h-3 text-amber-500" /> Celestial Dynamics
        </h3>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setPaused(!isPaused)}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${isPaused ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-indigo-600 border-indigo-500 text-white'}`}
           >
             {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
             <span className="text-[9px] font-bold uppercase">{isPaused ? 'Resume' : 'Pause'}</span>
           </button>
           <button 
             onClick={() => setAutoPause(!autoPauseEnabled)}
             title="Auto-pause when rotating globe"
             className={`p-2 rounded-lg border transition-all ${autoPauseEnabled ? 'bg-amber-900/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
           >
             <Timer className="w-4 h-4" />
           </button>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold mb-2 text-slate-400 uppercase tracking-tighter">
            <span>Time Speed</span><span className="text-indigo-400">{timeScale >= 86400 ? (timeScale/86400).toFixed(1) + 'd/s' : timeScale.toFixed(1) + 'x'}</span>
          </div>
          <input type="range" min="0" max="500000" step="1" value={timeScale} onChange={(e) => setTimeScale(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500" />
          <div className="flex justify-between text-[8px] text-slate-600 font-bold mt-1 uppercase tracking-tighter">
             <span>Living</span><span>Historical</span><span>Geologic</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold mb-2 text-slate-400 uppercase tracking-tighter">
            <span>Axial Tilt</span><span className="text-amber-400">{config.orbital.axialTilt}°</span>
          </div>
          <input type="range" min="0" max="90" step="0.5" value={config.orbital.axialTilt} onChange={(e) => updateConfig({ orbital: { ...config.orbital, axialTilt: parseFloat(e.target.value) } })} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500" />
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold mb-2 text-slate-400 uppercase tracking-tighter">
            <span>Day Length</span><span className="text-cyan-400">{(config.orbital.dayLengthSeconds / 3600).toFixed(1)}h</span>
          </div>
          <input type="range" min="3600" max="172800" step="3600" value={config.orbital.dayLengthSeconds} onChange={(e) => updateConfig({ orbital: { ...config.orbital, dayLengthSeconds: parseInt(e.target.value) } })} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500" />
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Lattice Config</h3>
        <div>
          <div className="flex justify-between text-[10px] font-bold mb-2 text-slate-400 uppercase tracking-tighter">
            <span>Subdivision</span><span className="text-indigo-400">Level {config.subdivisions}</span>
          </div>
          <input type="range" min="1" max="7" step="1" value={config.subdivisions} onChange={(e) => updateConfig({ subdivisions: parseInt(e.target.value) })} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] font-bold mb-2 text-slate-400 uppercase tracking-tighter">
            <span>Relief Strength</span><span className="text-amber-400">{config.elevationScale.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.5" max="3.0" step="0.1" value={config.elevationScale} onChange={(e) => updateConfig({ elevationScale: parseFloat(e.target.value) })} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500" />
        </div>
      </div>
      <div className="w-full h-[1px] bg-slate-800" />
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Voxel Resolution</h3>
        <div>
          <div className="flex justify-between text-[10px] font-bold mb-2 text-slate-400 uppercase tracking-tighter">
            <span>Detail</span><span className="text-cyan-400">{resolution}px</span>
          </div>
          <input type="range" min="8" max="48" step="4" value={resolution} onChange={(e) => updateResolution(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500" />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="absolute inset-0 z-[100] bg-slate-950/95 p-6 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest">
            <Settings className="w-4 h-4" /> Core Config
          </div>
          <button onClick={toggleSettings} className="p-2 bg-slate-800 rounded-full text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-40 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest">
          <Settings className="w-4 h-4" /> Synthesis Core
        </div>
        <button onClick={toggleSettings} className="text-slate-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>
      {content}
    </div>
  );
};
