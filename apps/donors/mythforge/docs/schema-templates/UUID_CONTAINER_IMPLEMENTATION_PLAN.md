# UUID Container Implementation Plan

> **Status:** Draft
> **Scope:** `src/lib/schema`, file-authoring UI, UUID container state, event projection, migrations, and per-category doc normalization
> **Depends on:** [UUID Container Architecture](./UUID_CONTAINER_ARCHITECTURE.md)

## Goal

Build one coherent system for Mythforge schema work:

- native schemas stay code-backed
- project schemas stay file-backed in `docs/schema-templates/`
- every entity instance is a UUID container
- events are appended to the UUID, not rewritten in place
- the UI shows the current projection plus the binding and history
- the Architect can author both native and project schema paths without collapsing them into one accidental implementation

## Current State

- `src/lib/schema/registry.ts`, `merge.ts`, `conflicts.ts`, and `validation.ts` exist, but the schema descriptors are minimal and not versioned.
- `src/lib/validation.ts` and `src/lib/types/templates.ts` already back built-in native category validation and defaults.
- `docs/schema-templates/` already contains category docs, schemas, prompts, samples, and workflow notes.
- The current template manager/editor edits runtime custom categories in the store, not the file-backed schema corpus.
- No unified file-authoring workspace exists yet.

## Phase 1: Normalize The Runtime Schema Descriptor

Goal:

- make `src/lib/schema` the normalized adapter layer for both native and project schemas
- add explicit schema class, source, version, and binding metadata
- keep validation and conflict handling deterministic

Atomic actions:

- [ ] Extend the schema registry types
  Acceptance: schema entries carry explicit metadata for `kind`, `version`, `source`, and field contract details.
- [ ] Teach the registry to distinguish native and project schemas
  Acceptance: the runtime can resolve whether a schema came from code or from `docs/schema-templates/`.
- [ ] Add a schema-binding type
  Acceptance: a UUID can point at one active schema binding with a visible version.
- [ ] Normalize conflict and merge behavior
  Acceptance: `mergeSchemas` and `detectSchemaConflicts` operate on the same descriptor shape the registry uses.
- [ ] Keep validation path compatibility
  Acceptance: existing built-in validation still passes against the updated registry and descriptor model.

Deliverables:

- normalized schema descriptor types in `src/lib/schema`
- explicit schema-binding metadata
- conflict and merge helpers that understand schema class and version
- tests that cover native and project schema descriptors

User checkpoint:

- Review the runtime descriptor model and confirm it matches the native/project split you want.

Exact UI test at the gate:

- Browser: open the current app shell and verify the schema-related UI still loads while the updated descriptor model is wired in.
- Desktop: repeat the shell check in the desktop app and confirm the same schema entry points still render.

Question to ask at milestone completion:

- "Does the runtime schema model still reflect the native versus project split you want?"

## Phase 2: Build The File-Authoring Workspace

Goal:

- make `docs/schema-templates/` editable through a unified authoring UI
- give the Architect a dedicated file-authoring route, separate from the runtime custom-category helper
- let the user create and update the category doc, JSON Schema, prompt, sample, and method together, including workflow bundles with nested payloads

Code task targets:

- `src/app/schema-templates/page.tsx` for the dedicated authoring route
- `src/components/schema-templates/SchemaTemplateWorkspace.tsx` for the bundle shell
- `src/components/schema-templates/SchemaTemplateEditor.tsx` for the split-pane editors
- `src/lib/schema/catalog.ts` for manifest loading and bundle discovery
- `src/lib/schema/io.ts` for read/write of the linked files
- `src/lib/schema/validation.ts` for schema/sample validation in the workspace
- `tests/harness/schema-template-harness.ts` or an equivalent harness helper for the real UI gate
- `docs/schema-templates/index.md` for the entity versus workflow-bundle rules

Atomic actions:

- [ ] Define the file-authoring workspace route or view
  Acceptance: there is one canonical place in the app that opens a schema template for editing.
- [ ] Load the category doc, schema, prompt, sample, and method side by side
  Acceptance: the workspace can read the linked files as one authoring bundle.
- [ ] Add a save flow for the linked files
  Acceptance: edits persist back to the corresponding files in `docs/schema-templates/`.
- [ ] Add schema preview and sample validation
  Acceptance: the workspace shows whether the sample validates against the schema before save.
- [ ] Show the native/project classification explicitly
  Acceptance: the UI makes it obvious whether the current schema is code-backed or file-backed.

Deliverables:

- a schema-authoring workspace in the app
- read/write support for the schema-template file bundle
- preview and validation feedback for schema/sample pairs
- visible native/project classification in the authoring UI
- explicit handling for workflow bundles with nested outputs

User checkpoint:

- Open the authoring workspace and confirm the bundle, preview, and save flow match how you expect to write schema templates.

Exact UI test at the gate:

- Browser: create or edit one schema template bundle, save it, and confirm the updated files persist.
- Desktop: repeat the same authoring flow in the desktop app and confirm the same files persist there.

Question to ask at milestone completion:

- "Did the file-authoring workspace behave like a real schema editor, not just a helper panel?"

## Phase 3: Wire The UUID Container And Event Projection

Goal:

- treat UUIDs as the true container for cards and artifacts
- append events to the UUID and derive the current projection from that history

Atomic actions:

- [ ] Add a UUID container model
  Acceptance: a card can exist before a schema is attached.
- [ ] Add schema-binding state to the container
  Acceptance: the active schema and version are visible on the UUID record.
- [ ] Add append-only events
  Acceptance: events are added to history without mutating prior entries.
- [ ] Add a projection step
  Acceptance: the UI can derive the current card state from the binding plus event log.
- [ ] Expose the current projection in the UI
  Acceptance: the user sees the current state, binding, and history together.

Deliverables:

- UUID container store/state
- append-only event log
- derived projection layer
- UI surfaces for binding, history, and current state

User checkpoint:

- Create a UUID container, attach a schema, append an event, and confirm the current card reflects the derived projection.

Exact UI test at the gate:

- Browser: create a blank UUID card, attach a built-in schema, append a history event, and confirm the projection updates.
- Desktop: repeat the same container and event flow in the desktop app.

Question to ask at milestone completion:

- "Did the UUID container keep the history append-only while the projection stayed current?"

## Phase 4: Add Migration And Promotion Rules

Goal:

- make schema changes explicit and safe
- support versioned migration between native and project schemas

Atomic actions:

- [ ] Add versioned migration metadata
  Acceptance: schema changes carry a visible before/after version trail.
- [ ] Add explicit promotion rules
  Acceptance: a project schema can move toward a native schema only through an explicit step.
- [ ] Surface collision and shadowing policy
  Acceptance: the UI warns or explains when a project schema overrides a built-in one.
- [ ] Add cycle safety in the authoring flow
  Acceptance: inheritance loops are detected and handled safely.
- [ ] Preserve the UUID history during migration
  Acceptance: migration changes the binding or projection without deleting prior events.

Deliverables:

- explicit migration records
- promotion rules between project and native schema classes
- collision and cycle safety warnings
- preserved UUID history across migration

User checkpoint:

- Test one migration or promotion path and confirm the UUID history survives the transition.

Exact UI test at the gate:

- Browser: migrate one container from one schema version to another and confirm the history remains intact.
- Desktop: repeat the same migration in the desktop app and confirm the same result.

Question to ask at milestone completion:

- "Did the migration keep the UUID and its history intact?"

## Phase 5: Normalize The Per-Category Docs

Goal:

- make every per-category schema doc conform to the UUID container model
- ensure the root template docs all speak the same container language

Atomic actions:

- [ ] Add the shared container model block to every category doc
  Acceptance: each category doc states the UUID, schema binding, event, projection, and migration contract.
- [ ] Keep the field sections aligned with the architecture spec
  Acceptance: each doc names the same category contract that the runtime and authoring UI use.
- [ ] Mark file-backed versus code-backed paths clearly
  Acceptance: the docs distinguish native and project schema sources.
- [ ] Keep the examples synchronized with the schema contract
  Acceptance: each category doc's example payload matches the documented shape.
- [ ] Cross-link each category doc to the architecture spec and implementation plan
  Acceptance: every per-category doc has a visible path back to the canonical model.

Deliverables:

- category docs with a standard container section
- explicit native/project classification language
- cross-links to the architecture spec and implementation plan

User checkpoint:

- Review a representative category doc and confirm the container section and field contract read the way you expect.

Exact UI test at the gate:

- Browser: open the category docs and confirm the container model section is visible and consistent.
- Desktop: repeat the same docs review in the desktop app or desktop browser workflow.

Question to ask at milestone completion:

- "Do the category docs now read like one container model instead of unrelated templates?"

## Phase 6: Verify And Document

Goal:

- prove the runtime schema layer, authoring workspace, and container model work together
- keep the docs and tests synchronized

Atomic actions:

- [ ] Add tests for native schema resolution
  Acceptance: code-backed schemas still validate and resolve as expected.
- [ ] Add tests for project schema resolution
  Acceptance: file-backed schemas resolve through the adapter path.
- [ ] Add tests for UUID append-only history
  Acceptance: event history cannot be rewritten by normal flows.
- [ ] Add tests for migration and projection
  Acceptance: the projection updates while history survives migration.
- [ ] Add UI E2E coverage for the authoring workspace
  Acceptance: the user can author, save, and reopen a schema template.
- [ ] Update the docs index and linked references
  Acceptance: the plan, architecture spec, and normalized docs are all reachable from `docs/README.md`.

Deliverables:

- runtime schema tests
- UUID container tests
- migration/projection tests
- authoring workspace UI coverage
- final docs cross-links

User checkpoint:

- Run the full authoring and container flow end to end and confirm the docs match what the UI actually does.

Exact UI test at the gate:

- Browser: author one schema bundle, bind it to a UUID, append an event, and confirm the projection and docs all line up.
- Desktop: repeat the same end-to-end path in the desktop app.

Question to ask at milestone completion:

- "Did the UI, runtime schema layer, and docs all agree end to end?"

## Definition Of Done

- `src/lib/schema` exposes a normalized runtime contract for native and project schemas.
- The file-authoring UI can edit `docs/schema-templates/` as a real bundle.
- UUID containers exist independently of schema binding.
- Events are append-only.
- Current state is a projection from schema binding plus event log.
- Schema changes are versioned and explicit.
- The per-category docs conform to the container model.
- The docs index points at the architecture spec and implementation plan.
