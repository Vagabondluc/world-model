## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Alexandrian - Alternate Backbone/social_event.txt`

Use the sections below as the instruction skeleton for generating a social event (party, court, market, ball). Emphasize stakes, attendees, and social mechanics. Final output must be strict JSON matching the schema below.

Social Event Skeleton

- Title & Occasion
- Purpose and Stakes
- Location and Atmosphere
- Attendees (important NPCs and factions)
- Agenda / Timeline
- Social Beats & Scenes
- Conflicts, Secrets, and Scandals
- Skill Challenges or Social Mechanics
- Props, Decorations, and Notable Details
- Hooks and Followups

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `SocialEvent` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `SocialEvent` JSON schema:

```
{
  "title": string,
  "occasion": string | null,
  "purpose": string,
  "location": string | null,
  "atmosphere": string | null,
  "attendees": [{ "name": string, "role": string, "faction": string | null }],
  "timeline": [{ "time": string | null, "action": string }],
  "conflicts": [string],
  "skill_challenges": [{ "type": string, "dc": number | null }],
  "props": [string],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
