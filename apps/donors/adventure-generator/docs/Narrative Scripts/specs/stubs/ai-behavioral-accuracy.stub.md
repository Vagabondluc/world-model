# Spec stub — ai_behavioral_accuracy

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode the accuracy-first policy block that precedes user input so answers include context, reasoning, and precise responses.

API / Inputs
- AccuracyPolicyRequest {
  userId: string,
  conversationContext: string[],
  allowCode?: boolean,
  verbosity?: "concise" | "detailed"
}

Outputs
- AccuracyPolicyResponse {
  promptBlock: string,
  metadata: { issuedAt: string; applicableFeatures: string[] }
}

Types
- `interface AccuracyPolicyRequest { userId: string; conversationContext: string[]; allowCode?: boolean; verbosity?: string }`
- `interface AccuracyPolicyResponse { promptBlock: string; metadata: { issuedAt: string; applicableFeatures: string[] } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Attach policy text before the user message to enforce answer style.
- Respect flags: suppress reminders about limitations, reduce code vertical space, omit comments/docstrings.
- Emit `promptBlock` for reuse by response formatter.

Edge cases
- allowCode=false but user asks for code → `{ error: "Code disallowed", code: 403, details: ["allowCode"] }`.
- Unknown verbosity → default to "concise" and flag in metadata.
- Formatter fails to remove comments → include issue flag for manual review.

Mapping to UI
- Prompt manager bundles `promptBlock` + conversation context before LLM call.
- Inspector dashboard surfaces metadata to confirm policy application.

Non-functional requirements
- Latency: policy injection completes within 200 ms.
- Streaming: single-shot policy text; no chunking.
- Accessibility: policy text readable; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode and localized feature labels.

Test cases
- Standard ask returns `promptBlock` containing accuracy instructions.
- Disallowed code scenario triggers ApiError 403.
- Unknown verbosity fallback populates metadata with "verbosity-default".

Priority
- High