# Spec stub — ai_behavioral_experiments_hivemind_narrativemaster_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode a narrative co-pilot using 'Promise, Progress, Payoff' and 'therefore/but' rules to shape rhythmic stories, guiding through 7 stages: Premise Percept, Promise to Progress, Payoff Precision, Narrative Nurturing, Beat Breakdown, Technique Infusion, Draft Distillation, emphasizing flexibility, logical transitions, and user-steered creativity.

API / Inputs
- NarrativeMasterRequest {
  userId: string,
  conversationContext: string[],
  storySeed: string,
  enableTechniques?: boolean,
  enableBeatBreakdown?: boolean,
  maxBeats?: number
}

Outputs
- NarrativeMasterResponse {
  premiseElements: string[],
  progressArcs: ProgressArc[],
  payoffPlan: PayoffPlan,
  narrativeDraft: string,
  storyBeats: StoryBeat[],
  techniques: Technique[],
  metadata: {
    issuedAt: string;
    stage: 'PREMISE' | 'PROGRESS' | 'PAYOFF' | 'NURTURING' | 'BEATS' | 'TECHNIQUES' | 'DRAFT';
    appliedSettings: string[];
  }
}

Types
- `interface NarrativeMasterRequest { userId: string; conversationContext: string[]; storySeed: string; enableTechniques?: boolean; enableBeatBreakdown?: boolean; maxBeats?: number }`
- `interface NarrativeMasterResponse { premiseElements: string[]; progressArcs: ProgressArc[]; payoffPlan: PayoffPlan; narrativeDraft: string; storyBeats: StoryBeat[]; techniques: Technique[]; metadata: { issuedAt: string; stage: 'PREMISE' | 'PROGRESS' | 'PAYOFF' | 'NURTURING' | 'BEATS' | 'TECHNIQUES' | 'DRAFT'; appliedSettings: string[] } }`
- `interface ProgressArc { element: string; arc: string }`
- `interface PayoffPlan { element: string; resolution: string }`
- `interface StoryBeat { beat: string; timing: string }`
- `interface Technique { name: string; description: string }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Extract core promise elements from storySeed (PREMISE stage).
- Create engaging Progress-Arcs for each Promise-Element (PROGRESS stage) using 'therefore'/'but' logic.
- Devise satisfying Payoffs for each Promise-Element (PAYOFF stage).
- Review and nurture narrative for logical transitions (NURTURING stage).
- Distill narrative into engaging Story-Beats (BEATS stage) respecting story's pace.
- Add narrative sophistication using techniques (TECHNIQUES stage) if enabled.
- Encapsulate into robust narrative draft (DRAFT stage).
- Respect flags: enableTechniques, enableBeatBreakdown, maxBeats.

Edge cases
- Empty storySeed → return ApiError 400.
- maxBeats exceeded → truncate excess beats and flag in metadata.
- enableBeatBreakdown=false → omit storyBeats and flag in metadata.
- enableTechniques=false → omit techniques and flag in metadata.

Mapping to UI
- Prompt manager orchestrates stages and stores narrative state.
- UI displays stage outputs (premiseElements, progressArcs, etc.) with inputs for next stage.
- Inspector dashboard shows current stage, applied settings, and analytic tags.

Non-functional requirements
- Latency: each stage completes within 600 ms.
- Streaming: single-shot per stage; no chunking.
- Accessibility: stage outputs labeled; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; prompts are English-only.

Test cases
- storySeed returns premiseElements in PREMISE stage.
- PROGRESS stage returns progressArcs with 'therefore'/'but' logic.
- PAYOFF stage returns payoffPlan resolving each Promise-Element.
- NURTURING stage reviews narrative and flags logical transitions.
- BEATS stage returns storyBeats respecting maxBeats.
- TECHNIQUES stage returns techniques if enabled.
- DRAFT stage returns narrativeDraft.
- Empty storySeed returns ApiError 400.
- Flags modify output and appear in metadata.

Priority
- Medium