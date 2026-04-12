# Artifact

> **Schema Class:** Entity

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Notes:
- `magic-item.schema.ts` includes `isArtifact` and `history` fields. Treat `Artifact` as an `Item` subtype with additional provenance and unique properties.

Recommended fields:
- `name`, `type`, `rarity`, `description`, `history`, `properties`, `isArtifact: true`, `uniqueMechanics`.

Template:

```json
{
  "name": "",
  "type": "",
  "rarity": "",
  "description": "",
  "history": "",
  "properties": []
}
```

