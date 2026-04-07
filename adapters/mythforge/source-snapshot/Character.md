# Character

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms: `character_profile.schema.ts`, `npc_creator_bot.schema.ts` (overlap)

Fields (extracted):
- `characterName`: string
- `archetype`: string (optional)
- `mbti`, `enneagram`: string (optional)
- `happiness`, `fear`, `love`: string (optional)
- `arcStage`: string (optional)
- `arcBeats`: array of strings (optional)

Normalized template:

```json
{
  "name": "",
  "archetype": "",
  "personality": {
    "mbti": "",
    "enneagram": ""
  },
  "emotionalStates": {}
}
```

