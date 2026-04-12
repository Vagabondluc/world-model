# NPC

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Source forms:
- `Quick_NPC.schema.ts`
- `NPC_Description_v1.schema.ts`
- `npc_creator_bot.schema.ts`
- `Quick_NPC` (multiple quick forms)

Aggregated fields (merged):
- `name` / `npcName`: string (optional)
- `role`: string (optional)
- `tone`: string (optional)
- `race`: string (optional)
- `gender`: string (optional)
- `age`: string (optional)
- `class`: string (optional)
- `level`: number (optional)
- `occupation`: string (optional)
- `personalityTraits`: string (optional)
- `ideals`: string (optional)
- `bonds`: string (optional)
- `flaws`: string (optional)
- `goals`: string (optional)
- `backstory`: string (optional)
- `physicalDescription`: string (optional)
- `distinguishingMarks`: string (optional)
- `clothing`: string (optional)
- `mannerisms`: string (optional)
- `portraitPrompt`: string (optional)
- `voice`: string (optional)
- `tags` / `categories`: array of strings (optional)
- `seed`, `useTablePicker`, `aiContext`: optional utility fields present in quick forms

Normalized JSON template example:

```json
{
  "name": "",
  "role": "",
  "race": "",
  "class": "",
  "level": null,
  "occupation": "",
  "personalityTraits": "",
  "backstory": "",
  "physicalDescription": "",
  "portraitPrompt": "",
  "tags": []
}
```

Notes:
- Combine `personalityTraits` and `character_profile` fields when present (MBTI, enneagram, happiness/fear/love, arc stage) to power roleplay/arc generation.

