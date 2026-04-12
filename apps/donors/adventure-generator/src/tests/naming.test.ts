import { describe, it, expect } from 'vitest';
import { generateLocationName } from '../utils/map/namingEngine';

describe('NamingEngine', () => {
    it('should generate a name with a Markov-style proper name', () => {
        const name = generateLocationName('Settlement', 'grassland', 'surface');
        expect(name).toBeTruthy();
        expect(name.split(' ').length).toBeGreaterThanOrEqual(2);
    });

    it('should add water suffixes for ocean biomes', () => {
        const name = generateLocationName('Settlement', 'ocean', 'surface');
        const waterKeywords = ['Isle', 'Atoll', 'Reef', 'Skerry', 'Sandbar', 'Key', 'Rock'];
        expect(waterKeywords.some(k => name.includes(k))).toBe(true);
    });

    it('should add underwater-specific suffixes', () => {
        const name = generateLocationName('Dungeon', 'underwater', 'elemental_water');
        const deepKeywords = ['Abyss', 'Trench', 'Grotto', 'Shelf', 'Vents', 'Current', 'Depth'];
        expect(deepKeywords.some(k => name.includes(k))).toBe(true);
    });

    it('should use theme-specific adjectives for Feywild (probabilistic)', () => {
        const feyAdjectives = ['Singing', 'Dreaming', 'Crystal', 'Eternal', 'Twisted', 'Bright', 'Moonlit', 'Sunless', 'Verdant', 'Shimmering', 'Faerie', 'Glow', 'Primal'];
        let found = false;
        for (let i = 0; i < 20; i++) {
            const name = generateLocationName('Special Location', 'forest', 'feywild');
            if (feyAdjectives.some(a => name.includes(a))) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    });

    it('should generate valid names for all location types', () => {
        const types: any[] = ['Settlement', 'Dungeon', 'Battlemap', 'Special Location'];
        types.forEach(t => {
            const name = generateLocationName(t, 'grassland', 'surface');
            expect(name).toBeDefined();
            expect(name.length).toBeGreaterThan(3);
        });
    });
});
