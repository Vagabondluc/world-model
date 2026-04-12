# Item

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `magic-item.schema.ts`, `magic-weapon-basic.schema.ts`

Fields (extracted):
- `itemName` / `weaponName`: string
- `itemType` / `weaponType`: string
- `subtype`: string (optional)
- `rarity`: string
- `value`: string (optional)
- `description`: string
- `requiresAttunement`: boolean (optional)
- `attunementRequirement`: string (optional)
- `charges`, `chargeRegen`: number/string (optional)
- `properties`: array (min 1)
- flags: `isSentient`, `isCursed`, `isFabled`, `isArtifact` (optional booleans)

Normalized template:

```json
{
  "name": "",
  "type": "",
  "subtype": "",
  "rarity": "",
  "description": "",
  "properties": [],
  "flags": { "sentient": false }
}
```

