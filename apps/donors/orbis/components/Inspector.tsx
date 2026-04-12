
import React, { useState, useEffect } from 'react';
import { Microscope, Activity, Box, BookOpen, Grid, Scan, Fingerprint, Castle } from 'lucide-react';
import { useWorldStore } from '../stores/useWorldStore';
import { useLocalStore } from '../stores/useLocalStore';
import { useUIStore } from '../stores/useUIStore';
import { VoxelVisualizer } from './VoxelVisualizer';
import { useRegionStore } from '../stores/useRegionStore';
import { TooltipTrigger } from './ui/TooltipSystem';
import { InspectorDataTab } from './inspector/InspectorDataTab';
import { InspectorJournalTab } from './inspector/InspectorJournalTab';
import { InspectorCivTab } from './inspector/InspectorCivTab';
import { SettlementType } from '../types';

export const Inspector: React.FC = () => {
  const { selectedHexId, getHexById, hexDescriptions, config } = useWorldStore();
  const { voxels, isLoading, inspectMode, setInspectMode, hydrateVoxelChunk } = useLocalStore();
  const { regions } = useRegionStore();
  const { globeMode } = useUIStore();
  
  const [activeTab, setActiveTab] = useState<'DATA' | 'VISUAL' | 'CIV' | 'JOURNAL'>('DATA');
  const [journalContent, setJournalContent] = useState('');

  const selectedHex = selectedHexId ? getHexById(selectedHexId) : null;
  const hasSettlement = selectedHex && selectedHex.settlementType !== SettlementType.NONE;

  useEffect(() => {
    if (selectedHexId) {
      const savedDesc = hexDescriptions[selectedHexId];
      setJournalContent(savedDesc || '');
      // Reset to DATA tab on new selection unless currently on JOURNAL
      if (activeTab === 'CIV' && (!selectedHex || selectedHex.settlementType === SettlementType.NONE)) {
          setActiveTab('DATA');
      }
    }
  }, [selectedHexId, hexDescriptions]);

  // Re-hydrate when inspect mode changes (only matters for Voxel mode, but safe to call)
  useEffect(() => {
    if (selectedHexId) {
        hydrateVoxelChunk(selectedHexId, config, regions);
    }
  }, [inspectMode, selectedHexId]);

  if (!selectedHex) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
        <Microscope className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-xs uppercase tracking-widest font-bold">No Signal</p>
        <p className="text-[10px] mt-2">Select a hex on the globe to inspect local data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <div>
          <span className="font-bold text-slate-200 tracking-wider text-xs block">{selectedHex.name || selectedHex.id}</span>
          <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-tighter flex items-center gap-1">
            <Fingerprint className="w-2 h-2" /> {selectedHex.uuid}
          </span>
          <span className="text-[8px] text-slate-500 font-mono block mt-0.5">{selectedHex.biome}</span>
        </div>
        <div className="flex gap-2">
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <TooltipTrigger content="Single Cell Focus">
                    <button 
                        onClick={() => setInspectMode('SINGLE')} 
                        className={`p-1.5 rounded-md transition-all ${inspectMode === 'SINGLE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Box className="w-3.5 h-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipTrigger content="Regional Context (Neighbors)">
                    <button 
                        onClick={() => setInspectMode('REGION')} 
                        className={`p-1.5 rounded-md transition-all ${inspectMode === 'REGION' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Grid className="w-3.5 h-3.5" />
                    </button>
                </TooltipTrigger>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg">
                <button onClick={() => setActiveTab('DATA')} className={`p-1.5 rounded-md transition-all ${activeTab === 'DATA' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><Activity className="w-3.5 h-3.5" /></button>
                <button onClick={() => setActiveTab('VISUAL')} className={`p-1.5 rounded-md transition-all ${activeTab === 'VISUAL' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}><Scan className="w-3.5 h-3.5" /></button>
                
                {hasSettlement && (
                  <button onClick={() => setActiveTab('CIV')} className={`p-1.5 rounded-md transition-all ${activeTab === 'CIV' ? 'bg-fuchsia-600 text-white' : 'text-slate-400'}`}><Castle className="w-3.5 h-3.5" /></button>
                )}
                
                <button onClick={() => setActiveTab('JOURNAL')} className={`p-1.5 rounded-md transition-all ${activeTab === 'JOURNAL' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}><BookOpen className="w-3.5 h-3.5" /></button>
            </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'DATA' && (
            <InspectorDataTab selectedHex={selectedHex} />
        )}

        {activeTab === 'VISUAL' && (
          <div className="h-full bg-slate-950 relative">
            <VoxelVisualizer 
                voxels={voxels} 
                isLoading={isLoading} 
                mask={globeMode === 'HEX' ? 'HEX' : 'SQUARE'} 
            />
          </div>
        )}

        {activeTab === 'CIV' && hasSettlement && (
            <InspectorCivTab hex={selectedHex} />
        )}

        {activeTab === 'JOURNAL' && (
            <InspectorJournalTab 
                hexId={selectedHex.id} 
                content={journalContent} 
                onChange={setJournalContent} 
            />
        )}
      </div>
    </div>
  );
};
