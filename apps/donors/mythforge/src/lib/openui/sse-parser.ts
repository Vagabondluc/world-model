/**
 * OpenUI stream event types
 */
export type OpenUIStreamEventType = 'text' | 'component' | 'action' | 'done' | 'error';

export interface OpenUIStreamEvent {
  type: OpenUIStreamEventType;
  text?: string;
  component?: { type: string; props: Record<string, unknown> };
  action?: { type: 'createEntity' | 'updateEntity' | 'createRelationship'; payload: unknown };
}

/**
 * Parse a single raw SSE event block into a typed OpenUIStreamEvent.
 * The function is resilient to inputs in either plain JSON or standard SSE "event:/data:" format.
 */
export function parseSSEEvent(raw: string): OpenUIStreamEvent {
  const trimmed = raw.trim();
  const lines = trimmed.split(/\r?\n/);
  let eventName = '';
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith('event:')) {
      eventName = line.slice('event:'.length).trim();
      continue;
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice('data:'.length).trim());
      continue;
    }
    // fallback: if the block looks like pure JSON, collect it
    dataLines.push(line);
  }

  const dataStr = dataLines.join('\n').trim();

  // Try to parse JSON payload; fall back to raw text
  let payload: unknown;
  if (dataStr) {
    try {
      payload = JSON.parse(dataStr);
    } catch {
      payload = dataStr;
    }
  }

  // Build event object according to eventName / payload
  switch (eventName) {
    case 'text':
      return { type: 'text', text: typeof payload === 'string' ? payload : isRecord(payload) && typeof payload.text === 'string' ? payload.text : JSON.stringify(payload ?? '') };
    case 'component':
      {
        const component = isRecord(payload)
          ? payload.component ?? (payload.type ? { type: payload.type, props: payload.props ?? {} } : payload)
          : payload;
      return {
        type: 'component',
        component: isRecord(component) ? { type: String(component.type ?? 'component'), props: isRecord(component.props) ? component.props : {} } : component,
      } as OpenUIStreamEvent;
      }
    case 'action':
      return { type: 'action', action: isRecord(payload) && 'action' in payload ? payload.action : payload } as OpenUIStreamEvent;
    case 'done':
      return { type: 'done' };
    case 'error':
      return { type: 'error', text: typeof payload === 'string' ? payload : isRecord(payload) && typeof payload.text === 'string' ? payload.text : JSON.stringify(payload ?? '') };
    default: {
      // If no explicit event name, try to infer from payload shape
      if (!payload) return { type: 'text', text: '' };
      if (isRecord(payload) && (payload.type === 'component' || payload.component)) {
        const component = isRecord(payload.component)
          ? payload.component
          : { type: String(payload.type), props: isRecord(payload.props) ? payload.props : {} };
        return { type: 'component', component: { type: String(component.type ?? 'component'), props: isRecord(component.props) ? component.props : {} } } as OpenUIStreamEvent;
      }
      if (isRecord(payload) && (payload.type === 'action' || payload.action)) {
        return { type: 'action', action: payload.action ?? payload } as OpenUIStreamEvent;
      }
      // fallback to text
      return { type: 'text', text: typeof payload === 'string' ? payload : JSON.stringify(payload) };
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parse a ReadableStream (SSE stream) into an async generator of OpenUIStreamEvent.
 * This uses TextDecoder and supports partial chunking.
 */
export async function* parseSSEStream(stream: ReadableStream<Uint8Array> | null): AsyncGenerator<OpenUIStreamEvent> {
  if (!stream) return;
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line
      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        try {
          const evt = parseSSEEvent(rawEvent);
          yield evt;
        } catch (err) {
          // yield an error event so callers can react
          yield { type: 'error', text: String(err instanceof Error ? err.message : err) };
        }
      }
    }

    if (buffer.trim()) {
      // trailing data
      try {
        yield parseSSEEvent(buffer);
      } catch (err) {
        yield { type: 'error', text: String(err instanceof Error ? err.message : err) };
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // ignore
    }
  }
}
