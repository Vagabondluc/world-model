
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { HexData, VoxelMaterial, PlanetType } from '../../types';
import { getSurfaceMaterialForHex, getStratifiedMaterial } from '../../utils/materialUtils';
import { VoxelMeshGroup } from './VoxelMeshGroup';

interface VoxelGlobeProps {
  hexes: HexData[];
  globeRadius: number;
  elevationScale: number;
  seaLevel: number;
  showGlobeElevation: boolean;
  planetType: PlanetType;
  voxelScale: number;
  onPointerDown?: (e: any) => void;
  onPointerUp?: (e: any) => void;
}

const CRUST_LAYERS = 4;

export const VoxelGlobe: React.FC<VoxelGlobeProps> = ({
  hexes, globeRadius, elevationScale, seaLevel, showGlobeElevation, planetType, voxelScale, onPointerDown, onPointerUp
}) => {
  const voxelInstancedData = useMemo(() => {
    const groups = new Map<VoxelMaterial, THREE.Matrix4[]>();
    const dummy = new THREE.Object3D();

    hexes.forEach(h => {
      const surfaceMat = getSurfaceMaterialForHex(h, seaLevel, planetType);
      const elevation = showGlobeElevation ? (h.biomeData.height - seaLevel) * elevationScale : 0;
      const hPos = new THREE.Vector3(...h.center);
      
      const zHeight = voxelScale * 1.2; // Vertical size of voxel
      
      // Calculate surface radius (where the top face of the top voxel should be)
      const surfaceRadius = globeRadius + elevation;
      
      // Center the top voxel so its top face aligns with surfaceRadius
      // Center = surfaceRadius - (zHeight / 2)
      const topVoxelCenterRadius = surfaceRadius - (zHeight * 0.5);

      for (let layer = 0; layer < CRUST_LAYERS; layer++) {
        const material = getStratifiedMaterial(surfaceMat, layer);
        if (!groups.has(material)) groups.set(material, []);
        
        // Stack voxels inwards from the top center
        // 0.95 factor ensures they stack solidly with slight overlap to prevent gaps
        const layerOffset = layer * (zHeight * 0.95);
        const radius = topVoxelCenterRadius - layerOffset;
        
        dummy.position.copy(hPos).multiplyScalar(radius);
        dummy.lookAt(0, 0, 0);
        // Scale z slightly to elongate towards center, ensuring core coverage
        dummy.scale.set(voxelScale, voxelScale, zHeight);
        dummy.updateMatrix();
        groups.get(material)!.push(dummy.matrix.clone());
      }
    });
    return groups;
  }, [hexes, showGlobeElevation, seaLevel, elevationScale, planetType, globeRadius, voxelScale]);

  return (
    <group onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      {Array.from(voxelInstancedData.entries()).map(([mat, matrices]) => (
        <VoxelMeshGroup key={mat} material={mat} matrices={matrices} />
      ))}
    </group>
  );
};
