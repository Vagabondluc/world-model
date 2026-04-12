# Final App Architecture

The final app is a single product built on top of `world-model`. It does not reach back into the donor repositories at runtime and it does not treat donor apps as living dependencies.

## Product Shape

The app is a single product over one canonical world model.

The public surface is now:

- `/`
  - unified landing page over canonical bundle state
- `World`
  - map, locations, cities, biomes, dungeons, entities, and spatial relationships
- `Story`
  - quests, sessions, progression, and generated content
- `Schema`
  - contracts, adapters, migration reports, and provenance

Prototype-only families remain available for comparison and testing:

- `Task`
  - `Create`, `Edit`, `Inspect`, `Validate`
- `Flow`
  - `Start`, `Build`, `Run`, `Review`

Legacy `Guided`, `Studio`, and `Architect` names remain compatibility redirects only.
All surfaces edit the same canonical records.

The product comparison route is:

- `/compare`
  - shows the public product surface and shared canonical concept matrix

Donor comparison routes also exist for Phase 7 rehost work:

- `/donor/mythforge`
- `/donor/orbis`
- `/donor/adventure-generator` (note: source is `to be merged/dungeon generator/` folder)
- `/donor/mappa-imperium`
- `/donor/dawn-of-worlds`
- `/donor/faction-image`
- `/compare/donors`

These are internal donor rehost surfaces, not the public product taxonomy.

## Canonical Shell

The shell is persistent across the app and is shared by all public and prototype routes:

- left navigation
- top context bar
- center workspace
- right inspector
- optional bottom drawer
- modal host for wizards, generators, and report viewers

The shell layers are:

- navigation layer
  - family tabs, route links, and tools menu
- context layer
  - current family/tab, selected world, selected entity, and save state
- workspace layer
  - the active taxonomy page
- inspector layer
  - bundle and selection details
- modal layer
  - create/edit/generate/import/report dialogs

The default workspace is world-aware and entity-aware, but not map-only. The selected entity inspector stays part of the main interaction surface.

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

The product/donor code-side boundary is encoded in:

- `apps/unified-app/src/product/surface-contract.ts`

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

## Route Boundaries

The active public routes are:

- `/`
- `/world`
- `/story`
- `/schema`

The comparison route is:

- `/compare`
  - shows the public product surface and prototype families side-by-side
  - serves the cross-donor views used to compare donor lenses on the same canonical bundle

Prototype routes remain internal comparison surfaces:

- `/prototype/role/*`
- `/prototype/task/*`
- `/prototype/flow/*`

Donor rehost routes remain internal conformance surfaces:

- `/donor/mythforge`
- `/donor/orbis`
- `/donor/adventure-generator`
- `/compare/donors`

Legacy routes remain redirect-only compatibility paths:

- `/guided` -> `/world`
- `/studio` -> `/story`
- `/architect` -> `/schema`
  - compatibility redirects, not public product routes

## Primary Loop

The first complete loop is:

1. open or create a world
2. load canonical state or import a donor snapshot
3. edit the world in the active public surface
4. save the canonical bundle
5. reload the bundle
6. verify the same canonical state comes back

If this loop is not stable, no higher-level feature work should proceed.
