import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('OpenUI registry', () => {
  it('registers components, supports overwrite and lists types', async () => {
    const { registry } = await import('@/lib/openui/registry');

    const TestComponentA = () => null;
    const titleSchema = z.object({ title: z.string() });
    registry.register('TestComponentUnique', TestComponentA, titleSchema);

    const entryA = registry.get('TestComponentUnique');
    expect(entryA).toBeDefined();
    if (!entryA) return;

    expect(entryA.type).toBe('TestComponentUnique');
    expect(typeof entryA.component).toBe('function');
    expect(entryA.propSchema).toBeDefined();

    const TestComponentB = () => null;
    registry.register('TestComponentUnique', TestComponentB, titleSchema);
    const entryAfter = registry.get('TestComponentUnique');
    expect(entryAfter).toBeDefined();
    if (!entryAfter) return;
    expect(entryAfter.component).toBe(TestComponentB);

    const types = registry.getAll().map((e) => e.type);
    expect(types).toContain('TestComponentUnique');
  });
});
