# Schema Mapping Methods

This is the normalization rulebook for `docs/schema-templates/`.
Use it to turn source forms into canonical category templates, runtime schemas, and UI-ready defaults.

## Source Priority

1. Mechanical Sycophant Zod form contracts
2. Narrative Scripts type definitions
3. Curated defaults

## Normalization Rules

- Field normalization: map common name variants to a canonical key
  - Example: `campaignTitle|adventureName|dungeonName` -> `title`
  - Example: `npcName|name` -> `name`
- Type mapping: `z.string()` -> `string`, `z.number()` -> `number`, `z.boolean()` -> `boolean`, `z.array(...)` -> `array`, `z.record(...)` -> `object`
- Optional detection: `.optional()` -> optional field
- Defaults: use schema defaults if present, else set permissive defaults (`""`, `[]`, `0`, `false`)

## Canonical Workflow

1. Define whether the template is a single entity schema or a workflow bundle in the schema-template docs.
2. Add or update the Zod schema in `src/lib/validation/schemas-entities.ts`.
3. Register the schema in `src/lib/validation.ts` under `CATEGORY_SCHEMAS`.
4. Add the normalized template object to `src/lib/types/templates.ts` under `CATEGORY_TEMPLATES`.
5. Wire the category into the template editor and manager UI.
6. Verify the form validation behavior in the browser and desktop UI.

## Recommended Steps To Apply A Template

- [ ] Add or update the runtime Zod schema in `src/lib/validation/schemas-entities.ts`
  Acceptance: the schema accepts the documented fields and rejects invalid types.
- [ ] Decide whether the template is a single entity schema or a workflow bundle
  Acceptance: the docs state whether the contract is a flat payload or a multi-shape bundle.
- [ ] Register the schema in `src/lib/validation.ts`
  Acceptance: the category key resolves to the intended runtime schema.
- [ ] Add the normalized template object to `src/lib/types/templates.ts`
  Acceptance: the UI initializes with the same defaults described in the docs.
- [ ] Update the template editor and manager if the visible field set changes
  Acceptance: the UI exposes the same category fields that the docs describe.
- [ ] Add or update tests for schema validation and template resolution
  Acceptance: the category contract is covered by an automated test.

## Normalization Example

NPC canonical snippet, merged from Quick_NPC, NPC_Description_v1, and npc_creator_bot:

```ts
export const npcSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  race: z.string().optional(),
  class: z.string().optional(),
  level: z.number().optional(),
  occupation: z.string().optional(),
  personalityTraits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  goals: z.string().optional(),
  backstory: z.string().optional(),
  physicalDescription: z.string().optional(),
  portraitPrompt: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).passthrough();
```

Keep schemas permissive (`.passthrough()`) during migration to avoid breaking older data.

The runtime template manager in the app only covers custom category definitions in the store. It does not author these folder files directly, so keep the file-based workflow and the UI workflow in sync but separate.

Workflow bundles should document each nested payload, stage contract, and companion sample separately even when they share one UUID container.
