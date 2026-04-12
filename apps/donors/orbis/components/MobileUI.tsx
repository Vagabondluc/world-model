
import React from 'react';
import { 
  Layers, Zap, Microscope, X, Users, Waves, Activity, Mountain, 
  Thermometer, Map as MapIcon, ArrowUpCircle, ArrowDownCircle, 
  Flame, Snowflake, Droplet, Sun
} from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useWorldStore } from '../stores/useWorldStore';
import { useLocalStore } from '../stores/useLocalStore';
import { ViewMode, TerraformMode, SettlementType } from '../types';
import { VoxelVisualizer } from './VoxelVisualizer';

export const MobileUI: React.FC = () => {
  const { 
    mobileTab, setMobileTab, viewMode, setViewMode, 
    toggleGlobeElevation, showGlobeElevation, 
    showClouds, toggleClouds,
    showGlobalLight, toggleGlobalLight 
  } = useUIStore();
  const { 
    selectedHexId, getHexById, setTerraformMode, brushRadius, brushIntensity, setBrushRadius, setBrushIntensity 
  } = useWorldStore();
  const { voxels, isLoading } = useLocalStore();

  const selectedHex = selectedHexId ? getHexById(selectedHexId) : null;

  const ViewModeButton = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => (
    <button 
      onClick={() => setViewMode(mode)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold transition-all uppercase tracking-wider border ${
        viewMode === mode 
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40 translate-y-[-1px]' 
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      }`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );

  const TerraformButton = ({ mode, icon: Icon, label }: { mode: TerraformMode, icon: any, label: string }) => (
    <button 
      onClick={() => setTerraformMode(mode)}
      title={label}
      className={`p-2 rounded transition-all border bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="md:hidden">
      {/* Floating Mobile Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-full shadow-2xl">
        <button 
          onClick={() => setMobileTab(mobileTab === 'LAYERS' ? 'NONE' : 'LAYERS')}
          className={`p-3 rounded-full transition-all ${mobileTab === 'LAYERS' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          <Layers className="w-6 h-6" />
        </button>
        <button 
          onClick={() => {
            setMobileTab(mobileTab === 'TOOLS' ? 'NONE' : 'TOOLS');
            if (mobileTab !== 'TOOLS') setTerraformMode(TerraformMode.RAISE);
            else setTerraformMode(TerraformMode.SELECT);
          }}
          className={`p-3 rounded-full transition-all ${mobileTab === 'TOOLS' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
        >
          <Zap className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setMobileTab(mobileTab === 'INSPECT' ? 'NONE' : 'INSPECT')}
          disabled={!selectedHexId}
          className={`p-3 rounded-full transition-all disabled:opacity-20 ${mobileTab === 'INSPECT' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
        >
          <Microscope className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Bottom Sheets */}
      {mobileTab !== 'NONE' && (
        <div 
          className="absolute inset-x-0 bottom-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out flex flex-col"
          style={{ height: mobileTab === 'INSPECT' ? '60vh' : 'auto' }}
        >
          {/* Header */}
          <div className="w-full flex flex-col items-center py-3 border-b border-slate-800/50">
            <div className="w-12 h-1 bg-slate-700 rounded-full mb-2" />
            <div className="flex justify-between items-center w-full px-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{mobileTab}</span>
              <button onClick={() => setMobileTab('NONE')} className="p-1 bg-slate-800 rounded-full text-slate-500"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto">
            {mobileTab === 'LAYERS' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <ViewModeButton mode={ViewMode.BIOME} icon={MapIcon} label="Biome" />
                  <ViewModeButton mode={ViewMode.CIVILIZATION} icon={Users} label="Civ" />
                  <ViewModeButton mode={ViewMode.RIVERS} icon={Waves} label="Hydro" />
                  <ViewModeButton mode={ViewMode.PLATES} icon={Activity} label="Dynamics" />
                  <ViewModeButton mode={ViewMode.ELEVATION} icon={Mountain} label="Height" />
                  <ViewModeButton mode={ViewMode.TEMPERATURE} icon={Thermometer} label="Thermal" />
                </div>
                <div className="w-full h-[1px] bg-slate-800" />
                <div className="flex flex-wrap gap-2">
                  <button onClick={toggleGlobeElevation} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${showGlobeElevation ? 'bg-amber-900/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Relief</button>
                  <button onClick={toggleClouds} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${showClouds ? 'bg-blue-900/20 border-blue-500 text-blue-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Clouds</button>
                  <button onClick={toggleGlobalLight} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${showGlobalLight ? 'bg-yellow-900/20 border-yellow-500 text-yellow-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Light</button>
                </div>
              </div>
            )}

            {mobileTab === 'TOOLS' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-3">
                  <TerraformButton mode={TerraformMode.RAISE} icon={ArrowUpCircle} label="Raise" />
                  <TerraformButton mode={TerraformMode.LOWER} icon={ArrowDownCircle} label="Lower" />
                  <TerraformButton mode={TerraformMode.HEAT} icon={Flame} label="Heat" />
                  <TerraformButton mode={TerraformMode.COOL} icon={Snowflake} label="Cool" />
                  <TerraformButton mode={TerraformMode.MOISTEN} icon={Droplet} label="Moist" />
                  <TerraformButton mode={TerraformMode.DRY} icon={Sun} label="Dry" />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>Brush Size</span><span>{brushRadius}</span></div>
                    <input type="range" min="0" max="4" step="1" value={brushRadius} onChange={(e) => setBrushRadius(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>Intensity</span><span>{(brushIntensity * 100).toFixed(0)}%</span></div>
                    <input type="range" min="0.05" max="0.5" step="0.05" value={brushIntensity} onChange={(e) => setBrushIntensity(parseFloat(e.target.value))} className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {mobileTab === 'INSPECT' && selectedHex && (
              <div className="flex flex-col h-full gap-4">
                <div className="h-48 shrink-0 bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800">
                  <VoxelVisualizer voxels={voxels} isLoading={isLoading} />
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pb-12">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-indigo-300">{selectedHex.biome}</h2>
                    <span className="text-[10px] font-mono text-slate-500">{selectedHex.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-slate-500">Habitability</span>
                      <div className="text-lg font-bold text-amber-500">{(selectedHex.habitabilityScore * 100).toFixed(0)}%</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-slate-500">Settlement</span>
                      <div className="text-lg font-bold text-indigo-400 truncate">{selectedHex.settlementType}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources</span>
                    {Object.entries(selectedHex.resources).map(([res, val]) => (
                      <div key={res} className="space-y-1">
                        <div className="flex justify-between text-xs capitalize text-slate-300"><span>{res.toLowerCase()}</span><span>{((val as number ?? 0) * 100).toFixed(0)}%</span></div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${(val as number ?? 0) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
