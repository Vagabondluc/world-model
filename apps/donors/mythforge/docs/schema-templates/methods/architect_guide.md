# MythosForge Loom Method — Architect Agent Guide

This document is the canonical specification for how the **Architect Agent** defines and registers a new Loom method.
It provides a step-by-step protocol, a template for each required artifact, and naming and key conventions that all methods must follow.

---

## What is a Loom Method?

A **Loom Method** is a named, multi-stage generation pipeline that the Loom agent can execute.
Each method maps one or more source Narrative Scripts (located in `Narrative Scripts/Execution_Systems/`)
to the canonical Loom stage model, producing both human-readable text and machine-readable JSON artifacts.

**Single-step scripts** (quick generators, simple descriptors) are registered as a prompt with one stage subscription.
**Multi-step scripts** get the full treatment: spec + prompt + sample + schema + registry entry.

---

## Protocol: Full Method Treatment (5 artifacts)

For every **multi-step** Narrative Script, produce these five artifacts:

### 1. `methods/<MethodName>_method.md` — Spec

Describes the method's purpose, stages, inputs/outputs, and canonical keys. Template:

```
<MethodName> Loom Method — Spec

Overview
--------
[One paragraph: what this method generates and why it is a method (multi-step).]

Source
------
Source script: Narrative Scripts/Execution_Systems/<category>/<filename.txt>

Stages & responsibilities
-------------------------
Map each step in the source script to one canonical Loom stage:
- seed            → accept seed + high-level parameters; return normalized inputs
- table           → produce variation tables (d6/d12/d20 rows)
- matrix          → expand tables into grid matrices
- node_generation → emit raw nodes (clue, site, npc-beat, beat)
- create_entities → for nodes that imply full objects, output locations[], npcs[], scenes[], items[]
- link_nodes      → produce explicit connections[] objects {from, to, reason}
- synthesize      → combine nodes + entities into the final artifact JSON + text narrative
- finalize        → produce polished human text and final JSON

Only include stages the method actually needs.

Artifact conventions
--------------------
- Every artifact output MUST contain top-level `loom` with `stage` and `seed`.
- The method's primary output key is `<method_key>` (lowercase snake_case).
- Use short unique IDs: e.g., "R1", "N3", "L2".
- The `seed` field MUST appear both at `loom.seed` and inside the artifact root.

Integration notes
-----------------
- Register in `loom_subscriptions.yaml` with all applicable stages.
- Store the prompt skeleton in `prompts/<MethodName>_prompt.md`.
- Store a sample fixture in `samples/<method_key>/sample.json`.
- Store the JSON Schema in `schemas/<MethodName>.schema.json`.
```

---

### 2. `prompts/<MethodName>_prompt.md` — LLM Prompt Skeleton

The actual text that gets sent to the LLM for this method. Template:

```markdown
---
subscribes_to: ["stage1", "stage2", ...]
---

# <MethodName> Prompt (LLM Skeleton)

Purpose:
- [One sentence: what this prompt generates.]

Inputs:
- `seed` (string) — canonical seed.
- `<field>` (type) — [description of each input field from the source script.]

Output contract:
- Top-level `<method_key>` (object) with: [list required fields].
- Top-level `text` (string) with [human-facing output].

Stage guidance:
- `<stage>`: [what the LLM should produce in this stage.]

Prompt template:
"[The actual instruction paragraph(s) that will be sent to the LLM, using {{seed}}, {{constraints}}, etc. as placeholders.]"
```

Note: source-backed prompts may also include `id`, `source`, and `type` frontmatter when that metadata helps mirror the registry. The minimum required frontmatter is still `subscribes_to`.

---

### 3. `samples/<method_key>/sample.json` — Fixture

A canonical example output for the `synthesize` stage. Must validate against the schema. Template:

```json
{
  "loom": { "stage": "synthesize", "seed": "<method_key>-example-001" },
  "<method_key>": {
    "id": "<ID>",
    "title": "Example Title",
    "seed": "<method_key>-example-001",
    ...all required fields per schema...
  },
  "text": "Human-readable GM notes / narrative summary."
}
```

---

### 4. `schemas/<MethodName>.schema.json` — JSON Schema

Validates the synthesized artifact. Must require at minimum `id` and the primary array fields.
Template:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "<MethodName>",
  "type": "object",
  "required": ["<method_key>"],
  "properties": {
    "<method_key>": {
      "type": "object",
      "required": ["id", "<primary_field>"],
      "properties": {
        "id":    { "type": "string" },
        "title": { "type": "string" },
        "seed":  { "type": "string" },
        "<primary_field>": { "type": "array", "items": { "type": "object" } }
      }
    }
  }
}
```

---

### 5. Entry in `loom_subscriptions.yaml` — Registry

Add to the central registry:

```yaml
- id: <method_id>
  file: "<MethodName>_prompt.md"
  subscribes_to: ["stage1", "stage2", ...]
  source: "Narrative Scripts/Execution_Systems/<category>/<filename>"
  type: "multi-step"   # or "single-step"
```

---

## Protocol: Single-Step Treatment (2 artifacts)

For simple, single-pass scripts (quick generators, descriptions, table rollers), produce only:

1. `prompts/<MethodName>_prompt.md` — prompt skeleton with `subscribes_to: ["<one stage>"]`
2. Registry entry in `loom_subscriptions.yaml` with `type: "single-step"`

## Helper Prompts Without a Source Script

Some Loom prompts are canonical helpers rather than direct translations of one Narrative Script. Examples include `Table_prompt.md`, `NodeCloud_prompt.md`, `Mission_prompt.md`, `DungeonPart_prompt.md`, and `DungeonAssembly_prompt.md`.

For these helpers:

- Keep the prompt file focused on `subscribes_to` and the output contract.
- It is acceptable for the registry entry to omit `source` and `type` when there is no single source script to point at.
- If the helper emits structured JSON, still provide a schema and sample fixture so it can be validated like any other method artifact.

---

## Canonical Stage Reference

| Stage            | When to use                                                    |
|------------------|----------------------------------------------------------------|
| `seed`           | Normalise inputs, expand partial seed into parameters          |
| `table`          | Produce labelled rows of options (encounter tables, motif tables) |
| `matrix`         | Cross-product tables; produce grid arrays                      |
| `node_generation`| Emit raw node objects with `id`, `type`, `summary`, `detail`   |
| `create_entities`| Expand nodes into full entity objects (locations, NPCs, scenes)|
| `link_nodes`     | Produce `connections[]` objects `{from, to, reason}`           |
| `synthesize`     | Combine all above into the final artifact + `text` summary     |
| `finalize`       | Polished human text; optional format translation               |

---

## Canonical Key Conventions

| Field          | Rule                                                         |
|----------------|--------------------------------------------------------------|
| `id`           | Short uppercase + number: "R1", "N3", "L2"                   |
| `seed`         | Present at `loom.seed` AND artifact root                     |
| `nodes[].id`   | Prefixed: "N1", "N2"                                         |
| `locations[].id` | Prefixed: "L1", "L2"                                       |
| `npcs[].id`    | Prefixed: "P1", "P2"                                         |
| `scenes[].id`  | Prefixed: "S1", "S2"                                         |
| `connections[].from/to` | Reference other `id` fields                         |
| `text`         | Always a string at artifact root; human GM-facing narrative   |

---

## Classification System

When prospecting a new source script, classify it using this rubric:

| Class       | Criteria                                          | Treatment        |
|-------------|---------------------------------------------------|------------------|
| `generator` | One-shot table or variation roller                | single-step      |
| `descriptor`| One-shot description or summariser               | single-step      |
| `method`    | 3+ explicit steps, outputs linked entities        | full treatment   |
| `compound`  | Two paired scripts (prep + execution)             | full treatment as one method with two stages |
| `locale`    | Westmarsh/world-specific variant of a core method | Register as variant; inherits core method stages |

---

## Checklist for the Architect Agent

When creating a new Loom method, verify:

- [ ] Source script located and read in full
- [ ] Classified (generator / descriptor / method / compound / locale)
- [ ] Stages mapped to canonical Loom stages
- [ ] `_method.md` written (for full treatment)
- [ ] `_prompt.md` written with correct `subscribes_to` frontmatter
- [ ] `sample.json` fixture created (for full treatment)
- [ ] `.schema.json` created matching sample (for full treatment)
- [ ] Registry entry added to `loom_subscriptions.yaml`
- [ ] Sample validates against schema (run `node scripts/loom_dispatch_test.js`)
