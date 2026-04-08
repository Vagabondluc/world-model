# Phase 3: Final App Scaffold

## Objective

Create the final app shell and make it hydrate from canonical state only.

The executable app scaffold lives at `world-model/apps/unified-app`.

This phase builds the canonical data bridge and a minimal scaffolding shell to prove it works. The `Guided`, `Studio`, and `Architect` depth stubs are internal validation scaffolding — they are not donor-faithful surfaces and are not the final product UX. Donor-faithful surfaces are Phase 7 scope.

## Dependencies

- Phase 1 complete
- Phase 2 complete
- app shell hierarchy documented
- adapter snapshots available

## Subphases

### 3.1 App workspace scaffold

Deliverables:

- `apps/unified-app` created
- shell folder created
- mode folders created
- workspace/inspector/panel folders created
- state/service/route folders created

Acceptance:

- app structure matches the documented repository layout
- app can be bootstrapped without donor imports
- app package exposes `lint`, `typecheck`, `test`, and `build` scripts

### 3.2 Canonical state bridge

Deliverables:

- load path from canonical bundle
- save path to canonical bundle
- hydration path into app state
- overlay path for UI-only state

Acceptance:

- canonical state and UI overlays are separated
- app can restart from canonical state only
- load/save roundtrip preserves canonical bundle JSON

### 3.3 Guided mode scaffold (scaffolding stub)

Deliverables:

- beginner onboarding flow
- create/open world flow
- import flow from canonical bundle
- first action shortcuts

Acceptance:

- a new user can reach the core loop without opening expert controls

Note: this is a scaffolding stub to validate the canonical state bridge. It does not represent any donor app's UX. Donor-faithful guided flows are Phase 7 scope.

### 3.4 Studio mode scaffold (scaffolding stub)

Deliverables:

- workspace editing surface
- canonical inspector
- entity selection
- relation view
- attachment view

Acceptance:

- a user can inspect and edit canonical records in one place

Note: this is a scaffolding stub. It does not replicate any donor app's editing surface. Donor-faithful studio flows are Phase 7 scope.

### 3.5 Architect mode scaffold (scaffolding stub)

Deliverables:

- schema inspection
- adapter inspection
- migration tools
- promoted schema view

Acceptance:

- expert tools are visible but isolated from beginner clutter

Note: this is a scaffolding stub. Schema inspection for a real user context is Phase 7 and Phase 8 scope.

### 3.6 Shared shell behaviors

Deliverables:

- persistent navigation
- persistent top context
- persistent selected-world state
- persistent save/load affordances

Acceptance:

- switching modes does not destroy the current world context

## Harness

- shell render smoke test
- mode-switch test
- canonical load test
- canonical save test
- overlay isolation test

## Exit Criteria

- the app renders without donor imports
- all three depths hydrate from the canonical model
- mode switching does not lose canonical state
- UI-only state remains local

## Failure Cases

- the app imports donor code directly
- a mode owns a different data model
- save/load paths diverge
- overlays become durable truth by accident
- scaffolding stubs are mistaken for donor-faithful surfaces and handed off as finished product UX
