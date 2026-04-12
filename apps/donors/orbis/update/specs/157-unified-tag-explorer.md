# 157 Unified Tag Explorer (#EXPLORER)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/30-runtime-determinism/38-unified-tag-system.md`, `docs/brainstorm/156-magic-tag-taxonomy.md`, `docs/brainstorm/122-causality-trace-contract.md`]
- `Owns`: [`tag explorer UI patterns`, `semantic code indexing rules`]
- `Writes`: [`tag usage reports`, `cross-reference graph`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/157-unified-tag-explorer.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a developer tool for Orbis 2.0 that allows exploring the codebase and active simulation state via its semantic tags. It bridges static source code analysis with runtime state inspection.

## 1. Data Ingestion Architecture
The Explorer maintains a dual-index of the system.

### 1.1 Static Code Indexing (Hardened)
- **AST Lexer**: Scans `.ts` files for the pattern `TAG_ID.<CATEGORY>_<NAME>` or binary hex literals matching Spec 38.
- **Dependency Inversion**: Functions must declare tag dependencies in a `@meta` block or JSDoc.
- **Trace Linkage**: The parser creates a static map: `File -> Function -> TagDependency[]`.

### 1.2 Runtime State Indexing (Hardened)
- **Atomics Sampling**: The Explorer-Worker uses `Atomics.load` to sample tag intensities from the `SharedArrayBuffer` without locking the Sim-Worker.
- **Temporal Diffing**: Stores a circular buffer of tag deltas for the last 100 ticks to visualize "Ripple Effects."

## 2. UI Patterns & Views

### 2.1 The Semantic Graph (Hardened)
- **Force-Directed Layout**: Uses D3.js to represent tag clusters.
- **Causality Flow**: Arrows indicate propagation edges (`species_to_civ`, etc.). Color intensity indicates the current `supportPPM`.

### 2.2 The "Impact" Inspector (Causality Visualizer)
For a selected tag (e.g., `Militaristic`), the explorer shows:
- **Upstream Drivers**: Tech nodes or actions causing the drift.
- **Downstream Consequences**: Every threshold (Spec 114) that could be triggered by this tag.
- **Live Equation Solver**: Displays the specific line of code (via AST link) and the current variable values from the live buffer.

## 3. Query Engine: TagQL (Grammar)
```antlr
query    : select_stmt | find_stmt | trace_stmt ;
select   : 'SELECT' 'entities' 'WHERE' condition ;
find     : 'FIND' 'code' 'WHERE' ('consumes' | 'emits') tag_list ;
condition: 'tags' 'HAS' tag_list ('AND' 'intensity' operator value)? ;
```

## 4. Performance & Scalability (Hardened)
- **Worker Pooling**: AST indexing is parallelized across CPU cores.
- **Memory Mapping**: Large state buffers are indexed via a **Spatial Hash** to only show tags relevant to the current map viewport.

## 5. Integration (Hardened)
- **Compliance Check**: Integrated into the `123-promotion-gate`. A spec fails if it introduces a `TagId` not indexed by the Explorer.
- **CLI**: `gemini-explore --tags [Militaristic]` exports a SVG/JSON dependency graph.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.
