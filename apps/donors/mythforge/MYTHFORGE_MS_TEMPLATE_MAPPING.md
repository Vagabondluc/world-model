# MythosForge — Mechanical Sycophant Forms → Template Mapping

Purpose
- Provide a concise, actionable mapping guide for applying Mechanical Sycophant form contracts (Zod schemas) as templates and schema entries in the MythosForge application.

Goals
- Create template defaults compatible with `CATEGORY_TEMPLATES`.
- Align or add Zod validators to `CATEGORY_SCHEMAS` where appropriate.
- Provide implementation steps and examples for common slugs.

Mapping principles
- Target category: prefer an existing MythosForge category (e.g., `NPC`, `Campaign`, `Item`) when semantics match. If no good match exists, create a slug-named template (e.g., `Quick NPC` or `5_node_mystery`).
- Field types: map Zod primitives to template defaults:
  - `z.string()` → `""` (empty string) or a short example
  - `z.number()` → `0` (or `min` if present)
  - `z.boolean()` → `false`
  - `z.array(...)` → `[]`
  - `z.record(...)` → `{}`
  - `z.unknown()` / `z.any()` → `{}` or `[]` depending on context
- Optional vs required: include all top-level fields in templates; for optional fields set practical defaults so UI editors show controls consistently.
- Arrays & nested objects: templates should supply empty containers ([], {}) as defaults; detailed sub-shape mapping can be added later.

Schema vs template
- Templates (`CATEGORY_TEMPLATES`) are default data used by the UI when creating entities. They should be permissive and friendly to editors.
- Zod schemas in MythosForge (`CATEGORY_SCHEMAS`) are authoritative validators for runtime checks; where possible reuse or mirror Mechanical Sycophant Zod contracts to validate incoming data.

Implementation steps
1. Pick a slug and decide the Mythos target name (either reuse existing category name or use the slug as the template name).
2. Add template defaults to `src/lib/types/templates.ts` under `CATEGORY_TEMPLATES`. Use the field mapping rules above.
3. If runtime validation is required, copy or convert the mechanical-sycophant Zod schema into `src/lib/validation/schemas-entities.ts` (or `schemas-geo.ts`), export it and add it to `CATEGORY_SCHEMAS` in `src/lib/validation.ts` using the same human-facing category name.
4. Add UI metadata: update `CATEGORY_GROUPS` and `CATEGORY_ICONS` in `src/lib/types/templates.ts` to place the new template in the explorer.
5. Add tests: call `validateEntityAttributes(name, templateDefault)` to ensure templates validate (or update schema if more permissive behavior is needed).
6. Optionally automate: build a small script to read `mechanical-sycophant/src/contracts/forms/*.schema.ts` and emit template entries into `templates.ts` (or a JSON file you can import).

Notes & caveats
- Many mechanical-sycophant contracts use `z.unknown()` or `z.record(...)` for nested data. Templates for those fields should use `{}` or `[]` as defaults; decide later whether to expand nested schemas.
- The MythosForge schemas currently use `.passthrough()` for forward compatibility — templates can include extra keys safely. If you need strict validation, remove `.passthrough()` or create `.strict()` variants.
- Calendar example: `mechanical-sycophant` forms and MythosForge `calendarSchema` have different shapes — choose whether to normalize the template (preferred) or adjust the validator to accept the form shape.

Example mappings

- Quick_NPC → `Quick NPC` template (recommended to map to existing `NPC` or keep as separate):

```json
{
  "name": "",
  "role": "",
  "tone": "",
  "tags": [],
  "seed": "",
  "useTablePicker": false,
  "aiContext": ""
}
```

- Campaign Prep (map to `Campaign` category; preserve MythosForge campaign defaults and extend):

```json
{
  "current_date": "Day 1",
  "session_number": 1,
  "player_count": 4,
  "completion_percentage": 0,
  "campaignTitle": "",
  "flavor": "",
  "tier": "",
  "duration": ""
}
```

- Character Profile → map to `Character` or `NPC` depending on usage:

```json
{
  "characterName": "",
  "archetype": "",
  "mbti": "",
  "enneagram": "",
  "happiness": "",
  "fear": "",
  "love": "",
  "arcStage": "",
  "arcBeats": []
}
```

Quick checklist for adding one slug
- Add template default to `CATEGORY_TEMPLATES`.
- If needed, create Zod schema file in `src/lib/validation/` and add to `CATEGORY_SCHEMAS`.
- Add icon & group entry in `CATEGORY_ICONS` and `CATEGORY_GROUPS`.
- Add a unit test invoking `validateEntityAttributes(slugName, templateDefault)`.

Suggested automation (optional)
- A small Node script can parse each `*.schema.ts` in `mechanical-sycophant/src/contracts/forms/`, extract top-level keys and Zod primitive hints, and emit a JSON file that can be merged into `templates.ts` automatically. This reduces manual typing for 37 slugs.

Where the files live (for reference)
- Mechanical Sycophant contracts: `mechanical-sycophant/src/contracts/forms/*.schema.ts`
- MythosForge templates: `src/lib/types/templates.ts`
- MythosForge validation: `src/lib/validation/` (schemas-geo.ts, schemas-entities.ts, validation.ts)

Next actions I can take
- Generate template entries automatically from contracts and open a PR-ready patch.
- Add one or two canonical mappings as examples directly into `CATEGORY_TEMPLATES`.
- Create a small extraction script to produce JSON templates from the Zod contracts.

Comprehensive NPC template — one canonical mapping
-------------------------------------------------
Purpose
- Provide a single, exhaustive `NPC` template that subsumes the several NPC-related Mechanical Sycophant slugs (`npc_creator_bot`, `character_profile`, `NPC_Description_v1`, `Quick_NPC`) so MythosForge has one canonical, editor-friendly template.

Strategy
- Merge fields from the MS contracts into one normalized shape. Use permissive defaults (empty strings, arrays, or sensible numbers) so editors render fields immediately and validation remains predictable.
- Keep names aligned with existing MythosForge `NPC` usage where possible (`hp`, `ac`, `level`, `wealth_gold`, `disposition`). Add other descriptive fields commonly found in MS forms (`backstory`, `personalityTraits`, `portraitPrompt`, etc.).

Field reference (name: type — default — source(s) — UI control — validation)
- `name` / `npcName`: string — "" — `Quick_NPC`, `NpcDescriptionV1`, `CharacterProfile` — Text input — max 100
- `role`: string — "" — `Quick_NPC`, `npc_creator_bot` — Text input / select
- `archetype`: string — "" — `character_profile` — Text input
- `race`: string — "" — `npc_creator_bot`, `NpcDescriptionV1` — Text input
- `class`: string — "" — `npc_creator_bot` — Text input
- `occupation`: string — "" — `npc_creator_bot` — Text input
- `tone`: string — "" — `Quick_NPC` — Text input
- `mbti`: string — "" — `character_profile` — Text input (short)
- `enneagram`: string — "" — `character_profile` — Text input (short)
- `hp`: number — 10 — `NPC`/`npc_creator_bot` — Number input — min 0
- `ac`: number — 10 — `NPC`/`npc_creator_bot` — Number input — min 0
- `level`: number — 1 — `NPC`/`npc_creator_bot` — Number input — min 1
- `age`: number — 25 — `NpcDescriptionV1` — Number input
- `wealth_gold`: number — 0 — `NPC` — Number input
- `disposition`: string — "Neutral" — `NPC` — Select
- `personalityTraits`: string — "" — `npc_creator_bot` — Textarea
- `ideals`: string — "" — `npc_creator_bot` — Textarea
- `bonds`: string — "" — `npc_creator_bot` — Textarea
- `flaws`: string — "" — `npc_creator_bot` — Textarea
- `goals`: string — "" — `npc_creator_bot` — Textarea
- `backstory`: string — "" — `npc_creator_bot` — Textarea (long)
- `physicalDescription`: string — "" — `npc_creator_bot` — Textarea
- `distinguishingMarks`: string — "" — `NpcDescriptionV1` — Textarea
- `clothing`: string — "" — `NpcDescriptionV1` — Textarea
- `mannerisms`: string — "" — `NpcDescriptionV1` — Textarea
- `portraitPrompt`: string — "" — `NpcDescriptionV1` — Textarea (image prompt)
- `voice`: string — "" — `npc_creator_bot` — Text input
- `tags`: string[] — [] — `Quick_NPC` — Tag input
- `categories`: string[] — [] — `npc_creator_bot` — Tag input / select
- `seed`: string — "" — `Quick_NPC` — Hidden / seed input
- `useTablePicker`: boolean — false — `Quick_NPC` — Toggle
- `aiContext`: string — "" — `Quick_NPC` — Textarea
- `arcStage`: string — "" — `character_profile` — Select
- `arcBeats`: string[] — [] — `character_profile` — Array editor
- `happiness`, `fear`, `love`: string — "" — `character_profile` — Textareas for emotional hooks

Example template JSON (matches `CATEGORY_TEMPLATES['NPC']` added to MythosForge)
```json
{
  "name": "",
  "npcName": "",
  "role": "",
  "archetype": "",
  "race": "",
  "class": "",
  "occupation": "",
  "tone": "",
  "mbti": "",
  "enneagram": "",
  "hp": 10,
  "ac": 10,
  "level": 1,
  "age": 25,
  "wealth_gold": 0,
  "disposition": "Neutral",
  "personalityTraits": "",
  "ideals": "",
  "bonds": "",
  "flaws": "",
  "goals": "",
  "backstory": "",
  "physicalDescription": "",
  "distinguishingMarks": "",
  "clothing": "",
  "mannerisms": "",
  "portraitPrompt": "",
  "voice": "",
  "tags": [],
  "categories": [],
  "seed": "",
  "useTablePicker": false,
  "aiContext": "",
  "arcStage": "",
  "arcBeats": [],
  "happiness": "",
  "fear": "",
  "love": ""
}
```

Suggested Zod schema snippet (add to `src/lib/validation/schemas-entities.ts`)
```ts
import { z } from 'zod';
import { num, str, strArr, bool } from './schemas-geo';

export const npcSchema = z.object({
  npcName: z.string().max(100).optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  archetype: z.string().optional(),
  race: z.string().optional(),
  class: z.string().optional(),
  occupation: z.string().optional(),
  tone: z.string().optional(),
  mbti: z.string().optional(),
  enneagram: z.string().optional(),
  hp: num(10),
  ac: num(10),
  level: num(1),
  age: num(25),
  wealth_gold: num(0),
  disposition: str('Neutral'),
  personalityTraits: str(''),
  ideals: str(''),
  bonds: str(''),
  flaws: str(''),
  goals: str(''),
  backstory: str(''),
  physicalDescription: str(''),
  distinguishingMarks: str(''),
  clothing: str(''),
  mannerisms: str(''),
  portraitPrompt: str(''),
  voice: str(''),
  tags: strArr([]),
  categories: strArr([]),
  seed: str(''),
  useTablePicker: bool(false),
  aiContext: str(''),
  arcStage: str(''),
  arcBeats: strArr([]),
  happiness: str(''),
  fear: str(''),
  love: str('')
}).passthrough();
```

Validation & tests
- Add the `npcSchema` to `CATEGORY_SCHEMAS` in `src/lib/validation.ts` under the `NPC` key.
- Add a unit test that calls `validateEntityAttributes('NPC', CATEGORY_TEMPLATES['NPC'])` and asserts success. This ensures the template is valid at runtime.

UI mapping notes
- Numeric fields: `hp`, `ac`, `level`, `age`, `wealth_gold` → numeric inputs with min values.
- Arrays: `tags`, `categories`, `arcBeats` → TagInput or repeatable list controls.
- Long text: `backstory`, `personalityTraits`, `physicalDescription`, `portraitPrompt` → multi-line textarea.
- Toggles: `useTablePicker` → boolean switch.

Applying the change
1. `CATEGORY_TEMPLATES['NPC']` already updated to the comprehensive shape in `src/lib/types/templates.ts`.
2. If you want strict validation, add `npcSchema` to `schemas-entities.ts` and register in `validation.ts`.
3. Add a unit test under `src/lib/__tests__` to validate the template against the registered schema.

If you want, I can add the `npcSchema` and the unit test now and run tests locally.
