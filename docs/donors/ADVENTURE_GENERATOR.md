# Adventure Generator — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Adventure Generator |
| Class | **fragment** |
| Adapter ID | `adventure-generator` |
| Manifest | `adapters/adventure-generator/manifest.yaml` |
| Source Root | `adapters/adventure-generator/source-snapshot/` (21 files) |
| Source Kind | `typescript` |
| Tech Residue | Next.js (only schema files and two workflow stores survive) |
| Canonical Lane | workflow |
| Phase 7 Methodology | intent reconstruction |
| Adapter Status | **registered** |

## What It Is

Adventure Generator is a workflow donor. A Next.js application originally existed; what survives in the adapter snapshot is a subset of its schema files and two workflow/history stores.

The donor's contribution to the canonical model is the concept of a *guided workflow session*: a multi-step creation process with checkpoints, progress tracking, and the ability to link generated outputs to canonical locations.

This is the only donor that provides the `WorkflowAttachment` shape. Any canonical entity that represents a guided creation process (adventures, scenario setups, guided questionnaires) derives its session structure from this donor's contracts.

## What Is Extracted

| Included Path | Reason |
|---|---|
| `schemas/` | domain schema templates for workflow steps and outputs |
| `stores/workflowStore.ts` | guided workflow state — steps, progress, checkpoints |
| `stores/historyStore.ts` | history of workflow sessions and output references |

The adapter includes 21 files total across the schemas directory and the two stores.

## What Is Not Extracted

| Excluded Path | Reason |
|---|---|
| `components/` | donor UI (deep narrative authoring workspace, menus, layout) |
| `tests/` | donor test suite |
| `lib/` | donor runtime utilities |

The application routing, page layout, and rendering logic are excluded from data-extraction scope. These are available for Phase 7 intent reconstruction.

## Canonical Lane — Workflow

| Canonical Record | Description |
|---|---|
| `WorkflowAttachment` | attached to EntityRecord or WorldRecord; describes active/completed workflow state |
| Workflow step payload | per-step state and input schemas |
| Workflow checkpoint payload | named save points within a workflow session |
| Generated-output reference contract | reference from a workflow output to a canonical Entity or Location |

### Promotion Class

`workflow` — concepts from this donor are optional workflow attachments. An entity or world without a `WorkflowAttachment` is fully valid.

## Concept Families

Registered in concept-family-registry:

- `workflow-schema` — guided step and domain schema definitions
- `location-linkage` — the contract for linking a generated adventure output to a `LocationAttachment`
- `domain-schema` — domain-type enumeration for workflow categories

## UI Characterization Methodology

**Intent reconstruction.** The donor application no longer runs in full; only schema files and two stores survive. Phase 7 characterization:

1. Read the 21 surviving files in the adapter snapshot
2. Identify the workflows implied by `workflowStore.ts` (steps, checkpoints, progress)
3. Reconstruct the intended user flow from store field names, action names, and schema shapes
4. Produce a feature matrix with `basis: reconstructed` for each requirement

Pre-registered waivers for this donor:
- **AG-W01**: The donor UI is not fully recoverable. Surface behavior for non-store material (navigation, layout, editor chrome) must use `basis: inferred` with a documented reasoning chain. Mitigation: cross-reference against any surviving `.next/` build artifacts or static pages if present.
- **AG-W02**: Checkpoint and resume flow details cannot be fully verified from stores alone. Mitigation: treat checkpoint fields as the authoritative contract and design conformant behavior around them.

## Origin Note

The source application was a Next.js project. The `to be merged/dungeon generator/zai2/` folder also appears to be a Next.js fragment (only `.next/` build artifacts). These are two separate donors — this Adventure Generator entry is the registered adapter; Dungeon Generator is unregistered and documented separately.

## Open Questions

- Does `historyStore.ts` imply a persistent session history that requires a new canonical record (e.g., `WorkflowHistoryRecord`), or is it scoped to in-memory session only?
- Is the `location-linkage` concept intended to work in one direction only (workflow → location), or bidirectionally (location owns link back to workflow)?
- Are the domain schemas in `schemas/` exclusive to workflow outputs, or are they also used as input validation templates?
