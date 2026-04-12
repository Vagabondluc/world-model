import { describe, expect, it } from 'vitest';
import { buildAiContextPack } from '@/lib/llm/ai-chat';
import { toPiMonoAdapterContext } from '@/lib/pi-mono';

describe('pi-mono adapter context', () => {
  it('keeps the shared pack and provider capability flags together', () => {
    const pack = buildAiContextPack({
      mode: 'scholar',
      worldContext: {
        entities: [
          {
            id: 'e-1',
            title: 'The Archivist',
            category: 'NPC',
            uuid_short: 'E-1111',
            markdown_content: 'A keeper of lost maps.',
            json_attributes: { hp: 10, ac: 12, level: 2, disposition: 'Neutral' },
            tags: ['scholar'],
          },
        ],
        relationships: [],
      },
      runtime: { localOllama: false, httpAi: true, openui: true, piMono: true },
    });

    const adapter = toPiMonoAdapterContext(pack);
    expect(adapter.repoUrl).toContain('pi-mono');
    expect(adapter.contextPack.personaLabel).toBe('The Scholar');
    expect(adapter.providerCapabilities.piMono).toBe(true);
    expect(adapter.structuredBlocks).toContain('graph_analysis');
  });
});

