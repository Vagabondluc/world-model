## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Deity Instruction Skeleton

- Name and Titles
- Divine Rank and Domains
- Portfolio and Alignment
- Worship Practices and Holy Sites
- Clergy and Followers
- Myths, Miracles, and Legendary Acts
- Hooks & Campaign Influence

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Deity` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Deity` JSON schema:

```
{
  "name": string,
  "divine_rank": number,
  "domains": [string],
  "worshippers": number,
  "alignment": string,
  "portfolio": string,
  "holy_sites": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
