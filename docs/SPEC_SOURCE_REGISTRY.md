# Spec Source Registry

`world-model` promotes donor schema from registered source roots.

## Registered Sources

- `spec-sources/mythforge.toml`
  - trunk donor
  - source root: `../mythforge/docs/schema-templates`
  - allowed surface: UUID architecture docs, selected category docs, exported JSON Schema
  - excluded: prompts, samples, methods

- `spec-sources/orbis.toml`
  - simulation donor
  - source root: `../to be merged/true orbis/Orbis Spec 2.0/`
  - allowed surface: runtime contracts, kernel contracts, domain contracts
  - excluded: dashboard components, test harnesses, app-facing shims

- `spec-sources/adventure-generator.toml`
  - workflow donor
  - source root: `../to be merged/dungeon generator/src`
  - **Note:** folder name `dungeon generator` does not match app identity (`dnd-adventure-generator`). This is a collection-side naming hazard — see `docs/donors/DUNGEON_GENERATOR.md`.
  - previous (incorrect) source root: `../../../../antigravity/dnd adventure generator/src` — **RETIRED**
  - allowed surface: Zod schemas, workflow store, history store
  - excluded: UI components, tests, local harnesses, Python sidecar, Tauri bindings

## Pending Registration (unregistered donors with full source available)

- `spec-sources/mappa-imperium.toml` — **to be created**
  - world-era / collaborative-session donor
  - source root: `../to be merged/mappa imperium/src`
  - allowed surface: Zod/TypeScript schemas, store contracts, era graph types, node editor types
  - excluded: component render logic, API routes

- `spec-sources/dawn-of-worlds.toml` — **to be created**
  - world-object-taxonomy / world-turn / multiplayer donor
  - source root: `../to be merged/world-builder-ui/src`
  - allowed surface: core types (WorldKind, WorldObject, HexSchema, EventSchema, protocolTypes), store schemas
  - excluded: Three.js/OGL render code, Tauri shell bindings, game loop logic

- `spec-sources/faction-image.toml` — **to be created**
  - asset-sigil / icon-discovery donor
  - source root: `../to be merged/faction-image/src`
  - allowed surface: `src/icon-generator/types.ts`, `src/icon-generator/` core logic, `src/icon-discovery/` types
  - excluded: React component render code, Playwright tests, Stryker config, dashboard surface

## Registry Rules

- donor repos are source material only
- manifests define the only ingestible paths
- excluded paths are not canonical input even if they contain type-like strings
- UI and routing surfaces stay donor-local unless explicitly promoted later
- a TOML entry is required before any automated import can be registered
