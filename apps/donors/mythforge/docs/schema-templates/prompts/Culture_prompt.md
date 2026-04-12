## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — cultural and worldbuilding entries

Use the sections below as the instruction skeleton for generating a culture entry (customs, taboos, institutions). Emphasize player-facing elements and NPC behavior. Final output must be strict JSON matching the schema below.

Culture Skeleton

- Culture Name / Ethnonym
- Geographic / Environmental Context
- Core Values and Taboos
- Social Structure and Institutions
- Typical Dress and Symbols
- Rituals, Holidays, and Rites of Passage
- Economic Activities and Crafts
- Language / Dialects
- Conflict Zones and Relations
- Hooks and Roleplay Prompts

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Culture` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Culture` JSON schema:

```
{
  "name": string,
  "region": string | null,
  "values": [string],
  "taboos": [string],
  "structure": { "political": string | null, "social": string | null },
  "symbols": [string],
  "rituals": [{ "name": string, "description": string }],
  "economy": string | null,
  "language": string | null,
  "relations": [string],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
