# OpenUI OptionA Checklist

> Status: Draft
> Scope: OpenUI immediate-render mode and its current implementation gap
> Canonical sources:
> - [OpenUI Integration Plan](./OPENUi_INTEGRATION_PLAN.md)
> - [OpenUI Integration Guide](./OPENUi_INTEGRATION.md)
> - [OpenUI Overlap Analysis](./OPENUi_OVERLAP_ANALYSIS.md)
> - [OpenUI OptionA Harness](../../tests/harness/README.md)
> - [OpenUI OptionA Harness helpers](../../tests/harness/openui-optiona-harness.ts)

## Checklist

- [x] A streaming-first OpenUI SSE route exists at `src/app/api/openui/stream/route.ts`
- [x] OpenUI component rendering validates props against registered Zod schemas
- [x] OpenUI parser coverage exists for chunked SSE streams and malformed payloads
- [x] Reusable harness helpers exist for request payloads and SSE event collection
- [ ] Immediate-render OptionA mode exists in runtime code
- [ ] Fallback-to-streaming behavior exists in runtime code
- [ ] Browser UI entrypoint exists for manual end-to-end testing
- [ ] Desktop/Tauri UI entrypoint exists for manual end-to-end testing
- [ ] Timeout handling exists for immediate-render requests
- [ ] Registry metadata exposes OptionA support per component

## Implementation Map

### Schema Layer

- [x] Runtime config schema exists for OpenUI strict validation
- [ ] OptionA runtime config schema exists in code
- [ ] Registry metadata schema includes `optionA` support fields
- [ ] Request/response schema exists for the immediate-render workflow
- [x] Harness request payload schema exists in `tests/harness/openui-optiona-harness.ts`

Acceptance:

- The docs can point to one schema source per layer.
- The schema layer names the file where the runtime shape lives.

### Workflow Layer

- [ ] Validate the incoming request payload
- [ ] Resolve the OpenUI runtime config
- [ ] Check whether the component supports OptionA
- [ ] Choose immediate render or streaming fallback
- [ ] Return a synchronous response when immediate render succeeds
- [ ] Emit SSE when fallback is required
- [ ] Verify the response with the harness

Acceptance:

- A reader can trace the OptionA flow from request validation to final response.
- The workflow layer names the runtime decision points in order.

## Acceptance Criteria

- Immediate render bypasses SSE and returns a single synchronous response.
- Fallback behavior returns to streaming when immediate render is unsupported or times out.
- The harness can assemble payloads, mock SSE blocks, and collect parsed events.
- Browser and desktop UI flows can be tested end to end with the same harness-backed scenario.
- The docs distinguish implemented behavior from planned behavior.

## Current Implementation Snapshot

- `src/app/api/openui/stream/route.ts` currently streams SSE and simulates text, component, action, and done events.
- `src/lib/openui/config.ts` currently exposes `strictValidation` only.
- `src/lib/openui/components/OpenUIRenderer.tsx` validates props and renders registered components.
- `tests/harness/openui-optiona-harness.ts` now provides reusable payload and SSE helpers for tests.
- There is no OpenUI browser page or desktop window yet, so UI-level E2E coverage is still pending.

## Next Steps

1. Normalize the remaining OpenUI reference docs so they point to this checklist.
2. Keep the OpenUI route tests using the shared harness helpers.
3. Add the browser and desktop UI surfaces that Phase 3 expects.
4. Implement the schema layer items before the workflow layer items.
