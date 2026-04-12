## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "table", "matrix", "node_generation", "create_entities", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/Encounters/urban_crawl.txt"
type: "multi-step"
---

# Urban Crawl Prompt (LLM Skeleton)

Purpose:
- Generate a district-by-district urban exploration framework with encounter tables, keyed locations, and social/combat/exploration scenes layered into an active city environment.

Inputs:
- `seed` (string) — canonical seed.
- `city` (string) — city/district name.
- `tone` (string) — noir | heist | political | festival | dangerous.
- `stops` (number) — number of urban scenes/stops.

Output contract:
- Top-level `urban_crawl` with: `id`, `city`, `tone`, `districts[]` (each: id, name, description, encounter_table[], keyed_locations[]), `scenes[]`, `social_encounter_table[]`, `complications[]`, `seed`.
- Top-level `text` GM brief.

Stage guidance:
- `seed`: Accept city, tone, stops.
- `table`: Produce social_encounter_table and per-district encounter tables.
- `matrix`: Cross-reference locations with scene slots.
- `node_generation`: Emit location and NPC-beat nodes per district.
- `create_entities`: Expand keyed_locations[], scenes[], district descriptions.
- `synthesize`: Assemble `urban_crawl` artifact.
- `finalize`: Polish GM text; add random encounter frequency rules.

Prompt template:
"You are an urban crawl designer. Given seed `{{seed}}`, city `{{city}}`, tone `{{tone}}`, stops `{{stops}}`, produce an `urban_crawl` JSON. For each district, include a small encounter table and 3–5 keyed locations. Produce a social encounter table (d20, 20 entries). Generate scenes[] for each stop. Output root `text` as a GM urban brief."
