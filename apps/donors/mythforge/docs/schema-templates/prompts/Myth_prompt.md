## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Myth Instruction Skeleton

- Title and Cultural Origin
- Summary Narrative (origin story / key motif)
- Characters and Archetypes Involved
- Magical or Moral Lessons
- Historical Influence and Spread
- Hooks for Gameplay

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Myth` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Myth` JSON schema:

```
{
  "title": string,
  "era_origin": string,
  "truthfulness": string,
  "spread": string,
  "summary": string,
  "motifs": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
