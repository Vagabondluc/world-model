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
source: "Narrative Scripts/Execution_Systems/Travel/wilderness_travel.txt"
type: "multi-step"
---

# Wilderness Travel Prompt (LLM Skeleton)

Purpose:
- Generate a complete wilderness travel framework: purpose, route structure, encounter tables (2d6), location matrices, and scene-by-scene content for D&D 5e.

Inputs:
- `seed` (string) — canonical seed.
- `purpose` (string) — reason for travel: destination, escape, exploration, resources, other.
- `structure` (string) — route | hexcrawl | pointcrawl.
- `stops` (number) — number of travel stops/scenes.
- `locale` (string) — biome/region (e.g., "foggy moors", "ancient forest").

Output contract:
- Top-level `wilderness_travel` with: `id`, `purpose`, `structure`, `encounter_table[]` (2d6 rows), `location_table[]` (named locations with inhabitants, complication, scene_type), `location_matrix[][]` (grid referencing location_table indices), `scenes[]` (each with id, title, location ref, encounter, weather, rest_interruption), `weather_table[]`, `resource_table[]`, `seed`.
- Top-level `text` GM journey brief.

Stage guidance:
- `seed`: Accept purpose, structure, stops, locale.
- `table`: Produce encounter_table (2d6: Dangerous/Challenging/Moderate/Easy/Beneficial rows) and location_table.
- `matrix`: Produce `location_matrix[][]` cross-referencing scene slots to location entries.
- `node_generation`: Emit individual scene nodes from the matrix rolls.
- `create_entities`: Expand each scene node into a full `scenes[]` entry.
- `synthesize`: Assemble all tables, matrix, and scenes into `wilderness_travel` artifact.
- `finalize`: Polish GM text; mark random roll instructions per table.

Prompt template:
"You are a wilderness travel designer for D&D 5e. Given seed `{{seed}}`, purpose `{{purpose}}`, structure `{{structure}}`, stops `{{stops}}`, locale `{{locale}}`, produce a `wilderness_travel` JSON. Include: a 2d6 encounter_table with granular entries (location, inhabitants, complication, scene_type); a location_table with vivid named locations; a location_matrix for randomly populating scenes; expanded scenes[] entries; a d20 weather_table and a foraging resource_table. Include root `text` as a GM journey brief."
