# Spec stub — ai_behavioral_new_behavior

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode a meta-instruction that, when a request cannot be fulfilled as asked, directs the AI to acknowledge the limitation, provide a reason, offer an alternative aligned with the original intent, and then execute the adapted request.

API / Inputs
- NewBehaviorRequest {
  userId: string,
  conversationContext: string[],
  userAsk: string,
  requireReason?: boolean,
  requireAlternative?: boolean
}

Outputs
- NewBehaviorResponse {
  promptBlock: string,
  metadata: { issuedAt: string; appliedSettings: string[] }
}

Types
- `interface NewBehaviorRequest { userId: string; conversationContext: string[]; userAsk: string; requireReason?: boolean; requireAlternative?: boolean }`
- `interface NewBehaviorResponse { promptBlock: string; metadata: { issuedAt: string; appliedSettings: string[] } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Compose prompt block with the four-step behavior: acknowledge limitation, give reason, offer alternative, execute adapted ask.
- Respect flags: requireReason, requireAlternative.
- Include metadata listing applied settings.

Edge cases
- requireReason=false but reason is needed → omit reason step and flag in metadata.
- requireAlternative=false but alternative is available → omit alternative step and flag in metadata.
- Empty userAsk → return ApiError 400.

Mapping to UI
- Prompt manager injects `promptBlock` before LLM call.
- Inspector dashboard shows applied settings.
- Settings page toggles flags per user.

Non-functional requirements
- Latency: behavior injection completes within 150 ms.
- Streaming: single-shot behavior text; no chunking.
- Accessibility: behavior text readable; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; behavior text is English-only.

Test cases
- Standard request returns `promptBlock` containing the four-step behavior.
- requireReason=false omits reason step and flags in metadata.
- requireAlternative=false omits alternative step and flags in metadata.
- Empty userAsk returns ApiError 400.

Priority
- Medium