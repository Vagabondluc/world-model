import { describe, it, expect } from 'vitest';
import { buildSchemaFromTemplate, validateEntityAttributes } from '@/lib/validation';
import { CATEGORY_TEMPLATES } from '@/lib/types/templates';
import type { CustomCategoryDef } from '@/lib/types';

// ---------------------------------------------------------------------------
// 1. buildSchemaFromTemplate — type inference
// ---------------------------------------------------------------------------
describe('buildSchemaFromTemplate — type inference', () => {
  it('string value produces optional string schema', () => {
    const schema = buildSchemaFromTemplate({ name: 'Bob' });
    expect(schema.safeParse({ name: 'Alice' }).success).toBe(true);
    expect(schema.safeParse({}).success).toBe(true); // optional
    expect(schema.safeParse({ name: 42 }).success).toBe(false);
  });

  it('number value produces optional number schema', () => {
    const schema = buildSchemaFromTemplate({ level: 1 });
    expect(schema.safeParse({ level: 5 }).success).toBe(true);
    expect(schema.safeParse({}).success).toBe(true);
    expect(schema.safeParse({ level: 'five' }).success).toBe(false);
  });

  it('boolean value produces optional boolean schema', () => {
    const schema = buildSchemaFromTemplate({ active: true });
    expect(schema.safeParse({ active: false }).success).toBe(true);
    expect(schema.safeParse({}).success).toBe(true);
    expect(schema.safeParse({ active: 'yes' }).success).toBe(false);
  });

  it('string array produces string array schema', () => {
    const schema = buildSchemaFromTemplate({ tags: ['a', 'b'] });
    expect(schema.safeParse({ tags: ['x'] }).success).toBe(true);
    expect(schema.safeParse({ tags: [1] }).success).toBe(false);
  });

  it('number array produces number array schema', () => {
    const schema = buildSchemaFromTemplate({ scores: [1, 2] });
    expect(schema.safeParse({ scores: [3] }).success).toBe(true);
    expect(schema.safeParse({ scores: ['high'] }).success).toBe(false);
  });

  it('boolean array produces boolean array schema', () => {
    const schema = buildSchemaFromTemplate({ flags: [true] });
    expect(schema.safeParse({ flags: [false, true] }).success).toBe(true);
    expect(schema.safeParse({ flags: [1] }).success).toBe(false);
  });

  it('mixed array produces any array schema', () => {
    const schema = buildSchemaFromTemplate({ misc: ['a', 1] });
    expect(schema.safeParse({ misc: ['x', 2, true] }).success).toBe(true);
  });

  it('plain object produces record-any schema', () => {
    const schema = buildSchemaFromTemplate({ meta: { key: 'val' } });
    expect(schema.safeParse({ meta: { key2: 42 } }).success).toBe(true);
  });

  it('null value produces any schema', () => {
    const schema = buildSchemaFromTemplate({ x: null });
    expect(schema.safeParse({ x: 'anything' }).success).toBe(true);
    expect(schema.safeParse({ x: 99 }).success).toBe(true);
  });

  it('extra keys pass through (passthrough schema)', () => {
    const schema = buildSchemaFromTemplate({ name: 'Bob' });
    const result = schema.safeParse({ name: 'Alice', extra: 999 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Record<string, unknown>).extra).toBe(999);
    }
  });

  it('empty template produces passthrough schema', () => {
    const schema = buildSchemaFromTemplate({});
    expect(schema.safeParse({ anything: 'goes' }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. validateEntityAttributes — built-in categories
// ---------------------------------------------------------------------------
describe('validateEntityAttributes — built-in categories', () => {
  it('valid NPC template data passes', () => {
    const template = CATEGORY_TEMPLATES['NPC'] as Record<string, unknown>;
    const result = validateEntityAttributes('NPC', template);
    expect(result.success).toBe(true);
  });

  it('empty attrs passes (all fields optional)', () => {
    const result = validateEntityAttributes('NPC', {});
    expect(result.success).toBe(true);
  });

  it('extra fields pass through on built-in category', () => {
    const result = validateEntityAttributes('NPC', { name: 'Bob', unknownField: 99 });
    expect(result.success).toBe(true);
  });

  it('valid Settlement template data passes', () => {
    const template = CATEGORY_TEMPLATES['Settlement'] as Record<string, unknown>;
    const result = validateEntityAttributes('Settlement', template);
    expect(result.success).toBe(true);
  });

  it('valid Faction template data passes', () => {
    const template = CATEGORY_TEMPLATES['Faction'] as Record<string, unknown>;
    const result = validateEntityAttributes('Faction', template);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. validateEntityAttributes — custom categories
// ---------------------------------------------------------------------------
describe('validateEntityAttributes — custom categories', () => {
  const customDef: CustomCategoryDef = {
    id: 'val-c1',
    name: 'Arena Fighter',
    group: 'Custom',
    icon: 'Swords',
    baseCategory: 'NPC',
    attributes: {
      arena_rank: { type: 'number', default: 1 },
      wins: { type: 'number', default: 0 },
    },
  };

  it('valid custom category passes', () => {
    const result = validateEntityAttributes(
      'Arena Fighter',
      { arena_rank: 5, wins: 12 },
      [customDef],
    );
    expect(result.success).toBe(true);
  });

  it('invalid type in custom attribute fails', () => {
    const result = validateEntityAttributes(
      'Arena Fighter',
      { arena_rank: 'champion', wins: 12 },
      [customDef],
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes('arena_rank'))).toBe(true);
    }
  });

  it('custom category with NPC inheritance resolves base fields', () => {
    const result = validateEntityAttributes(
      'Arena Fighter',
      { name: 'Thorek', race: 'Dwarf', arena_rank: 3, wins: 8 },
      [customDef],
    );
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. validateEntityAttributes — edge cases
// ---------------------------------------------------------------------------
describe('validateEntityAttributes — edge cases', () => {
  it('completely unknown category with no customs passes attrs unchanged', () => {
    // Current implementation: unknown category with no built-in template → passes
    const result = validateEntityAttributes('Wizard', {}, []);
    expect(result.success).toBe(true);
  });

  it('unknown category with matching custom passes', () => {
    const wizardDef: CustomCategoryDef = {
      id: 'w1', name: 'Wizard', group: 'Custom', icon: 'Wand2',
      attributes: { school: { type: 'string', default: 'Evocation' } },
    };
    const result = validateEntityAttributes('Wizard', { school: 'Illusion' }, [wizardDef]);
    expect(result.success).toBe(true);
  });

  it('empty attrs with custom category passes (all fields have defaults)', () => {
    const def: CustomCategoryDef = {
      id: 'e1', name: 'MinimalCat', group: 'Custom', icon: 'Box',
      attributes: { hp: { type: 'number', default: 10 } },
    };
    const result = validateEntityAttributes('MinimalCat', {}, [def]);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. Integration — save-flow scenario (NPC+Court)
// ---------------------------------------------------------------------------
describe('save-flow integration', () => {
  const customCategories: CustomCategoryDef[] = [
    {
      id: 'save-c1',
      name: 'NPC+CourtSave',
      group: 'Custom',
      icon: 'Crown',
      baseCategory: 'NPC',
      attributes: {
        courtRank: { type: 'string', default: 'Knight' },
        loyalty: { type: 'number', default: 75 },
      },
    },
  ];

  it('valid entity with all inherited and own fields passes', () => {
    const result = validateEntityAttributes(
      'NPC+CourtSave',
      { name: 'Sir Aldric', race: 'Human', courtRank: 'Baron', loyalty: 90 },
      customCategories,
    );
    expect(result.success).toBe(true);
  });

  it('invalid loyalty type fails with field name in error', () => {
    const result = validateEntityAttributes(
      'NPC+CourtSave',
      { name: 'Sir Aldric', loyalty: 'very loyal' },
      customCategories,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes('loyalty'))).toBe(true);
    }
  });
});
