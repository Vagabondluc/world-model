# SPEC: Zod Schema Validation

**Version:** 0.2.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

## 1. Overview
Adoption of Zod for runtime type safety, particularly for AI outputs and complex form data.

## 2. Goals
- Eliminate `any` types in API responses.
- Provide graceful fallback defaults when AI returns partial data.
- Single source of truth for TypeScript types (inferred from Zod).

## 3. Implementation Details
- **Location**: `/schemas/`
- **Naming Convention**: `[Entity]Schema` (e.g., `LocationSchema`, `NpcSchema`).
- **AI Helper**: Create `utils/zodHelpers.ts` to convert Zod to standard JSON schema for `responseSchema` in Gemini API calls.

## 4. Migration Steps
1. Define `SimpleAdventureSchema` (replaces manual validation in `validators.ts`).
2. Define `AdventureOutlineSchema` (Scenes, Locations, NPCs, Factions).
3. Update `aiService.ts` to accept Zod schemas instead of raw JSON schemas.

## Addendum: Multi-Step Pipeline Integration

- Add validation gates at pipeline boundaries: pre-gen, post-gen, and post-stitch.
- Add link integrity checks using the Link Registry and RedirectMap contracts in `docs/specs/persistence.md`.
- Validation results must be surfaced to the pipeline progress UI.
