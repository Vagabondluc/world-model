## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Use the sections below as the instruction skeleton for generating an LLM-friendly NPC card. Draw from `Quick_NPC.txt`, `npc_creator_bot.txt`, and `NPC_Description_v1.txt`. Keep output compact and roleplay-ready; provide a short reference table plus expanded fields as requested. The final output must be strict JSON matching the schema below.

NPC Skeleton

- Card Value (optional)
- Name
- Race
- Class / Profession / Role
- Level (if applicable)
- Alignment
- Appearance (one-sentence)
- Physical Description (brief paragraph)
- Motivations / Goals (one-liners)
- Personality Traits (list)
- Flaws (list)
- Habits / Mannerisms
- Speech (voice sample / catchphrase)
- Knowledge (shared and secret)
- Bonds / Relationships
- Roleplaying Cues (short list)
- Backstory (concise paragraph)
- Stats (optional object for system-specific statblocks)
- Inventory / Notable Items (optional list)
- Image prompt (text for text-to-image)
- Tags, seed

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the canonical `NPC` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `NPC` JSON schema (return object with these keys):

```
{
  "card_value": string | null,
  "name": string,
  "race": string | null,
  "class": string | null,
  "level": number | null,
  "role": string | null,
  "profession": string | null,
  "alignment": string | null,
  "appearance": string,
  "physical_description": string,
  "motivation": string | null,
  "goals": [string],
  "personality_traits": [string],
  "flaws": [string],
  "habits_mannerisms": string | null,
  "speech": string | null,
  "catchphrase": string | null,
  "knowledge_shared": string | null,
  "knowledge_secret": string | null,
  "bonds": [string],
  "roleplaying_cues": [string],
  "backstory": string,
  "relationships": [{ "name": string, "relation": string, "notes": string | null }],
  "stats": object | null,
  "inventory": [{ "name": string, "description": string }],
  "image_prompt": string | null,
  "tags": [string],
  "seed": string | null
}
```

Formatting notes for the generator:
- Keep the `appearance` line single-sentence and evocative.
- `personality_traits` should be 3–6 concise traits.
- `roleplaying_cues` should be 3 short actionable cues (tone, posture, verbal tic).
- For `stats`, include only system-relevant fields if provided; otherwise return `null`.

Finish by returning only the JSON object.
