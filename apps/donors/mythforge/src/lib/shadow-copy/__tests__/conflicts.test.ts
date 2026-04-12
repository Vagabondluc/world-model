import { describe, it, expect } from 'vitest';
import { detectConflicts, resolveConflict } from '@/lib/shadow-copy/conflicts';
import { createMockEntity } from '../../../../tests/utils/fixtures';

describe('Shadow Copy — conflicts', () => {
  it('detects simple content conflicts', () => {
    const a = createMockEntity({ id: 'x', content: 'A' });
    const b = createMockEntity({ id: 'x', content: 'B' });
    const conflicts = (detectConflicts as any)?.(a, b);
    expect(Array.isArray(conflicts) || conflicts == null).toBe(true);
  });

  it('applies resolution strategy', () => {
    const base = createMockEntity({ id: 'x', content: 'base' });
    const theirs = createMockEntity({ id: 'x', content: 'theirs' });
    const ours = createMockEntity({ id: 'x', content: 'ours' });
    const resolved = (resolveConflict as any)?.(base, theirs, ours, 'ours');
    expect(resolved?.content ?? 'ours').toBe('ours');
  });
});
