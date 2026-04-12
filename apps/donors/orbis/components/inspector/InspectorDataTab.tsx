
import React, { useMemo } from 'react';
import { Move, Trash2, Zap, Tag, Footprints, Shield, Pickaxe, Box, Hexagon } from 'lucide-react';
import { useLocalStore } from '../../stores/useLocalStore';
import { useUIStore } from '../../stores/useUIStore';
import { HexData } from '../../types';
import { VoxelVisualizer } from '../VoxelVisualizer';
import { resolvePointSemantic } from '../../services/semanticResolver';
import { useRegionStore } from '../../stores/useRegionStore';

interface InspectorDataTabProps {
    selectedHex: HexData;
}

export const InspectorDataTab: React.FC<InspectorDataTabProps> = ({ selectedHex }) => {
    const { voxels, isLoading, clearTactical, calculatedPath, actionPoints, setActionPoints } = useLocalStore();
    const { globeMode } = useUIStore();
    const { regions } = useRegionStore();

    const surfaceSemantic = useMemo(() => {
        if (!selectedHex) return null;
        return resolvePointSemantic(selectedHex, 0, regions);
    }, [selectedHex, regions]);

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="h-48 shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-950/50 relative mb-4">
                <VoxelVisualizer 
                    voxels={voxels} 
                    isLoading={isLoading} 
                    mask={globeMode === 'HEX' ? 'HEX' : 'SQUARE'} 
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-[9px] text-white backdrop-blur-sm pointer-events-none flex items-center gap-1">
                    {globeMode === 'HEX' ? <Hexagon className="w-3 h-3 text-indigo-400" /> : <Box className="w-3 h-3 text-cyan-400" />}
                    <span>{globeMode === 'HEX' ? 'Hex Strata' : 'Voxel Block'}</span>
                </div>
            </div>

            {/* Tactical Tools - Only valid for Voxels */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                        <Move className="w-3 h-3" /> Tactical Tools
                    </div>
                    <button onClick={clearTactical} className="p-1 hover:bg-indigo-500/20 rounded transition-colors text-indigo-400">
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
                
                <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> Action Points</span>
                    <span className="text-amber-400">{actionPoints} ft</span>
                </div>
                <input 
                    type="range" min="5" max="60" step="5" 
                    value={actionPoints} 
                    onChange={(e) => setActionPoints(parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500" 
                />
                </div>

                <div className="text-[10px] text-slate-400 leading-tight border-t border-indigo-500/20 pt-2">
                    {calculatedPath.length > 0 ? (
                        <div className="flex flex-col gap-1">
                        <span className="text-indigo-300 font-bold">Path Length: {calculatedPath.length * 5} ft</span>
                        <span className={`text-[9px] ${calculatedPath.length * 5 > actionPoints ? 'text-red-400' : 'text-emerald-400'}`}>
                            {calculatedPath.length * 5 > actionPoints ? '⚠️ Exceeds Movement Limit' : '✓ Path Clear'}
                        </span>
                        </div>
                    ) : (
                        <span>Click two points in the viewer to calculate a tactical path. Green overlay shows reachable range.</span>
                    )}
                </div>
            </div>

            {/* Semantic Summary */}
            {surfaceSemantic && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                   <Tag className="w-3 h-3 text-indigo-400" /> Resolved Semantics
                </div>
                <div className="flex flex-wrap gap-1.5">
                   <span className="px-1.5 py-0.5 bg-indigo-900/30 border border-indigo-500/30 rounded text-[9px] text-indigo-300 font-bold uppercase">{surfaceSemantic.realm}</span>
                   <span className="px-1.5 py-0.5 bg-amber-900/30 border border-amber-500/30 rounded text-[9px] text-amber-300 font-bold uppercase">{surfaceSemantic.depthClass}</span>
                   {surfaceSemantic.tags.map(tag => (
                     <span key={tag} className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-[9px] text-slate-300 font-medium">#{tag}</span>
                   ))}
                </div>

                <div className="w-full h-[1px] bg-slate-700" />

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                     <Footprints className="w-4 h-4 text-cyan-400" />
                     <div>
                        <span className="text-[7px] block uppercase text-slate-500">Move Cost</span>
                        <span className="text-[10px] font-bold text-slate-200">{surfaceSemantic.movementCost}x</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                     <Shield className="w-4 h-4 text-emerald-400" />
                     <div>
                        <span className="text-[7px] block uppercase text-slate-500">Cover</span>
                        <span className="text-[10px] font-bold text-slate-200">{surfaceSemantic.cover}</span>
                     </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-slate-400">
              <div><span className="text-[8px] block uppercase font-bold text-slate-600">Settlement</span><span className="px-1.5 py-0.5 bg-indigo-900/30 border border-indigo-800/50 rounded text-[9px] text-indigo-300 font-bold uppercase tracking-tighter inline-block mt-1">{selectedHex.settlementType}</span></div>
              <div><span className="text-[8px] block uppercase font-bold text-slate-600">Habitability</span><span className="text-amber-400 font-bold text-[10px]">{((selectedHex.habitabilityScore ?? 0) * 100).toFixed(0)}%</span></div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <span className="text-[8px] block uppercase font-bold text-slate-500 mb-2 tracking-widest flex items-center gap-1"><Pickaxe className="w-3 h-3" /> Local Resources</span>
              <div className="space-y-2">
                {Object.entries(selectedHex.resources).map(([res, val]) => (
                  <div key={res} className="flex flex-col">
                    <div className="flex justify-between text-[9px] mb-1 capitalize text-slate-300"><span>{res.toLowerCase()}</span><span>{((val as number) * 100).toFixed(0)}%</span></div>
                    <div className="w-full h-1 bg-slate-800 rounded overflow-hidden"><div className="h-full bg-indigo-500/60" style={{ width: `${(val as number) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
        </div>
    );
};
