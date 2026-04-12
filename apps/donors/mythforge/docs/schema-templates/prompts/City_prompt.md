## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Use the sections below as the instruction skeleton for generating a detailed city entry. Follow Narrative Scripts style codes (AC&OT, MS&L, D&T, C&L, ND, PD). Keep prose concise; final output must be strict JSON matching the schema.

City Instruction Skeleton

- Name and Districts
- Population & Demographics
- Economy and Trade Centers
- Governance and Law Enforcement
- Landmarks and Notable Structures
- Neighborhoods and Social Layout
- Threats and Conflicts
- Adventure Hooks and GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `City` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `City` JSON schema:

```
{
  "population": number,
  "wealth_tier": number,
  "guard_count": number,
  "crime_rate": number,
  "name": string,
  "districts": [{ "name": string, "description": string }],
  "landmarks": [{ "name": string, "description": string }],
  "economy_summary": string,
  "governance": { "type": string, "leader": string | null },
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
