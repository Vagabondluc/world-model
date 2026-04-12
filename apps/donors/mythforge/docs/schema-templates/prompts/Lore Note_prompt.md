## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
# Prompt Skeleton — Lore Note

Source: Narrative Scripts — `AI_Behavior/encyclopedic_TextEntry_v1.txt`

---

LLM Skeleton (verbatim):

```text
Creating Comprehensive Encyclopedia Entries:

Structured Narrative: Develop a clear and well-organized narrative without introductory or concluding elements.
Detailed Information: Infuse the narrative with comprehensive data, including actions, motivations, and outcomes.
...
```

---

Output format (MythosForge `Lore Note` keys):

Produce JSON with `title`, `body`, `tags`, `related`.

```json
{
  "title": "",
  "body": "",
  "tags": [],
  "related": []
}
```

Instructions: Use the skeleton to produce a concise lore note and then output the JSON object.
