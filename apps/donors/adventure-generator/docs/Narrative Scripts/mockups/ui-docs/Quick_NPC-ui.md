# Quick_NPC UI Explanation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Overview
- Purpose: Fast NPC generation with two modes: AI-assisted and procedural (seed/table-based). Outputs save as `cards` collection objects.
- Environment: React + Tailwind. Components should be modular (Form, AIContext, SeedControls, Preview, TableConfigModal).

Form Field Mapping
- `NPC Name` -> formData.npcName (string)
- `Role` -> formData.role (enum)
- `Tone` -> formData.tone (enum)
- `Tags` -> formData.tags (array[string])
- `Seed` -> generation.seed (string|number)
- `Use table picker` -> generation.tablePicker (boolean)

Behavior
- AI Fill: POST to AI service with payload {context: AIContext, seed, roleHints}. Expect JSON response with the keys the UI knows how to map. Validate and populate fields.
- Generate (procedural): deterministic RNG seeded by `seed` + optional salt. If `Use table picker` enabled, sample table entries (weighted) to fill fields.
- Conflict resolution: if both AI and procedural values exist, the most recent action wins; allow undo.

Table Config
- Load tables from resources/ (JSON/YAML). Provide UI to adjust weights and preview table outputs.

Persistence & Export
- Save to Firestore `cards` with structure matching `database_schema.md`.
- Export options: JSON (full), Markdown (handout), Foundry JSON (if mapped).

Edge Cases
- Empty seed -> use current timestamp but mark as non-deterministic
- AI returns malformed JSON -> show parse error and raw output modal
- Table insufficient entries -> fallback to AI or random fallback list

Accessibility
- All controls keyboard-accessible; labels for screen readers

Testing notes
- Unit tests: form validation, seed determinism, AI response mapping
- Integration: ensure saved `cards` have required fields

