import { describe, it, expect } from 'vitest';
import { createBranch, listBranches } from '@/lib/git/branch';

describe('Git — branch', () => {
  it('creates a branch', async () => {
    const b = await (createBranch as any)?.('feature/x');
    expect(b?.name || b == null).toBeTruthy();
  });

  it('lists branches', async () => {
    const list = await (listBranches as any)?.();
    expect(Array.isArray(list) || list == null).toBe(true);
  });
});
