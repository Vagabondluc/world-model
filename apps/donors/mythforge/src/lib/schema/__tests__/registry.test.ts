import { describe, it, expect } from 'vitest';
import { registerSchema, getSchema } from '@/lib/schema/registry';
import { createMockSchema } from '../../../../tests/utils/fixtures';

describe('Schema — registry', () => {
  it('registers and retrieves a schema', () => {
    const s = createMockSchema('npc');
    (registerSchema as any)?.(s);
    const got = (getSchema as any)?.('npc');
    expect(got?.name || got == null).toBe('npc');
  });
});
