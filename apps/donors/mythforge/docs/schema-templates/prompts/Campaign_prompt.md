## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
# Prompt Skeleton — Campaign

Source: Narrative Scripts — `Execution_Systems/plot/campaign_prep.txt`

---

LLM Skeleton (verbatim):

```text
# LLM Guidelines for Conceptualizing and Describing a Campaign

As an LLM, your task is to create a comprehensive document that conceptualizes and describes a campaign for a tabletop roleplaying game. This document should provide a flexible, character-focused framework for a long-term gaming experience that can span months or even years.

... (see source file for full content)
```

---

Output format (use the MythosForge schema keys):

Produce a JSON object matching the `Campaign` template with keys: `title`, `description`, `tier`, `duration`, `metaplot`, `cast`, `arcs`, `branches`.

Example:

```json
{
  "title": "",
  "description": "",
  "tier": "",
  "duration": "",
  "metaplot": "",
  "cast": [],
  "arcs": [],
  "branches": []
}
```

Instructions to the LLM when using this skeleton:
- First, read the LLM skeleton above and internalize the structure.
- Then generate a campaign description, and at the end output a JSON object strictly matching the keys in the example.
- Use `null` for unknown numeric fields; keep strings concise where appropriate.

