import { vi, test, expect } from 'vitest';

// Mock Tauri invoke and event listen before importing the provider
vi.mock('@tauri-apps/api/core', () => ({
  invoke: async (_cmd: string, _args?: unknown) => {
    // Return an empty models list for simplicity
    return [];
  },
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: async (_evt: string, cb: (e: any) => void) => {
    // Emit a few tokens asynchronously, then a done event
    setTimeout(() => cb({ payload: { token: 'Hello', done: false } }), 0);
    setTimeout(() => cb({ payload: { token: ' world', done: false } }), 10);
    setTimeout(() => cb({ payload: { token: '', done: true } }), 20);
    // Return an unlisten function
    return async () => {};
  },
}));

import ollamaGenerate from '@/lib/llm/providers/ollama-tauri';

test('ollamaGenerate yields tokens from mocked Tauri events', async () => {
  const gen = ollamaGenerate('dummy-model', 'prompt');
  let acc = '';
  // Collect tokens produced by the async generator
  // eslint-disable-next-line no-restricted-syntax
  for await (const token of gen) {
    acc += token;
  }
  expect(acc).toBe('Hello world');
});
