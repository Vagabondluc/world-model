# MythosForge Schema Templates

> **Status:** Canonical
> **Scope:** Category schemas, prompt skeletons, workflow notes, samples, and runtime mapping

This folder is the canonical source for Mythforge category schema templates.
It defines the schema layer, the prompt layer, the workflow layer, and the sample fixtures that keep the runtime code and the docs aligned.

Start with `UUID_CONTAINER_ARCHITECTURE.md` for the UUID, schema, and event model. Then use `methods.md` for normalization rules and the implementation map below to trace each template into runtime code and UI surfaces.

## Container Vocabulary

- UUID container - the persistent entity instance.
- Schema binding - the code-backed or file-backed contract attached to that UUID.
- Projection - the current JSON payload produced from the binding plus append-only history.
- Events - append-only history stored outside the schema files.
- Native schema - a code-backed Zod/Zustand contract in runtime.
- Project schema - a file-backed template bundle under `docs/schema-templates/`.
- Workflow bundle - a schema/template file that coordinates multiple nested payloads or staged outputs under one documented contract.
- Auxiliary context - `loom` and `text` when a prompt uses them; they stay auxiliary unless the matching schema explicitly requires them.

## Schema Classes

### Entity Schemas

- `Arcane.schema.json`
- `Artifact.schema.json`
- `CoreMysteryElements.schema.json`
- `DungeonAssembly.schema.json`
- `DungeonPart.schema.json`
- `HeistPlan.schema.json`
- `Matrix.schema.json`
- `MysteryNode.schema.json`
- `NodeConnections.schema.json`
- `Quest.schema.json`
- `Table.schema.json`
- `VividDescription.schema.json`

### Workflow Bundle Companions

- `ArtifactEnvelope.schema.json`
- `HeistEnvelope.schema.json`
- `MatrixEnvelope.schema.json`
- `NodeConnectionsEnvelope.schema.json`
- `TableEnvelope.schema.json`

These envelope files are legacy compatibility companions. The non-envelope schema file is the canonical entity schema for new work.

## Canonical Artifacts

- `methods.md` - normalization rules for turning source forms into canonical category templates
- `UUID_CONTAINER_ARCHITECTURE.md` - canonical UUID, schema binding, event, and migration architecture
- `UUID_CONTAINER_IMPLEMENTATION_PLAN.md` - executable plan for `src/lib/schema`, the file-authoring UI, and doc normalization
- `methods/architect_guide.md` - method authoring protocol for multi-stage workflows
- `methods/loom_workflows.md` - Loom stage contracts and validation expectations
- `schemas/*.schema.json` - exported JSON Schema files for category and workflow artifacts
- `prompts/*_prompt.md` - prompt skeletons used to generate or validate structured content
- `samples/*/sample.json` - fixture outputs that validate the schema files
- `*.md` category template notes - human-readable source material for each category

## Implementation Map

### Schema Layer

- Canonical JSON Schema lives in `schemas/*.schema.json`
- Runtime Zod validation lives in `src/lib/validation/schemas-entities.ts`
- Category validation dispatch lives in `src/lib/validation.ts`
- Category defaults and built-in templates live in `src/lib/types/templates.ts`

### Workflow Layer

- Normalization rules and field mapping live in `methods.md`
- Method authoring protocol lives in `methods/architect_guide.md`
- Loom stage contracts and registration guidance live in `methods/loom_workflows.md`
- Central prompt registry entries live in `methods/loom_subscriptions.yaml`

### UI Layer

- Template creation and editing live in `src/components/mythosforge/TemplateManager.tsx` and `src/components/mythosforge/TemplateEditor.tsx`
- Entity form validation consumes the runtime schema through `src/components/mythosforge/useEntityForm.ts`
- Schema validation feedback is surfaced through the same UI flows the user edits

## Runtime UI Coverage

The template manager/editor UI is a runtime authoring surface, not a file authoring surface.

- It creates and edits `customCategories` in the store.
- It supports `name`, `group`, `icon`, `baseCategory`, and primitive fields only (`string`, `number`, `boolean`).
- It resolves inheritance against built-in category templates through `validateEntityAttributes`.
- It resolves by category name, so a custom category can shadow a built-in one if that is the intended policy.
- It relies on resolution-time cycle protection, not UI-time cycle prevention, for inheritance loops.
- It does not edit the markdown files, JSON Schema files, prompt skeletons, or sample fixtures under `docs/schema-templates/`.

Use the runtime UI to verify that the docs match the app behavior, but keep file-based template authoring in the `docs/schema-templates` workflow.

## Workflow By Template Type

### Category Source Doc (`<Category>.md`)

1. Write the canonical category summary.
2. List the source shape and intended use.
3. Link the category doc to the matching JSON Schema, prompt skeleton, sample fixture, and workflow method.
Acceptance: the category doc names the same fields and category key that the schema and runtime template use, and it includes the shared container model block.

### JSON Schema (`schemas/*.schema.json`)

1. Define required and optional fields.
2. Match the schema shape to the category doc.
3. Validate the sample fixture against the schema.
4. Keep the schema aligned with runtime validation.
Acceptance: the schema validates the documented sample and mirrors the runtime category contract.

### Workflow Bundle Schema (`schemas/*.schema.json` with nested payloads or staged outputs)

1. Define the primary container object and each nested payload.
2. Keep the prompt skeleton aligned with the stage contract and output order.
3. Validate the sample fixture against the full bundle output.
4. Keep the bundle aligned with runtime validation and any companion method notes.
Acceptance: the bundle validates the documented sample, preserves the primary container contract, and describes each nested payload clearly.

### Prompt Skeleton (`prompts/*_prompt.md`)

1. Add the `subscribes_to` frontmatter.
2. Write the prompt output contract.
3. Link the prompt to its schema and workflow method.
4. Keep the prompt fields aligned with the sample fixture.
Acceptance: the prompt describes the same fields and stage contract as the matching schema and method.

### Sample Fixture (`samples/*/sample.json`)

1. Build a representative sample payload.
2. Include the required Loom metadata when the sample belongs to a method.
3. Validate the sample against the matching schema.
4. Keep the fixture synchronized with any schema change.
Acceptance: the sample passes schema validation without special-case handling.

### Workflow Method (`methods/<MethodName>_method.md`)

1. Define the method purpose and source script.
2. Map each source step to a canonical Loom stage.
3. Write the matching prompt skeleton, schema, sample fixture, and registry entry.
4. Verify the sample against the schema and stage contract.
Acceptance: the method can be traced from source script to prompt, schema, sample, and registry entry.

### Runtime Custom Category Template (UI)

1. Open the Entity Template Manager.
2. Create or edit a custom category.
3. Decide whether the new name is unique or intentionally shadows a built-in category.
4. Choose a group, icon, and optional base category.
5. Add primitive fields and defaults.
6. Save the template and confirm it persists in the store.
7. Create or edit an entity using the new template and confirm validation follows the template.
Acceptance: the custom category persists, the naming policy is explicit, inheritance resolves without looping, and validation matches the docs.

## Add Or Update A Schema Template

- [ ] Identify the source category and decide whether it is built-in or custom
  Acceptance: the template has a single canonical category name.
- [ ] Decide the category-name collision policy
  Acceptance: the docs state whether a custom category may shadow a built-in one.
- [ ] Decide the inheritance-cycle policy
  Acceptance: the docs state whether cycles are rejected, warned about, or resolved by fallback.
- [ ] Add the shared container model block to the category doc
  Acceptance: the doc explicitly names UUID, schema binding, append-only events, projection, and migration.
- [ ] Normalize field names and defaults in `methods.md`
  Acceptance: the category fields use the same names everywhere in the docs.
- [ ] Add or update the JSON schema in `schemas/*.schema.json`
  Acceptance: the schema validates the documented sample payload.
- [ ] Add or update the prompt skeleton in `prompts/*_prompt.md`
  Acceptance: the prompt matches the schema fields and the intended workflow.
- [ ] Create or refresh the sample fixture in `samples/*/sample.json`
  Acceptance: the sample validates against the schema without special-casing.
- [ ] Update runtime schema/default code in `src/lib/validation/schemas-entities.ts`, `src/lib/validation.ts`, and `src/lib/types/templates.ts`
  Acceptance: the UI and runtime validation reflect the same category contract as the docs.
- [ ] Verify the template in the editor and manager UI
  Acceptance: the visible fields and validation states match the documented template.
- [ ] Add or update tests for schema validation and template resolution
  Acceptance: the docs and the runtime code agree under automated tests.

## Current Category Set

Core category files included in this batch:

- Campaign
- Adventure
- NPC
- Settlement
- City
- Dungeon
- Item
- Artifact
- Encounter
- Quest
- Faction
- Biome
- Character
