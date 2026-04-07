# Faction

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `factions_creation.schema.ts`, `faction_downtime.schema.ts`

Fields (extracted):
- `factionName`: string
- `factionType`: string
- `tier`: string
- `leader`: string (optional)
- `keyAgents`: array (optional)
- `clockSegments`, `clockProgress`: optional
- `currentAgenda`: string (optional)
- `allies`, `enemies`: arrays (optional)
- `territory`: string (optional)

Normalized template example:

```json
{
  "name": "",
  "type": "",
  "leader": "",
  "keyAgents": [],
  "agenda": ""
}
```

