import { describe, it, expect } from 'vitest';
import { AI_MODES } from '@/lib/types';
import type { AIMode, AIModeConfig, ChatMessage, ChatComponent } from '@/lib/types';

// ---------------------------------------------------------------------------
// 1. AI_MODES structural invariants
// ---------------------------------------------------------------------------
describe('AI_MODES structural invariants', () => {
  it('has exactly four modes', () => {
    expect(AI_MODES).toHaveLength(4);
  });

  it('all expected mode ids are present', () => {
    const ids = new Set(AI_MODES.map((m) => m.id));
    const expected: AIMode[] = ['architect', 'lorekeeper', 'scholar', 'roleplayer'];
    for (const id of expected) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('no duplicate labels', () => {
    const labels = AI_MODES.map((m) => m.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('no duplicate icons', () => {
    const icons = AI_MODES.map((m) => m.icon);
    expect(new Set(icons).size).toBe(icons.length);
  });

  it('all modes have a non-empty system prompt', () => {
    for (const mode of AI_MODES) {
      expect(typeof mode.systemPrompt).toBe('string');
      expect(mode.systemPrompt.length).toBeGreaterThan(0);
    }
  });

  it('all modes have a non-empty description', () => {
    for (const mode of AI_MODES) {
      expect(mode.description.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Per-mode system prompt keyword contracts
// ---------------------------------------------------------------------------
describe('AI_MODES — system prompt contracts', () => {
  const findMode = (id: AIMode): AIModeConfig =>
    AI_MODES.find((m) => m.id === id)!;

  it('architect prompt contains structure/rules/database/organize keyword', () => {
    const { systemPrompt } = findMode('architect');
    const lower = systemPrompt.toLowerCase();
    const match = ['structure', 'rules', 'database', 'organize'].some((w) => lower.includes(w));
    expect(match).toBe(true);
  });

  it('lorekeeper prompt contains Draft Card reference', () => {
    const { systemPrompt } = findMode('lorekeeper');
    const lower = systemPrompt.toLowerCase();
    expect(lower.includes('draft card') || lower.includes('draft cards')).toBe(true);
  });

  it('scholar prompt references search/retrieve/lore/reference', () => {
    const { systemPrompt } = findMode('scholar');
    const lower = systemPrompt.toLowerCase();
    const match = ['search', 'retrieve', 'lore', 'reference'].some((w) => lower.includes(w));
    expect(match).toBe(true);
  });

  it('roleplayer prompt mentions character/NPC/in character/dialogue', () => {
    const { systemPrompt } = findMode('roleplayer');
    const lower = systemPrompt.toLowerCase();
    const match = ['character', 'npc', 'in character', 'dialogue'].some((w) => lower.includes(w));
    expect(match).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Mode lookup helpers
// ---------------------------------------------------------------------------
describe('AI_MODES lookup', () => {
  it('find by id returns correct mode', () => {
    const scholar = AI_MODES.find((m) => m.id === 'scholar');
    expect(scholar).toBeDefined();
    expect(scholar!.label).toBe('The Scholar');
  });

  it('find unknown id returns undefined', () => {
    const wizard = AI_MODES.find((m) => m.id === ('wizard' as AIMode));
    expect(wizard).toBeUndefined();
  });

  it('every mode has the correct icon mapped to a non-empty string', () => {
    for (const mode of AI_MODES) {
      expect(typeof mode.icon).toBe('string');
      expect(mode.icon.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. ChatMessage & ChatComponent type contracts
// ---------------------------------------------------------------------------
describe('ChatMessage type contracts', () => {
  it('constructs a valid ChatMessage with all required fields', () => {
    const msg: ChatMessage = {
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
      mode: 'architect',
      timestamp: Date.now(),
    };
    expect(msg.id).toBe('msg-1');
    expect(msg.role).toBe('user');
    expect(msg.mode).toBe('architect');
  });

  it('components field is optional', () => {
    const msg: ChatMessage = {
      id: 'msg-2',
      role: 'assistant',
      content: 'Hi',
      mode: 'lorekeeper',
      timestamp: Date.now(),
    };
    expect(msg.components).toBeUndefined();
  });

  it('ChatMessage with components array is valid', () => {
    const component: ChatComponent = {
      type: 'draft_card',
      data: { title: 'Mira', category: 'NPC' },
    };
    const msg: ChatMessage = {
      id: 'msg-3',
      role: 'assistant',
      content: 'Here is your NPC',
      mode: 'lorekeeper',
      timestamp: Date.now(),
      components: [component],
    };
    expect(msg.components).toHaveLength(1);
    expect(msg.components![0].type).toBe('draft_card');
    expect(msg.components![0].data.title).toBe('Mira');
  });

  it('all ChatComponent types can be constructed without error', () => {
    const types: ChatComponent['type'][] = [
      'draft_card',
      'schema_confirmation',
      'entity_reference',
      'pin_button',
      'consistency_issue',
      'relationship_suggestion',
      'category_suggestion',
      'graph_analysis',
    ];
    for (const type of types) {
      const c: ChatComponent = { type, data: {} };
      expect(c.type).toBe(type);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Mode config completeness
// ---------------------------------------------------------------------------
describe('AI_MODES completeness', () => {
  it('each mode config has id, label, icon, description, systemPrompt', () => {
    const requiredKeys: (keyof AIModeConfig)[] = ['id', 'label', 'icon', 'description', 'systemPrompt'];
    for (const mode of AI_MODES) {
      for (const key of requiredKeys) {
        expect(mode).toHaveProperty(key);
        expect(mode[key]).toBeTruthy();
      }
    }
  });

  it('mode ids are valid AIMode union members', () => {
    const validIds: AIMode[] = ['architect', 'lorekeeper', 'scholar', 'roleplayer'];
    for (const mode of AI_MODES) {
      expect(validIds).toContain(mode.id);
    }
  });
});
