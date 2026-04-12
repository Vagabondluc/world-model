import { describe, expect, it } from 'vitest';
import { collectSSEEvents, makePayload, mockSSEStream } from './openui-optiona-harness';

describe('OpenUI OptionA harness', () => {
  it('builds request payloads and collects SSE events', async () => {
    const payload = makePayload(
      [{ role: 'user', content: 'OPENUI: {"event":"component","component":{"type":"DraftCard","props":{"id":"1"}}}' }],
      { enabled: true, timeout: 5000, fallbackToStreaming: true },
    );

    expect(payload.messages).toHaveLength(1);
    expect(payload.optionA?.enabled).toBe(true);

    const stream = mockSSEStream([
      { type: 'text', text: 'hello' },
      { type: 'component', component: { type: 'DraftCard', props: { id: '1', title: 'Draft' } } },
      { type: 'action', action: { type: 'createEntity', payload: { suggestedId: '1' } } },
      { type: 'done' },
    ]);

    const events = await collectSSEEvents(stream);
    expect(events.map((event) => event.type)).toEqual(['text', 'component', 'action', 'done']);
  });
});
