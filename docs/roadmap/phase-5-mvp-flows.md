# Phase 5: Final App MVP Flows

## Objective

Ship a very small but complete product loop with enough depth to prove the product is coherent.

## Dependencies

- Phase 3 complete
- Phase 4 complete
- canonical load/save stable
- adapter snapshots stable

## MVP Scope

The MVP must support:

- open or create a world
- edit canonical data
- save canonical bundle
- reload canonical bundle
- switch between guided, studio, and architect depths
- inspect promoted schema and adapter mappings

The MVP must not require:

- full donor feature parity
- every Orbis domain
- every Adventure Generator tool
- a complete reimplementation of donor apps

## Subphases

### 5.1 Beginner loop

Deliverables:

- create/open world
- first guided onboarding
- minimal world creation
- minimal entity creation
- save action

Acceptance:

- a beginner can enter the product and persist meaningful state

### 5.2 Studio loop

Deliverables:

- edit the world
- inspect relationships
- inspect attachments
- inspect selection
- reload and confirm state survival

Acceptance:

- the normal working surface feels coherent and stable

### 5.3 Architect loop

Deliverables:

- inspect promoted schema ids
- inspect adapter mappings
- view migration/import reports
- validate one schema or bundle from the expert surface

Acceptance:

- expert controls exist without contaminating the beginner flow

### 5.4 MVP trimming pass

Deliverables:

- hide or defer non-essential tools
- remove duplicate navigation
- collapse low-value entry points
- keep only the smallest visible surface

Acceptance:

- the product reads as one product, not a pile of donor features

### 5.5 MVP usability pass

Deliverables:

- basic empty state handling
- obvious save/load affordances
- understandable mode labels
- visible canonical entity feedback

Acceptance:

- users can tell what the app is doing at every step

## Harness

- browser smoke test
- save/load round-trip test
- regression test for donor-import boundaries
- mode visibility test
- empty-state test

## Exit Criteria

- the product loop is usable
- the canonical model remains stable
- the app can be handed off to the next phase without reopening the architecture question
- the MVP is small enough to maintain

## Failure Cases

- MVP still depends on donor runtime paths
- more than one shell philosophy leaks into the UI
- canonical save/load is not obviously the primary path
- expert tools overwhelm beginner flows
