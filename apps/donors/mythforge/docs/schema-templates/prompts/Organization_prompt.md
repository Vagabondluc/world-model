## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Factions/factions_creation.txt`

Use the sections below as the instruction skeleton for generating an organization or faction. Emphasize goals, structure, and agents. The final output must be strict JSON matching the schema below.

Organization Skeleton

- Name & Short Description
- Purpose / Agenda
- Tier / Power Level
- Leadership and Governance
- Key Agents / NPCs
- Allies and Enemies
- Resources and Assets
- Influence Zones / Areas of Operation
- Current Projects / Clocks
- Hooks and Conflicts

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Organization` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Organization` JSON schema:

```
{
  "name": string,
  "short_description": string,
  "purpose": string,
  "tier": number | null,
  "leaders": [{ "name": string, "role": string, "description": string | null }],
  "agents": [{ "name": string, "role": string, "notes": string | null }],
  "allies": [string],
  "enemies": [string],
  "resources": { "wealth": number | null, "assets": [string] },
  "influence_zones": [string],
  "clocks": [{ "name": string, "segments": number | null, "goal": string }],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
