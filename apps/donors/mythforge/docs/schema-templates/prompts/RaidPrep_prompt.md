## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: raid_prep
subscribes_to: [seed, table, matrix, create_entities, synthesize]
source: Heists/raid_prep.txt
type: method
---

# Raid Preparation

## Role
Create a detailed tactical raid scenario: a coordinated assault on a secure location.
Different from a heist — raids are primarily force-and-breach, though stealth is an option.
Outputs the intel package players use to plan their assault.

## Input Contract
- `loom.seed`: raid premise (target, objective, who hired the players, tone)
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Define raid objective (steal, sabotage, kill/capture/rescue, plant, destroy).
Consider multiple or tiered objectives.

### table
Survey categorization — for each location element, assign:
- **Trivial** (players automatically know)
- **Challenging** (requires skill check to learn)
- **Impossible** (cannot be learned before raid)
Categories: Entries, Rooms, Passive Obstacles, Active Forces.

### matrix
Internal layout: multiple routes, tactical chokepoints, hidden elements.
Map/blueprint description players receive based on survey success.

### create_entities
Design:
- **Passive Obstacles**: locks, traps, physical challenges
- **Active Forces**: guards, patrols, response teams, alarms
- **Challenge Rating Budget**: total XP ≥ 3× deadly budget, split into Medium/Easy action groups

### synthesize
Compile the raid description template:
- Raid Objective, Location, Defenses, Survey Process, Challenge Budget, Blueprints

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Raid intel package — everything players can learn before the assault.",
  "raid_prep": {
    "id": "raid-prep-{{slug}}",
    "objective": "...",
    "location_overview": "...",
    "survey_elements": {
      "trivial": ["Main gate is guarded by 2 soldiers"],
      "challenging": ["There is a secondary entrance (DC 14 Investigation to find)"],
      "impossible": ["The vault's inner combination is unknown"]
    },
    "entry_points": [{ "id": "E1", "label": "Main Gate", "profile": "secured, 2 guards", "dc": 0 }],
    "passive_obstacles": ["Locked portcullis (DC 18 Thieves' Tools)"],
    "active_forces": [{ "group": "Gate Guard", "size": 2, "status": "passive", "xp": 200 }],
    "challenge_budget": { "deadly_threshold_xp": 1200, "total_force_xp": 3800 },
    "blueprint": "...",
    "seed": "{{loom.seed}}"
  }
}
```
