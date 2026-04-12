# QuickNPC_Creation_v1 — UI Explanation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Overview
Quick-reference NPC generator producing markdown table with 9 one-sentence categories plus brief 2-4 sentence description. Includes mandatory unexpected detail for memorable NPCs.

## Environment
React + Tailwind. Components: `QuickNPCForm`, `MarkdownTablePreview`, `UnexpectedDetailGenerator`.

## Form Field Mapping
Input fields → generated output:
- `npcName` → Identity row (if blank, procedural generates)
- `race` → Identity row
- `role` → Identity row
- `seed` → generation.seed
- `includeUnexpectedDetail` → generation.unexpectedDetail (default: true)

Table categories (all auto-generated):
- `identity` → "Name, Race, Role" (one sentence)
- `look` → appearance description (one sentence)
- `goal` → motivation (one sentence)
- `traits` → personality (one sentence)
- `habits` → mannerisms (one sentence)
- `speech` → speech pattern (one sentence)
- `knowledge` → shared/secret knowledge (one sentence)
- `bonds` → relationships (one sentence)
- `cues` → roleplay cues (one sentence)

Extended output:
- `briefDescription` → 2-4 sentence narrative
- `unexpectedDetail` → quirky trait

## Markdown Table Format
```markdown
| Category   | Details                                     |
|------------|--------------------------------------------|
| Identity   | [NPC Name, Race, Role]                      |
| Look       | [One-sentence NPC Appearance]                |
| Goal       | [One-sentence NPC Motivation]                |
| Traits     | [One-sentence NPC Personality]               |
| Habits     | [One-sentence NPC Mannerisms]                |
| Speech     | [One-sentence NPC Speech]                    |
| Knowledge  | [One-sentence NPC Shared/Secret Knowledge]   |
| Bonds      | [One-sentence NPC Relationships]             |
| Cues       | [One-sentence Roleplay Cues]                 |
```

## Behavior
### One-Sentence Enforcement
Each table cell must be exactly one sentence (max 20 words). If AI returns multi-sentence, truncate to first sentence. Display word count per row during edit.

### Unexpected Detail Generation
Mandatory element. Procedural mode samples from `unexpected_details` table. AI mode instructed to include creative quirk. Detail integrated into description paragraph.

### AI Fill
POST to AI:
```json
{
  "mode": "quick_npc",
  "name": "<name or blank>",
  "race": "<race or random>",
  "role": "<role or random>",
  "requireUnexpectedDetail": true,
  "seed": "<seed>"
}
```
AI returns markdown table + description. Parse markdown to extract table rows, validate one-sentence rule, populate preview.

### Generate (Procedural)
- RNG seed → sample all category tables (9 tables)
- Assemble markdown table
- Generate description from templates (2-4 sentences)
- Inject unexpected detail from table

## Validation
- Table rows: 1-20 words each
- Description: 30-60 words (2-4 sentences)
- Unexpected detail: must be present

## Persistence & Export
- Save as `card`: `type: "QuickNPC"`, `formData.markdownTable` + `formData.description`
- Export markdown (with frontmatter)
- Copy markdown to clipboard

## Edge Cases
- AI exceeds one-sentence → truncate with "..." and show warning
- Missing unexpected detail → auto-generate from fallback list
- Empty table cells → show placeholder, allow manual fill

## Accessibility
- Markdown table rendered semantically
- Raw markdown toggle for copy/paste
- Screen reader announces table structure

## Testing
- Unit: one-sentence validation, markdown parsing
- Integration: RNG determinism, unexpected detail presence
- E2E: generate → validate table → export markdown
