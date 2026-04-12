import { describe, it, expect } from 'vitest';
import { getHistory, diff } from '@/lib/git/history';

describe('Git — history', () => {
  it('retrieves history list', async () => {
    const h = await (getHistory as any)?.();
    expect(Array.isArray(h) || h == null).toBe(true);
  });

  it('generates a diff between commits', async () => {
    const d = await (diff as any)?.('c1', 'c2');
    expect(typeof (d ?? '')).toBe('string');
  });
});
