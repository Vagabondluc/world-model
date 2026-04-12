# Biome

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms: `wilderness_travel.schema.ts`, `wilderness_travel_long.schema.ts`, `fantastic_location.schema.ts` (contexts)

Fields (observed):
- `biome`: string
- `uniqueFeature` / `habitat` / `sensoryDetails`: records or strings
- `landmarks`, `dangers`, `inhabitants`: arrays (optional)

Template:

```json
{
  "name": "",
  "description": "",
  "landmarks": [],
  "inhabitants": []
}
```

