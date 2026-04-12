
import { TrunkId, TrophicLevel, GenomeModule } from './types';
import { BiomeType } from '../../types';

/**
 * SpeciesTemplate
 * Represents a concrete species evolved from a lineage trunk.
 * Follows spec ID: 08-species-template-procedural-biology.
 */
export interface SpeciesTemplate {
  id: string;
  name: string;
  trunk: TrunkId;
  trophicLevel: TrophicLevel;
  modules: GenomeModule[];
  preferredBiome: BiomeType;
  description: string;
  
  // Stats derived from modules (Normalized 0..1)
  adaptability: number; 
  aggression: number;
  metabolism: number;
  
  // Metadata
  evolutionTick: bigint;
  parentSpeciesId?: string; // If branched from another species
}
