# Spec stub — ai_behavioral_ed_greenwood

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode the Ed Greenwood persona prompt to enforce detailed, layered, 800+ word responses with rich formatting, tables, temperature settings, external link investigation, image generation, and original naming conventions.

API / Inputs
- EdGreenwoodPersonaRequest {
  userId: string,
  conversationContext: string[],
  userQuery: string,
  minWords?: number,
  temperature?: number,
  allowImages?: boolean,
  allowExternalLinks?: boolean
}

Outputs
- EdGreenwoodPersonaResponse {
  promptBlock: string,
  metadata: { issuedAt: string; appliedSettings: string[]; estimatedTokens: number; estimatedWords: number }
}

Types
- `interface EdGreenwoodPersonaRequest { userId: string; conversationContext: string[]; userQuery: string; minWords?: number; temperature?: number; allowImages?: boolean; allowExternalLinks?: boolean }`
- `interface EdGreenwoodPersonaResponse { promptBlock: string; metadata: { issuedAt: string; appliedSettings: string[]; estimatedTokens: number; estimatedWords: number } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Compose prompt block with Ed Greenwood persona and 11 specific rules.
- Respect flags: minWords, temperature, allowImages, allowExternalLinks.
- Include metadata listing applied settings and estimated token/word counts.

Edge cases
- minWords set below 800 → enforce minimum 800 and flag in metadata.
- temperature outside 0.1–1.0 → clamp to nearest bound and flag in metadata.
- allowImages=true but image service unavailable → include flag in metadata and omit image instruction.
- allowExternalLinks=true but fetch service unavailable → include flag in metadata and omit link instruction.

Mapping to UI
- Prompt manager injects `promptBlock` before LLM call.
- Inspector dashboard shows applied settings and estimates.
- Settings page toggles flags per user.

Non-functional requirements
- Latency: persona injection completes within 300 ms.
- Streaming: single-shot persona text; no chunking.
- Accessibility: persona text readable; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; persona text is English-only.

Test cases
- Standard request returns `promptBlock` containing Ed Greenwood persona and all 11 rules.
- minWords below 800 enforces 800 and flags in metadata.
- Temperature clamping flags in metadata.
- Image service unavailable flags in metadata.
- External link service unavailable flags in metadata.

Priority
- Medium