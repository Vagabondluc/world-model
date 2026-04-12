import { describe, it, expect } from 'vitest';
import { POST } from '../../../src/app/api/openui/stream/route';
import { parseSSEStream } from '../../../src/lib/openui/sse-parser';

describe('openui e2e streaming behaviour', () => {
  it('streams incremental text before component and done', async () => {
    const req = new Request('http://localhost/api/openui/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Stream test' }] }),
    });

    const res = await POST(req as unknown as Request);

    const events: any[] = [];
    for await (const evt of parseSSEStream(res.body as ReadableStream<Uint8Array>)) {
      events.push(evt);
    }

    // Expect at least one text, one component and a done
    expect(events.filter((e) => e.type === 'text').length).toBeGreaterThanOrEqual(1);
    expect(events.some((e) => e.type === 'component')).toBeTruthy();
    expect(events.some((e) => e.type === 'done')).toBeTruthy();
  });
});
