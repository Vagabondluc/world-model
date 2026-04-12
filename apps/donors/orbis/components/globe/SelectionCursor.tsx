
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { HexData } from '../../types';
import { GlobeMode } from '../../stores/useUIStore';

interface SelectionCursorProps {
  hex: HexData | undefined;
  globeRadius: number;
  elevationScale: number;
  seaLevel: number;
  showGlobeElevation: boolean;
  globeMode: GlobeMode;
  voxelScale: number;
}

export const SelectionCursor = React.memo(({ 
  hex, globeRadius, elevationScale, seaLevel, showGlobeElevation, globeMode, voxelScale 
}: SelectionCursorProps) => {
  if (!hex) return null;

  const radius = globeRadius + (showGlobeElevation ? (hex.biomeData.height - seaLevel) * elevationScale : 0) + 0.05;

  if (globeMode === 'VOXEL') {
    const pos = new THREE.Vector3(...hex.center).multiplyScalar(radius);
    return (
      <group position={pos} lookAt={new THREE.Vector3(0,0,0)}>
        <mesh>
          <boxGeometry args={[voxelScale * 1.05, voxelScale * 1.05, voxelScale * 1.2]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </group>
    );
  }

  // Hex Mode: Compute geometry in useMemo to ensure stability
  const geometry = useMemo(() => {
    const points = hex.vertices.map((v: number[]) => new THREE.Vector3(...v).normalize().multiplyScalar(radius));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [hex, radius]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="#ffffff" linewidth={3} />
    </lineLoop>
  );
});
