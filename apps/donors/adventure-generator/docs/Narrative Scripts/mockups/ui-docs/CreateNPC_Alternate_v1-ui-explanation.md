# CreateNPC_Alternate_v1 — UI Explanation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Overview
Comprehensive NPC generator covering 14 data points including race, personality, alignment, profession, secrets, quest hooks, and famous-character comparisons. Supports AI-assisted and seed-based procedural generation.

## Environment
React + Tailwind. Components: `NPCForm`, `AIContextPanel`, `SeedControls`, `PreviewPane`, `TableConfigModal`, `HistoryDropdown`.

## Form Field Mapping
- `NPC Name` → formData.name (string)
- `Race` → formData.race (enum or custom)
- `Gender` → formData.gender (enum)
- `Sexual Preference` → formData.sexualPreference (string, optional)
- `Alignment` → formData.alignment (enum, 9 D&D values)
- `Job` → formData.job (string)
- `Personality` → formData.personality (array[string], max 5)
- `Physical Descriptor` → formData.physicalDescriptor (string)
- `Speech Example` → formData.speechExample (string)
- `Skills/Abilities` → formData.skills (string or array)
- `Secret` → formData.secret (string)
- `Quest Hook` → formData.questHook (string)
- `Carried Items` → formData.carriedItems (string)
- `Famous Comparison` → formData.famousComparison (string)
- `Seed` → generation.seed (string|number)
- `Use table picker` → generation.useTablePicker (boolean)

## Behavior
### AI Fill
POST to AI endpoint:
```json
{
  "context": "<AI context textarea>",
  "seed": "<seed>",
  "fields": ["name", "race", "gender", "alignment", "job", "personality", "physicalDescriptor", "speechExample", "skills", "secret", "questHook", "carriedItems", "famousComparison"]
}
```
Parse response JSON and populate all 14 fields. Validate alignment against 9 valid values.

### Generate (Procedural)
- Initialize RNG with seed
- Sample tables: races, alignments, jobs, personality_traits (select 5), secrets, quest_hooks, famous_comparisons
- Skills auto-inferred from job (e.g., "Cartographer" → navigation, cartography)
- Physical descriptor assembled from physical_trait templates
- Speech example from speech_pattern templates

### Conflict Resolution
Most recent action wins. Undo stack holds previous state.

## Table Config
Modal lists all procedural tables with editable weights. Users can import/export custom table JSON.

## Persistence & Export
- Save to Firestore `cards` collection: `type: "NPC"`, `formData` contains all 14 fields, `createdAt`, `updatedAt`
- Export: JSON (full), Markdown (formatted profile), plain text (copy/paste)

## Edge Cases
- Empty seed → timestamp-based (non-deterministic flag)
- AI returns malformed JSON → show error modal with raw response
- Table missing entries → fallback to AI or show warning

## Accessibility
- All controls keyboard-accessible
- Labels + aria-labels for screen readers
- Error messages announced via aria-live

## Testing
- Unit: form validation, RNG determinism, AI response mapping
- Integration: Firestore save/load, export functionality
- E2E: full AI Fill → Save → Export cycle
