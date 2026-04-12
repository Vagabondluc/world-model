import type { OpenUIStreamEvent } from '@/lib/openui/sse-parser';
import { parseSSEStream } from '@/lib/openui/sse-parser';

export interface OpenUIOptionAMessage {
  role: string;
  content: string;
}

export interface OpenUIOptionARequest {
  messages: OpenUIOptionAMessage[];
  optionA?: {
    enabled?: boolean;
    timeout?: number;
    fallbackToStreaming?: boolean;
  };
}

export type OpenUIHarnessEvent =
  | { type: 'text'; text: string }
  | { type: 'component'; component: { type: string; props: Record<string, unknown> } }
  | { type: 'action'; action: { type: string; payload?: unknown } }
  | { type: 'done' }
  | { type: 'error'; text: string };

export function makePayload(messages: OpenUIOptionAMessage[], optionA?: OpenUIOptionARequest['optionA']): OpenUIOptionARequest {
  return optionA ? { messages, optionA } : { messages };
}

function serializeEvent(event: OpenUIHarnessEvent): unknown {
  switch (event.type) {
    case 'text':
      return { text: event.text };
    case 'component':
      return { component: event.component };
    case 'action':
      return event.action;
    case 'done':
      return {};
    case 'error':
      return { text: event.text };
    default:
      return {};
  }
}

function encodeSseEvent(event: OpenUIHarnessEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(serializeEvent(event))}\n\n`;
}

export function mockSSEStream(events: OpenUIHarnessEvent[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(encodeSseEvent(event)));
      }
      controller.close();
    },
  });
}

export async function collectSSEEvents(stream: ReadableStream<Uint8Array> | null): Promise<OpenUIStreamEvent[]> {
  const events: OpenUIStreamEvent[] = [];
  for await (const event of parseSSEStream(stream)) {
    events.push(event);
  }
  return events;
}

export async function collectSSEEventTypes(stream: ReadableStream<Uint8Array> | null): Promise<OpenUIStreamEvent['type'][]> {
  const events = await collectSSEEvents(stream);
  return events.map((event) => event.type);
}
