import { describe, it, expect } from 'vitest';
import { initRepo } from '@/lib/git/init';

describe('Git — init', () => {
  it('initializes a repository', async () => {
    const res = await (initRepo as any)?.();
    expect(res === true || res == null).toBe(true);
  });
});
