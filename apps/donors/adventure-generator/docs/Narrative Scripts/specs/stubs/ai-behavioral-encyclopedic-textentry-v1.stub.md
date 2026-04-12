# Spec stub — ai_behavioral_encyclopedic_textentry_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode guidelines for creating concise, structured encyclopedia entries (~550 tokens) without intros/outros, emphasizing clear narrative, comprehensive data, genre relevance, depth, originality, contextual insight, and efficiency.

API / Inputs
- EncyclopedicEntryRequest {
  userId: string,
  conversationContext: string[],
  topic: string,
  maxTokens?: number,
  genre?: string,
  allowMultipleOutcomes?: boolean
}

Outputs
- EncyclopedicEntryResponse {
  promptBlock: string,
  metadata: { issuedAt: string; appliedSettings: string[]; estimatedTokens: number }
}

Types
- `interface EncyclopedicEntryRequest { userId: string; conversationContext: string[]; topic: string; maxTokens?: number; genre?: string; allowMultipleOutcomes?: boolean }`
- `interface EncyclopedicEntryResponse { promptBlock: string; metadata: { issuedAt: string; appliedSettings: string[]; estimatedTokens: number } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Compose prompt block with encyclopedic entry instructions.
- Respect flags: maxTokens, genre, allowMultipleOutcomes.
- Include metadata listing applied settings and estimated token count.

Edge cases
- maxTokens not provided or below 400 → default to 550 and flag in metadata.
- allowMultipleOutcomes=false but topic implies multiple outcomes → omit contextual insight instruction and flag in metadata.
- Topic not provided → return ApiError 400.

Mapping to UI
- Prompt manager injects `promptBlock` before LLM call.
- Inspector dashboard shows applied settings and token estimate.
- Settings page toggles flags per user.

Non-functional requirements
- Latency: instruction injection completes within 150 ms.
- Streaming: single-shot instruction text; no chunking.
- Accessibility: instruction text readable; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; instruction text is English-only.

Test cases
- Standard request returns `promptBlock` containing encyclopedic entry guidelines.
- maxTokens default to 550 and flags in metadata.
- allowMultipleOutcomes=false omits contextual insight and flags in metadata.
- Missing topic returns ApiError 400.

Priority
- Medium