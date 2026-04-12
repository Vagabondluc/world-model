## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: travel_event_system
subscribes_to: [seed, table, create_entities, synthesize]
source: adventures/pointyhat travel adventure.txt
type: method
---

# Travel Event System (TES) — PointyHat Method

## Role
Transform travel into a dynamic narrative experience. Abstracts distance into three brackets
(Close/Far/Very Far) and assigns color-coded events (Red/Blue/Yellow + combos).
Focus is on drama, not logistics.

## Input Contract
- `loom.seed`: journey premise (origin, destination, who is traveling, narrative context)
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Define journey parameters:
- Distance bracket: Close (1 event) / Far (2 events) / Very Far (3 events)
- GM may adjust count for narrative pacing.
- Overall feel: what should this journey emphasize?

### table
Roll or assign event types for each event slot:
- **Red** — Combat: ambush, territorial monster, rival party
- **Blue** — Roleplay: diplomatic encounter, cultural friction, spirit negotiation
- **Yellow** — Exploration: terrain challenge, environmental puzzle, mystical landscape
- **Purple** (RP+Combat): negotiation that could escalate
- **Green** (Explore+RP): lost creature in danger, collaborative discovery
- **Orange** (Combat+Explore): enemy ambush in treacherous terrain
- **White** (All three): complex scene requiring negotiation, combat, and environment

### create_entities
Expand each event slot into a full travel scene:
- Color/type, location along the route, inciting moment, choices available, consequences.

### synthesize
Assemble into an ordered journey doc: distance, tone, events in sequence, how each transitions.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Journey summary: distance bracket, event sequence, dramatic highlights.",
  "travel_journey": {
    "id": "tes-{{slug}}",
    "origin": "...",
    "destination": "...",
    "distance_bracket": "Far",
    "event_count": 2,
    "events": [
      {
        "slot": 1,
        "color": "Red",
        "type": "Combat",
        "title": "Ambush at the Crossroads",
        "description": "...",
        "choices": ["fight", "flee", "parley"],
        "consequences": "..."
      }
    ],
    "tone": "...",
    "seed": "{{loom.seed}}"
  }
}
```
