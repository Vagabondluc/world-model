
import React from 'react';
import { Globe, RefreshCw, Settings, Menu, Compass, HelpCircle, Map as MapIcon, Rotate3d, Scan } from 'lucide-react';
import { useWorldStore } from '../stores/useWorldStore';
import { useUIStore } from '../stores/useUIStore';
import { TooltipTrigger } from './ui/TooltipSystem';

export const Header: React.FC = () => {
  const { seed, config, isGenerating, setSeed, regenerateWorld, selectedHexId } = useWorldStore();
  const { 
    isSettingsOpen, toggleSettings, isCosmicPanelOpen, toggleCosmicPanel, 
    setHelpOpen, projectionMode, setProjectionMode, mapProjection, setMapProjection 
  } = useUIStore();

  const handleProjectionCycle = () => {
    if (projectionMode === 'GLOBE') {
        setProjectionMode('FLAT');
        setMapProjection('EQUIRECTANGULAR');
    } else {
        // Cycle map projections
        if (mapProjection === 'EQUIRECTANGULAR') {
            setMapProjection('MOLLWEIDE');
        } else if (mapProjection === 'MOLLWEIDE') {
            // Only allow LOCAL if a hex is selected
            if (selectedHexId) {
                setMapProjection('LOCAL');
            } else {
                setMapProjection('EQUIRECTANGULAR');
                setProjectionMode('GLOBE');
            }
        } else {
            // LOCAL -> GLOBE
            setMapProjection('EQUIRECTANGULAR'); // Reset
            setProjectionMode('GLOBE');
        }
    }
  };

  const getProjectionLabel = () => {
      if (projectionMode === 'GLOBE') return 'Globe';
      if (mapProjection === 'EQUIRECTANGULAR') return 'Map (Rect)';
      if (mapProjection === 'MOLLWEIDE') return 'Map (Oval)';
      return 'Region (Local)';
  };

  const getProjectionIcon = () => {
      if (projectionMode === 'GLOBE') return <Globe className="w-4 h-4" />;
      if (mapProjection === 'EQUIRECTANGULAR') return <MapIcon className="w-4 h-4" />;
      if (mapProjection === 'MOLLWEIDE') return <Rotate3d className="w-4 h-4" />;
      return <Scan className="w-4 h-4" />;
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md items-center px-6 justify-between shrink-0 z-50 shadow-2xl relative">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-indigo-500 animate-pulse" />
          <h1 className="font-bold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            ORBIS <span className="text-slate-500 font-medium text-sm ml-2">Planetary Voxel Engine</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 border-r border-slate-800 pr-6">
            <span className="uppercase tracking-tighter">Vertices: <span className="text-slate-300">{(10 * Math.pow(4, config.subdivisions) + 2).toLocaleString()}</span></span>
            <span className="uppercase tracking-tighter">Seed: <span className="text-indigo-400">{seed}</span></span>
          </div>
          
          <TooltipTrigger content="Cycle View Projection (Globe -> Rect -> Oval -> Local)">
            <button 
              onClick={handleProjectionCycle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${projectionMode === 'FLAT' ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
            >
              {getProjectionIcon()}
              <span className="text-[10px] font-bold uppercase tracking-widest">{getProjectionLabel()}</span>
            </button>
          </TooltipTrigger>

          <TooltipTrigger content="Toggle Architect Panel">
            <button 
              onClick={toggleCosmicPanel}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isCosmicPanelOpen ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
            >
              <Compass className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Architect</span>
            </button>
          </TooltipTrigger>

          <TooltipTrigger content="Regenerate World">
            <button 
              disabled={isGenerating}
              onClick={() => setSeed(Math.floor(Math.random() * 10000))} 
              className={`flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded font-bold text-[10px] uppercase tracking-widest transition-all ${isGenerating ? 'animate-pulse' : ''}`}
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} /> 
              {isGenerating ? 'Synthesizing...' : 'Regenerate'}
            </button>
          </TooltipTrigger>

          <div className="flex gap-2">
            <TooltipTrigger content="Help & Controls">
              <button 
                onClick={() => setHelpOpen(true)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipTrigger content="Toggle Sidebar">
              <button 
                onClick={toggleSettings} 
                className={`p-2 rounded-full transition-colors ${isSettingsOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex md:hidden h-12 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md items-center px-4 justify-between shrink-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <h1 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">ORBIS</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setHelpOpen(true)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleCosmicPanel}
            className={`p-1.5 rounded-lg transition-colors ${isCosmicPanelOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            <Compass className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleSettings}
            className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>
    </>
  );
};
