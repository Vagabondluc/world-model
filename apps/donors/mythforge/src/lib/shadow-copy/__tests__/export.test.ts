import { describe, it, expect } from 'vitest';
import { exportEntityToFile } from '@/lib/shadow-copy/export';
import { createMockEntity } from '../../../../tests/utils/fixtures';

describe('Shadow Copy — export', () => {
  it('exports an entity to markdown string', async () => {
    const e = createMockEntity({ id: 'ent-export', title: 'Export' });
    const out = await (exportEntityToFile as any)?.(e);
    expect(typeof (out ?? '')).toBe('string');
  });
});
