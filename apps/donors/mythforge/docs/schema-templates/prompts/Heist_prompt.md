## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "node_generation", "create_entities", "link_nodes", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/Heists/heist_prep.txt + heist_running.txt"
type: "compound"
---

!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `tdd/11_Heists/raid_prep-tdd.md` and `Execution_Systems/Heists/raid_prep.txt`

Use the sections below as the instruction skeleton for generating a heist scenario. Emphasize planning, entry, roles, and failure modes. Final output must be strict JSON matching the schema below.

Heist Skeleton

- Title / Target
- Objective(s)
- Location & Security Overview
- Roles and Crew Composition
- Entry Points & Timelines
- Tools, Tech, and Resources
- Contingencies & Fail-Safes
- Alarms, Guards, and Detection
- Rewards and Risks
- Aftermath / Extraction Plans

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Heist` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Heist` JSON schema:

```
{
  "title": string,
  "target": string,
  "objectives": [string],
  "location": string | null,
  "security": { "type": string, "guards": number | null, "alarms": string | null },
  "roles": [{ "role": string, "specialist": string, "notes": string | null }],
  "entry_plan": { "method": string, "timeline_minutes": number | null },
  "tools": [string],
  "contingencies": [string],
  "reward_estimate": number | null,
  "risks": [string],
  "extraction": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
