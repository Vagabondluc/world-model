## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — treasure/loot templates and Homebrew statblock notes.

Use the sections below as the instruction skeleton for generating a treasure cache or loot bundle. Include composition, value, and adventure hooks. Final output must be strict JSON matching the schema below.

Treasure Skeleton

- Name / Discovery Hook
- Composition (coins, gems, art, magic items, unique objects)
- Estimated Monetary Value
- Notable Magic Items (if any) with short descriptions
- Origin / Ownership clues
- Security / Traps / Guardians
- Distribution notes (party split, faction interest)
- Adventure Hooks and Plot Uses

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Treasure` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Treasure` JSON schema:

```
{
  "name": string,
  "hook": string | null,
  "composition": { "coins": { "gold": number | null, "silver": number | null, "copper": number | null }, "gems": [{ "description": string, "value": number | null }], "art_objects": [{ "description": string, "value": number | null }], "magic_items": [{ "name": string, "description": string, "rarity": string | null }] },
  "estimated_value": number | null,
  "origin_clues": [string],
  "security": { "traps": [string], "guards": [string] },
  "distribution_notes": string | null,
  "plot_hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
