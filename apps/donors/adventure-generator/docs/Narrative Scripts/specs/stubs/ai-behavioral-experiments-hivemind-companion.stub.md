# Spec stub — ai_behavioral_experiments_hivemind_companion

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode a persona customization and interaction guide for an AI GM team simulation, defining GM roles and player types with preferences, session adjustments, dynamic role integration, and feedback-driven adaptation.

API / Inputs
- HivemindCompanionRequest {
  userId: string,
  conversationContext: string[],
  selectedGmRoles: string[],
  selectedPlayerTypes: string[],
  sessionAdjustments: {
    date: string;
    campaign: string;
    focus: string;
  };
  dynamicRoleSettings: {
    emphasize: string[];
    mute: string[];
  };
  feedback?: {
    previousSessionDate: string;
    effectivenessRating: number; // 1-5
    comments: string;
  }
}

Outputs
- HivemindCompanionResponse {
  promptBlock: string,
  metadata: {
    issuedAt: string;
    appliedGmRoles: string[];
    appliedPlayerTypes: string[];
    llmConfigs: Record<string, LlmConfig>;
    emphasisFlags: string[];
    muteFlags: string[];
    feedbackAdjustments: string[];
  }
}

Types
- `interface HivemindCompanionRequest { userId: string; conversationContext: string[]; selectedGmRoles: string[]; selectedPlayerTypes: string[]; sessionAdjustments: { date: string; campaign: string; focus: string }; dynamicRoleSettings: { emphasize: string[]; mute: string[] }; feedback?: { previousSessionDate: string; effectivenessRating: number; comments: string } }`
- `interface HivemindCompanionResponse { promptBlock: string; metadata: { issuedAt: string; appliedGmRoles: string[]; appliedPlayerTypes: string[]; llmConfigs: Record<string, LlmConfig>; emphasisFlags: string[]; muteFlags: string[]; feedbackAdjustments: string[] } }`
- `interface LlmConfig { temperature: string; maxTokens: string; topP: string }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Compose prompt block integrating selected GM roles and player types with their preferences and LLM configs.
- Apply session-specific adjustments (date, campaign, focus).
- Apply dynamic role emphasis/mute flags.
- Incorporate feedback to adjust role weightings and content style.
- Balance conflicting preferences by finding middle ground.
- Provide alternative engagement options for different player types.

Edge cases
- Empty selectedGmRoles or selectedPlayerTypes → return ApiError 400.
- Invalid role abbreviations → filter out unknown roles and flag in metadata.
- Feedback rating out of 1-5 range → clamp to nearest bound and flag in metadata.
- Conflicting emphasis/mute flags for the same role → resolve by prioritizing emphasis and flag in metadata.

Mapping to UI
- Prompt manager orchestrates flow and stores role selections and feedback.
- UI presents checkboxes for GM roles/player types, session fields, emphasis/mute toggles, and feedback form.
- Inspector dashboard shows applied LLM configs and feedback-derived adjustments.

Non-functional requirements
- Latency: prompt generation completes within 800 ms.
- Streaming: single-shot prompt block; no chunking.
- Accessibility: all labels exposed with screen-reader-friendly text; role descriptions readable.
- i18n: supports Unicode; prompts are English-only.

Test cases
- Standard request returns prompt block with all selected roles and player types integrated.
- Session adjustments update prompt focus and appear in metadata.
- Emphasis/mute flags adjust content emphasis and appear in metadata flags.
- Feedback rating adjusts future prompts and appears in feedbackAdjustments.
- Empty selections return ApiError 400.
- Invalid role abbreviations are filtered and flagged.

Priority
- Medium