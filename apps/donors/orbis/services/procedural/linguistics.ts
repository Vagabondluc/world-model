
import { PseudoRandom } from '../noise';
import { BiomeType } from '../../types';

interface PhonemeSet {
  consonants: string[];
  vowels: string[];
  patterns: string[]; // C=Consonant, V=Vowel, L=Liquid/Special
}

const PHONETIC_PROFILES: Record<string, PhonemeSet> = {
  // Harsh, gutteral, abrupt
  HARSH: {
    consonants: ['k', 't', 'r', 'g', 'z', 'x', 'v', 'b', 'd'],
    vowels: ['a', 'o', 'u', 'i'],
    patterns: ['CVC', 'CVCC', 'VC', 'CVCVC']
  },
  // Flowing, liquid, musical
  FLOWING: {
    consonants: ['l', 'n', 'm', 'r', 's', 'th', 'w', 'y'],
    vowels: ['a', 'e', 'ia', 'ea', 'oi', 'ae'],
    patterns: ['CV', 'CVCV', 'VCV', 'CVV']
  },
  // Sibilant, exotic, mysterious
  EXOTIC: {
    consonants: ['sh', 'z', 'xh', 'ph', 'qu', 'j', 'ch'],
    vowels: ['ai', 'uo', 'y', 'aa'],
    patterns: ['CV', 'CVC', 'CVVC', 'VCC']
  },
  // Standard, balanced
  COMMON: {
    consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'],
    vowels: ['a', 'e', 'i', 'o', 'u'],
    patterns: ['CVC', 'CVCV', 'VCV']
  }
};

const BIOME_MAP: Record<BiomeType, string> = {
  [BiomeType.ICE]: 'HARSH',
  [BiomeType.SNOW]: 'HARSH',
  [BiomeType.TUNDRA]: 'HARSH',
  [BiomeType.TAIGA]: 'HARSH',
  [BiomeType.SCORCHED]: 'HARSH',
  [BiomeType.VOLCANIC]: 'HARSH',
  
  [BiomeType.TROPICAL_RAIN_FOREST]: 'FLOWING',
  [BiomeType.TROPICAL_SEASONAL_FOREST]: 'FLOWING',
  [BiomeType.CORAL_REEF]: 'FLOWING',
  [BiomeType.KELP_FOREST]: 'FLOWING',
  [BiomeType.WARM_OCEAN]: 'FLOWING',
  
  [BiomeType.SUBTROPICAL_DESERT]: 'EXOTIC',
  [BiomeType.TEMPERATE_DESERT]: 'EXOTIC',
  [BiomeType.SAVANNA]: 'EXOTIC',
  [BiomeType.MANGROVE]: 'EXOTIC',
  
  [BiomeType.GRASSLAND]: 'COMMON',
  [BiomeType.TEMPERATE_DECIDUOUS_FOREST]: 'COMMON',
  [BiomeType.TEMPERATE_RAIN_FOREST]: 'COMMON',
  [BiomeType.MEDITERRANEAN]: 'COMMON',
  
  // Exotic / Multi-Axial
  [BiomeType.SKY_ISLAND]: 'FLOWING',
  [BiomeType.THUNDER_REACH]: 'HARSH',
  [BiomeType.CRYSTAL_GROVE]: 'EXOTIC',
  [BiomeType.FUNGAL_FOREST]: 'EXOTIC',
  [BiomeType.MAGMA_FORGE]: 'HARSH',
  [BiomeType.ASH_WASTE]: 'HARSH',
  [BiomeType.NECROPOLIS]: 'EXOTIC',
  [BiomeType.VOID_OCEAN]: 'EXOTIC',
  [BiomeType.PRIMORDIAL_SOUP]: 'EXOTIC',

  // Defaults
  [BiomeType.DEEP_OCEAN]: 'EXOTIC',
  [BiomeType.OCEAN]: 'FLOWING',
  [BiomeType.BEACH]: 'FLOWING',
  [BiomeType.BARE]: 'HARSH',
  [BiomeType.SALT_FLATS]: 'EXOTIC',
  [BiomeType.STEPPE]: 'HARSH',
  [BiomeType.SHRUBLAND]: 'COMMON',
  [BiomeType.ALPINE]: 'HARSH'
};

export const generateLinguisticName = (seed: number, biome: BiomeType): string => {
  const rng = new PseudoRandom(seed);
  const profileKey = BIOME_MAP[biome] || 'COMMON';
  const profile = PHONETIC_PROFILES[profileKey];
  
  // Decide length (syllable count)
  const syllables = 2 + Math.floor(rng.next() * 2); // 2 or 3
  
  let name = "";
  
  for (let i = 0; i < syllables; i++) {
    const pattern = profile.patterns[Math.floor(rng.next() * profile.patterns.length)];
    
    for (const char of pattern) {
      if (char === 'C') {
        name += profile.consonants[Math.floor(rng.next() * profile.consonants.length)];
      } else if (char === 'V') {
        name += profile.vowels[Math.floor(rng.next() * profile.vowels.length)];
      }
    }
  }
  
  // Capitalize
  return name.charAt(0).toUpperCase() + name.slice(1);
};