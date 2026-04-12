import { vi, test, expect } from 'vitest';

vi.mock('@/lib/llm/providers/ollama-tauri', () => ({
  default: async function* mockOllamaGenerate() {
    yield 'Lore intro. ';
    yield '[DRAFT_ENTITY]{"title":"Iris","category":"NPC","summary":"A quiet archivist.","markdown":"## Iris\\nSilent watcher.","attributes":{"hp":10,"ac":12},"tags":["npc","lorekeeper"]}[/DRAFT_ENTITY]';
  },
}));

import { generateLocalOllamaResponse } from '@/lib/llm/local-ollama';

test('generateLocalOllamaResponse extracts draft cards from streamed local ollama output', async () => {
  const result = await generateLocalOllamaResponse('dummy-model', {
    mode: 'lorekeeper',
    messages: [{ role: 'user', content: 'Create a lorekeeper NPC draft.' }],
  });

  expect(result.content).toContain('Lore intro.');
  expect(result.content).not.toContain('[DRAFT_ENTITY]');
  expect(result.components).toHaveLength(1);
  expect(result.components[0]).toMatchObject({
    type: 'draft_card',
    data: {
      title: 'Iris',
      category: 'NPC',
      summary: 'A quiet archivist.',
      tags: ['npc', 'lorekeeper'],
    },
  });
});
