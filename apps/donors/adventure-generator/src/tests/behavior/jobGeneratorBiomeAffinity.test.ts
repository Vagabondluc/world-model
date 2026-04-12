import { describe, it, expect } from 'vitest';
import type { JobArchetype, JobContext } from '../../types/jobGenerator';
import { scoreArchetypeWeight } from '../../utils/jobGenerator';

describe('scoreArchetypeWeight', () => {
    const baseArchetype: JobArchetype = {
        id: 'escort',
        weight: 2,
        tags: ['travel'],
        biomeAffinity: ['forest', 'plains'],
        titleTemplates: ['Test'],
        summaryTemplates: ['Test'],
        detailsTemplates: ['Test'],
        complicationPools: ['ambushes'],
        rewardPools: ['standardCoin']
    };

    it('boosts weight when biome matches affinity', () => {
        const ctx: JobContext = { biome: 'forest' };
        const weight = scoreArchetypeWeight(baseArchetype, ctx);
        expect(weight).toBeCloseTo(3.5);
    });

    it('reduces weight when biome does not match affinity', () => {
        const ctx: JobContext = { biome: 'swamp' };
        const weight = scoreArchetypeWeight(baseArchetype, ctx);
        expect(weight).toBeCloseTo(1);
    });

    it('keeps base weight when biome is not provided', () => {
        const ctx: JobContext = {};
        const weight = scoreArchetypeWeight(baseArchetype, ctx);
        expect(weight).toBeCloseTo(2);
    });

    it('keeps base weight when no affinity is defined', () => {
        const ctx: JobContext = { biome: 'forest' };
        const archetype: JobArchetype = { ...baseArchetype, biomeAffinity: [] };
        const weight = scoreArchetypeWeight(archetype, ctx);
        expect(weight).toBeCloseTo(2);
    });
});
