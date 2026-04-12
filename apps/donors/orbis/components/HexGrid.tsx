
import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GlobeScene, HexGridProps } from './GlobeScene';
import { FlatMapScene } from './FlatMapScene';
import { useUIStore } from '../stores/useUIStore';
import { useLocalStore } from '../stores/useLocalStore';
import { useRegionStore } from '../stores/useRegionStore';
import { VoxelVisualizer } from './VoxelVisualizer';

export const HexGrid: React.FC<Omit<HexGridProps, 'projectionMode'>> = (props) => {
  const { projectionMode, mapProjection, globeMode } = useUIStore();
  const { voxels, isLoading, setInspectMode, inspectMode, hydrateVoxelChunk } = useLocalStore();
  const { regions } = useRegionStore();

  // Auto-switch to REGION inspect mode when entering LOCAL projection to ensure neighbors are generated
  useEffect(() => {
    if (mapProjection === 'LOCAL' && inspectMode !== 'REGION' && props.selectedHexId) {
        setInspectMode('REGION');
        hydrateVoxelChunk(props.selectedHexId, props.config, regions);
    }
  }, [mapProjection, inspectMode, props.selectedHexId, props.config, regions]);

  if (mapProjection === 'LOCAL') {
    return (
      <div className="w-full h-full bg-slate-950 relative">
        <VoxelVisualizer 
          voxels={voxels} 
          isLoading={isLoading} 
          mask={globeMode === 'HEX' ? 'HEX' : 'SQUARE'} 
        />
        
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 text-xs font-mono text-slate-400 pointer-events-none flex flex-col items-center z-10">
            <span>Region Projection</span>
            <span className="text-[9px] text-slate-500">
                Localized Tangent Plane (No Distortion)
            </span>
        </div>
      </div>
    );
  }

  if (projectionMode === 'FLAT') {
    return (
      <div className="w-full h-full bg-slate-950 relative">
        <FlatMapScene 
            hexes={props.hexes}
            viewMode={props.viewMode}
            onSelectHex={props.onSelectHex}
            selectedHexId={props.selectedHexId}
            terraformMode={props.terraformMode}
            onApplyBrush={props.onApplyBrush}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-950 relative">
      <Canvas shadows camera={{ position: [0, 0, 22], fov: 45 }} dpr={[1, 2]}>
        <GlobeScene {...props} projectionMode={projectionMode} />
      </Canvas>
    </div>
  );
};
