import { describe, it, expect, vi } from 'vitest';
import { generateProceduralMapData, GenerationSettings } from '../utils/mapGenerationUtils';

describe('MapGenerationHierarchy', () => {
    const defaultSettings: GenerationSettings = {
        radius: 10,
        scale: 10,
        waterLevel: -0.2,
        moistureOffset: 0,
        seed: 'test-seed',
        numRegions: 3,
        theme: 'surface',
        locationDensity: 1.0,
        settlementDensity: 1.0,
    };

    it('should generate at least one Capital when settlementDensity is 1.0', () => {
        const { locations } = generateProceduralMapData(defaultSettings, 'test-map');
        const capitals = locations.filter(l => l.customTags.includes('Capital'));
        expect(capitals.length).toBeGreaterThanOrEqual(1);
    });

    it('should generate more settlements at high settlementDensity', () => {
        const low = generateProceduralMapData({ ...defaultSettings, settlementDensity: 0.1 }, 'map-low');
        const high = generateProceduralMapData({ ...defaultSettings, settlementDensity: 2.0 }, 'map-high');
        expect(high.locations.length).toBeGreaterThan(low.locations.length);
    });

    it('should generate zero hierarchical settlements when density is 0', () => {
        const { locations } = generateProceduralMapData({ ...defaultSettings, settlementDensity: 0 }, 'map-wilderness');
        const hierarchical = locations.filter(l =>
            l.customTags.includes('Capital') ||
            l.customTags.includes('City') ||
            l.customTags.includes('Village')
        );
        expect(hierarchical.length).toBe(0);
    });

    it('should assign correct custom tags for hierarchy level', () => {
        const { locations } = generateProceduralMapData(defaultSettings, 'test-map');
        const cities = locations.filter(l => l.customTags.includes('City'));
        cities.forEach(c => {
            expect(c.type).toBe('Settlement');
            expect(c.description).toContain('City');
        });
    });

    it('should maintain consistent mapping of locations to regions', () => {
        const { locations, regions } = generateProceduralMapData(defaultSettings, 'test-map');
        locations.forEach(loc => {
            const region = regions.find(r => r.id === loc.regionId);
            expect(region).toBeDefined();
        });
    });
});
