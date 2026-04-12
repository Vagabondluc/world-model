import { describe, it, expect } from 'vitest';
import { CATEGORY_TEMPLATES } from '@/lib/types/templates';
import type { CustomCategoryDef } from '@/lib/types';
import { validateEntityAttributes } from '@/lib/validation';

describe('npcSchema', () => {
  it("validates the NPC template in CATEGORY_TEMPLATES['NPC']", () => {
    const template = CATEGORY_TEMPLATES['NPC'];
    const res = validateEntityAttributes('NPC', template as Record<string, unknown>);
    expect(res.success).toBe(true);
  });

  it('validates a custom NPC extension with inherited base fields', () => {
    const customCategories: CustomCategoryDef[] = [
      {
        id: 'custom-npc-1',
        name: 'NPC+Court',
        group: 'Custom',
        icon: 'UserCircle',
        baseCategory: 'NPC',
        attributes: {
          court_title: { type: 'string', default: 'Envoy' },
          loyalty_score: { type: 'number', default: 75 },
        },
      },
    ];

    const res = validateEntityAttributes('NPC+Court', {
      name: 'Aelar',
      race: 'elf',
      court_title: 'Envoy',
      loyalty_score: 90,
    }, customCategories);

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toMatchObject({
        name: 'Aelar',
        race: 'elf',
        court_title: 'Envoy',
        loyalty_score: 90,
      });
    }
  });
});
