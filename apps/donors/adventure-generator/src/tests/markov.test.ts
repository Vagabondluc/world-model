import { describe, it, expect } from 'vitest';
import { MarkovGenerator } from '../utils/markovGenerator';

describe('MarkovGenerator', () => {
    const training = ['Aethelred', 'Aethelgard', 'Aethelstan', 'Beric', 'Berand'];
    const gen = new MarkovGenerator(training, 2);

    it('should generate a name within length constraints', () => {
        const name = gen.generate(4, 10);
        expect(name.length).toBeGreaterThanOrEqual(4);
        expect(name.length).toBeLessThanOrEqual(10);
    });

    it('should always capitalize the first letter', () => {
        const name = gen.generate();
        expect(name[0]).toBe(name[0].toUpperCase());
        expect(name.slice(1)).toBe(name.slice(1).toLowerCase());
    });

    it('should handle very short training words', () => {
        const smallGen = new MarkovGenerator(['Bo', 'Jo', 'Ko'], 1);
        const name = smallGen.generate(2, 4);
        expect(name.length).toBeGreaterThanOrEqual(2);
    });

    it('should produce different names over multiple runs', () => {
        const results = new Set();
        for (let i = 0; i < 20; i++) {
            results.add(gen.generate());
        }
        expect(results.size).toBeGreaterThan(1);
    });

    it('should respect the max length strictly', () => {
        const name = gen.generate(2, 5);
        expect(name.length).toBeLessThanOrEqual(5);
    });
});
