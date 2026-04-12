## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
# Prompt Skeleton — Region

Source: Narrative Scripts — `Execution_Systems/Locations/fantastic_location.txt`

---

LLM Skeleton (verbatim):

```text
# LLM Guidelines for Conceptualizing and Describing Fantastical Locations

As an LLM, your task is to create a comprehensive document that conceptualizes and describes a fantastical location for use in a tabletop roleplaying game or storytelling scenario. This document should provide a vivid, engaging, and mechanically useful description of a unique and memorable location.

... (see source file for full content)
```

---

Output format (MythosForge `Region` keys):

Produce JSON with `name`, `description`, `biomes`, `majorSettlements`, `notes`.

```json
{
  "name": "",
  "description": "",
  "biomes": [],
  "majorSettlements": [],
  "notes": ""
}
```

Instructions: Use the skeleton to produce a region description; then output JSON matching the keys above.
