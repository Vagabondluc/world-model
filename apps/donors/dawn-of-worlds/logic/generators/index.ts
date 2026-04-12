// Auto-import all generators to register them
import './classicGenerator';
import './globeGenerator';

export { getGenerator, getAvailableGenerators, GENERATORS } from '../worldGenerators';
export type { WorldGenerator, GeneratedWorldData, GenerationConfig } from '../worldGenerators';
