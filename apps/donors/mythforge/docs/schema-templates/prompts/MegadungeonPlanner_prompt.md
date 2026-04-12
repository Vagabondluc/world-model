## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: megadungeon_planner
subscribes_to: [seed, table, matrix, synthesize, finalize]
source: Dungeons/megadungeon-planner.txt
type: method
---

# Megadungeon Planner

## Role
Design a large-scale, campaign-spanning dungeon with 10–20 interconnected levels,
faction ecosystems, restocking mechanics, and multi-leg storylines. Output is a
`DungeonAssembly` with `topology: megadungeon` operating at level-granularity
(each part = a level, not a room).

## Input Contract
- `loom.seed`: megadungeon premise (origin myth, overarching mystery, campaign stage)
- `loom.stage`: which phase to execute

## Stage Behavior

### seed
Generate overarching concept: origin, purpose, central theme, 3 campaign-length secrets.

### table
Plan 10–20 levels: list each with `id, label, theme, difficulty_band` (levels 1–5, 6–10, 11–15, 16+).
Assign 3–5 factions with territory control and inter-faction dynamics.

### matrix
Sketch level-to-level connections: standard stairs, chutes, hidden shafts, portal networks.
Apply Xandering at macro scale (multiple ways between levels, shortcut spirals).

### synthesize
Produce:
- Ecosystem: internal economy, resource flows, creature food chains
- Multi-leg quest arcs spanning several levels
- Restocking protocol: how cleared areas change or refill
- Legendary locations and artifacts (1–3)

### finalize
Campaign integration guide: hooks to enter, pacing for outside adventures, difficulty curve.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Megadungeon campaign overview.",
  "dungeon": {
    "id": "mega-{{slug}}",
    "title": "...",
    "theme": "...",
    "topology": "megadungeon",
    "goal": "...",
    "creator_lore": "...",
    "mechanics": ["..."],
    "parts": [
      { "id": "L1", "part_type": "level", "role": "entrance", "label": "The Gatehouse Ruins", "description": "..." }
    ],
    "connections": [{ "from": "L1", "to": "L2", "passage_type": "stairs", "locked": false, "secret": false }],
    "factions": ["The Vermin Court", "The Iron Covenant"],
    "legendary_locations": ["..."],
    "restocking_protocol": "...",
    "campaign_hooks": ["..."],
    "gm_advice": "...",
    "seed": "{{loom.seed}}"
  }
}
```
