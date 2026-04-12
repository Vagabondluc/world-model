import { describe, it, expect } from 'vitest';
import {
  isLegendaryMonster,
  getMonsterMultiplier,
  getEncounterXPBudget,
  calculateAdjustedXP,
  determineDifficulty,
  CR_TO_XP,
  XP_THRESHOLDS,
} from '@/lib/encounter-types';
import type { Monster, Difficulty } from '@/lib/encounter-types';

describe('encounter-types', () => {
  describe('CR_TO_XP', () => {
    it('should have XP values for common CRs', () => {
      expect(CR_TO_XP['1/4']).toBe(50);
      expect(CR_TO_XP['1/2']).toBe(100);
      expect(CR_TO_XP['1']).toBe(200);
      expect(CR_TO_XP['5']).toBe(1800);
      expect(CR_TO_XP['10']).toBe(5900);
      expect(CR_TO_XP['20']).toBe(25000);
    });
  });

  describe('XP_THRESHOLDS', () => {
    it('should have thresholds for all levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(XP_THRESHOLDS[level]).toBeDefined();
        expect(XP_THRESHOLDS[level].easy).toBeGreaterThan(0);
        expect(XP_THRESHOLDS[level].medium).toBeGreaterThan(XP_THRESHOLDS[level].easy);
        expect(XP_THRESHOLDS[level].hard).toBeGreaterThan(XP_THRESHOLDS[level].medium);
        expect(XP_THRESHOLDS[level].deadly).toBeGreaterThan(XP_THRESHOLDS[level].hard);
      }
    });
  });

  describe('isLegendaryMonster', () => {
    it('should return true for monsters with isLegendary flag', () => {
      const legendaryMonster: Monster = {
        id: 'test-1',
        name: 'Ancient Dragon',
        cr: '20',
        xp: 25000,
        size: 'Gargantuan',
        type: 'Dragon',
        count: 1,
        isLegendary: true,
      };
      expect(isLegendaryMonster(legendaryMonster)).toBe(true);
    });

    it('should return false for monsters without isLegendary flag', () => {
      const normalMonster: Monster = {
        id: 'test-2',
        name: 'Goblin',
        cr: '1/4',
        xp: 50,
        size: 'Small',
        type: 'Humanoid',
        count: 1,
      };
      expect(isLegendaryMonster(normalMonster)).toBe(false);
    });
  });

  describe('getMonsterMultiplier', () => {
    it('should return 1 for single monster', () => {
      expect(getMonsterMultiplier(1)).toBe(1);
    });

    it('should return 1.5 for 2 monsters', () => {
      expect(getMonsterMultiplier(2)).toBe(1.5);
    });

    it('should return 2 for 3-6 monsters', () => {
      expect(getMonsterMultiplier(3)).toBe(2);
      expect(getMonsterMultiplier(4)).toBe(2);
      expect(getMonsterMultiplier(6)).toBe(2);
    });

    it('should return 2.5 for 7-10 monsters', () => {
      expect(getMonsterMultiplier(7)).toBe(2.5);
      expect(getMonsterMultiplier(10)).toBe(2.5);
    });

    it('should return 3 for 11-14 monsters', () => {
      expect(getMonsterMultiplier(11)).toBe(3);
      expect(getMonsterMultiplier(14)).toBe(3);
    });

    it('should return 4 for 15+ monsters', () => {
      expect(getMonsterMultiplier(15)).toBe(4);
      expect(getMonsterMultiplier(20)).toBe(4);
      expect(getMonsterMultiplier(100)).toBe(4);
    });
  });

  describe('getEncounterXPBudget', () => {
    it('should calculate XP budget based on party level and difficulty', () => {
      // Level 5 medium difficulty = 500 XP per player
      const budget = getEncounterXPBudget(5, 4, 'medium');
      expect(budget).toBe(2000); // 500 * 4 players
    });

    it('should scale with player count', () => {
      const budget4Players = getEncounterXPBudget(5, 4, 'medium');
      const budget6Players = getEncounterXPBudget(5, 6, 'medium');
      expect(budget6Players).toBe(budget4Players * 1.5);
    });
  });

  describe('calculateAdjustedXP', () => {
    it('should calculate adjusted XP for a single monster', () => {
      const monsters: Monster[] = [
        { id: '1', name: 'Goblin', cr: '1/4', xp: 50, size: 'Small', type: 'Humanoid', count: 1 },
      ];
      // 50 XP * 1 monster * multiplier 1 = 50
      expect(calculateAdjustedXP(monsters)).toBe(50);
    });

    it('should apply multiplier for multiple monsters', () => {
      const monsters: Monster[] = [
        { id: '1', name: 'Goblin', cr: '1/4', xp: 50, size: 'Small', type: 'Humanoid', count: 6 },
      ];
      // 50 XP * 6 monsters = 300 total XP, multiplier 2 = 600 adjusted
      expect(calculateAdjustedXP(monsters)).toBe(600);
    });
  });

  describe('determineDifficulty', () => {
    // Level 1 thresholds for 4 players: easy=100, medium=200, hard=300, deadly=400
    it('should return easy for low XP', () => {
      const difficulty = determineDifficulty(50, 1, 4);
      expect(difficulty).toBe('easy');
    });

    it('should return medium for medium XP', () => {
      const difficulty = determineDifficulty(200, 1, 4);
      expect(difficulty).toBe('medium');
    });

    it('should return hard for high XP', () => {
      const difficulty = determineDifficulty(300, 1, 4);
      expect(difficulty).toBe('hard');
    });

    it('should return deadly for very high XP', () => {
      const difficulty = determineDifficulty(400, 1, 4);
      expect(difficulty).toBe('deadly');
    });
  });
});
