## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "create_entities", "link_nodes", "synthesize"]
source: "Narrative Scripts/Execution_Systems/Factions/factions_creation.txt"
type: "multi-step"
---

# Faction Creation Prompt (LLM Skeleton)

Purpose:
- Generate a fully realised faction with leadership, agents, allies, enemies, and active clocks.

Inputs:
- `seed` (string) — canonical seed.
- `type` (string) — faction archetype: guild, criminal, religious, military, government, secret society, artisan.
- `tier` (1|2|3|4) — power level.
- `locale` (string) — city or region.

Output contract:
- Top-level `faction` with: `id`, `name`, `type`, `tier`, `short_description`, `leader[]`, `agents[]` (2–3, each with name, personality, skills, role), `allies[]`, `enemies[]`, `clocks[]` (1–3, each with goal, segments, filled), `seed`.
- Top-level `text` GM brief.

Stage guidance:
- `seed`: Accept type, tier, locale; derive faction goals.
- `create_entities`: Build leader objects, agent objects, ally/enemy stubs.
- `link_nodes`: Add `allies[]` and `enemies[]` cross-references to other faction IDs.
- `synthesize`: Assemble final `faction` artifact with clocks.

Prompt template:
"You are a faction designer. Given seed `{{seed}}`, type `{{type}}`, tier `{{tier}}`, locale `{{locale}}`, produce a `faction` JSON object. Include at least 2 named agents with personalities. Create 1–3 faction clocks with goals. Identify at least one ally and one enemy faction. Include the tier proficiency bonus (tier×2). Output a root `text` GM summary."
