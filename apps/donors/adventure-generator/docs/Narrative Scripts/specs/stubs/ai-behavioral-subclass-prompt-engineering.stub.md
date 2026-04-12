# Spec stub — ai_behavioral_subclass_prompt_engineering

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode a detailed prompt engineering template for D&D 5e subclass creation, combining persona, mechanical balance focus, lore flexibility, feedback/iteration preferences, technical formatting, and a strict behavioral code, ending with a requirement to provide three bold follow-up questions.

API / Inputs
- SubclassPromptRequest {
  userId: string,
  conversationContext: string[],
  dndClass: string,
  themeName: string,
  mechanicsNotes?: string,
  temperature?: number,
  allowFollowUpQuestions?: boolean,
  requireComparativeTables?: boolean
}

Outputs
- SubclassPromptResponse {
  promptBlock: string,
  metadata: { issuedAt: string; appliedSettings: string[]; estimatedTokens: number }
}

Types
- `interface SubclassPromptRequest { userId: string; conversationContext: string[]; dndClass: string; themeName: string; mechanicsNotes?: string; temperature?: number; allowFollowUpQuestions?: boolean; requireComparativeTables?: boolean }`
- `interface SubclassPromptResponse { promptBlock: string; metadata: { issuedAt: string; appliedSettings: string[]; estimatedTokens: number } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Compose prompt block with persona, rules, and follow-up question requirement.
- Respect flags: temperature, allowFollowUpQuestions, requireComparativeTables.
- Include metadata listing applied settings and estimated token count.

Edge cases
- temperature outside 0.1–1.0 → clamp to nearest bound and flag in metadata.
- allowFollowUpQuestions=false → omit follow-up question requirement and flag in metadata.
- requireComparativeTables=true but subclass database unavailable → include flag in metadata and omit comparative tables instruction.
- Missing dndClass or themeName → return ApiError 400.

Mapping to UI
- Prompt manager injects `promptBlock` before LLM call.
- Inspector dashboard shows applied settings and token estimate.
- Settings page toggles flags per user.

Non-functional requirements
- Latency: prompt injection completes within 300 ms.
- Streaming: single-shot prompt text; no chunking.
- Accessibility: prompt text readable; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; prompt text is English-only.

Test cases
- Standard request returns `promptBlock` containing persona, rules, and follow-up question requirement.
- Temperature clamping flags in metadata.
- allowFollowUpQuestions=false omits follow-up requirement and flags in metadata.
- requireComparativeTables=true but DB unavailable flags in metadata.
- Missing dndClass or themeName returns ApiError 400.

Priority
- High