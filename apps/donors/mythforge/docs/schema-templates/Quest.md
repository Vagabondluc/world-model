# Quest

> **Schema Class:** Entity

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms mapped: `raid_prep.schema.ts`, `heist_prep.schema.ts`, `create_hook.schema.ts`

Fields (recommended):
- `title` / `scenarioName` / `targetName`
- `objective` / `goal`
- `partySize`, `partyLevel`, `xpBudget`
- `surveyIntel`, `blueprintLayout`, `defenseLayers`
- `tensionTriggers`, `xpAllocation`

Normalized template:

```json
{
  "title": "",
  "objective": "",
  "partySize": null,
  "partyLevel": null,
  "resources": [],
  "blueprint": {}
}
```

