import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseSSEEvent, parseSSEStream } from '@/lib/openui/sse-parser';

type ParseFixture = {
  cases: Array<{
    name: string;
    raw: string;
    expected: Record<string, unknown>;
  }>;
};

const fixturePath = join(process.cwd(), 'src/lib/openui/__tests__/fixtures/parse_json_cases.json');
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as ParseFixture;

describe('OpenUI SSE parser contract', () => {
  it.each(fixture.cases)('parses fixture case %s', ({ raw, expected }) => {
    expect(parseSSEEvent(raw)).toMatchObject(expected);
  });

  it('handles chunked SSE boundaries', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('event: text\nda'));
        controller.enqueue(encoder.encode('ta: split payload'));
        controller.enqueue(encoder.encode('\n\n'));
        controller.enqueue(encoder.encode('data: done\n\n'));
        controller.close();
      },
    });

    const events = [] as Array<{ type: string; text?: string }>;
    for await (const event of parseSSEStream(stream)) {
      events.push(event);
    }

    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ type: 'text', text: 'split payload' });
    expect(events[1]).toMatchObject({ type: 'text', text: 'done' });
  });

  it('treats malformed JSON payloads as raw text', () => {
    const event = parseSSEEvent('event: text\ndata: {not-json}\n\n');
    expect(event).toMatchObject({ type: 'text', text: '{not-json}' });
  });
});
