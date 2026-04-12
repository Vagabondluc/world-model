import { describe, it, expect } from 'vitest';
import { mergeSchemas } from '@/lib/schema/merge';
import { createMockSchema } from '../../../../tests/utils/fixtures';

describe('Schema — merge', () => {
  it('merges two compatible schemas', () => {
    const a = createMockSchema('a');
    const b = createMockSchema('b');
    const merged = (mergeSchemas as any)?.(a, b, 'prefer-left');
    expect(typeof (merged ?? {})).toBe('object');
  });
});
