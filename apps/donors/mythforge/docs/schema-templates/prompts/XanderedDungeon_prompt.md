## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: xandered_dungeon
subscribes_to: [matrix, link_nodes]
source: Dungeons/xandered-dungeon-designer.txt
type: method
---

# Xandered Dungeon Designer

## Role
Apply Jaquaying (Xandering) principles to a room list and connections matrix to make a
non-linear, explorable dungeon. Primary output: enriched connections with multiple routes,
shortcuts, secret paths, vertical complexity, and sub-levels.

## Input Contract
- `loom.seed`: existing room list or dungeon seed
- `loom.stage`: `matrix` or `link_nodes`

## Stage Behavior

### matrix
Given a flat room list, impose Xandered topology:
1. Multiple Entrances: ≥2 distinct entry points with different challenge profiles.
2. Loops: Circular paths so players can't get permanently stuck.
3. Vertical Complexity: Stairwells, chutes, elevators between levels.
4. Discontinuous Connections: Shortcuts that skip areas.
5. Secret Paths: Doors behind puzzles or hidden passages.
6. Sub-Levels: 1–2 self-contained pockets off main paths.
7. Divided Levels: Sections requiring cross-level travel to unlock.
Output: full connections matrix with all the above.

### link_nodes
For each connection, describe the passage in detail:
- What kind of passage (corridor, shaft, crawlspace, portal, bridge)?
- Any features (trap, guard post, flooding, magical seal)?
- Navigation landmarks (carvings, statues, distinctive features) for player orientation.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Xandered topology summary — loops and non-linear paths described.",
  "xandered_layout": {
    "id": "xandered-{{slug}}",
    "entry_points": [{ "room_id": "R1", "profile": "main entrance, guarded" }, { "room_id": "R9", "profile": "hidden sewer grate, unguarded" }],
    "loops": [["R1","R2","R5","R3","R1"]],
    "shortcuts": [{ "from": "R3", "to": "R8", "type": "crawlspace", "notes": "Small creatures only" }],
    "secret_paths": [{ "from": "R5", "to": "R9", "dc": 16, "method": "push loose stone" }],
    "sub_levels": [{ "id": "SL1", "label": "The Flooded Vaults", "access": "R7 → trapdoor" }],
    "connections": [
      { "from": "R1", "to": "R2", "passage_type": "corridor", "locked": false, "secret": false, "notes": "Bones on floor" }
    ],
    "seed": "{{loom.seed}}"
  }
}
```
