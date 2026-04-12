# NPC_Description_Simple_v1.txt — Full Questionnaire & Answers

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Script purpose: Ultra-minimal physical description generator following strict template format. Creates one-paragraph physical descriptions suitable for quick encounter notes.

## 1. Primary output type
- ✅ Single paragraph text (template-filled)
- ✅ Copy/paste-ready for GM notes
- ✅ Export as plain text or card snippet

## 2. Required input fields

| Field | Type | Required | Default/Example |
|-------|------|----------|-----------------|
| `Character Name` | text | yes | user input or random |
| `Age` | number | no | 18-80 random range |
| `Gender` | select | no | M/F/NB/other/random |
| `Race` | select | no | D&D races + random |
| `Profession` | text | no | procedural |
| `Hair Length` | select | no | short/medium/long/bald |
| `Hair Texture` | select | no | straight/wavy/curly/kinky |
| `Hair Color` | select | no | color picker or dropdown |
| `Eye Color` | select | no | color picker or dropdown |
| `Skin Color/Desc` | text | no | free-form or dropdown |
| `Height (cm)` | number | no | auto-calc ft/in |
| `Height (ft/in)` | text | auto-calculated | from cm |
| `Body Type` | select | no | slim/athletic/stocky/heavy/muscular |
| `Face Shape` | select | no | round/oval/square/heart/angular |
| `Face Additional Desc` | text | no | scars, tattoos, etc |
| `Notable Behaviors` | text | no | quirks, mannerisms |
| `Seed` | text/number | no | deterministic generation |

## 3. AI Mode specifics
- AI context: "Generate a physical description for an NPC following this template..."
- AI fills all template fields
- Expected JSON keys match field names above

## 4. Procedural Mode specifics
- Seed-based RNG
- Tables: `races`, `professions`, `hair_lengths`, `hair_textures`, `hair_colors`, `eye_colors`, `skin_tones`, `body_types`, `face_shapes`, `notable_behaviors`
- Height: randomize within race-appropriate range
- All dropdowns sample from weighted tables

## 5. Controls & UI elements
- [Generate (procedural)], [AI Fill], [Clear], [Copy Text], [Save as Snippet]
- Live preview shows formatted paragraph
- Template preview toggle (show/hide field markers)

## 6. Validation & Constraints
- Name: 2-50 chars
- Age: 1-999 (warning if > 200 for non-elf races)
- Height: 50-300 cm (auto-validates for race)

## 7. State & Persistence
- Can save as snippet in `cards` collection (type: "NPCSnippet")
- No full card save (this is a description generator, not full NPC)

## 8. Accessibility & Responsiveness
- Simple form, single column layout
- Mobile-friendly

## 9. Notes & Edge Cases
- Template strictly followed: "(Name) is a (Age) year old (Gender) (Race) (Profession). They have (Length), (Texture), (Color) hair and (Color) eyes..."
- If field blank, procedural fills it
- AI must return exact template structure

## 10. Acceptance Criteria
- Same seed produces identical description
- Output exactly matches template format
- Copy button functional
