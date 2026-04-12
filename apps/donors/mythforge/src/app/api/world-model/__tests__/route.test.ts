import { describe, expect, it } from 'vitest';

import { POST } from '../route';
import { createMythforgeWorldModelHarnessState } from '@/lib/world-model-harness';

describe('world-model route', () => {
  it('round-trips Mythforge state through the Rust driver', async () => {
    const state = createMythforgeWorldModelHarnessState();
    const request = new Request('http://localhost/api/world-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const payload = await response.json() as { status: string; bundle?: { world?: { world_id?: string | null }; entities?: Record<string, unknown>; relations?: unknown[] } };
    expect(payload.status).toBe('Applied');
    expect(payload.bundle?.world?.world_id).toBe('mythforge-world');
    expect(Object.keys(payload.bundle?.entities ?? {})).toHaveLength(2);
    expect(payload.bundle?.relations).toHaveLength(1);
  });
});
