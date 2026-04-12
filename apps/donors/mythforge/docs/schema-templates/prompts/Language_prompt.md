## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — glossaries and language notes

Use the sections below as the instruction skeleton for generating a language note (naming conventions, sample phrases, orthography). Final output must be strict JSON matching the schema below.

Language Skeleton

- Language Name and Family
- Phonetic Overview / Sounds
- Common Naming Patterns
- Sample Phrases (greeting, farewell, common terms)
- Writing System (if any)
- Formal vs Informal Registers
- Loanwords and Influence
- Useful NPC Dialogue Examples
- Notes for Pronunciation and GM

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Language` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Language` JSON schema:

```
{
  "name": string,
  "family": string | null,
  "phonemes": [string],
  "naming_patterns": [{ "element": string, "example": string }],
  "phrases": [{ "label": string, "phrase": string, "translation": string }],
  "script": string | null,
  "registers": [{ "type": string, "notes": string | null }],
  "loanwords": [string],
  "dialogue_examples": [string],
  "gm_notes": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
