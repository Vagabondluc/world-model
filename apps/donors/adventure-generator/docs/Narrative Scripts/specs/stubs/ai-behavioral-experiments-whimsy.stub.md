# Spec stub — ai_behavioral_experiments_whimsy

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Encode a world-building creation assistant (Whimsy) that guides users through a structured, multi-step process: intro/world-type choice, naming, secondary theme, brief description/year, auto-creation of locations/characters, then a persistent menu with Creation, Simulation, Exploration, and Freeform. Enforces strict conversational rules: short responses, emojis, numbered lists, no clichés, sophisticated writing for stories, bold/italics for style, and tracking world year.

API / Inputs
- WhimsyRequest {
  userId: string,
  conversationContext: string[],
  userResponse: string,
  currentStep: string,
  worldState: {
    name?: string;
    year?: number;
    theme?: string;
    secondaryTheme?: string;
    characters?: Character[];
    locations?: Location[];
  };
  allowEmojis?: boolean;
  maxEmojisPerMessage?: number
}

Outputs
- WhimsyResponse {
  nextPrompt: string,
  menuOptions?: MenuOption[],
  worldStateUpdates: Partial<WorldState>,
  metadata: { issuedAt: string; appliedSettings: string[]; currentStep: string }
}

Types
- `interface WhimsyRequest { userId: string; conversationContext: string[]; userResponse: string; currentStep: string; worldState: WorldState; allowEmojis?: boolean; maxEmojisPerMessage?: number }`
- `interface WhimsyResponse { nextPrompt: string; menuOptions?: MenuOption[]; worldStateUpdates: Partial<WorldState>; metadata: { issuedAt: string; appliedSettings: string[]; currentStep: string } }`
- `interface Character { name: string; age: number; height: string; weight: string; motivation: string; appearance: string; relationships?: string[] }`
- `interface Location { name: string; description: string; relationships?: string[] }`
- `interface MenuOption { label: string; emoji?: string; action: string }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Guide through steps: intro, world-type choice, naming, secondary theme, description/year, auto-creation, then persistent menu.
- In menu, handle Creation (character/location), Simulation (time progress/event), Exploration (interview/explore/story), Freeform (ask/change).
- Enforce rules: short responses, emojis if allowed, numbered lists, no clichés, sophisticated writing for stories, bold/italics, track world year.
- Respect flags: allowEmojis, maxEmojisPerMessage.

Edge cases
- allowEmojis=false but content requires emojis → omit emojis and flag in metadata.
- maxEmojisPerMessage exceeded → truncate excess emojis and flag in metadata.
- Missing required worldState fields for a step → return ApiError 400.
- Invalid menu action → return ApiError 400 with allowed actions.

Mapping to UI
- Prompt manager orchestrates flow and stores worldState.
- UI displays nextPrompt, menuOptions (if applicable), and world state summary.
- Inspector dashboard shows current step and applied settings.

Non-functional requirements
- Latency: each step completes within 700 ms.
- Streaming: single-shot per step; no chunking.
- Accessibility: menuOptions labeled; worldState exposed with screen-reader-friendly labels.
- i18n: supports Unicode; prompts are English-only.

Test cases
- Intro step returns nextPrompt asking for world-type choice with numbered list and emojis.
- Menu step returns nextPrompt with menuOptions and current worldState.
- allowEmojis=false omits emojis and flags in metadata.
- maxEmojisPerMessage exceeded truncates excess emojis and flags in metadata.
- Invalid menu action returns ApiError 400.

Priority
- Medium