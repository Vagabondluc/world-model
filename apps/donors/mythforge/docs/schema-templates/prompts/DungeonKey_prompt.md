## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: dungeon_key
subscribes_to: [synthesize, finalize]
source: Dungeons/dungeon-key-writer.txt
type: compound
---

# Dungeon Key Writer

## Role
Takes all assembled `DungeonPart` bricks + global features and produces the master dungeon key
document — the GM's play reference. Covers intro, global features, each room keyed by number,
treasure summary, random encounter table, and appendices.

## Input Contract
- `loom.seed`: dungeon seed or assembly id
- `loom.stage`: `synthesize` or `finalize`

## Stage Behavior

### synthesize
For each room in the assembly, produce a standardized room entry:
```
## R1. The Weeping Gate
> Boxed text (2–4 sentences, player-facing)

**Reactive Checks:** Perception DC 14 — notices tripwire.
**Room Elements:** Cracked altar, phosphorescent moss, Grethix the Warden.
**Denizens:** Grethix — bribeable with food; knows shortcut to R8.
**Connections:** N → R2 (corridor), W → R5 (locked, key in R3), Secret → R9 (DC 16 Perception)
```

### finalize
Assemble into full document:
1. Dungeon Introduction (history, purpose, theme)
2. Global Features block (from DungeonFeatures)
3. Keyed rooms in order
4. Treasure Summary (by room)
5. Random Encounter Table (d6 or d12)
6. GM Advice + Appendices

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Full formatted dungeon key document as markdown.",
  "dungeon_key": {
    "id": "key-{{slug}}",
    "introduction": "...",
    "global_features_ref": "features-{{slug}}",
    "rooms_keyed": [
      {
        "room_id": "R1",
        "header": "R1. The Weeping Gate",
        "boxed_text": "...",
        "reactive_checks": ["Perception DC 14 — tripwire"],
        "elements": ["..."],
        "denizens": ["..."],
        "connections": ["N → R2", "Secret → R9 (DC 16)"],
        "treasure": "..."
      }
    ],
    "treasure_summary": [{ "room": "R1", "loot": "..." }],
    "random_encounter_table": ["..."],
    "gm_advice": "...",
    "seed": "{{loom.seed}}"
  }
}
```
