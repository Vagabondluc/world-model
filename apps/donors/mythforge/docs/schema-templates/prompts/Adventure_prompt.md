## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
# Prompt Skeleton — Adventure

Source: Narrative Scripts — `Engines/Golden_Compass/Golden Compass Adventure Template.txt`

---

LLM Skeleton (verbatim):

```text
# Golden Compass Adventure Template

## 1. Episode Foundations

**Episode Title:** [Your Title]
**Subtitle:** [Your Subtitle]

... (see source file for full content)
```

---

Output format (use the MythosForge `Adventure` template keys):

Produce a JSON object with fields: `title`, `scenes`, `theme`, `difficulty`, `factions`, `notes`.

Example:

```json
{
  "title": "",
  "scenes": [],
  "theme": "",
  "difficulty": null,
  "factions": [],
  "notes": ""
}
```

Instructions:
- Use the skeleton to generate the detailed adventure narrative, then emit the JSON object matching keys above. Ensure `scenes` is an array of scene objects.
