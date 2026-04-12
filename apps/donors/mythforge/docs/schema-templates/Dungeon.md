# Dungeon

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `megadungeon-planner.schema.ts`, `DungeonDesign_5Room.schema.ts`, `dungeon-room-designer.schema.ts`, `dungeon-map-creator.schema.ts`, `dungeon-key-writer.schema.ts`

Fields (merged):
- `dungeonName` / `mapName` / `roomId`: string
- `totalLevels`, `currentLevel`, `levelTheme`, `difficulty`
- `rooms`: array / `room1..room5` records
- `rooms` entries: room metadata, `interactiveElements`, `sensoryPalette` (see `dungeon-room-designer`)
- `passages`, `secrets`, `elevationChanges` (map metadata)
- `roomElements`, `denizens`, `treasure` (room-level fields)

Normalized template:

```json
{
  "title": "",
  "totalLevels": null,
  "rooms": [],
  "factions": [],
  "notes": ""
}
```

