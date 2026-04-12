## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — local celebration and event templates

Use the sections below as the instruction skeleton for generating a festival or public celebration. Cover schedule, attractions, and political stakes. Final output must be strict JSON matching the schema below.

Festival Skeleton

- Name & Theme
- Duration and Schedule
- Major Attractions and Performers
- Sponsoring Factions and Patrons
- Rituals / Ceremonies
- Security & Crowd Considerations
- Economic Impact (vendors, tourism)
- Conflicts / Potential Incidents
- Hooks and Roleplay Opportunities

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Festival` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Festival` JSON schema:

```
{
  "name": string,
  "theme": string | null,
  "duration_hours": number | null,
  "schedule": [{ "time": string | null, "event": string }],
  "attractions": [{ "name": string, "type": string, "notes": string | null }],
  "sponsors": [string],
  "ceremonies": [string],
  "security_notes": string | null,
  "economic_effect": string | null,
  "incidents": [string],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
