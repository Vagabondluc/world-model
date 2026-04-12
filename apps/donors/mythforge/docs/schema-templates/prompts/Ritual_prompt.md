## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Westmarsh/mission prompt.txt` (Ritual Missions) and Mysteries

Use the sections below as the instruction skeleton for generating a ritual or ceremonial mission. Emphasize requirements, participants, risks, and outcomes. The final output must be strict JSON matching the schema below.

Ritual Skeleton

- Name & Purpose
- Required Participants and Roles
- Location Requirements
- Materials & Components
- Time / Duration
- Skill/Checks required
- Expected Outcomes & Consequences
- Failure Modes and Escalation
- Hooks and Adventure Uses

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Ritual` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Ritual` JSON schema:

```
{
  "name": string,
  "purpose": string,
  "participants": [{ "role": string, "count": number | null, "description": string | null }],
  "location": string | null,
  "materials": [{ "name": string, "quantity": number | null }],
  "duration_hours": number | null,
  "skill_checks": [{ "type": string, "dc": number | null }],
  "success_outcomes": [string],
  "failure_outcomes": [string],
  "risks": [string],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
