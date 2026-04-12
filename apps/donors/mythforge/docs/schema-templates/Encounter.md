# Encounter

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `EncounterDesign_v1.schema.ts`, `combat_encounter.schema.ts`

Fields (merged):
- `encounterName`: string
- `encounterType`: string
- `location`: string (optional)
- `objective`: string
- `enemies`: array
- `npcs`: array
- `environmentalEffects`: array
- `skillChallenges`: array
- `xpReward`: number (optional)
- `treasure`: array (optional)

Normalized template:

```json
{
  "title": "",
  "type": "",
  "location": "",
  "objective": "",
  "enemies": [],
  "npcs": []
}
```

