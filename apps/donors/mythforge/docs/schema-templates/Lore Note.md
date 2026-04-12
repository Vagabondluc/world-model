# Lore Note

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Purpose: short lore entries, worldbuilding notes, citations.

Recommended fields:
- `title`: string
- `body`: string
- `tags`: string[]
- `related`: string[] (entity ids)

