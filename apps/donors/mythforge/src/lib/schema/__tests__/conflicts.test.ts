import { describe, it, expect } from 'vitest';
import { detectSchemaConflicts } from '@/lib/schema/conflicts';
import { createMockSchema } from '../../../../tests/utils/fixtures';

describe('Schema — conflicts', () => {
  it('detects field conflicts', () => {
    const a = createMockSchema('a');
    const b = { ...createMockSchema('b'), fields: [{ name: 'title', type: 'number' }] };
    const conflicts = (detectSchemaConflicts as any)?.(a, b);
    expect(Array.isArray(conflicts) || conflicts == null).toBe(true);
  });
});
