/**
 * SSE route that accepts POSTed chat messages and returns a Server-Sent Events stream
 * emitting OpenUI-formatted events. This implementation includes a small simulator
 * for AI output so integration tests and the dev harness can exercise the full
 * OpenUI flow without an external LLM dependency.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // If caller included a machine-readable OPENUI hint in the last message we
      // try to parse it and emit corresponding events. The hint format is lightweight
      // and intended for use in tests/dev: a message containing `OPENUI: <json>`.
      const last = messages.length ? String(messages[messages.length - 1].content || '') : '';
      const OPENUI_PREFIX = 'OPENUI:';

      try {
        if (last.includes(OPENUI_PREFIX)) {
          const raw = last.split(OPENUI_PREFIX)[1].trim();
          try {
            const parsed = JSON.parse(raw);
            // If the parsed object looks like an array of events, emit them
            if (Array.isArray(parsed)) {
              for (const p of parsed) {
                const et = p.event ?? (p.type ? (p.type === 'component' ? 'component' : 'action') : 'text');
                send(et, p.data ?? p);
              }
            } else {
              // single event object
              const et = parsed.event ?? (parsed.component ? 'component' : parsed.action ? 'action' : 'text');
              send(et, parsed);
            }
            send('done', {});
            controller.close();
            return;
          } catch {
            send('error', { text: 'Invalid OPENUI JSON payload' });
            controller.close();
            return;
          }
        }

        // Default simulated streaming behaviour: stream incremental text updates,
        // then send a component render hint and an action.
        const simulated = 'This is a simulated assistant response from the OpenUI SSE endpoint.';
        let acc = '';
        for (let i = 0; i < simulated.length; i++) {
          acc += simulated[i];
          // send partial updates occasionally
          if (i % 8 === 0) {
            send('text', { text: acc });
            // small pause so clients receive chunks; await within start is allowed
            await new Promise((r) => setTimeout(r, 15));
          }
        }

        // Emit a component event (DraftCard) to demonstrate component rendering hint
        send('component', {
          component: {
            type: 'DraftCard',
            props: {
              id: `draft-${Date.now()}`,
              title: 'Generated draft',
              category: 'npc',
              attributes: { strength: 12, agility: 9 },
            },
          },
        });

        // Emit an action that indicates the assistant recommends creating an entity
        send('action', { type: 'createEntity', payload: { suggestedId: `draft-${Date.now()}` } });

        send('done', {});
      } catch (e) {
        send('error', { text: String(e instanceof Error ? e.message : e) });
      } finally {
        try {
          controller.close();
        } catch {
          // ignore
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
