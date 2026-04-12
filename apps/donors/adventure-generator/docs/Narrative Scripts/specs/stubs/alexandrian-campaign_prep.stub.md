# Spec stub — alexandrian_campaign_prep

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Generate a full campaign prep document from structured inputs or free-text prompts.

API / Inputs
- CampaignRequest {
  title: string,
  tone: "dark" | "high" | "low" | "grimdark" | string,
  length: string,
  levelRange: string,
  themes: string[],
  seeds?: string[]
}

Outputs
- CampaignDocument { markdown: string, sections: string[] }

Types
- `interface CampaignRequest { title: string; tone: string; length: string; levelRange: string; themes: string[]; seeds?: string[]; tier?: string }`
- `interface CampaignDocument { markdown: string; sections: string[]; wordCount: number; generatedAt: string }`
- `interface ApiError { error: string; code: number; fields?: string[] }`
- `interface StreamingChunk { chunk: string; done: boolean }`

Behaviour
- Confirm inputs are present and in expected shape (tone, themes, lengths).
- Generate sectioned markdown following the campaign_prep template and record tokens consumed.
- Support streaming output (chunked Markdown) for preview panes.
- Allow tone/themes substitutions, fallback defaults, and optional section toggles.

Edge cases
- Empty or malformed inputs → return `{ error: "Invalid request", code: 400, fields: ["levelRange"] }`.
- Large seeds causing token overflow → trim seeds and tag warning metadata.
- Missing required sections → flag in response and highlight needed fields.

Mapping to UI
- Multi-step builder: form inputs → instant preview → final output → export controls.
- Button triggers API call; preview view renders streaming chunks until completion.

Non-functional requirements
- Latency: respond within 3s for small requests; streaming chunks emitted every 500ms.
- Streaming: support `StreamingChunk` events for preview rendering.
- Accessibility: forms must include labels/hints, preview pane should be screen-reader friendly.
- i18n: all text inputs support Unicode; generated markdown can be localized via `tone` + `themes`.

Test cases
- Valid ask returns ordered sections plus wordCount metadata.
- Invalid levelRange returns ApiError with `code: 400`.
- Streaming preview yields `StreamingChunk` records that accumulate to final markdown.

Priority
- High