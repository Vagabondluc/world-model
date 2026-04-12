> **Schema Class:** Entity

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — random table and generator files (e.g., `random-encounter-table-generator.txt`).

Use the sections below as the instruction skeleton for generating a random table. Include dice roll mapping, entries, and usage notes. Final output must be strict JSON matching the schema below.

Table Skeleton

- Table Name & Purpose
- Dice Notation (e.g., 1d6, 2d10)
- Entries (row value, weight/roll range, description)
- Distribution Notes (weighted, uniform)
- Example Usages
- Expansion / Variants

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Table` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Table` JSON schema:

```
{
  "name": string,
  "purpose": string | null,
  "dice": string,
  "entries": [{ "roll": string | number, "description": string, "weight": number | null }],
  "distribution": string | null,
  "examples": [string],
  "variants": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
