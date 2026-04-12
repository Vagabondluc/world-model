# Quick_NPC.txt — Questionnaire & Answers

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Script purpose: Rapid one-click NPC generator for encounter/handout use. Outputs a short description + minimal statblock and role tags.

1. Primary output type
   - Short description (1-2 paragraphs)
   - Compact structured statblock (HP, AC, Role)
   - JSON export for `cards` collection

2. Inputs
   - `NPC Name` (text, optional) — If blank, procedural or AI will name
   - `Role` (select: merchant/guard/villain/ally/random)
   - `Tone` (select: gritty / whimsical / mysterious / heroic)
   - `Tags` (multi-select/tags)
   - `Seed` (text or number) — deterministic seed for procedural mode
   - `Use table picker` (checkbox) — enable table-based attributes

3. AI Mode specifics
   - AI context textarea (placeholder): "Describe a 2-sentence NPC for use in a one-paragraph handout. Include hooks and one quirky trait."
   - AI should return `name`, `shortDescription`, `hook`, `traits` as JSON lines in the completion (post-processed client-side)

4. Procedural Mode specifics
   - Seed-based RNG (default behavior)
   - Tables: `roles`, `tone_phrases`, `quirks`, `hooks` (loaded from resources)
   - Weights: `roles` weighted by context if provided

5. Controls & UI
   - Buttons: [Generate (procedural)], [AI Fill], [Save Template], [Export JSON], [Copy text]
   - Live Preview (right panel)
   - History list of previous generated NPCs for the working session

6. Persistence
   - Save as `card` → `type: NPC` with `formData` fields

7. Acceptance Criteria
   - Seed with same value produces identical NPC
   - AI Fill returns a valid JSON object populating the form
   - Preview and Export functions work

