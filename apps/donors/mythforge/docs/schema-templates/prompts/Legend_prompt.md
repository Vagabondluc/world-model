## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Myth_prompt.md` and myth/legend templates

Use the sections below as the instruction skeleton for generating a legend or folk tale entry. Emphasize motifs, variants, and cultural significance. Final output must be strict JSON matching the schema below.

Legend Skeleton

- Title / Hook
- Origin and Cultural Context
- Main Characters and Motifs
- Core Narrative Beats
- Variants and Regional Versions
- Moral or Thematic Point
- Physical Traces (places, relics)
- Associated Rituals or Calendar Dates
- Uses in Adventures (hooks)

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Legend` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Legend` JSON schema:

```
{
  "title": string,
  "origin": string | null,
  "culture": string | null,
  "characters": [{ "name": string, "role": string | null }],
  "beats": [string],
  "variants": [string],
  "theme": string | null,
  "traces": [string],
  "rituals": [string],
  "adventure_hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
