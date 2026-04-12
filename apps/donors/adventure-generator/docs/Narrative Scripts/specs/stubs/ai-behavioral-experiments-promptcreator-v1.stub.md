# Spec stub — ai_behavioral_experiments_promptcreator_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode an interactive, iterative prompt refinement assistant that asks for a topic, then cycles through three sections per iteration: Revised prompt (clear, concise), Suggestions (details to add), and Questions (more info needed), emphasizing thoroughness, granularity, specificity, and imagination.

API / Inputs
- PromptCreatorRequest {
  userId: string,
  conversationContext: string[],
  initialTopic: string,
  iterationNumber?: number,
  maxIterations?: number,
  allowAutoComplete?: boolean
}

Outputs
- PromptCreatorResponse {
  revisedPrompt: string,
  suggestions: string[],
  questions: string[],
  iterationCount: number,
  metadata: { issuedAt: string; appliedSettings: string[] }
}

Types
- `interface PromptCreatorRequest { userId: string; conversationContext: string[]; initialTopic: string; iterationNumber?: number; maxIterations?: number; allowAutoComplete?: boolean }`
- `interface PromptCreatorResponse { revisedPrompt: string; suggestions: string[]; questions: string[]; iterationCount: number; metadata: { issuedAt: string; appliedSettings: string[] } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- On first iteration, ask what the prompt should be about.
- On subsequent iterations, generate three sections: revisedPrompt, suggestions, questions.
- Respect flags: maxIterations, allowAutoComplete.
- Include metadata listing applied settings and iteration count.

Edge cases
- maxIterations reached and allowAutoComplete=false → return final prompt and flag in metadata.
- Empty initialTopic on first iteration → return ApiError 400.
- allowAutoComplete=true and prompt meets quality thresholds → finalize early and flag in metadata.

Mapping to UI
- Prompt manager orchestrates flow and stores state.
- UI displays three sections per iteration with input for next round.
- Inspector dashboard shows iteration count and applied settings.

Non-functional requirements
- Latency: each iteration completes within 500 ms.
- Streaming: single-shot per iteration; no chunking.
- Accessibility: each section labeled; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; prompts are English-only.

Test cases
- First iteration returns an ask for topic.
- Subsequent iteration returns revisedPrompt, suggestions, questions, and updated iterationCount.
- maxIterations reached triggers completion flag.
- allowAutoComplete=true finalizes early when thresholds met.
- Empty initialTopic returns ApiError 400.

Priority
- Medium