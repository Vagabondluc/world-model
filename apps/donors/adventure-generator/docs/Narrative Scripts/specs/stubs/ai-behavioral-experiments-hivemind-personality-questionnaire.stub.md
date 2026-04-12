# Spec stub — ai_behavioral_experiments_hivemind_personality_questionnaire

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode guidelines to generate immersive, sensory-rich RPG player type questionnaire scenarios with 5-sense settings, layered complexity, active language, tailored response options per archetype, point allocation system, consistency, accessibility, and interpretive engagement, aiming to categorize players into roles.json types.

API / Inputs
- PersonalityQuestionnaireRequest {
  userId: string,
  conversationContext: string[],
  targetArchetype?: string,
  maxScenarios?: number,
  allowEmotionalReactions?: boolean,
  pointAllocationWeights?: Record<string, number>
}

Outputs
- PersonalityQuestionnaireResponse {
  scenarios: Scenario[],
  pointMatrix: Record<string, Record<string, number>>,
  metadata: {
    issuedAt: string;
    appliedSettings: string[];
    totalPoints: Record<string, number>;
  }
}

Types
- `interface PersonalityQuestionnaireRequest { userId: string; conversationContext: string[]; targetArchetype?: string; maxScenarios?: number; allowEmotionalReactions?: boolean; pointAllocationWeights?: Record<string, number> }`
- `interface PersonalityQuestionnaireResponse { scenarios: Scenario[]; pointMatrix: Record<string, Record<string, number>>; metadata: { issuedAt: string; appliedSettings: string[]; totalPoints: Record<string, number> } }`
- `interface Scenario { description: string; choices: Choice[]; context: string }`
- `interface Choice { label: string; points: Record<string, number>; emotionalReaction?: string; physicalReaction?: string }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Generate scenarios with vivid 5-sense descriptions and layered complexity.
- Provide response options tailored to role archetypes (narrative, strategy, simplicity, rule-conscious).
- Assign points per choice using pointAllocationWeights; default to equal weights if not provided.
- Include emotional/physical reaction prompts if allowEmotionalReactions.
- Ensure consistency and accessibility across scenarios.
- Calculate pointMatrix mapping choices to player archetypes.

Edge cases
- maxScenarios exceeded → truncate excess scenarios and flag in metadata.
- allowEmotionalReactions=false → omit reaction prompts and flag in metadata.
- Invalid pointAllocationWeights → default to equal weights and flag in metadata.
- Empty targetArchetype → generate generic scenarios and flag in metadata.

Mapping to UI
- Prompt manager orchestrates questionnaire flow and stores responses.
- UI presents scenarios with multi-choice options and optional reaction inputs.
- Inspector dashboard shows point matrix and inferred player types.

Non-functional requirements
- Latency: questionnaire generation completes within 700 ms.
- Streaming: single-shot questionnaire; no chunking.
- Accessibility: scenarios and choices labeled; point matrix exposed with screen-reader-friendly labels.
- i18n: supports Unicode; scenarios are English-only.

Test cases
- Standard request returns scenarios with tailored choices and point matrix.
- maxScenarios exceeded truncates and flags in metadata.
- allowEmotionalReactions=false omits reaction prompts and flags in metadata.
- Invalid weights default to equal and flag in metadata.
- Empty targetArchetype generates generic scenarios and flags in metadata.

Priority
- Medium