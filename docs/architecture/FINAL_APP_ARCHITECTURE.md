# Final App Architecture

The final app is a single product built on top of `world-model`. It does not reach back into the donor repositories at runtime and it does not treat donor apps as living dependencies.

## Product Shape

The app has three interaction depths over one canonical world model:

- `Guided`
  - beginner entry surface
  - wizards, defaults, and one-step actions
- `Studio`
  - normal authoring surface
  - map, workspace, inspectors, and edits
- `Architect`
  - expert surface
  - schemas, adapter inspection, migration reports, and batch operations

All three depths edit the same canonical records.

## Canonical Shell

The shell should be persistent across the app:

- left navigation
- top context bar
- center workspace
- right inspector
- optional bottom drawer

The default workspace should be map-first and entity-aware, but not map-only. The selected entity inspector is always part of the main interaction surface.

## Runtime Rule

The final app must only depend on:

- `world-model` crates and emitted contracts
- copied adapter snapshots stored inside this workspace
- local app code under `world-model/apps/unified-app`

It must not import runtime logic from:

- `mythforge`
- `mechanical-sycophant`
- `to be merged`
- `antigravity`

## Canonical State Bridge

The app shell loads and saves canonical bundles through a dedicated bridge:

- load canonical bundle JSON before hydration
- validate the bundle against the emitted `CanonicalBundle` contract
- hydrate durable canonical state separately from overlay UI state
- serialize only canonical state back to JSON
- keep selection, drawer, and mode state local to the app shell
- Architect mode may load migration report JSON for inspection, but reports remain non-canonical and local to the UI

## Ownership Rule

The final app owns:

- shell composition
- mode switching
- UI state
- app-local overlays
- canonical save/load orchestration

The final app does not own:

- canonical schema definitions
- donor source truth
- simulation depth
- workflow semantics

Those live in `world-model` and the copied adapter snapshots.

## Primary Loop

The first complete loop is:

1. open or create a world
2. load canonical state or import a donor snapshot
3. edit the world in guided/studio/architect mode
4. save the canonical bundle
5. reload the bundle
6. verify the same canonical state comes back

If this loop is not stable, no higher-level feature work should proceed.
