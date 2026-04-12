import { describe, it, expect } from 'vitest';
import { POST } from '../stream/route';
import { collectSSEEvents, makePayload } from '../../../../../tests/harness/openui-optiona-harness';

describe('openui /stream SSE endpoint', () => {
  it('returns component events when OPENUI payload is provided', async () => {
    const req = new Request('http://localhost/api/openui/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        makePayload([
          { role: 'user', content: 'OPENUI: {"event":"component","component":{"type":"DraftCard","props":{"id":"1","title":"Test Draft"}}}' },
        ]),
      ),
    });

    const res = await POST(req as unknown as Request);
    expect(res.headers.get('Content-Type') || '').toContain('text/event-stream');

    const events = await collectSSEEvents(res.body as ReadableStream<Uint8Array>);

    expect(events.length).toBeGreaterThan(0);
    expect(events.some((e) => e.type === 'component')).toBeTruthy();
  });
});
