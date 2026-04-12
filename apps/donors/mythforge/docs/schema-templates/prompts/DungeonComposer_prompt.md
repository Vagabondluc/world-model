## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: dungeon_composer
subscribes_to: [seed, table, matrix, create_entities, link_nodes, synthesize, finalize]
source: Dungeons/ (all files combined)
type: compound
---

# Dungeon Composer — Lego Assembler

## Role
Master orchestrator for dungeon construction. Calls and sequences all dungeon part-prompts
(concept → layout → rooms → corridors → features → key) to produce a fully assembled
`DungeonAssembly`. Think of this as the instruction sheet; the part-prompts are the bricks.

## Input Contract
- `loom.seed`: dungeon premise (theme, feel, who built it, why players go there)
- `loom.stage`: determines which phase to execute

## Stage Behavior

### seed
Generate core dungeon concept via `DungeonConcept_prompt`. Output:
- one-word theme, creator lore, player goal, primary denizens, mechanical hook

### table
Choose topology (`5room | 10room | xandered | megadungeon | pointyhat | freeform`) and produce
a flat room list: `[{id, label, role}...]`. No details yet — just the list of bricks to build.

### matrix
Build a connections matrix. For each room pair that should link, produce:
`{ from, to, passage_type, locked?, secret? }`. Ensure loops exist (Xandering principle).
If xandered topology, add at least two alternate routes and one shortcut.

### create_entities
Expand each room into a full `DungeonPart` brick:
- description, sensory (sight/sound/smell/touch), contents, challenges, npcs, treasure, gm_notes
Also run `CorridorThemes_prompt` for any connective corridors.

### link_nodes
Wire exits onto every part using the matrix. Add secret doors, one-way passages, elevation shifts.
Flag doors as locked/secret as needed.

### synthesize
Run `DungeonFeatures_prompt` (global ambiance) then `DungeonKey_prompt` (room-by-room key).
Produce the `dungeon` assembly object with all parts embedded.

### finalize
Format the full dungeon as a play-ready document: intro → global features → keyed rooms →
treasure summary → random encounter table → GM advice.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Brief human-readable summary of what was assembled this stage.",
  "dungeon": {
    "id": "dungeon-{{slug}}",
    "title": "...",
    "theme": "...",
    "topology": "5room|10room|xandered|megadungeon|pointyhat|freeform|layered",
    "goal": "...",
    "creator_lore": "...",
    "mechanics": ["..."],
    "global_features": { "illumination": "...", "atmosphere": "...", "wall_material": "...", "ceiling_height": "...", "sounds": "...", "temperature": "..." },
    "parts": [ { "id": "...", "part_type": "room|corridor|...", "role": "...", "label": "...", "description": "..." } ],
    "connections": [ { "from": "...", "to": "...", "passage_type": "...", "locked": false, "secret": false } ],
    "corridor_themes": ["..."],
    "treasure_summary": [],
    "random_encounter_table": ["..."],
    "gm_advice": "...",
    "seed": "{{loom.seed}}"
  }
}
```
