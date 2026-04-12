// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useWorldStore } from '@/store/useWorldStore';

vi.mock('@/lib/llm/ollama-settings', () => ({
  loadOllamaSettings: vi.fn(async () => ({
    provider: 'ollama',
    runtime: 'tauri',
    baseUrl: 'http://127.0.0.1:11434',
    autoDiscoverModels: true,
    refreshOnOpen: true,
    refreshIntervalSec: 60,
    selectedModel: 'mistral:7b',
    discoveredModels: [{ name: 'mistral:7b' }],
    lastDiscoveryAt: 1,
    lastHealthCheckAt: 1,
    isReachable: true,
    lastError: null,
  })),
  discoverOllamaModels: vi.fn(async () => [{ name: 'mistral:7b' }]),
  resolveOllamaModel: vi.fn((settings: { selectedModel?: string | null }) => settings.selectedModel ?? null),
}));

vi.mock('@/lib/llm/providers/ollama-tauri', () => ({
  default: async function* mockOllamaGenerate() {
    yield 'Lore intro. ';
    yield '[DRAFT_ENTITY]{"title":"Iris","category":"NPC","summary":"A quiet archivist.","markdown":"## Iris\\nSilent watcher.","attributes":{"hp":10,"ac":12},"tags":["npc","lorekeeper"]}[/DRAFT_ENTITY]';
  },
}));

import { AICopilot } from '@/components/mythosforge/AICopilot';

describe('ollama e2e card generation', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
    useWorldStore.getState().resetWorld();
    useWorldStore.setState({ aiMode: 'lorekeeper', chatMessages: [], chatInput: '' });
  });

  afterEach(() => {
    useWorldStore.getState().resetWorld();
  });

  it('generates a draft card locally and saves it into the world store', async () => {
    const before = useWorldStore.getState().entities.length;

    render(<AICopilot />);

    const input = screen.getByPlaceholderText(/message the lorekeeper/i);
    fireEvent.change(input, { target: { value: 'Create a new archivist NPC.' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await expect(screen.findByText(/a quiet archivist\./i)).resolves.toBeInTheDocument();
    const createButtons = screen.getAllByRole('button', { name: /create draft card/i });
    expect(createButtons.length).toBeGreaterThan(1);

    fireEvent.click(createButtons.at(-1)!);

    await waitFor(() => {
      expect(useWorldStore.getState().entities.length).toBe(before + 1);
    });

    expect(useWorldStore.getState().entities.at(-1)).toMatchObject({
      title: 'Iris',
      category: 'NPC',
      markdown_content: '## Iris\nSilent watcher.',
      json_attributes: { hp: 10, ac: 12 },
    });
  });
});
