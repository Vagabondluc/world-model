
import { generateProceduralMapData, GenerationSettings } from './src/utils/mapGenerationUtils';

const settings: GenerationSettings = {
    radius: 5,
    scale: 30,
    waterLevel: 0.3,
    moistureOffset: 0,
    seed: 'test-seed',
    numRegions: 3,
    theme: 'surface',
    locationDensity: 1,
    settlementDensity: 1
};

console.log('Generating map with settings:', settings);

try {
    const result = generateProceduralMapData(settings, 'test-map-id');
    console.log('Map generated successfully!');
    console.log(`Regions: ${result.regions.length}`);
    console.log(`Locations: ${result.locations.length}`);
    console.log(`Hexes: ${Object.keys(result.hexBiomes).length}`);
} catch (error) {
    console.error('Map generation failed:', error);
    process.exit(1);
}
