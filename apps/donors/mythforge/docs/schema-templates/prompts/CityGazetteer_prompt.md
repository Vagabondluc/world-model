## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "table", "node_generation", "create_entities", "link_nodes", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/Locations/city_gazetteer.txt"
type: "multi-step"
---

# City Gazetteer Prompt (LLM Skeleton)

Purpose:
- Generate a comprehensive encyclopaedic city reference: transport, districts, landmarks, services, adventure sites, scenic encounter table, and background events.

Inputs:
- `seed` (string) — canonical seed.
- `city_name` (string) — name of the city.
- `district_count` (number) — number of districts.
- `scale` (string) — small | medium | large | metropolis.
- `tone` (string) — optional: trade hub, militaristic, arcane, corrupt, cosmopolitan.

Output contract:
- Top-level `city` with: `id`, `name`, `scale`, `tone`, `transport` (entry_exit_points[], intra_city_routes[]), `districts[]` (each: id, name, description, landmarks[], services[]), `adventure_sites[]`, `scenic_encounter_table[]` (20–30 entries), `background_events[]`, `seed`.
- Top-level `text` GM city brief.

Stage guidance:
- `seed`: Accept city_name, district_count, scale, tone.
- `table`: Produce scenic_encounter_table and background_events list.
- `node_generation`: Emit district nodes (one per district) and adventure site nodes.
- `create_entities`: Expand each district with landmarks (3–5 per district) and services (2–3 per category).
- `link_nodes`: Map intra-city transport routes between districts.
- `synthesize`: Assemble full `city` artifact.
- `finalize`: Polish descriptions; add GM scenic encounter deployment rules.

Prompt template:
"You are a city gazetteer writer. Given seed `{{seed}}`, city `{{city_name}}`, scale `{{scale}}`, tone `{{tone}}`, district_count `{{district_count}}`, produce a `city` JSON. For each district include 3–5 landmarks and 2–3 services per category. Produce a 20-entry scenic_encounter_table and 5+ background_events. Include transport routes (entry/exit and intra-city). Output root `text` as a GM city overview."
