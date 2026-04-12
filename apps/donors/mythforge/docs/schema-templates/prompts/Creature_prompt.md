## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Ressources/monster template.txt` and `Output/homebrew 5e/StatblockExpended_v1-pc-creature.txt`

Use the sections below as the instruction skeleton for generating a creature/monster statblock suitable for tabletop play. Keep mechanical details accurate and concise. Final output must be strict JSON matching the schema below.

Creature Skeleton

- Name, Type, Size
- Alignment and Role (striker, controller, brute, leader, support)
- Challenge Rating & XP
- Core Stats (STR/DEX/CON/INT/WIS/CHA)
- Key Abilities and Traits
- Actions, Legendary/Reactions
- Tactics & Encounter Role
- Lair / Habitat and Ecology
- Loot & Hooks

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Creature` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Creature` JSON schema:

```
{
  "name": string,
  "size": string | null,
  "type": string | null,
  "alignment": string | null,
  "challenge_rating": number | null,
  "xp_value": number | null,
  "stats": { "str": number | null, "dex": number | null, "con": number | null, "int": number | null, "wis": number | null, "cha": number | null },
  "abilities": [{ "name": string, "description": string }],
  "actions": [{ "name": string, "description": string }],
  "legendary_actions": [{ "name": string, "description": string }],
  "lair_actions": [{ "name": string, "description": string }],
  "tactics": string | null,
  "ecology": string | null,
  "loot": [{ "name": string, "quantity": number | null }],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
