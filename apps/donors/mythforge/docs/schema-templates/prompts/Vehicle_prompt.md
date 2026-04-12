## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Engines/Golden_Compass/Golden Compass Wealth and Vehicle System.txt`

Use the sections below as the instruction skeleton for generating a vehicle or transportation asset. Keep mechanics clear and table-ready; include acquisition, durability, and hooks. The final output must be strict JSON matching the schema below.

Vehicle Skeleton

- Name & Model
- Type (land, water, air, hybrid)
- Environments (land, water, air)
- Capacity (passengers / cargo)
- Speed and Movement stats
- Durability / Luck Points / Health
- Handling / Skill Check types and DCs
- Special Features & Modifications
- Repair & Maintenance notes
- Acquisition & Cost (wealth points / price)
- Adventure Hooks and Use-cases

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Vehicle` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Vehicle` JSON schema:

```
{
  "name": string,
  "model": string | null,
  "type": string,
  "environments": [string],
  "capacity": { "passengers": number | null, "cargo_lbs": number | null },
  "speed": { "land_mph": number | null, "water_knots": number | null, "air_mph": number | null },
  "durability": { "luck_points": number | null, "hp": number | null },
  "handling": string | null,
  "special_features": [{ "name": string, "description": string }],
  "repair_notes": string | null,
  "acquisition": { "method": string, "cost": number | null },
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
