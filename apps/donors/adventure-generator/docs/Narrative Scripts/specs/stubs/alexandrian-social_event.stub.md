# Spec stub — alexandrian_social_event

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Source
- [`Alexandrian - Alternate Backbone/social_event.txt:1`](Alexandrian - Alternate Backbone/social_event.txt:1)

Purpose
- Generate structured social-event sequences and NPC notes from minimal inputs for use in a Scene Creator UI.

API / Inputs
- SocialEventRequest {
  title?: string,
  location?: string,
  guestCount?: number,
  keyNPCs?: { name: string; role: string; notes?: string }[],
  tone?: string,
  hooks?: string[]
}

Outputs
- SocialEvent {
  markdown: string,
  sequence: { id: string; step: string }[],
  npcNotes: { name: string; summary: string }[],
  handouts?: { path: string; description: string }[]
}

Types
- `interface SocialEventRequest { title?: string; location?: string; guestCount?: number; keyNPCs?: NPCTemplate[]; tone?: string; hooks?: string[] }`
- `interface SocialEvent { markdown: string; sequence: EventStep[]; npcNotes: NPCNote[]; handouts?: Handout[] }`
- `interface ApiError { error: string; code: number; details?: string[] }`
- `type NPCTemplate = { name: string; role: string; notes?: string }`
- `type EventStep = { id: string; step: string }`
- `type NPCNote = { name: string; summary: string }`
- `type Handout = { path: string; description: string }`

Behavior
- Confirm required metadata before generation (title/location).
- Generate opening hook, optional ordered or randomized sequence, conversation topics, and NPC notes per template.
- Offer a “grab bag” mode that randomizes or locks steps as needed.
- Export timeline + handout assets (Markdown/HTML) with metadata for downloads.

Edge cases
- guestCount <= 0 → `{ error: "Guest count must be positive", code: 422, details: ["guestCount"] }`.
- Missing NPCs → generate placeholder NPC templates with unique roles.
- Large NPC lists → paginate in API response and warn UI.
- Sequence weight imbalance → return ApiError with recommended adjustments.

Mapping to UI
- Scene editor layout: panels for Guest list, Event sequence, Conversation topics, Handouts.
- Controls: Randomize sequence with preview, Lock steps, Flag NPCs as important, Generate handout exports.
- Preview: timeline + printable handout export.

Non-functional requirements
- Latency: respond within 2s for minimal inputs; stream incremental updates for large guest lists.
- Streaming: emit sequence chunks as partial updates to the preview timeline.
- Accessibility: UI must support keyboard navigation, screen-reader-friendly labels, and contrast ratios.
- i18n: support Unicode inputs; localized tone/hook strings supplied via template library.

Tests (examples)
- Valid ask returns SocialEvent with >0 sequence steps.
- Randomize mode yields non-identical sequences on subsequent calls.
- Handout export includes NPC summary lines and metadata path.
- Invalid guestCount returns ApiError with code 422.

Priority
- Medium-High