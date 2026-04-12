# Spec stub — alexandrian_complete_megadungeon_guide

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Source
- [`Alexandrian - Alternate Backbone/complete-megadungeon-guide.md:1`](Alexandrian - Alternate Backbone/complete-megadungeon-guide.md:1)

Purpose
- Serve static guide content and provide interactive checklist/templating for megadungeon design.

API / Inputs
- GuideRequest {
  theme?: string,
  focusLevels?: number[],
  includeChecklist?: boolean,
  customizeSections?: string[]
}

Outputs
- GuideDocument {
  markdown: string,
  checklists?: { id: string, items: string[] }[],
  templates?: { name: string, data: Record<string, unknown> }[]
}

Types
- `interface GuideRequest { theme?: string; focusLevels?: number[]; includeChecklist?: boolean; customizeSections?: string[] }`
- `interface GuideDocument { markdown: string; checklists?: { id: string; items: string[] }[]; templates?: { name: string; data: Record<string, unknown> }[] }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Return full guide markdown when no options are set.
- When includeChecklist=true, emit checklist objects keyed to the guide sections.
- Customize sections via strings and perform placeholder substitution for theme/faction values.
- Provide sanitized template payloads that UI can consume (checklists → tasks, templates → generator jobs).

Edge cases
- Missing theme → respond with `{ error: "Theme missing", code: 422, details: ["theme"] }` and fall back to default content.
- Overly large customization → trim inputs and add warning metadata.
- Section filters that do not match existing headings → return ApiError with available options list.

Mapping to UI
- Read-only guide view with "Create interactive checklist" toggle.
- Task list component consumes `checklists` and allows completion state per user.
- Export options: Markdown, PDF, printable checklist.

Non-functional requirements
- Latency: serve cached markdown within 2 seconds for default requests.
- Accessibility: guide sections should have heading order and linkable anchors.
- i18n: theme/faction strings should support UTF-8 and localization tokens.
- Streaming: large checklists delivered incrementally via `templates` entry.

Tests (examples)
- Ask without params returns `GuideDocument` with `markdown` and default sections.
- includeChecklist=true returns checklist array with at least one item per major section.
- customizeSections filters output markdown to the requested headings.
- Invalid section names return ApiError listing valid headings.

Priority
- Medium