# 03_ai-service-timing.md

## Title
AI Service Timing & Context Repair Specification

## Problem Summary
The AI service executes asynchronously outside of the React state guarantee, leading to race conditions where the service reads stale state or executes before the state is fully ready. This results in "undefined config" errors and missing UUID lookups.

## Scaffold Working Logic
*   **Mechanism:** AI generation logic was handled directly inside the React component tree (`AIContext`).
*   **Behavior:** UUID replacement and prompt construction happened synchronously with direct access to the active React context.
*   **Result:** Access to the current state (elements, settings) was guaranteed during execution.

## Src Broken Logic
*   **Mechanism:** AI logic was moved to a decoupled standalone service module.
*   **Behavior:** The service runs asynchronously and attempts to access state that may not be passed explicitly or is resolved differently.
*   **Result:** The service executes before state is fully ready or reads stale state, causing crashes due to timing mismatches (e.g., missing config objects).

## Proposed Fix
Decouple the AI Service from implicit state and enforce **Explicit Context Injection**.

1.  **Update Service Signature:**
    *   Refactor `generateContent` in `aiService.ts` to accept a comprehensive `context` object as a mandatory argument.
    *   This object must include: `currentElements`, `gameSettings`, `playerData`, and `temporalContext` (if applicable).

2.  **Synchronous Assembly:**
    *   In the `useAIGeneration` hook (or component), assemble this `context` object **synchronously** from the store *before* calling the async service.
    *   Do not let the service attempt to read from the store or hooks directly.

3.  **Validation Guard:**
    *   Inside the service, validate that `context` and `context.gameSettings` are defined before proceeding. Throw a clear error if they are missing, rather than failing on property access.

## Migration / Patch Notes
*   **Files Affected:** `src/services/aiService.ts`, `src/hooks/useAIGeneration.ts`.
*   **Architectural Adjustment:** The service becomes a pure function (input -> output) with no side-effect dependencies on the application state.

## Optional Test Scenarios
1.  **Fast Click:** Click "Generate" immediately upon loading the Era 4 interface. The service should either succeed or log a "Context not ready" warning, but it must not crash the app with "undefined" errors.
2.  **Context Injection:** Paste a UUID into the prompt. Ensure the service receives the *current* list of elements to perform the replacement, even if an element was just created seconds ago.