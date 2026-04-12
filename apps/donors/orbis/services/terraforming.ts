
import * as THREE from 'three';
import { HexData, TerraformMode, TerrainConfig } from '../types';
import { determineBiome, determineVerticalZone } from './terrain/biomeLogic';
import { calculateAtmosphere } from './terrain/atmosphereLogic';

export const applyTerraformBrush = (
  centerId: string,
  hexes: HexData[],
  mode: TerraformMode,
  radius: number,
  intensity: number,
  config: TerrainConfig,
  seed: number
): HexData[] => {
  if (mode === TerraformMode.SELECT) return hexes;

  const centerHex = hexes.find(h => h.id === centerId);
  if (!centerHex) return hexes;

  const affectedIds = new Set<string>();
  const queue: { id: string, dist: number }[] = [{ id: centerId, dist: 0 }];
  const visited = new Set<string>([centerId]);

  // BFS for neighbors in radius
  while (queue.length > 0) {
    const { id, dist } = queue.shift()!;
    affectedIds.add(id);
    if (dist < radius) {
      const h = hexes.find(hex => hex.id === id);
      if (h) {
        h.neighbors.forEach(nid => {
          if (!visited.has(nid)) {
            visited.add(nid);
            queue.push({ id: nid, dist: dist + 1 });
          }
        });
      }
    }
  }

  const centerPos = new THREE.Vector3(...centerHex.center);
  const sigma = radius > 0 ? radius * radius : 0.5;

  const nextHexes = hexes.map(hex => {
    if (!affectedIds.has(hex.id)) return hex;

    const pos = new THREE.Vector3(...hex.center);
    const spatialDist = pos.distanceTo(centerPos) * 10;
    const falloff = Math.exp(-(spatialDist * spatialDist) / (sigma * 2));
    const delta = intensity * falloff;

    const nextBiomeData = { ...hex.biomeData };

    switch (mode) {
      case TerraformMode.RAISE: nextBiomeData.height += delta; break;
      case TerraformMode.LOWER: nextBiomeData.height -= delta; break;
      case TerraformMode.HEAT: nextBiomeData.temperature += delta * 20; break;
      case TerraformMode.COOL: nextBiomeData.temperature -= delta * 20; break;
      case TerraformMode.MOISTEN: nextBiomeData.moisture += delta; break;
      case TerraformMode.DRY: nextBiomeData.moisture -= delta; break;
    }

    nextBiomeData.height = Math.max(-1.0, Math.min(1.0, nextBiomeData.height));
    nextBiomeData.moisture = Math.max(0, Math.min(1, nextBiomeData.moisture));
    
    const nextZone = determineVerticalZone(nextBiomeData.height, config.seaLevel);
    const nextBiome = determineBiome(nextBiomeData.temperature, nextBiomeData.moisture, nextZone);

    return {
      ...hex,
      biome: nextBiome,
      verticalZone: nextZone,
      biomeData: nextBiomeData
    };
  });

  calculateAtmosphere(nextHexes, config, seed);

  return nextHexes;
};
