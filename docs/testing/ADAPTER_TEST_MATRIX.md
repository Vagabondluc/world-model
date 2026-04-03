# Adapter Test Matrix

This matrix defines what each adapter must prove.

## Mythforge Adapter

Must prove:

- world create/update/save/load round-trip
- entity create/update/save/load round-trip
- relation persistence
- schema binding persistence
- append-only history persistence
- canonical bundle hydration

Must not leak:

- donor shell layout
- donor-only overlays
- donor-specific AI copilot state

## Orbis Adapter

Must prove:

- profile mapping
- domain toggle mapping
- simulation snapshot mapping
- event envelope mapping
- optional attachment round-trip

Must not leak:

- donor-only dashboard assumptions
- placeholder harness state
- standalone simulation shell dependencies

## Adventure Generator Adapter

Must prove:

- workflow/session mapping
- checkpoint and progress mapping
- generated-output mapping
- location/adventure linkage mapping
- canonical bundle hydration

Must not leak:

- donor-specific tool panels
- donor-only navigation state
- unrelated content browser state

## Shared Tests

All adapters should be validated for:

- provenance preservation
- schema validation
- conflict handling
- import/export symmetry
- round-trip stability
