## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
# Prompt Skeleton — Biome

Source: Narrative Scripts — `Execution_Systems/Travel/wilderness_travel.txt`

---

LLM Skeleton (verbatim):

```text
Here are the updated instructions tailored for a TTRPG writer, focusing on the detailed generation of encounter tables, locations, and using a matrix system for creating scenes in D&D 5e travel:

---

**Role:** You are a TTRPG writer drafting an interactive and dynamic wilderness travel system for Dungeons & Dragons 5e. Your task is to create detailed encounter tables, locations, and scene generation methods. Be diligent in generating specific, granular details for every encounter, location, and event, ensuring a rich experience.

... (see source file for full content)
```

---

Output format (MythosForge `Biome` template):

Produce JSON with `name`, `description`, `landmarks`, `inhabitants`.

```json
{
  "name": "",
  "description": "",
  "landmarks": [],
  "inhabitants": []
}
```

Instructions: Use the skeleton to produce a rich biome description and then output the JSON object.
