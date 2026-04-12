
import React from 'react';
import { SimulationTuner } from './SimulationTuner';
import { Inspector } from '../Inspector';
import { SimulationDashboard } from '../dashboard/SimulationDashboard';
import { useUIStore } from '../../stores/useUIStore';
import { Activity, Microscope, LayoutDashboard, Maximize2, Minimize2 } from 'lucide-react';
import { TooltipTrigger } from '../ui/TooltipSystem';

export const RightPanel: React.FC = () => {
  const { sidebarTab, setSidebarTab, inspectorMode, setInspectorMode } = useUIStore();

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Tabs */}
      <div className="flex shrink-0 border-b border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setSidebarTab('GLOBAL')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${sidebarTab === 'GLOBAL' ? 'text-indigo-400 bg-slate-800/50 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Activity className="w-3 h-3" /> Global
        </button>
        <button
          onClick={() => (setSidebarTab as any)('DASHBOARD')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${(sidebarTab as any) === 'DASHBOARD' ? 'text-emerald-400 bg-slate-800/50 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <LayoutDashboard className="w-3 h-3" /> Status
        </button>
        <button
          onClick={() => setSidebarTab('LOCAL')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${sidebarTab === 'LOCAL' ? 'text-cyan-400 bg-slate-800/50 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Microscope className="w-3 h-3" /> Local
        </button>
        
        {/* Fullscreen Toggle */}
        <TooltipTrigger content={inspectorMode === 'FULLSCREEN' ? "Dock Panel" : "Fullscreen Panel"}>
          <button 
            onClick={() => setInspectorMode(inspectorMode === 'FULLSCREEN' ? 'DOCKED' : 'FULLSCREEN')}
            className="px-3 border-l border-slate-800 text-slate-500 hover:text-white transition-colors"
          >
            {inspectorMode === 'FULLSCREEN' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </TooltipTrigger>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {sidebarTab === 'GLOBAL' ? <SimulationTuner /> : 
         (sidebarTab as any) === 'DASHBOARD' ? <SimulationDashboard /> :
         <Inspector />}
      </div>
    </div>
  );
};
