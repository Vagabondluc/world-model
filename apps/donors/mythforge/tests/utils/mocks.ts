import { vi } from 'vitest';

export function createMockFs(initial: Record<string, string> = {}) {
  const store = { ...initial };
  return {
    readFile: vi.fn(async (p: string) => store[p] ?? null),
    writeFile: vi.fn(async (p: string, content: string) => { store[p] = content; }),
    listFiles: vi.fn(async (dir: string) => Object.keys(store)),
    reset: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
}

export function createMockGit() {
  return {
    init: vi.fn(async () => true),
    commit: vi.fn(async (msg: string) => ({ id: `cmt-${Date.now()}`, msg })),
    log: vi.fn(async () => []),
    branch: vi.fn(async (name: string) => ({ name })),
    checkout: vi.fn(async (name: string) => ({ name })),
  };
}

export function createMockFetch(response: any = {}) {
  return vi.fn(async () => ({ ok: true, json: async () => response }));
}
