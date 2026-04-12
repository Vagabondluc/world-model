# Spec stub — ai_behavioral_experiments_hivemind_concept_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode a multi-phase RPG design team simulation with five roles (PL Innovator, VL Engineer, NL Storyteller, GR Facilitator, RT Historian) orchestrating DEBATE, VOTING, and ADAPTATION phases to blend preferences into a unified RPG concept, emphasizing dialogues, justified opinions, collaborative solutions, and clear decision paths.

API / Inputs
- HiveMindConceptRequest {
  userId: string,
  conversationContext: string[],
  ideaSeed: string,
  enableDebate?: boolean,
  enableVoting?: boolean,
  enableAdaptation?: boolean
}

Outputs
- HiveMindConceptResponse {
  debateDialogues: Dialogue[],
  votingSummary: VotingSummary,
  adaptedConcept: string,
  metadata: {
    issuedAt: string;
    phase: 'DEBATE' | 'VOTING' | 'ADAPTATION';
    appliedSettings: string[];
  }
}

Types
- `interface HiveMindConceptRequest { userId: string; conversationContext: string[]; ideaSeed: string; enableDebate?: boolean; enableVoting?: boolean; enableAdaptation?: boolean }`
- `interface HiveMindConceptResponse { debateDialogues: Dialogue[]; votingSummary: VotingSummary; adaptedConcept: string; metadata: { issuedAt: string; phase: 'DEBATE' | 'VOTING' | 'ADAPTATION'; appliedSettings: string[] } }`
- `interface Dialogue { speaker: string; content: string; justification?: string }`
- `interface VotingSummary { approvals: Vote[]; criticalFeedback: Feedback[] }`
- `interface Vote { voter: string; targetIdea: string; justification: string }`
- `interface Feedback { critic: string; suggestions: string }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- If enableDebate, generate DEBATE phase dialogues where each role pitches/challenges based on drives.
- If enableVoting, generate VOTING phase with approval votes (with justifications) and critical feedback (with suggestions).
- If enableAdaptation, generate ADAPTATION phase blending collective preferences into a unified concept.
- Emphasize engaging dialogues, justified opinions, collaborative solutions, clear decision paths.
- Include metadata with current phase and applied settings.

Edge cases
- Missing ideaSeed → return ApiError 400.
- Flags all false → return ApiError 400.
- Incomplete role set → proceed with available roles and flag in metadata.
- Voting ties → resolve by random selection among tied options and flag in metadata.

Mapping to UI
- Prompt manager orchestrates phases and stores state.
- UI displays dialogues, voting options, and adapted concept per phase.
- Inspector dashboard shows current phase, role contributions, and applied settings.

Non-functional requirements
- Latency: each phase completes within 600 ms.
- Streaming: single-shot per phase; no chunking.
- Accessibility: dialogues and voting options labeled; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; prompts are English-only.

Test cases
- enableDebate=true returns debateDialogues with role-based pitches and challenges.
- enableVoting=true returns votingSummary with approvals and critical feedback.
- enableAdaptation=true returns adaptedConcept blending preferences.
- Missing ideaSeed returns ApiError 400.
- Flags all false returns ApiError 400.

Priority
- Medium