import { describe, test, expect } from 'bun:test';
import { 
  calculateAdjustedXP,
  determineDifficulty,
  isLegendaryMonster,
  getMonsterMultiplier,
  CR_TO_XP,
  XP_THRESHOLDS
} from '../src/lib/encounter-types';
import type { Monster } from '../src/lib/encounter-types';

describe('XP Calculations', () => {
  test('calculateAdjustedXP returns correct value for single monster', () => {
    const monsters: Monster[] = [
      { id: '1', name: 'Goblin', cr: '1/4', xp: 50, size: 'Small', type: 'Humanoid', count: 1 }
    ];
    // 1 monster = 1x multiplier
    expect(calculateAdjustedXP(monsters)).toBe(50);
  });

  test('calculateAdjustedXP applies multiplier for multiple monsters', () => {
    const monsters: Monster[] = [
      { id: '1', name: 'Goblin', cr: '1/4', xp: 50, size: 'Small', type: 'Humanoid', count: 3 }
    ];
    // 3 monsters = 2x multiplier
    // Total XP = 50 * 3 = 150
    // Adjusted = 150 * 2 = 300
    expect(calculateAdjustedXP(monsters)).toBe(300);
  });

  test('calculateAdjustedXP handles large groups', () => {
    const monsters: Monster[] = [
      { id: '1', name: 'Goblin', cr: '1/4', xp: 50, size: 'Small', type: 'Humanoid', count: 10 }
    ];
    // 10 monsters = 2.5x multiplier
    // Total XP = 50 * 10 = 500
    // Adjusted = 500 * 2.5 = 1250
    expect(calculateAdjustedXP(monsters)).toBe(1250);
  });
});

describe('Difficulty Determination', () => {
  test('determineDifficulty returns easy for low XP', () => {
    // Level 1 party of 4: easy threshold = 25 * 4 = 100
    const difficulty = determineDifficulty(50, 1, 4);
    expect(difficulty).toBe('easy');
  });

  test('determineDifficulty returns deadly for high XP', () => {
    // Level 10 party of 4: deadly threshold = 2800 * 4 = 11200
    const difficulty = determineDifficulty(15000, 10, 4);
    expect(difficulty).toBe('deadly');
  });

  test('determineDifficulty returns medium for moderate XP', () => {
    // Level 5 party of 4: medium threshold = 500 * 4 = 2000
    const difficulty = determineDifficulty(2000, 5, 4);
    expect(difficulty).toBe('medium');
  });

  test('determineDifficulty returns hard for XP between hard and deadly', () => {
    // Level 5 party of 4: medium = 500*4=2000, hard = 750*4=3000, deadly = 1100*4=4400
    // XP of 3500 should be hard (>= hardThreshold)
    const difficulty = determineDifficulty(3500, 5, 4);
    expect(difficulty).toBe('hard');
  });
});

describe('Monster Multiplier', () => {
  test('single monster has 1x multiplier', () => {
    expect(getMonsterMultiplier(1)).toBe(1);
  });

  test('two monsters have 1.5x multiplier', () => {
    expect(getMonsterMultiplier(2)).toBe(1.5);
  });

  test('3-6 monsters have 2x multiplier', () => {
    expect(getMonsterMultiplier(3)).toBe(2);
    expect(getMonsterMultiplier(6)).toBe(2);
  });

  test('7-10 monsters have 2.5x multiplier', () => {
    expect(getMonsterMultiplier(7)).toBe(2.5);
    expect(getMonsterMultiplier(10)).toBe(2.5);
  });

  test('11-14 monsters have 3x multiplier', () => {
    expect(getMonsterMultiplier(11)).toBe(3);
    expect(getMonsterMultiplier(14)).toBe(3);
  });

  test('15+ monsters have 4x multiplier', () => {
    expect(getMonsterMultiplier(15)).toBe(4);
    expect(getMonsterMultiplier(20)).toBe(4);
  });
});

describe('Legendary Monster Detection', () => {
  test('isLegendaryMonster returns true when isLegendary is set', () => {
    const monster: Monster = {
      id: '1',
      name: 'Ancient Red Dragon',
      cr: '24',
      xp: 62000,
      size: 'Gargantuan',
      type: 'Dragon',
      count: 1,
      isLegendary: true
    };
    expect(isLegendaryMonster(monster)).toBe(true);
  });

  test('isLegendaryMonster returns false for normal monsters', () => {
    const monster: Monster = {
      id: '1',
      name: 'Goblin',
      cr: '1/4',
      xp: 50,
      size: 'Small',
      type: 'Humanoid',
      count: 1
    };
    expect(isLegendaryMonster(monster)).toBe(false);
  });
});

describe('CR to XP Mapping', () => {
  test('CR 1/4 maps to 50 XP', () => {
    expect(CR_TO_XP['1/4']).toBe(50);
  });

  test('CR 1 maps to 200 XP', () => {
    expect(CR_TO_XP['1']).toBe(200);
  });

  test('CR 5 maps to 1800 XP', () => {
    expect(CR_TO_XP['5']).toBe(1800);
  });

  test('CR 20 maps to 25000 XP', () => {
    expect(CR_TO_XP['20']).toBe(25000);
  });
});

describe('XP Thresholds', () => {
  test('Level 1 easy threshold is 25', () => {
    expect(XP_THRESHOLDS[1].easy).toBe(25);
  });

  test('Level 5 medium threshold is 500', () => {
    // Corrected value based on actual data
    expect(XP_THRESHOLDS[5].medium).toBe(500);
  });

  test('Level 10 deadly threshold is 2800', () => {
    expect(XP_THRESHOLDS[10].deadly).toBe(2800);
  });

  test('Level 20 thresholds exist', () => {
    expect(XP_THRESHOLDS[20]).toBeDefined();
    expect(XP_THRESHOLDS[20].easy).toBe(2800);
    expect(XP_THRESHOLDS[20].deadly).toBe(12700);
  });
});
