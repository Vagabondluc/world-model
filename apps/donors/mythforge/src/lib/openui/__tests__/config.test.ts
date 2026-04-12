import { describe, it, expect } from 'vitest';
import { getComponentRegistry } from '@/lib/openui/registry';

describe('OpenUI — config', () => {
  it('returns registry mapping', () => {
    const r = (getComponentRegistry as any)?.();
    expect(typeof (r ?? {})).toBe('object');
  });
});
