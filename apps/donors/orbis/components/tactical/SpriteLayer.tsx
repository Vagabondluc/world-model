
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Voxel, BiomeType, VoxelMaterial } from '../../types';
import { Billboard, Image } from '@react-three/drei';

interface SpriteLayerProps {
  voxels: Voxel[];
}

const getSpriteTexture = (biome: BiomeType, material: VoxelMaterial): string | null => {
    // In a real app, these would be paths to PNG billboards
    // For now, we use colored emojis or placeholder paths
    if (biome === BiomeType.TROPICAL_RAIN_FOREST) return '🌳';
    if (biome === BiomeType.SUBTROPICAL_DESERT) return '🌵';
    if (material === VoxelMaterial.STONE) return '🪨';
    return null;
};

export const SpriteLayer: React.FC<SpriteLayerProps> = ({ voxels }) => {
  const surfaceVoxels = useMemo(() => voxels.filter(v => v.isSurface && v.semantic?.biome), [voxels]);

  const sprites = useMemo(() => {
    return surfaceVoxels.filter((_, i) => i % 15 === 0).map((v, i) => {
        const emoji = getSpriteTexture(v.semantic!.biome!, v.material);
        if (!emoji) return null;
        return (
            <Billboard key={i} position={[v.x, v.y + 1, v.z]} follow={true}>
                <mesh>
                    <planeGeometry args={[0.8, 0.8]} />
                    <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
                </mesh>
            </Billboard>
        );
    });
  }, [surfaceVoxels]);

  return <group>{sprites}</group>;
};
