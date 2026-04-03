# Spec Source Registry

`world-model` promotes donor schema from three source registries:

- `spec-sources/mythforge.toml`
  - trunk donor
  - source root: `../mythforge/docs/schema-templates`
  - allowed surface: UUID architecture docs, selected category docs, exported JSON Schema
  - excluded: prompts, samples, methods
- `spec-sources/orbis.toml`
  - simulation donor
  - source root: `../to be merged/Orbis Spec 2.0/Orbis 2.0/runtime`
  - allowed surface: runtime contracts, kernel contracts, domain contracts
  - excluded: dashboard components, test harnesses, app-facing shims
- `spec-sources/adventure-generator.toml`
  - workflow donor
  - source root: `../../../../antigravity/dnd adventure generator/src`
  - allowed surface: Zod schemas plus workflow/history store contracts
  - excluded: UI components, tests, local harnesses

Registry rules:

- donor repos are source material only
- manifests define the only ingestible paths
- excluded paths are not canonical input even if they contain type-like strings
- UI and routing surfaces stay donor-local unless explicitly promoted later
