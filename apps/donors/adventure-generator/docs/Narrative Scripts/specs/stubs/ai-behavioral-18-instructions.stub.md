# Spec stub — ai_behavioral_18_instructions

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode the 18-point behavioral policy to enforce accurate, detailed, step-by-step reasoning with stylistic constraints before LLM calls.

API / Inputs
- BehavioralPolicyRequest {
  userId: string,
  conversationContext: string[],
  allowCode?: boolean,
  verbosity?: "concise" | "detailed",
  requireNeutrality?: boolean,
  requireSummary?: boolean
}

Outputs
- BehavioralPolicyResponse {
  promptBlock: string,
  metadata: { issuedAt: string; appliedRules: string[]; tokenCount: number }
}

Types
- `interface BehavioralPolicyRequest { userId: string; conversationContext: string[]; allowCode?: boolean; verbosity?: string; requireNeutrality?: boolean; requireSummary?: boolean }`
- `interface BehavioralPolicyResponse { promptBlock: string; metadata: { issuedAt: string; appliedRules: string[]; tokenCount: number } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Compose prompt block with all 18 rules.
- Respect flags to toggle or emphasize rules (e.g., code handling, neutrality, summary).
- Include metadata listing applied rules and estimated token count.

Edge cases
- allowCode=false but user asks for code → `{ error: "Code disallowed", code: 403, details: ["allowCode"] }`.
- Unknown verbosity → default to "detailed" and flag in metadata.
- Prompt exceeds token limit → truncate optional rules and flag truncation in metadata.

Mapping to UI
- Prompt manager injects `promptBlock` before LLM call.
- Inspector dashboard shows applied rules and token count.
- Settings page toggles flags per user.

Non-functional requirements
- Latency: policy injection completes within 200 ms.
- Streaming: single-shot policy text; no chunking.
- Accessibility: policy text readable; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode and localized rule labels.

Test cases
- Standard request returns `promptBlock` containing all 18 rules.
- Disallowed code scenario triggers ApiError 403.
- Unknown verbosity fallback populates metadata with "verbosity-default".
- Token limit exceeded truncates optional rules and flags in metadata.

Priority
- High