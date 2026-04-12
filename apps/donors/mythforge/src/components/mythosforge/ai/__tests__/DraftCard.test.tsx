import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { DraftCardComponent } from '../DraftCard';
import { useWorldStore } from '@/store/useWorldStore';

describe('DraftCardComponent', () => {
  beforeEach(() => {
    useWorldStore.getState().resetWorld();
  });

  afterEach(() => {
    useWorldStore.getState().resetWorld();
  });

  it('creates a draft card in the world store from the AI panel action', () => {
    const before = useWorldStore.getState().entities.length;

    render(
      <DraftCardComponent
        data={{
          title: 'Iris',
          category: 'NPC',
          summary: 'A quiet archivist.',
          markdownPreview: '## Iris\nSilent watcher.',
          attributes: { hp: 10, ac: 12 },
          tags: ['npc', 'lorekeeper'],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /create draft card/i }));

    const after = useWorldStore.getState().entities.length;
    expect(after).toBe(before + 1);
    expect(useWorldStore.getState().entities.at(-1)).toMatchObject({
      title: 'Iris',
      category: 'NPC',
      markdown_content: '## Iris\nSilent watcher.',
      json_attributes: { hp: 10, ac: 12 },
    });
  });
});
