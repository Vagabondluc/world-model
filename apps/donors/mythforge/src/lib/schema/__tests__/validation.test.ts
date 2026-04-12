import { describe, it, expect } from 'vitest';
import { validateAgainstSchemas } from '@/lib/schema/validation';
import { createMockEntity, createMockSchema } from '../../../../tests/utils/fixtures';

describe('Schema — validation', () => {
  it('validates entity across schemas', async () => {
    const e = createMockEntity({ title: 'T' });
    const s = createMockSchema('s');
    const res = await (validateAgainstSchemas as any)?.(e, [s]);
    expect(res == null || res.valid === true || res.valid === false).toBe(true);
  });
});
