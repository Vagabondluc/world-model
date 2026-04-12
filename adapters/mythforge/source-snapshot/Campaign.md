# Campaign

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `mechanical-sycophant/src/contracts/forms/campaign_prep.schema.ts`

Fields (extracted):
- `campaignTitle`: string (max 100) — canonical `title`
- `flavor`: string — short descriptive flavor
- `tier`: string
- `duration`: string (optional)
- `metaplot`: string (max 2000, optional)
- `cast`: array (NPC references) (optional)
- `arcs`: array (optional)
- `branches`: array (optional)

Normalized template (example):

```json
{
  "title": "",
  "description": "",
  "tier": "",
  "duration": "",
  "metaplot": "",
  "cast": [],
  "arcs": [],
  "branches": []
}
```

