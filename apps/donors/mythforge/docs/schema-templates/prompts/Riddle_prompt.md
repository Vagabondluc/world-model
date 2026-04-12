## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — riddle and puzzle templates (`Execution_Systems/riddles/CreateRiddle_v1.txt`).

Use the sections below as the instruction skeleton for generating a riddle or puzzle entry. Provide answer and progressive hints. Final output must be strict JSON matching the schema below.

Riddle Skeleton

- Title / Short Hook
- Riddle Text
- Answer (single phrase)
- Hints (ordered from vague to explicit)
- Difficulty (easy/medium/hard)
- Usage notes (how to present to players)

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Riddle` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Riddle` JSON schema:

```
{
  "title": string,
  "riddle": string,
  "answer": string,
  "hints": [string],
  "difficulty": string | null,
  "usage": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
