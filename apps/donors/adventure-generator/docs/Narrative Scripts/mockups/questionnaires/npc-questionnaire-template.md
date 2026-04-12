# NPC UI Questionnaire Template

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose: Determine UI fields and behaviors for NPC generation scripts.

1. Script name and description
   - Script file: (e.g., `Quick_NPC.txt`)
   - Short description of purpose:

2. Primary output type
   - [ ] Short description (1-3 paragraphs)
   - [ ] Full statblock (structured fields)
   - [ ] Roleplay dialog/scene
   - [ ] JSON/DB-friendly object

3. Required input fields (list each field and type)
   - Field name: (e.g., `NPC Name`)
   - Type: text / textarea / select / tags / number / boolean / table-picker
   - Required: yes/no
   - Default value/example:

4. AI Mode specifics
   - Should AI be able to fill partial data? yes/no
   - AI context textarea (placeholder content):
   - AI model behavioral hints (system prompt):

5. Procedural Mode specifics
   - Seed input: numeric / string
   - Use table-based picker? yes/no
   - Table sources (file paths or JSON keys):
   - Weights / probabilities required? yes/no

6. Controls & UI elements
   - Generate (procedural) button
   - AI Fill button
   - Clear/Reset
   - Save as Template
   - Export (JSON/Markdown/Foundry)
   - Preview pane

7. Validation & Constraints
   - Field length limits
   - Allowed characters
   - Number ranges

8. State & Persistence
   - Save to `cards` collection? yes/no
   - Versioning required? yes/no
   - Template storage: global/user

9. Accessibility & Responsiveness
   - Keyboard shortcuts
   - Mobile-friendly layout constraints

10. Notes & Edge Cases
   - Interaction between AI and procedural (which wins on conflict)
   - Partial-run behaviors

11. Acceptance Criteria (what signals 'done')
   - Form fields map to `formData` fields
   - AI and Procedural both produce deterministic outputs with a seed
   - Preview updates live after generation

