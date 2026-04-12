import { describe, it, expect } from 'vitest';
import { POST } from '../../../src/app/api/openui/stream/route';
import { parseSSEStream } from '../../../src/lib/openui/sse-parser';

// Lightweight E2E-style test that invokes the route handler directly and verifies
// the stream contains a component hint that can be rendered client-side.
describe('openui e2e chat flow', () => {
  it('completes a chat flow and provides a component hint', async () => {
    const req = new Request('http://localhost/api/openui/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Please generate a draft' }] }),
    });

    const res = await POST(req as unknown as Request);

    const events: any[] = [];
    for await (const evt of parseSSEStream(res.body as ReadableStream<Uint8Array>)) {
      events.push(evt);
    }

    expect(events.some((e) => e.type === 'component')).toBeTruthy();
    expect(events.some((e) => e.type === 'action')).toBeTruthy();
  });
});
