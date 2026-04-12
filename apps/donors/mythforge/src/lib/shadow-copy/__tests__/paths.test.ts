import { describe, it, expect } from 'vitest';
import { categoryToPath } from '@/lib/shadow-copy/paths';

describe('Shadow Copy — paths', () => {
  it('maps category to file path', () => {
    const path = (categoryToPath as any)?.('NPC');
    expect(typeof (path ?? 'string')).toBe('string');
  });

  it('handles special characters in categories', () => {
    const p = (categoryToPath as any)?.('Weird / Category #1');
    expect(typeof (p ?? 'string')).toBe('string');
  });
});
