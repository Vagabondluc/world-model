
import React, { useRef, useMemo, useState } from 'react';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { HexData, ViewMode, TerraformMode, TerrainConfig } from '../types';
import { GlobeMode, ProjectionMode } from '../stores/useUIStore';
import { CelestialSystem } from './globe/CelestialSystem';
import { MagicTorch } from './globe/MagicTorch';
import { CloudLayer } from './globe/CloudLayer';
import { WindNeedles } from './globe/WindNeedles';
import { AuroraRing } from './globe/AuroraRing';
import { GlobeMesh } from './globe/GlobeMesh';
import { VoxelGlobe } from './globe/VoxelGlobe';
import { SelectionCursor } from './globe/SelectionCursor';
import { useGlobeInteraction } from '../hooks/useGlobeInteraction';

export interface HexGridProps {
  hexes: HexData[];
  selectedHexId: string | null;
  onSelectHex: (hex: HexData) => void;
  viewMode: ViewMode;
  globeMode: GlobeMode;
  projectionMode?: ProjectionMode;
  showGlobeElevation: boolean;
  showClouds: boolean;
  seaLevel: number;
  elevationScale: number;
  terraformMode: TerraformMode;
  onApplyBrush: (id: string) => void;
  seed: number;
  config: TerrainConfig;
}

export const GlobeScene: React.FC<HexGridProps> = ({ 
  hexes, selectedHexId, onSelectHex, viewMode, globeMode, projectionMode = 'GLOBE', 
  showGlobeElevation, showClouds, seaLevel, elevationScale, terraformMode, onApplyBrush, seed, config
}) => {
  const globeRadius = 10;
  const meshRef = useRef<THREE.Mesh>(null);
  const [sunDir, setSunDir] = useState(new THREE.Vector3(1, 0, 0));
  const controlsRef = useRef<any>(null);
  
  const { handlePointerDown, handlePointerUp } = useGlobeInteraction({
    hexes,
    isTerraforming: terraformMode !== TerraformMode.SELECT,
    onApplyBrush,
    onSelectHex
  });

  const selectedHex = useMemo(() => hexes.find(h => h.id === selectedHexId), [hexes, selectedHexId]);

  const voxelScale = useMemo(() => {
    if (hexes.length === 0) return 1;
    // Factor 3.8 ensures tight packing while minimizing bloat
    return (globeRadius / Math.sqrt(hexes.length)) * 3.8;
  }, [hexes.length, globeRadius]);

  return (
    <>
      <CelestialSystem config={config} onInteraction={() => {}} setSunDirection={setSunDir}>
        {globeMode === 'HEX' ? (
          <GlobeMesh 
            ref={meshRef}
            hexes={hexes}
            viewMode={viewMode}
            globeRadius={globeRadius}
            elevationScale={elevationScale}
            seaLevel={seaLevel}
            showGlobeElevation={showGlobeElevation}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          />
        ) : (
          <VoxelGlobe
            hexes={hexes}
            globeRadius={globeRadius}
            elevationScale={elevationScale}
            seaLevel={seaLevel}
            showGlobeElevation={showGlobeElevation}
            planetType={config.planetType}
            voxelScale={voxelScale}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          />
        )}
        
        <SelectionCursor 
          hex={selectedHex} 
          globeRadius={globeRadius}
          elevationScale={elevationScale}
          seaLevel={seaLevel}
          showGlobeElevation={showGlobeElevation}
          globeMode={globeMode}
          voxelScale={voxelScale}
        />

        {showClouds && <CloudLayer hexes={hexes} globeRadius={globeRadius} seed={seed} dayLength={config.orbital.dayLengthSeconds} />}
        <WindNeedles hexes={hexes} globeRadius={globeRadius} visible={viewMode === ViewMode.ATMOSPHERE} dayLength={config.orbital.dayLengthSeconds} />
        <AuroraRing config={config.magnetosphere} globeRadius={globeRadius} />
        <MagicTorch globeMeshRef={meshRef} sunDirection={sunDir} />
      </CelestialSystem>
      
      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.05} rotateSpeed={0.5} minDistance={12} maxDistance={50} />
      <GizmoHelper alignment="top-left" margin={[75, 75]}><GizmoViewport hideNegativeAxes /></GizmoHelper>
    </>
  );
};
