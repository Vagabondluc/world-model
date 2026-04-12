
import { BiomeType } from '../../types';
import { generateLinguisticName } from '../procedural/linguistics';

export const generateHexName = (seed: number, biome: BiomeType): string => {
  // Use the advanced linguistic generator
  return generateLinguisticName(seed, biome);
};
