## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: dungeon_layout
subscribes_to: [table, matrix]
source: Dungeons/dungeon-map-creator.txt, Dungeons/xandered-dungeon-designer.txt
type: generator
---

# Dungeon Layout — Map & Topology

## Role
Translate a room list into a spatial arrangement and connections map. Handles scale, flow,
loops, and the Xandering principles (multiple entrances, loops, shortcuts, secret paths,
sub-levels). Output feeds directly into `link_nodes`.

## Input Contract
- `loom.seed`: dungeon theme or existing concept id
- `loom.stage`: `table` or `matrix`

## Stage Behavior

### table
Choose topology and set scale. Produce a spatial description:
- Which rooms cluster together, which are isolated
- Entry points (at least 2), exit points, boss location
- Vertical relationships if multi-level

### matrix
Build the explicit connections matrix:
```
[{ from, to, passage_type (corridor|stairs|pit|portal|crawlspace), locked?, secret?, notes }]
```
Apply Xandering: ensure loops (no dead-end-only paths), at least one shortcut, at least one secret.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Spatial overview of how rooms are arranged and connected.",
  "dungeon_layout": {
    "id": "layout-{{slug}}",
    "topology": "xandered|5room|10room|freeform|layered",
    "scale": "1 square = 10 ft",
    "entry_points": ["R1", "R2"],
    "boss_room": "R10",
    "connections": [
      { "from": "R1", "to": "R2", "passage_type": "corridor", "locked": false, "secret": false }
    ],
    "shortcuts": ["R3→R8 via crawlspace"],
    "secrets": ["R5 secret door → R9"],
    "seed": "{{loom.seed}}"
  }
}
```
