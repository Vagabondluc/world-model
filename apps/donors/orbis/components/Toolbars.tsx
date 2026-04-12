
import React from 'react';
import { 
  Map as MapIcon, Users, Waves, Activity, Mountain, Thermometer, 
  Hexagon, Box, Eye, EyeOff, Cloud, MousePointer2, 
  ArrowUpCircle, ArrowDownCircle, Flame, Snowflake, Droplet, Sun, Wind, Lightbulb, LightbulbOff, Swords
} from 'lucide-react';
import { ViewMode, TerraformMode } from '../types';
import { useUIStore } from '../stores/useUIStore';
import { useWorldStore } from '../stores/useWorldStore';
import { TooltipTrigger } from './ui/TooltipSystem';

const ViewModeButton = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => {
  const { viewMode, setViewMode } = useUIStore();
  return (
    <TooltipTrigger content={label}>
      <button 
        onClick={() => setViewMode(mode)}
        aria-label={`View ${label}`}
        className={`w-full flex items-center gap-2 px-2 py-2 rounded text-[9px] font-bold transition-all uppercase tracking-wider border ${
          viewMode === mode 
            ? 'bg-indigo-600 border-indigo-500 text-white' 
            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
        }`}
      >
        <Icon className="w-4 h-4 mx-auto" />
      </button>
    </TooltipTrigger>
  );
};

const TerraformButton = ({ mode, icon: Icon, label }: { mode: TerraformMode, icon: any, label: string }) => {
  const { terraformMode, setTerraformMode } = useWorldStore();
  return (
    <TooltipTrigger content={label}>
      <button 
        onClick={() => setTerraformMode(mode)}
        aria-label={`Tool ${label}`}
        className={`w-full p-2 rounded transition-all border ${
          terraformMode === mode 
            ? 'bg-amber-600 border-amber-500 text-white' 
            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
        }`}
      >
        <Icon className="w-4 h-4 mx-auto" />
      </button>
    </TooltipTrigger>
  );
};

export const Toolbars: React.FC = () => {
  const { 
    globeMode, setGlobeMode, showGlobeElevation, toggleGlobeElevation, showClouds, toggleClouds 
  } = useUIStore();
  const { terraformMode, brushRadius, brushIntensity, setBrushRadius, setBrushIntensity } = useWorldStore();

  return (
    <div className="flex flex-col gap-4 px-2 items-center">
      
      {/* View Modes */}
      <div className="w-full flex flex-col gap-1">
        <div className="text-[8px] font-bold text-slate-600 uppercase text-center mb-1">Views</div>
        <ViewModeButton mode={ViewMode.BIOME} icon={MapIcon} label="Biome Distribution" />
        <ViewModeButton mode={ViewMode.ELEVATION} icon={Mountain} label="Height Map" />
        <ViewModeButton mode={ViewMode.PLATES} icon={Activity} label="Tectonic Plates" />
        <ViewModeButton mode={ViewMode.ATMOSPHERE} icon={Wind} label="Atmosphere & Wind" />
        <ViewModeButton mode={ViewMode.CIVILIZATION} icon={Users} label="Settlements" />
      </div>

      <div className="w-8 h-[1px] bg-slate-800" />

      {/* Render Toggles */}
      <div className="w-full flex flex-col gap-2">
        <TooltipTrigger content={globeMode === 'HEX' ? "Switch to Voxel Globe" : "Switch to Hex Globe"}>
          <button onClick={() => setGlobeMode(globeMode === 'HEX' ? 'VOXEL' : 'HEX')} className="p-2 rounded text-slate-400 hover:text-white border border-slate-800 bg-slate-900/50">
            {globeMode === 'HEX' ? <Hexagon className="w-4 h-4 mx-auto" /> : <Box className="w-4 h-4 mx-auto" />}
          </button>
        </TooltipTrigger>
        <TooltipTrigger content={showGlobeElevation ? "Flatten Relief" : "Apply 3D Relief"}>
          <button onClick={toggleGlobeElevation} className={`p-2 rounded border border-slate-800 ${showGlobeElevation ? 'text-amber-400' : 'text-slate-500'}`}>
            <Mountain className="w-4 h-4 mx-auto" />
          </button>
        </TooltipTrigger>
        <TooltipTrigger content={showClouds ? "Hide Atmosphere" : "Show Atmosphere"}>
          <button onClick={toggleClouds} className={`p-2 rounded border border-slate-800 ${showClouds ? 'text-blue-400' : 'text-slate-500'}`}>
            <Cloud className="w-4 h-4 mx-auto" />
          </button>
        </TooltipTrigger>
      </div>

      <div className="w-8 h-[1px] bg-slate-800" />

      {/* Terraform Tools */}
      <div className="w-full flex flex-col gap-1">
        <div className="text-[8px] font-bold text-slate-600 uppercase text-center mb-1">Tools</div>
        <TerraformButton mode={TerraformMode.SELECT} icon={MousePointer2} label="Select/Inspect" />
        <TerraformButton mode={TerraformMode.RAISE} icon={ArrowUpCircle} label="Raise Terrain" />
        <TerraformButton mode={TerraformMode.LOWER} icon={ArrowDownCircle} label="Lower Terrain" />
        <TerraformButton mode={TerraformMode.MOISTEN} icon={Droplet} label="Add Moisture" />
        <TerraformButton mode={TerraformMode.DRY} icon={Sun} label="Dry Out" />
      </div>

      {terraformMode !== TerraformMode.SELECT && (
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-800 w-full">
          <TooltipTrigger content="Brush Radius">
            <input type="range" min="0" max="4" step="1" value={brushRadius} onChange={(e) => setBrushRadius(parseInt(e.target.value))} className="w-10 h-1 bg-slate-800 rounded accent-amber-500" />
          </TooltipTrigger>
          <TooltipTrigger content="Brush Intensity">
            <input type="range" min="0.05" max="0.5" step="0.05" value={brushIntensity} onChange={(e) => setBrushIntensity(parseFloat(e.target.value))} className="w-10 h-1 bg-slate-800 rounded accent-amber-500" />
          </TooltipTrigger>
        </div>
      )}
    </div>
  );
};
