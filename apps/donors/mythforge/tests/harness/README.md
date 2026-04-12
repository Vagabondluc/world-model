# OpenUI OptionA Harness

Reusable helpers for exercising the OpenUI `/stream` endpoint in tests.

## Helpers

- `makePayload(messages, optionA?)` builds the request body used by the route tests.
- `mockSSEStream(events)` builds a synthetic SSE stream for parser and consumer tests.
- `collectSSEEvents(stream)` consumes a stream and returns parsed OpenUI events.
- `collectSSEEventTypes(stream)` returns only the event types for quick assertions.

## Intended Use

- Use the harness in unit and integration tests that need predictable OpenUI SSE data.
- Use it to verify parser behavior, streamed event order, and route output shape.
- Use it as the reusable foundation for the future browser and desktop E2E flows described in the roadmap.
