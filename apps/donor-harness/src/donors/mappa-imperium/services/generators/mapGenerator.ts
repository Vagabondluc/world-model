import { WorldSettings } from '@mi/types';
import { generatePerlinMap } from './perlinGenerator';
import { generateImperialMap } from './imperialGenerator';

export interface GeneratedMap {
    hexBiomes: Record<string, any>;
    regions: any[];
    locations: any[];
}

export function generateMap(settings: WorldSettings): GeneratedMap {
    if (settings.algorithm === 'wilderness') {
        const perlinSettings = {
            radius: settings.params.radius || 10,
            scale: settings.params.scale || 30,
            waterLevel: settings.params.waterLevel || 0.3,
            moistureOffset: settings.params.moistureOffset || 0,
            seed: settings.seed,
            numRegions: settings.params.numRegions || 3,
            theme: settings.params.theme || 'surface',
            locationDensity: settings.params.locationDensity,
            settlementDensity: settings.params.settlementDensity
        };
        return generatePerlinMap(perlinSettings);
    } else {
        const imperialSettings = {
            playerCount: settings.params.playerCount || 1,
            tier: settings.params.tier || 'standard',
            seed: settings.seed
        };
        return generateImperialMap(imperialSettings as any);
    }
}
