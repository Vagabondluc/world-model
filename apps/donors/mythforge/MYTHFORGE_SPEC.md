# MythosForge — Schema & Template Specification

Purpose
- Capture the schema and template design used in MythosForge so other projects can adopt, validate, and extend the model.

Scope
- Covers the Zod validation schemas, template defaults, and registry used by MythosForge.

Key files
- Schema builders and geo schemas: src/lib/validation/schemas-geo.ts
- Entity schemas: src/lib/validation/schemas-entities.ts
- Schema registry & validation: src/lib/validation.ts
- Template constants: src/lib/types/templates.ts

Design overview
- Primitive builders: `num`, `str`, `bool`, `strArr`, `numArr` (in `schemas-geo.ts`) return Zod types with sensible defaults and `.optional().default(...)` semantics.
- Schemas are defined using Zod objects and end with `.passthrough()` — unknown attributes are preserved rather than rejected.
- `CATEGORY_SCHEMAS` (in `validation.ts`) maps a human category name to a Zod schema used to validate JSON attribute blobs for entities.
- `CATEGORY_TEMPLATES` (in `templates.ts`) contains default JSON attribute objects for each category. These defaults are used when creating new entities and as examples of expected fields.

Validation flow
1. Lookup schema: `const schema = CATEGORY_SCHEMAS[category]`
2. If schema exists, call `schema.safeParse(attributes)`.
3. On success return the parsed data; on failure collect and return flattened validation errors.

Example (TypeScript)
```ts
import { validateEntityAttributes } from '@/lib/validation';

const res = validateEntityAttributes('NPC', { hp: 12, ac: 14 });
if (!res.success) console.error(res.errors);
else console.log('Validated:', res.data);
```

Template vs Schema notes
- Templates (`CATEGORY_TEMPLATES`) are the default attribute sets used by the UI and store.
- Schemas (Zod) are the authoritative validators used at runtime.
- There are small mismatches (example: `Calendar` template shape differs from `calendarSchema`) — align templates with schemas or adapt validators accordingly.

How to extend or add a new category
1. Add a Zod schema for the new category in `src/lib/validation/schemas-entities.ts` (or `schemas-geo.ts` if geographic).
2. Export your schema and add it to `CATEGORY_SCHEMAS` in `src/lib/validation.ts` using the human-facing category name.
3. Add a default entry for that category in `CATEGORY_TEMPLATES` in `src/lib/types/templates.ts`.
4. Add the category to `CATEGORY_GROUPS` and `CATEGORY_ICONS` for the explorer UI if applicable.
5. Add unit tests that exercise `validateEntityAttributes(category, attributes)` and the template defaults.

Testing & tooling
- Zod is used for validation; unit tests live under `src/lib/__tests__`.
- The project depends on `@standard-schema/*` helpers visible in `bun.lock` — these can be helpful when generating or validating schema docs.

Compatibility & migration notes
- Schemas use `.passthrough()` for forward compatibility.
- If you require strict validation, remove `.passthrough()` or create a `.strict()` variant for the registry.

Appendix: quick pointers
- Validate: `src/lib/validation.ts` — `validateEntityAttributes`.
- Templates & defaults: `src/lib/types/templates.ts`.
