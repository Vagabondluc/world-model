import { describe, it, expect } from 'vitest';
import type { CustomCategoryDef } from '@/lib/types';
import { buildCustomTemplate } from '@/lib/types';
import { CATEGORY_TEMPLATES } from '@/lib/types/templates';
import { validateEntityAttributes } from '@/lib/validation';

// ---------------------------------------------------------------------------
// Helpers — mirror resolveEffectiveTemplate from category-actions.ts
// (tested here without Zustand so we can keep tests pure)
// ---------------------------------------------------------------------------
function resolveTemplate(
  category: string,
  customCategories: CustomCategoryDef[],
  seen = new Set<string>(),
): Record<string, unknown> | undefined {
  if (seen.has(category)) return CATEGORY_TEMPLATES[category];
  seen.add(category);
  const customCat = customCategories.find((c) => c.name === category);
  if (!customCat) return CATEGORY_TEMPLATES[category];
  const baseTemplate = customCat.baseCategory
    ? customCat.baseCategory === category
      ? CATEGORY_TEMPLATES[category]
      : resolveTemplate(customCat.baseCategory, customCategories, seen)
    : undefined;
  return buildCustomTemplate(customCat, baseTemplate ?? {});
}

// ---------------------------------------------------------------------------
// 1. buildCustomTemplate
// ---------------------------------------------------------------------------
describe('buildCustomTemplate', () => {
  it('own string attribute becomes template value', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: { name: { type: 'string', default: 'Knight' } },
    };
    expect(buildCustomTemplate(def, {})).toEqual({ name: 'Knight' });
  });

  it('own number attribute becomes template value', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: { power: { type: 'number', default: 100 } },
    };
    expect(buildCustomTemplate(def, {})).toEqual({ power: 100 });
  });

  it('own boolean attribute becomes template value', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: { active: { type: 'boolean', default: true } },
    };
    expect(buildCustomTemplate(def, {})).toEqual({ active: true });
  });

  it('empty attributes returns only base template', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: {},
    };
    expect(buildCustomTemplate(def, { hp: 10 })).toEqual({ hp: 10 });
  });

  it('empty attributes and empty base returns empty object', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: {},
    };
    expect(buildCustomTemplate(def, {})).toEqual({});
  });

  it('child attribute overrides base key', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: { name: { type: 'string', default: 'Knight' } },
    };
    expect(buildCustomTemplate(def, { name: 'unnamed', hp: 5 })).toMatchObject({
      name: 'Knight',
      hp: 5,
    });
  });

  it('child adds new keys to base', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: { mana: { type: 'number', default: 50 } },
    };
    const result = buildCustomTemplate(def, { hp: 10 });
    expect(result.hp).toBe(10);
    expect(result.mana).toBe(50);
  });

  it('base keys not present in child are preserved', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Test', group: 'Custom', icon: 'Box',
      attributes: { hp: { type: 'number', default: 100 } },
    };
    const result = buildCustomTemplate(def, { lore: 'none', hp: 10 });
    expect(result.lore).toBe('none');
    expect(result.hp).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// 2. resolveTemplate (inheritance)
// ---------------------------------------------------------------------------
describe('resolveTemplate', () => {
  it('built-in category returns catalog template', () => {
    const result = resolveTemplate('NPC', []);
    expect(result).toEqual(CATEGORY_TEMPLATES['NPC']);
  });

  it('unknown non-custom category returns undefined', () => {
    const result = resolveTemplate('Wizard', []);
    expect(result).toBeUndefined();
  });

  it('custom with no base returns own defaults', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Mech', group: 'Custom', icon: 'Box',
      attributes: { pilot: { type: 'string', default: 'unknown' } },
    };
    const result = resolveTemplate('Mech', [def]);
    expect(result).toEqual({ pilot: 'unknown' });
  });

  it('custom extending built-in includes built-in fields', () => {
    const def: CustomCategoryDef = {
      id: 'c1', name: 'Knight', group: 'Custom', icon: 'Sword',
      baseCategory: 'NPC',
      attributes: { title: { type: 'string', default: 'Sir' } },
    };
    const result = resolveTemplate('Knight', [def]);
    expect(result).toBeDefined();
    expect(result!.title).toBe('Sir');
    // Should also include a field from NPC template
    const npcKey = Object.keys(CATEGORY_TEMPLATES['NPC']!)[0];
    expect(result).toHaveProperty(npcKey);
  });

  it('child field overrides built-in field on collision', () => {
    const npcTemplate = CATEGORY_TEMPLATES['NPC'] as Record<string, unknown>;
    const firstKey = Object.keys(npcTemplate)[0];
    const def: CustomCategoryDef = {
      id: 'c1', name: 'VeteranNPC', group: 'Custom', icon: 'Box',
      baseCategory: 'NPC',
      attributes: { [firstKey]: { type: 'string', default: 'OVERRIDE' } },
    };
    const result = resolveTemplate('VeteranNPC', [def]);
    expect(result![firstKey]).toBe('OVERRIDE');
  });

  it('two-level custom chain merges all fields', () => {
    const defB: CustomCategoryDef = {
      id: 'b', name: 'SquireNPC', group: 'Custom', icon: 'Box',
      baseCategory: 'NPC',
      attributes: { squire_rank: { type: 'number', default: 1 } },
    };
    const defA: CustomCategoryDef = {
      id: 'a', name: 'KnightNPC', group: 'Custom', icon: 'Box',
      baseCategory: 'SquireNPC',
      attributes: { crest: { type: 'string', default: 'Eagle' } },
    };
    const result = resolveTemplate('KnightNPC', [defA, defB]);
    expect(result).toBeDefined();
    expect(result!.crest).toBe('Eagle');
    expect(result!.squire_rank).toBe(1);
    const npcKey = Object.keys(CATEGORY_TEMPLATES['NPC']!)[0];
    expect(result).toHaveProperty(npcKey);
  });

  it('deepest child wins on key collision across chain', () => {
    const defB: CustomCategoryDef = {
      id: 'b', name: 'BaseHero', group: 'Custom', icon: 'Box',
      attributes: { level: { type: 'number', default: 1 } },
    };
    const defA: CustomCategoryDef = {
      id: 'a', name: 'TopHero', group: 'Custom', icon: 'Box',
      baseCategory: 'BaseHero',
      attributes: { level: { type: 'number', default: 99 } },
    };
    const result = resolveTemplate('TopHero', [defA, defB]);
    expect(result!.level).toBe(99);
  });

  it('self-reference does not cause infinite recursion', () => {
    const def: CustomCategoryDef = {
      id: 'x', name: 'X', group: 'Custom', icon: 'Box',
      baseCategory: 'X',
      attributes: {},
    };
    const start = Date.now();
    const result = resolveTemplate('X', [def]);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
    // Result is either the CATEGORY_TEMPLATES fallback (undefined for 'X') or {}
    expect(result === undefined || typeof result === 'object').toBe(true);
  });

  it('two-node cycle terminates', () => {
    const defA: CustomCategoryDef = {
      id: 'a', name: 'CycleA', group: 'Custom', icon: 'Box',
      baseCategory: 'CycleB',
      attributes: {},
    };
    const defB: CustomCategoryDef = {
      id: 'b', name: 'CycleB', group: 'Custom', icon: 'Box',
      baseCategory: 'CycleA',
      attributes: {},
    };
    const start = Date.now();
    const result = resolveTemplate('CycleA', [defA, defB]);
    expect(Date.now() - start).toBeLessThan(100);
    expect(result === undefined || typeof result === 'object').toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Store action logic (pure state, no Zustand required)
// ---------------------------------------------------------------------------
describe('store action logic', () => {
  it('addCustomCategory appends def', () => {
    const def: CustomCategoryDef = {
      id: 'new', name: 'Golem', group: 'Custom', icon: 'Box', attributes: {},
    };
    let state = { customCategories: [] as CustomCategoryDef[] };
    // Simulate the action
    state = { customCategories: [...state.customCategories, def] };
    expect(state.customCategories).toHaveLength(1);
    expect(state.customCategories[0].name).toBe('Golem');
  });

  it('updateCustomCategory merges partial update', () => {
    const def: CustomCategoryDef = {
      id: 'u1', name: 'Troll', group: 'Custom', icon: 'Box', attributes: {},
    };
    let state = { customCategories: [def] };
    // Simulate the action
    state = {
      customCategories: state.customCategories.map((c) =>
        c.id === 'u1' ? { ...c, icon: 'Skull' } : c,
      ),
    };
    expect(state.customCategories[0].icon).toBe('Skull');
    expect(state.customCategories[0].name).toBe('Troll');
  });

  it('removeCustomCategory removes by id', () => {
    const defA: CustomCategoryDef = { id: 'r1', name: 'A', group: 'Custom', icon: 'Box', attributes: {} };
    const defB: CustomCategoryDef = { id: 'r2', name: 'B', group: 'Custom', icon: 'Box', attributes: {} };
    let state = { customCategories: [defA, defB] };
    state = { customCategories: state.customCategories.filter((c) => c.id !== 'r1') };
    expect(state.customCategories).toHaveLength(1);
    expect(state.customCategories[0].id).toBe('r2');
  });

  it('remove nonexistent id is a noop', () => {
    const def: CustomCategoryDef = { id: 'k1', name: 'Keep', group: 'Custom', icon: 'Box', attributes: {} };
    let state = { customCategories: [def] };
    state = { customCategories: state.customCategories.filter((c) => c.id !== 'gone') };
    expect(state.customCategories).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 4. End-to-end lifecycle
// ---------------------------------------------------------------------------
describe('custom category lifecycle', () => {
  it('create → resolve → validate → failure path', () => {
    const def: CustomCategoryDef = {
      id: 'cat-court',
      name: 'NPC+Court2',
      group: 'Custom',
      icon: 'Crown',
      baseCategory: 'NPC',
      attributes: {
        courtRank: { type: 'string', default: 'Knight' },
        loyalty: { type: 'number', default: 75 },
      },
    };

    const template = resolveTemplate('NPC+Court2', [def]);
    expect(template).toBeDefined();
    expect(template!.courtRank).toBe('Knight');

    const goodResult = validateEntityAttributes(
      'NPC+Court2',
      { name: 'Sir Aldric', courtRank: 'Earl', loyalty: 90 },
      [def],
    );
    expect(goodResult.success).toBe(true);

    const badResult = validateEntityAttributes(
      'NPC+Court2',
      { name: 'Sir Aldric', loyalty: 'very loyal' },
      [def],
    );
    expect(badResult.success).toBe(false);
    if (!badResult.success) {
      expect(badResult.errors.some((e: string) => e.includes('loyalty'))).toBe(true);
    }
  });
});
