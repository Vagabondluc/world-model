import { describe, it, expect } from 'vitest';
import { POST } from '../stream/route';
import { collectSSEEvents, makePayload } from '../../../../../tests/harness/openui-optiona-harness';

// Integration smoke test for the full SSE flow (text -> component -> action -> done)
describe('openui /stream integration', () => {
  it('streams text, a component hint, an action and done', async () => {
    const req = new Request('http://localhost/api/openui/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makePayload([{ role: 'user', content: 'Hello world' }])),
    });

    const res = await POST(req as unknown as Request);
    const events = await collectSSEEvents(res.body as ReadableStream<Uint8Array>);

    const types = events.map((e) => e.type);
    expect(types).toContain('text');
    expect(types).toContain('component');
    expect(types).toContain('action');
    expect(types).toContain('done');
  });
});
