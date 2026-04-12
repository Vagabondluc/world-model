# NPC_Description_v1 — UI Explanation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Overview
Generates detailed roleplay-ready NPCs with markdown table output, backstory (100-500 words), and 4-section personality breakdown. Optimized for quick GM reference during gameplay.

## Environment
React + Tailwind. Components: `NPCDescForm`, `MarkdownPreview`, `BackstoryEditor`, `PersonalityPanel`, `ExportControls`.

## Form Field Mapping
Markdown table fields → formData:
- `cardValue` → formData.cardValue (string, optional)
- `name` → formData.name (string)
- `race` → formData.race (enum)
- `role` → formData.role (string)
- `appearance` → formData.appearance (string)
- `alignment` → formData.alignment (enum)
- `motivations` → formData.motivations (string, one-line)
- `personality` → formData.personality (string, one-line)
- `flaws` → formData.flaws (string, one-line)
- `catchphrase` → formData.catchphrase (string)
- `mannerisms` → formData.mannerisms (string)
- `speech` → formData.speech (string)
- `availableKnowledge` → formData.availableKnowledge (string)
- `hiddenKnowledge` → formData.hiddenKnowledge (string)
- `bonds` → formData.bonds (string)
- `roleplayingCues` → formData.roleplayingCues (string)

Extended fields:
- `backstory` → formData.backstory (string, 100-500 words)
- `personalityMotivations` → formData.personalityMotivations (string)
- `personalityMorals` → formData.personalityMorals (string)
- `personalityDescription` → formData.personalityDescription (string)
- `personalityFlawsDetailed` → formData.personalityFlawsDetailed (string)

Generation controls:
- `tone` → generation.tone (enum: gritty/whimsical/heroic)
- `length` → generation.length (enum: short/medium/long, affects backstory word count)
- `unexpectedElement` → generation.unexpectedElement (boolean)
- `seed` → generation.seed (string|number)

## Behavior
### AI Fill
POST to AI endpoint:
```json
{
  "context": "<AI context>",
  "tone": "<tone>",
  "length": "<length>",
  "unexpectedElement": true/false,
  "seed": "<seed>"
}
```
AI returns markdown table + backstory + personality sections. Parse markdown, extract table rows → populate form fields. Parse backstory and personality sections → populate extended fields.

### Generate (Procedural)
- RNG seed → sample tables for all table fields
- Backstory: stitch procedural templates (short: 100-150 words, medium: 200-350 words, long: 400-500 words)
- Personality sections: fill from trait/motivation/flaw/moral tables
- If `unexpectedElement` enabled, inject random quirk from `unexpected_traits` table

### Markdown Rendering
Preview pane uses `react-markdown` to render table + backstory + personality. Toggle between rendered and raw markdown view.

## Word Count Enforcement
Backstory enforces word limits based on `length` setting:
- Short: 100-150 words
- Medium: 200-350 words
- Long: 400-500 words

Display live word count in footer.

## Persistence & Export
- Save to Firestore `cards`: `type: "NPC"`, `formData` contains all table + extended fields
- Export Markdown: include frontmatter with metadata (seed, createdAt, version)
- Export JSON: full formData object

## Edge Cases
- AI returns non-markdown or malformed table → parse error modal, allow manual edit
- Word count exceeded → warning (soft limit, allow override)
- Missing backstory → generate minimal placeholder

## Accessibility
- Markdown table uses semantic `<table>` with proper headers
- Screen reader announces backstory and personality sections separately
- Keyboard navigation for all controls

## Testing
- Unit: markdown parsing, word count enforcement, table extraction
- Integration: AI response parsing, Firestore save/load
- E2E: Generate → Edit → Save → Export cycle
