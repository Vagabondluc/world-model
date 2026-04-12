## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: heist_running
subscribes_to: [seed, create_entities, synthesize, finalize]
source: Heists/heist_running.txt
type: method
---

# Heist Running — Prep to Runnable Scenario

## Role
Takes a heist preparation document (from `Heist_Planning_prompt`) and transforms it into a
fully realized, ready-to-run heist scenario with vivid location description, dynamic security,
NPC profiles, a timing/tension system, and aftermath consequences.

## Input Contract
- `loom.seed`: heist_prep document id, summary, or seed string
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Parse the heist prep: objective, location, entry points, defenses, crew.
Expand objective into a compelling narrative hook. Write brief timeline of events leading up to the heist opportunity.

### create_entities
Build out each component:
- **Location**: vivid atmospheric description of each area; table of key locations, function, special features
- **Security in Action**: guard behaviors, routines, timeline across a day/night cycle
- **Objective Specifics**: lore of the target item/info, extraction challenges
- **NPC Profiles**: full profiles for key NPCs + minor NPCs; stat blocks or skill lists for adversaries
- **Player Options**: role descriptions, useful equipment/skills menu, preparatory actions + benefits

### synthesize
Produce:
- Step-by-step GM guide for each heist phase
- Outcome tables for common player actions
- Tension meter (suspicion levels 0–5 with consequences)
- 3 major plot twists that could alter the heist

### finalize
Assemble full runnable scenario doc:
1. Scenario Overview  
2. Detailed Location  
3. Security in Action  
4. Objective Specifics  
5. NPC Profiles  
6. Player Options  
7. Running the Heist  
8. Dynamic Elements  
9. Aftermath & Consequences

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Runnable heist scenario summary.",
  "heist_scenario": {
    "id": "heist-run-{{slug}}",
    "objective_hook": "...",
    "location_description": "...",
    "security_timeline": "...",
    "npcs": [{ "name": "...", "role": "...", "motivation": "...", "stats": "..." }],
    "player_roles": ["Lookout", "Safecracker", "Tech Specialist"],
    "tension_meter": [
      { "level": 0, "label": "Clean", "consequence": "No complications" },
      { "level": 3, "label": "Suspicious", "consequence": "Guards double patrols" },
      { "level": 5, "label": "Lockdown", "consequence": "All alarms active, reinforcements called" }
    ],
    "plot_twists": ["..."],
    "aftermath_endings": ["Full success", "Partial success", "Blown cover", "Total failure"],
    "seed": "{{loom.seed}}"
  }
}
```
