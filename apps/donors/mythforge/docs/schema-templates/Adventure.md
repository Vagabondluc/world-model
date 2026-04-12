# Adventure

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `Three-Pass_Adventure`, `megadungeon-planner`, `DungeonDesign_5Room` (mechanical-sycophant forms)

Fields (extracted & merged):
- `adventureName` / `dungeonName`: string → canonical `title`
- `scenes`: array (scene entries)
- `currentPass`: string (optional)
- `rival`: record/object (optional)
- `doomsdayClock`: record/object (optional)
- `pass1Complete`, `pass2Complete`: boolean (optional)
- `totalLevels`, `currentLevel`, `levelTheme`, `difficulty` (from megadungeon-planner)

Normalized template:

```json
{
  "title": "",
  "scenes": [],
  "theme": "",
  "difficulty": null,
  "factions": [],
  "notes": ""
}
```

