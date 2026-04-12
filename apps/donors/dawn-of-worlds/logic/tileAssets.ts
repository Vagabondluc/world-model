
// Map biome keys to folder names in /PNG/Tiles/Terrain/
export type TileSurface = 'Grass' | 'Dirt' | 'Stone' | 'Sand' | 'Mars';

// Mapping from Biome ID to the Surface Folder it uses
// The actual file used will be {surface}_{variant}.png
export const BIOME_TO_SURFACE: Record<string, TileSurface> = {
  // Vegetation
  plains: 'Grass',
  grassland: 'Grass',
  forest: 'Grass',
  jungle: 'Grass',
  swamp: 'Grass',
  marsh: 'Grass',
  bog: 'Grass',
  
  // Earthy
  hills: 'Dirt',
  badlands: 'Dirt',
  mud: 'Dirt',
  
  // Rocky
  mountain: 'Stone',
  highlands: 'Stone',
  peak: 'Stone',
  volcano: 'Mars', // Using Mars for volcanic/reddish look
  wasteland: 'Mars',
  
  // Sandy
  desert: 'Sand',
  dunes: 'Sand',
  beach: 'Sand',
  coast: 'Sand',
  
  // Cold/Alien
  tundra: 'Stone', // Use stone or maybe we need a Snow folder? For now Stone/Dirt.
  snowfield: 'Stone', // Ideally we'd have a Snow folder.
  
  // Default fallbacks
  unknown: 'Dirt'
};

/**
 * Returns the public URL for a tile texture.
 * @param biome The biome key (e.g. 'forest', 'mountain')
 * @param variant Optional variant number (1-19 typically). If not provided, returns variant 01.
 */
export const getTileUrl = (biome: string, variant: number = 1): string => {
  const normalizedBiome = biome.toLowerCase();
  const surface = BIOME_TO_SURFACE[normalizedBiome] || 'Grass';
  // Formats variant as 2 digit string, e.g. 1 -> '01', 12 -> '12'
  const paddedNum = String(Math.max(1, Math.min(19, variant))).padStart(2, '0');
  
  // Construct path: /PNG/Tiles/Terrain/Grass/grass_01.png
  // Note: File names are lowercased: grass_01.png, stone_05.png
  return `/PNG/Tiles/Terrain/${surface}/${surface.toLowerCase()}_${paddedNum}.png`;
};

/**
 * Helper to get a random variant based on coordinate for consistency
 * @param q Hex Q coordinate
 * @param r Hex R coordinate
 * @param maxVariants Number of available variants in the folder (default 19)
 */
export const getDeterministicVariant = (q: number, r: number, maxVariants: number = 19): number => {
  // Simple deterministic hash
  const hash = Math.abs(Math.sin(q * 12.9898 + r * 78.233) * 43758.5453);
  return Math.floor((hash % 1) * maxVariants) + 1;
};
