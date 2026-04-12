> **Schema Class:** Entity

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: vivid_description
subscribes_to: ["finalize"]
source: "Narrative Scripts/Execution_Systems/plot/vivid_description.txt"
type: descriptor
---

# Vivid Description Prompt (LLM Skeleton)

## Role
Rewrite bland text into sensory-rich prose that preserves meaning while adding atmosphere,
motion, and clear imagery.

## Input Contract
- `loom.seed`: base text or scene fragment to rewrite
- `loom.stage`: `finalize`
- Optional context: `location`, `time_of_day`, `weather`, `tone`, `urgency`, `sensory_focus`

## Stage Behavior

### finalize
Enhance the source text with:
- A clear opening that sets place, time, or weather
- At least three senses by default, or all five when appropriate
- Strong active verbs and concrete details
- Figurative language used sparingly and only when it helps clarity
- Consistent tone and no contradictions with the source

## Output Contract
```json
{
  "loom": { "stage": "finalize", "seed": "{{loom.seed}}" },
  "text": "Enhanced vivid prose.",
  "vivid_description": {
    "id": "vivid-{{slug}}",
    "base_text": "...",
    "enhanced_text": "...",
    "location": "...",
    "time_of_day": "...",
    "weather": "...",
    "tone": "...",
    "urgency": "normal",
    "senses_covered": [{ "sense": "sight", "detail": "..." }],
    "figurative_notes": ["..."],
    "warnings": ["..."],
    "seed": "{{loom.seed}}"
  }
}
```
