## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: raid_execution
subscribes_to: [seed, create_entities, synthesize, finalize]
source: Heists/raid_execution.txt
type: method
---

# Raid Execution — Running the Raid

## Role
Procedures for GM to run a live raid scenario dynamically. Covers the raid turn procedure,
theater of operations, activation checks, fail-forward technique, and "Let It Ride" checks.
Transforms a raid_prep document into an active encounter system.

## Input Contract
- `loom.seed`: raid_prep document id or raid scenario seed
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Parse raid prep. Identify:
- Total active forces and their initial states (Active / Alert / Aware)
- Theater of operations (starting area + immediate neighboring zones)
- How to introduce the raid concept to new players (suggest: trivial first survey, equipment hints)

### create_entities
Build encounter resources:
- **Action Groups**: categorize each force as Active/Alert/Aware with perception penalties
- **Activation Table**: site check vs group check triggers
- **Fail-Forward Table**: for each major obstacle, what happens on failure (complication, cost-to-succeed, accept consequence)
- **Let It Ride Moments**: identify single decisive checks; define when riding check ends

### synthesize
Produce the Raid Turn Procedure reference:
1. Mark Ticks (1-min raid turns)
2. Activation Checks
3. Adversary Actions
4. Perception Checks (with distance penalties)
5. Resolve Actions (theater of operations scope)

### finalize
Full GM reference doc:
- Raid scenario overview
- Activation/awareness procedures
- Adversary response guide
- Player raid actions
- Complications & fail-forward table
- Pacing & transitions (dungeon turns → raid turns → combat rounds)

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Raid execution reference — all GM procedures for running the raid.",
  "raid_execution": {
    "id": "raid-exec-{{slug}}",
    "theater_of_operations": ["Entry hall", "Guard barracks", "Vault corridor"],
    "action_groups": [
      { "group": "Gate Guard", "state": "Active", "awareness_dc": 12, "perception_penalty": 0 }
    ],
    "activation_sources": ["site_check", "alarm_triggered", "noise_heard"],
    "fail_forward_table": [
      { "obstacle": "Lock (DC 18)", "fail_result": "Alarm triggered — pay 1 Tension to suppress" }
    ],
    "let_it_ride_moments": ["Infiltrating the compound (single Stealth check sets tone)"],
    "raid_turn_procedure": ["1. Mark Tick", "2. Activation Checks", "3. Adversary Actions", "4. Perception Checks", "5. Resolve"],
    "pacing_transitions": "Switch raid turns → combat rounds when direct engagement begins.",
    "seed": "{{loom.seed}}"
  }
}
```
