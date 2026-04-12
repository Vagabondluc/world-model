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

Use the sections below as the instruction skeleton for generating a campaign/group wealth or resource system entry. Emphasize mechanics, gain/loss methods, and narrative impact. The final output must be strict JSON matching the schema below.

Wealth / Resource Skeleton

- System Name & Short Hook
- Currency / Point Unit (e.g., Wealth Points)
- Starting Defaults and Tiers
- Methods to Gain Wealth
- Methods to Spend Wealth
- Interaction with Time and Travel
- Economic Effects on NPC interaction
- Hard/Soft Mode Variants
- Sample Scenarios

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Wealth` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Wealth` JSON schema:

```
{
  "name": string,
  "unit": string,
  "starting_tier": string | null,
  "starting_value": number | null,
  "tiers": [{ "name": string, "min_value": number | null, "max_value": number | null, "notes": string | null }],
  "gain_methods": [{ "name": string, "description": string }],
  "spend_methods": [{ "name": string, "description": string }],
  "time_interaction": string | null,
  "npc_social_effects": string | null,
  "variants": [{ "name": string, "description": string }],
  "sample_scenarios": [{ "title": string, "summary": string }],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
