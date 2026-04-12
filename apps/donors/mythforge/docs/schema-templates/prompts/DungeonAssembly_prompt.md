---
subscribes_to: ["synthesize", "finalize"]
---

> **Schema Class:** Entity

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.

# Dungeon Assembly Prompt (LLM Skeleton)

## Role
Assemble multiple `DungeonPart` bricks into one coherent `DungeonAssembly`.
Treat the output as the finished lego build: topology, connections, global features, and play-ready ordering.

## Input Contract
- `loom.seed`: dungeon seed or assembly brief
- `loom.stage`: `synthesize` or `finalize`
- Optional context: `parts[]`, `topology`, `goal`, `theme`, `global_features`, `connections`

## Stage Behavior

### synthesize
Merge the provided parts into a coherent `dungeon` object:
- Choose or confirm the topology
- Reconcile part order, labels, and connection graph
- Summarize global features and dungeon-wide mechanics
- Preserve part ids and keep connections consistent

### finalize
Polish the assembled dungeon for table use:
- Tighten the title, goal, and creator lore
- Add corridor themes, treasure summary, random encounter table, and GM advice
- Ensure the room flow supports exploration and non-linear play

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Short GM-facing summary of the assembled dungeon.",
  "dungeon": {
    "id": "dungeon-{{slug}}",
    "title": "...",
    "theme": "...",
    "topology": "5room|10room|xandered|megadungeon|pointyhat|freeform|layered",
    "goal": "...",
    "creator_lore": "...",
    "mechanics": ["..."],
    "global_features": { "illumination": "...", "atmosphere": "...", "wall_material": "...", "ceiling_height": "...", "sounds": "...", "temperature": "..." },
    "parts": [{ "id": "...", "part_type": "...", "role": "...", "label": "...", "description": "..." }],
    "connections": [{ "from": "...", "to": "...", "passage_type": "...", "locked": false, "secret": false, "notes": "..." }],
    "factions": ["..."],
    "treasure_summary": [],
    "random_encounter_table": ["..."],
    "corridor_themes": ["..."],
    "gm_advice": "...",
    "seed": "{{loom.seed}}"
  }
}
```
