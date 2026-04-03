# Phase 3: Final App Scaffold

## Objective

Create the final app shell and make it hydrate from canonical state only.

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

### 3.2 Canonical state bridge

Deliverables:

- load path from canonical bundle
- save path to canonical bundle
- hydration path into app state
- overlay path for UI-only state

Acceptance:

- canonical state and UI overlays are separated
- app can restart from canonical state only

### 3.3 Guided mode scaffold

Deliverables:

- beginner onboarding flow
- create/open world flow
- import flow from canonical bundle
- first action shortcuts

Acceptance:

- a new user can reach the core loop without opening expert controls

### 3.4 Studio mode scaffold

Deliverables:

- workspace editing surface
- canonical inspector
- entity selection
- relation view
- attachment view

Acceptance:

- a user can inspect and edit canonical records in one place

### 3.5 Architect mode scaffold

Deliverables:

- schema inspection
- adapter inspection
- migration tools
- promoted schema view

Acceptance:

- expert tools are visible but isolated from beginner clutter

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
