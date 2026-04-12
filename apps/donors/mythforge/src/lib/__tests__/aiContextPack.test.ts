import { describe, expect, it } from 'vitest';
import { buildAiContextPack, buildAiContextPrompt } from '@/lib/llm/ai-chat';
import type { AiChatEntityContext, AiChatWorldContext } from '@/lib/llm/ai-context';
import type { CustomCategoryDef } from '@/lib/types';

const worldContext: AiChatWorldContext = {
  entities: [
    {
      id: 'e-npc',
      title: 'Alice',
      category: 'NPC',
      uuid_short: 'E-A1B2',
      markdown_content: '# Alice\nA watchful archivist of the undercroft.',
      json_attributes: { hp: 10, ac: 12, level: 2, disposition: 'Neutral' },
      tags: ['lorekeeper'],
    },
    {
      id: 'e-faction',
      title: 'Blackstone Cabal',
      category: 'Faction',
      uuid_short: 'E-C3D4',
      markdown_content: 'A secret society controlling the lantern docks.',
      json_attributes: { member_count: 12, influence: 'Regional', resources: 'Moderate', secrecy: 4 },
      tags: ['faction'],
    },
    {
      id: 'e-city',
      title: 'Gloamspire',
      category: 'City',
      uuid_short: 'E-E5F6',
      markdown_content: 'The city of a thousand bells.',
      json_attributes: { population: 20000, wealth_tier: 3, guard_count: 300, crime_rate: 14 },
      tags: ['city'],
    },
  ],
  relationships: [
    { id: 'r-1', parent_id: 'e-npc', child_id: 'e-faction', relationship_type: 'member_of' },
    { id: 'r-2', parent_id: 'e-faction', child_id: 'e-city', relationship_type: 'located_in' },
  ],
  customCategories: [
    {
      id: 'c-1',
      name: 'Arena Fighter',
      group: 'Custom',
      icon: 'Swords',
      baseCategory: 'NPC',
      attributes: {
        arena_rank: { type: 'number', default: 1 },
        wins: { type: 'number', default: 0 },
      },
    },
  ],
};

const activeEntity: AiChatEntityContext = {
  entityId: 'e-npc',
  entityTitle: 'Alice',
  entityCategory: 'NPC',
  entityMarkdown: '# Alice\nA watchful archivist of the undercroft.',
  entityAttributes: { hp: 10, ac: 12, level: 2, disposition: 'Neutral' },
};

describe('AI context pack', () => {
  it('builds a rich lorekeeper context pack with schema summaries and runtime flags', () => {
    const pack = buildAiContextPack({
      mode: 'lorekeeper',
      context: activeEntity,
      worldContext,
      runtime: { localOllama: true, httpAi: false, openui: true, piMono: true },
    });

    expect(pack.personaLabel).toBe('The Lorekeeper');
    expect(pack.runtime.localOllama).toBe(true);
    expect(pack.runtime.piMono).toBe(true);
    expect(pack.activeEntity?.title).toBe('Alice');
    expect(pack.world.entityCount).toBe(3);
    expect(pack.world.relationshipCount).toBe(2);
    expect(pack.world.relationships[0].parentTitle).toBe('Alice');
    expect(pack.outputContract.allowedBlocks).toContain('draft_card');
    expect(pack.schema.categoryNames).toContain('NPC');
    expect(pack.schema.categories.some((category) => category.category === 'Arena Fighter')).toBe(true);

    const plane = pack.schema.categories.find((category) => category.category === 'Plane');
    expect(plane?.fields.find((field) => field.name === 'alignment')?.enumValues).toEqual(['Neutral', 'True Neutral']);

    const npc = pack.schema.categories.find((category) => category.category === 'NPC');
    expect(npc?.fields.find((field) => field.name === 'hp')?.observedRange).toEqual({ min: 10, max: 20 });
  });

  it('narrows the roleplayer context pack to nearby entities and minimal structured output', () => {
    const pack = buildAiContextPack({
      mode: 'roleplayer',
      context: activeEntity,
      worldContext,
    });

    expect(pack.personaLabel).toBe('The Roleplayer');
    expect(pack.world.entities.map((entity) => entity.title)).toEqual(expect.arrayContaining(['Alice', 'Blackstone Cabal']));
    expect(pack.world.entities.some((entity) => entity.title === 'Gloamspire')).toBe(false);
    expect(pack.schema.categoryNames).toEqual(expect.arrayContaining(['NPC', 'Faction']));
    expect(pack.schema.categoryNames).not.toContain('City');
    expect(pack.outputContract.allowedBlocks).not.toContain('draft_card');
    expect(pack.outputContract.suppressionBlocks).toContain('draft_card');
  });

  it('formats the pack into a compact system prompt section', () => {
    const prompt = buildAiContextPrompt({
      mode: 'lorekeeper',
      context: activeEntity,
      worldContext,
      runtime: { localOllama: true, httpAi: false, openui: true, piMono: false },
    });

    expect(prompt).toContain('[AI CONTEXT PACK v1]');
    expect(prompt).toContain('[SCHEMA CATALOG]');
    expect(prompt).toContain('Arena Fighter');
    expect(prompt).toContain('Allowed structured blocks: draft_card, relationship_suggestion, schema_confirmation');
  });
});

