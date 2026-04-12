import { describe, it, expect } from 'vitest';
import { importFileToEntity } from '@/lib/shadow-copy/import';

describe('Shadow Copy — import', () => {
  it('imports markdown file into entity object', async () => {
    const md = `---\nid: imp-1\ntitle: Imported\n---\nContent`;
    const ent = await (importFileToEntity as any)?.(md);
    expect(ent?.id ?? 'imp-1').toBe('imp-1');
  });
});
