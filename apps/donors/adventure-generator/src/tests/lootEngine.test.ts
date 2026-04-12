// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { LootEngine } from '../services/loot/lootEngine';
import { LootDials } from '../schemas/loot';

describe('LootEngine', () => {
    const defaultDials: LootDials = {
        partyLevel: 5,
        lootValue: 'standard',
        magicDensity: 0.5,
        rarityBias: 'balanced',
        tone: 'heroic',
        origin: 'dungeon',
        sentienceChance: 0,
        quirkChance: 0.5,
        cursedChance: 0.1,
        consumableRatio: 0.5,
        storyWeight: 0.5,
        seed: 12345
    };

    it('should match deterministic snapshot with seed 12345', () => {
        const result = LootEngine.generate(defaultDials);

        expect(result.gold).toEqual({ cp: 74, sp: 15, gp: 111 });
        expect(result.items).toHaveLength(4);
        expect(result.items[0].rarity).toBe('common');
        expect(result.items[0].magic).toBe(false);
    });

    it('should produce identical results with identical seeds', () => {
        const resultA = LootEngine.generate({ ...defaultDials, seed: 999 });
        const resultB = LootEngine.generate({ ...defaultDials, seed: 999 });

        expect(resultA).toEqual(resultB);
    });

    it('should produce different results with different seeds', () => {
        const resultA = LootEngine.generate({ ...defaultDials, seed: 111 });
        const resultB = LootEngine.generate({ ...defaultDials, seed: 222 });

        expect(resultA).not.toEqual(resultB);
    });

    it('should respect party level caps for low levels', () => {
        const lowLevelDials: LootDials = {
            ...defaultDials,
            partyLevel: 1,
            rarityBias: 'high_magic', // Should usually produce rares
            seed: 54321,
            magicDensity: 1.0
        };

        const result = LootEngine.generate(lowLevelDials);

        // Even with high magic, level 1 should cap rare->uncommon in engine logic
        result.items.forEach(item => {
            expect(['common', 'uncommon']).toContain(item.rarity);
        });
    });

    it('should respect zero magic density', () => {
        const noMagic: LootDials = {
            ...defaultDials,
            magicDensity: 0.0,
            seed: 777
        };

        const result = LootEngine.generate(noMagic);
        result.items.forEach(item => {
            expect(item.magic).toBe(false);
            expect(item.rarity).toBe('common');
        });
    });
});
