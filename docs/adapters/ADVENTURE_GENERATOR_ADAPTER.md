# Adventure Generator Adapter

Adventure Generator is the workflow donor. Its adapter contributes guided creation and session semantics to the final app.

Source of truth:

- `world-model/adapters/adventure-generator/manifest.yaml`
- `world-model/adapters/adventure-generator/mappings/concept-map.yaml`
- `world-model/adapters/adventure-generator/source-snapshot/`

## What Is Copied

Copy the Adventure Generator material that defines:

- guided steps
- checkpoints
- progress
- session or workflow state
- generated adventure outputs
- location/adventure linkage

## What Is Not Copied

Do not copy Adventure Generator surfaces that are only useful to the donor shell, including:

- broad tool menus
- deep narrative authoring workspaces that do not affect the canonical session model
- donor-specific layout state
- unrelated content browsers

## Canonical Mapping

The adapter maps Adventure concepts into:

- `WorkflowAttachment`
- workflow step and checkpoint payloads
- generated-output reference contracts
- location/adventure linkage payloads

## Final App Role

In the final app, Adventure Generator is a guided workflow source. It should help users create and resume work quickly, but the durable state lives in the canonical `world-model` bundle.
