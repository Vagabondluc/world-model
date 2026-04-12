# City

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `city_gazetteer.schema.ts`

Fields (extracted):
- `cityName`: string
- `activeDistrict`: string (optional)
- `districts`: array (min 1)
- `backgroundEvents`: array (optional)
- `encounterTable`: array (optional)

Normalized template example:

```json
{
  "name": "",
  "districts": [],
  "activeDistrict": "",
  "backgroundEvents": [],
  "encounterTable": []
}
```

