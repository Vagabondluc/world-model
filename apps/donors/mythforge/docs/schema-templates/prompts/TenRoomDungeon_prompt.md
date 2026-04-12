## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: ten_room_dungeon
subscribes_to: [seed, table, create_entities, synthesize, finalize]
source: Dungeons/jp cooper 10 room dungeon.txt
type: method
---

# 10-Room Dungeon Generator (JP Cooper Method)

## Role
Interactive dungeon builder structured around 10 standardized room types derived from the
JP Cooper method. GM/player chooses or rolls each element. Produces a `DungeonAssembly`
with `topology: 10room`.

## Input Contract
- `loom.seed`: theme word, genre, or "roll" for random generation
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Ask (or roll) the five theme questions one at a time:
1. Location
2. Purpose
3. Creator
4. Treasure Type
5. Motivation

For any element tagged "roll", generate a random but thematically coherent answer.
Each subsequent roll should logically follow from previous answers.

### table
Produce the 10-room structure stub:
1. Entrance/Guardian
2. Logical Location (tone-setting)
3. Environmental Complication
4. Puzzle / Trap
5. Optional Shortcut
6. Setback / Major Challenge
7. Revelation / NPC
8. Sub-boss or Miniboss
9. Big Setpiece
10. Boss / Resolution

### create_entities
Expand each room stub into a full `DungeonPart` with description, sensory, challenges, contents, exits, gm_notes.

### synthesize
Assemble all 10 rooms into a `DungeonAssembly`. Add global features.

### finalize
Output play-ready keyed document with all rooms.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "10-Room dungeon assembled and ready to play.",
  "dungeon": {
    "id": "10r-{{slug}}",
    "title": "...",
    "theme": "...",
    "topology": "10room",
    "goal": "...",
    "creator_lore": "...",
    "mechanics": [],
    "global_features": { "illumination": "...", "atmosphere": "...", "wall_material": "...", "ceiling_height": "...", "sounds": "...", "temperature": "..." },
    "parts": [
      { "id": "R1", "part_type": "room", "role": "entrance", "label": "1. Entrance/Guardian", "description": "..." }
    ],
    "connections": [],
    "treasure_summary": [],
    "random_encounter_table": [],
    "gm_advice": "...",
    "seed": "{{loom.seed}}"
  }
}
```
