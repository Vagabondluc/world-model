## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Item/magic_item.txt`

Use the sections below as the instruction skeleton for generating a single item (mundane or magical). Focus on clarity for mechanical application at the table. Final output must be strict JSON matching the schema below.

Item Skeleton

- Name & Short Hook
- Item Type (weapon, armor, wondrous, consumable, reagent)
- Rarity & Attunement
- Mechanical Effects (stats, bonuses, charges)
- Activation and Usage
- Flavor and Description
- Crafting / Materials / Origin Notes
- Hooks & Adventure Uses
- Loot/Value guidance

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Item` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Item` JSON schema:

```
{
  "name": string,
  "type": string,
  "rarity": string | null,
  "attunement_required": boolean | null,
  "description": string,
  "effects": [{ "name": string, "mechanic": string, "value": string | number | null }],
  "weight_lbs": number | null,
  "cost_gold": number | null,
  "durability_max": number | null,
  "magic_level": string | null,
  "crafting_notes": string | null,
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
