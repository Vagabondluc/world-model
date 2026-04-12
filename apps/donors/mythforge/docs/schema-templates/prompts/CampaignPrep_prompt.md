## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "create_entities", "link_nodes", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/plot/campaign_prep.txt"
type: "multi-step"
---

# Campaign Prep Prompt (LLM Skeleton)

Purpose:
- Generate a complete multi-section campaign document: overview, setting & themes, metaplot, key NPCs, adventure structure, player integration, campaign arc, and conclusion.

Inputs:
- `seed` (string) — canonical seed.
- `fantasy_type` (string) — dark | grimdark | high | low | portal | science | sword_and_sorcery | weird.
- `tier` (1|2|3|4) — starting tier of play.
- `length` (object) — sessions (number), level_range (string), real_time (string).
- `themes` (string[]) — 3–5 main themes.

Output contract:
- Top-level `campaign` with: `id`, `title`, `overview`, `fantasy_type`, `tier`, `length`, `setting` (geography, politics, culture, magic), `themes[]` (each: name, description, how_expressed), `metaplot`, `key_npcs[]`, `adventure_structure`, `player_integration`, `arcs[]`, `flexibility_notes`, `conclusion`, `seed`.
- Top-level `text` — concise campaign pitch (1 paragraph).

Stage guidance:
- `seed`: Normalise fantasy_type, tier, length, themes.
- `create_entities`: Build key_npcs[], arcs[], setting object.
- `link_nodes`: Link arcs to key_npcs via `connections[]` (who drives which arc).
- `synthesize`: Assemble full `campaign` artifact.
- `finalize`: Polish; produce campaign pitch paragraph for `text`.

Prompt template:
"You are a campaign architect. Given seed `{{seed}}`, fantasy type `{{fantasy_type}}`, tier `{{tier}}`, length `{{length}}`, themes `{{themes}}`, produce a `campaign` JSON following the output contract. Specify geographic, political, and magical setting details. Create 3–5 key NPCs with motivations. Define 3 campaign arcs with escalating stakes. Output a 1-paragraph `text` pitch."
