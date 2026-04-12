
FILE: docs/scaffold-fix/03_ai-context.logic-trace.md
SUBSYSTEM: AI Service & Context Injection

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/services/aiService.ts
FUNCTION / COMPONENT: generateContent
INPUTS: basePrompt, userInput, context (AIRequestContext), config
PRECONDITIONS: None explicitly thrown, but destructures `context`.
TRANSITION: 
1. Extracts `gameSettings`, `elements` from `context`.
2. Processes UUID matches using `elements`.
3. Adds Temporal Context if `config.eraId >= 4` and `gameSettings` exists.
OUTPUT / NEXT STEP: returns string (AI response)
DEPENDENCIES: @google/genai
STATUS: MATCH
NOTES: Service logic is decoupled and accepts explicit context. Temporal logic is present.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/hooks/useAIGeneration.ts
FUNCTION / COMPONENT: generate (callback)
INPUTS: basePrompt, userInput, config
PRECONDITIONS: None
TRANSITION:
1. Reads `elements`, `gameSettings`, `currentPlayer` from `useGameStore` (hook level).
2. Constructs `context` object: `{ elements, gameSettings, currentPlayer }`.
3. Calls `generateContent(..., context, ...)`.
OUTPUT / NEXT STEP: Sets local result state.
DEPENDENCIES: useGameStore, aiService
STATUS: MATCH
NOTES: Explicit context assembly happens synchronously before async service call.

PARITY SUMMARY TABLE:
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Context Access | Direct Context Usage | `useAIGeneration` Assembly | MATCH | Logic moved from Service internal to Hook assembly.
UUID Injection | Inside Component | `aiService.ts` | MATCH | Logic preserved and isolated.
Temporal Logic | Unknown (Implied manual) | `aiService.ts` | IMPROVED | Automated injection based on Era ID.

-------------------------
NEGATIVE PARITY SECTION
-------------------------
OBSERVED DIVERSION 1
Scaffold behavior: AI logic executed inside the React component tree (`AIContext`), having synchronous, direct access to the current Props and Context values for prompt construction.
Src behavior: AI logic moved to a standalone service (`aiService.ts`).
Evidence in files: docs/logic_difference_report.md Section 3 ("AI Service & Context Injection").
Impact: The service is decoupled from the UI state. If arguments are not explicitly passed at the call site, the service executes with stale or undefined data (e.g., missing `gameSettings` for temporal scaling).
Classification: Divergent

OBSERVED DIVERSION 2
Scaffold behavior: UUID replacement (Context Injection) logic was embedded in the view layer, ensuring it ran against the live DOM/Component state.
Src behavior: UUID replacement logic logic was moved to the service, but the service does not automatically have access to the `elements` array needed to perform the lookup.
Evidence in files: docs/logic_difference_report.md Section 7.3 ("The AI Service — Correct but 'Moved Too Soon'").
Impact: Prompt generation fails to replace UUIDs with element descriptions if the `elements` array is not manually injected into every call.
Classification: Regression

OBSERVED DIVERSION 3
Scaffold behavior: Prompt context (Era, Year) was implicitly available via parent props.
Src behavior: Temporal Context injection is a new requirement for Eras 4-6, but the logic to calculate and inject this (based on `turnDuration`) is complex and prone to being `undefined` if the store hasn't hydrated.
Evidence in files: docs/logic_difference_report.md Section 3 ("Temporal Injection").
Impact: AI narratives may lack the correct historical scale (Intimate vs Grand) if context injection fails silently.
Classification: Divergent
