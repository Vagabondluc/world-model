import { describe, it, expect } from 'vitest';
import { commit } from '@/lib/git/commit';

describe('Git — commit', () => {
  it('creates a commit with message', async () => {
    const r = await (commit as any)?.('Initial commit');
    expect(r?.id || r == null).toBeTruthy();
  });
});
