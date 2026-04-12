# Make a settlement.txt — Full Questionnaire & Answers

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Script purpose: Extended settlement generator with 9 sections including everyday life and challenges/conflicts. More comprehensive than Quick_settlement with additional cultural depth.

## 1. Primary output type
- ✅ 9-section structured document
- ✅ Markdown with narrative paragraphs
- ✅ Sections: Overview, Geography, Society, Economy, Governance, Culture, Associations, Prominent Individuals, Everyday Life, Challenges
- ✅ Export as Markdown or Card

## 2. Required input fields

| Field | Type | Required | Default/Example |
|-------|------|----------|-----------------|
| `Location Type` | select | yes | village/city/fortress |
| `General Setting` | select | yes | mountain/forest/desert |
| `World Genre` | select | yes | high-fantasy/post-apocalyptic/sci-fi |
| `Priority Themes` | textarea | yes | unique elements to emphasize |
| `Settlement Name` | text | no | AI/procedural generates |
| `Size` | select | no | hamlet/village/town/city |
| `Population` | number | no | auto-suggest based on size |
| `Seed` | text/number | no | deterministic |
| `Temperature` | slider | no | 0.0-1.0 (default 0.8) |

## 3. AI Mode specifics
- Full template with style codes (AC&OT, MS&L, D&T, C&L, IN, C&S, ND)
- Priority themes emphasized across all sections
- AI fills blanks left by user (semi-guided generation)
- Sections written in specified style (narrative vs informative vs concise)

## 4. Procedural Mode specifics
- Seed-based RNG
- Tables: `locations`, `settings`, `governance`, `economies`, `cultures`, `challenges`, `everyday_customs`, `factions`
- Each section: template + table samples
- Everyday Life section: traditions, mores, common occupations from tables
- Challenges section: internal disputes, external threats from contextual tables

## 5. Controls & UI elements
- [AI Fill All], [Generate All (procedural)], [Clear], [Save to Cards], [Export Markdown]
- Section-by-section editing (users can regenerate individual sections)
- Collapsible section preview
- Inline field editing for partial customization

## 6. Validation & Constraints
- Location Type + Setting + Genre: required
- Priority Themes: required (minimum 10 chars)
- Population: 10-1,000,000

## 7. State & Persistence
- Save as `card` → `type: "Settlement"`, formData contains all 9 sections
- Partial saves (save draft even if incomplete)
- Template storage: users can save settlement blueprints

## 8. Accessibility & Responsiveness
- Semantic HTML for sections
- Keyboard navigation for section editing
- Mobile: sections stack, scrollable layout

## 9. Notes & Edge Cases
- "Fill blanks" mode: user provides some details, AI/procedural completes rest
- Everyday Life and Challenges sections differentiate this from Quick_settlement
- Style codes vary per section (narrative for culture, concise for governance)
- If user leaves priority themes blank, show warning but allow generation

## 10. Acceptance Criteria
- Same seed produces identical settlement
- All 9 sections populated
- Priority themes reflected across sections
- Export functional
- Partial customization supported (regenerate individual sections)