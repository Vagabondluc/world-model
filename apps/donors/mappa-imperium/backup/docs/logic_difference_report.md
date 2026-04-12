# Logic & Behavioral Differences Report
**Scope:** Comparison between `scafold/` (Legacy) and `src/` (Current)
**Date:** October 2023

This document outlines the specific **logical and behavioral** differences between the two codebases. It ignores file organization changes (refactoring/decomposition) and focuses on how the application *functions* differently.

---

## 1. State Persistence & Lifecycle
**The most significant logical shift is how data survives page reloads and component unmounting.**

### **Scaffold (Legacy)**
*   **Logic:** Uses React Context (`GameContext`). State is held in Javascript memory.
*   **Behavior:** 
    *   **Page Refresh:** All data (players, elements, current era) is **lost** immediately upon refreshing the browser.
    *   **Session:** There is no concept of a "session" persisting across tabs or reloads without manual export/import.

### **Src (Current)**
*   **Logic:** Uses `Zustand` with `persist` middleware linked to `sessionStorage`.
*   **Behavior:**
    *   **Page Refresh:** Game state is **automatically restored**. A user can refresh the page and remain in the same game, with the same players and elements.
    *   **Transient Exclusion:** Logic explicitly *excludes* transient UI states (like `isTransitioning`, `isSettingsModalOpen`) from persistence to prevent the app from loading into a "stuck" state.

---

## 2. Era I: Geography Drafting Logic
**A fundamental change in how "Work in Progress" data is handled during the Age of Creation.**

### **Scaffold (Legacy)**
*   **Logic:** `EraCreationContext` maintained a `playersState` object: `Record<number, EraCreationState>`.
*   **Behavior:** It tracked the "draft" geography (features not yet saved as cards) for **all players simultaneously**. You could switch from Player 1 to Player 2, do some work, switch back to Player 1, and Player 1's draft choices would still be there.

### **Src (Current)**
*   **Logic:** `useEraCreationState` hook uses local component `useState`.
*   **Behavior:** Draft state is **ephemeral**. It exists only while the `EraCreationContent` component is mounted.
    *   **Impact:** If you start selecting geography for Player 1, then switch to Player 2 *before* finalizing/saving, Player 1's draft is **lost/reset**. This simplifies memory management but requires users to finish a task before switching contexts.

---

## 3. AI Service & Context Injection
**The logic for how AI prompts are constructed and executed has moved from the View layer to the Service layer.**

### **Scaffold (Legacy)**
*   **Logic:** `AIContext` directly imported `GoogleGenAI` and handled generation inside the React component tree.
*   **Behavior:** UUID replacement (swapping an ID for element details) happened *inside* the Context hook. Prompt construction was tightly coupled to the active React context.

### **Src (Current)**
*   **Logic:** `aiService.ts` is a standalone TypeScript module. The `useAIGeneration` hook delegates logic to this service.
*   **Behavior:**
    *   **Temporal Injection:** The service contains specific logic to check `config.eraId >= 4`. If true, it *automatically* calculates a "Temporal Context" (Intimate vs. Grand scale) based on `turnDuration` and injects it into the prompt. This logic was previously scattered or manual; now it is enforced at the service level.
    *   **Sanitization:** UUID replacement logic is isolated, making the "Context" feature of the AI input more robust and testable outside of React.

---

## 4. Render Stability (Infinite Loop Fix)
**A specific logical patch was applied to the layout rendering cycle.**

### **Scaffold (Legacy)**
*   **Logic:** `AppLayout` passed a `handleContentReady` function to children.
*   **Behavior:** This function was unstable (created on every render). When child components called it inside `useEffect`, it updated the parent, causing the parent to re-render, creating a new function, causing the child to re-run `useEffect`. **Result:** Infinite render loops and UI flickering.

### **Src (Current)**
*   **Logic:** `AppLayout` wraps `handleContentReady` in `useCallback`.
*   **Behavior:** The function reference remains stable. Child components (`EraContent`) can safely notify the parent of readiness without triggering recursive updates.

---

## 5. Debug System Logic
**The debug system changed from a "Game State Manipulator" to a "System Diagnostic Tool".**

### **Scaffold (Legacy)**
*   **Logic:** `DebugModal` was primarily a UI to trigger state changes (prepopulate eras).
*   **Behavior:** It assumed the environment was valid.

### **Src (Current)**
*   **Logic:** `UnifiedDebugSystem` runs active *diagnostic tests*.
*   **Behavior:**
    *   **Environment Constraints:** It actively attempts to write to `localStorage`, fetch external URLs, and check file system APIs to determine *capabilities*. It doesn't just assume features work; it tests them.
    *   **File Health:** It performs fetch requests to specific paths to verify `404` status vs `200` status, specifically to diagnose the Google Cloud Run static file serving issues.

## 6. Styling Logic
**The mechanism for resolving CSS classes changed from "Utility-First" to "Token-First".**

### **Scaffold (Legacy)**
*   **Logic:** Styles were hardcoded strings (`className="bg-red-500 p-4..."`) or relied on a CSS file that might 404.
*   **Behavior:** Visual consistency relied on developers manually copying/pasting utility strings correctly.

### **Src (Current)**
*   **Logic:** `src/design/tokens.ts` defines a JavaScript object acting as a "Style Registry".
*   **Behavior:** Components import `componentStyles`. Changing a style in `tokens.ts` propagates logic-wide. The logic for *what* a button looks like is decoupled from the button component itself.

---

## 7. Post-Refactor Regression Analysis
**Diagnosis of why the architectural improvements caused functional regressions in the "Src" build.**

The refactor successfully evolved the architecture but introduced functional regressions because it removed "compensating behaviors" (crutches) that the prototype relied on to function correctly.

### **1. State Persistence Broke Expected UX**
*   **Root Cause:** The mix of persisted global state and ephemeral local state created a disconnect.
*   **Impact:** Switching players or tabs destroys work-in-progress (drafts) because local state flushes instantly, while the UI assumes persistence similar to the monolithic context.
*   **Result:** Orphaned transitions and "undefined" crashes when the UI expects state that has been wiped.

### **2. Era Creation Component Logic Broke Workflow**
*   **Root Cause:** Moving from a centralized context map (`Record<number, State>`) to local component state (`useState`).
*   **Impact:** State is lost on unmount, tab switch, or player switch.
*   **Result:** Inconsistent rendering and missing arrays lead to runtime errors when the UI attempts to read state that no longer exists.

### **3. The AI Service — Correct but “Moved Too Soon”**
*   **Root Cause:** Moving AI logic to a service module decoupled it from the React state guarantee.
*   **Impact:** The service may execute before state is fully ready or read stale state, as it no longer waits for React's synchronous context resolution.
*   **Result:** Undefined AI configs, missing UUID lookups, and timing-based runtime exceptions.

### **4. Render Stability Fix Exposed Hidden Timing Bugs**
*   **Root Cause:** Fixing the infinite render loop removed the "force settle" effect of extra renders.
*   **Impact:** The unstable callback in the legacy code created extra renders that accidentally initialized state. Stabilizing it revealed the true "uninitialized state on first render" issues.
*   **Result:** Components initialize too early, leading to "cannot read property X of undefined" errors.

### **5. Debug System Refactor Removed Behavior the UI Counted On**
*   **Root Cause:** The debug system shifted from "State Manipulator" to "System Diagnostic".
*   **Impact:** The legacy debug UI forced state to exist (backfilling). The new system tests the environment but does not patch game state.
*   **Result:** The game starts in an uninitialized state without the forced defaults the UI previously relied on.

### **6. Styling Tokens Changed Render Order**
*   **Root Cause:** Moving from inline classes to an async imported token registry.
*   **Impact:** Styles are no longer applied instantly/synchronously. Token availability depends on module load order.
*   **Result:** Dynamic class construction fails if tokens aren't loaded, leading to unstyled components or layout shifts on first render.

### **Synthesis**
The legacy version worked because UI re-renders covered timing gaps, ephemeral memory kept drafts alive, context guaranteed data existence, and debug tools backfilled missing state. The refactor removed these crutches without implementing the necessary "Initialization Guards" and "Persistent Draft Stores" to replace them.

# Logic & Behavioral Differences Report
**Scope:** Comparison between `scafold/` (Legacy) and `src/` (Current)
**Date:** October 2023

This document outlines the specific **logical and behavioral** differences between the two codebases. It ignores file organization changes (refactoring/decomposition) and focuses on how the application *functions* differently.

---

## 1. State Persistence & Lifecycle
**The most significant logical shift is how data survives page reloads and component unmounting.**

### **Scaffold (Legacy)**
*   **Logic:** Uses React Context (`GameContext`). State is held in Javascript memory.
*   **Behavior:** 
    *   **Page Refresh:** All data (players, elements, current era) is **lost** immediately upon refreshing the browser.
    *   **Session:** There is no concept of a "session" persisting across tabs or reloads without manual export/import.

### **Src (Current)**
*   **Logic:** Uses `Zustand` with `persist` middleware linked to `sessionStorage`.
*   **Behavior:**
    *   **Page Refresh:** Game state is **automatically restored**. A user can refresh the page and remain in the same game, with the same players and elements.
    *   **Transient Exclusion:** Logic explicitly *excludes* transient UI states (like `isTransitioning`, `isSettingsModalOpen`) from persistence to prevent the app from loading into a "stuck" state.

---

## 2. Era I: Geography Drafting Logic
**A fundamental change in how "Work in Progress" data is handled during the Age of Creation.**

### **Scaffold (Legacy)**
*   **Logic:** `EraCreationContext` maintained a `playersState` object: `Record<number, EraCreationState>`.
*   **Behavior:** It tracked the "draft" geography (features not yet saved as cards) for **all players simultaneously**. You could switch from Player 1 to Player 2, do some work, switch back to Player 1, and Player 1's draft choices would still be there.

### **Src (Current)**
*   **Logic:** `useEraCreationState` hook uses local component `useState`.
*   **Behavior:** Draft state is **ephemeral**. It exists only while the `EraCreationContent` component is mounted.
    *   **Impact:** If you start selecting geography for Player 1, then switch to Player 2 *before* finalizing/saving, Player 1's draft is **lost/reset**. This simplifies memory management but requires users to finish a task before switching contexts.

---

## 3. AI Service & Context Injection
**The logic for how AI prompts are constructed and executed has moved from the View layer to the Service layer.**

### **Scaffold (Legacy)**
*   **Logic:** `AIContext` directly imported `GoogleGenAI` and handled generation inside the React component tree.
*   **Behavior:** UUID replacement (swapping an ID for element details) happened *inside* the Context hook. Prompt construction was tightly coupled to the active React context.

### **Src (Current)**
*   **Logic:** `aiService.ts` is a standalone TypeScript module. The `useAIGeneration` hook delegates logic to this service.
*   **Behavior:**
    *   **Temporal Injection:** The service contains specific logic to check `config.eraId >= 4`. If true, it *automatically* calculates a "Temporal Context" (Intimate vs. Grand scale) based on `turnDuration` and injects it into the prompt. This logic was previously scattered or manual; now it is enforced at the service level.
    *   **Sanitization:** UUID replacement logic is isolated, making the "Context" feature of the AI input more robust and testable outside of React.

---

## 4. Render Stability (Infinite Loop Fix)
**A specific logical patch was applied to the layout rendering cycle.**

### **Scaffold (Legacy)**
*   **Logic:** `AppLayout` passed a `handleContentReady` function to children.
*   **Behavior:** This function was unstable (created on every render). When child components called it inside `useEffect`, it updated the parent, causing the parent to re-render, creating a new function, causing the child to re-run `useEffect`. **Result:** Infinite render loops and UI flickering.

### **Src (Current)**
*   **Logic:** `AppLayout` wraps `handleContentReady` in `useCallback`.
*   **Behavior:** The function reference remains stable. Child components (`EraContent`) can safely notify the parent of readiness without triggering recursive updates.

---

## 5. Debug System Logic
**The debug system changed from a "Game State Manipulator" to a "System Diagnostic Tool".**

### **Scaffold (Legacy)**
*   **Logic:** `DebugModal` was primarily a UI to trigger state changes (prepopulate eras).
*   **Behavior:** It assumed the environment was valid.

### **Src (Current)**
*   **Logic:** `UnifiedDebugSystem` runs active *diagnostic tests*.
*   **Behavior:**
    *   **Environment Constraints:** It actively attempts to write to `localStorage`, fetch external URLs, and check file system APIs to determine *capabilities*. It doesn't just assume features work; it tests them.
    *   **File Health:** It performs fetch requests to specific paths to verify `404` status vs `200` status, specifically to diagnose the Google Cloud Run static file serving issues.

## 6. Styling Logic
**The mechanism for resolving CSS classes changed from "Utility-First" to "Token-First".**

### **Scaffold (Legacy)**
*   **Logic:** Styles were hardcoded strings (`className="bg-red-500 p-4..."`) or relied on a CSS file that might 404.
*   **Behavior:** Visual consistency relied on developers manually copying/pasting utility strings correctly.

### **Src (Current)**
*   **Logic:** `src/design/tokens.ts` defines a JavaScript object acting as a "Style Registry".
*   **Behavior:** Components import `componentStyles`. Changing a style in `tokens.ts` propagates logic-wide. The logic for *what* a button looks like is decoupled from the button component itself.

---

## 7. Post-Refactor Regression Analysis
**Diagnosis of why the architectural improvements caused functional regressions in the "Src" build.**

The refactor successfully evolved the architecture but introduced functional regressions because it removed "compensating behaviors" (crutches) that the prototype relied on to function correctly.

### **1. State Persistence Broke Expected UX**
*   **Root Cause:** The mix of persisted global state and ephemeral local state created a disconnect.
*   **Impact:** Switching players or tabs destroys work-in-progress (drafts) because local state flushes instantly, while the UI assumes persistence similar to the monolithic context.
*   **Result:** Orphaned transitions and "undefined" crashes when the UI expects state that has been wiped.

### **2. Era Creation Component Logic Broke Workflow**
*   **Root Cause:** Moving from a centralized context map (`Record<number, State>`) to local component state (`useState`).
*   **Impact:** State is lost on unmount, tab switch, or player switch.
*   **Result:** Inconsistent rendering and missing arrays lead to runtime errors when the UI attempts to read state that no longer exists.

### **3. The AI Service — Correct but “Moved Too Soon”**
*   **Root Cause:** Moving AI logic to a service module decoupled it from the React state guarantee.
*   **Impact:** The service may execute before state is fully ready or read stale state, as it no longer waits for React's synchronous context resolution.
*   **Result:** Undefined AI configs, missing UUID lookups, and timing-based runtime exceptions.

### **4. Render Stability Fix Exposed Hidden Timing Bugs**
*   **Root Cause:** Fixing the infinite render loop removed the "force settle" effect of extra renders.
*   **Impact:** The unstable callback in the legacy code created extra renders that accidentally initialized state. Stabilizing it revealed the true "uninitialized state on first render" issues.
*   **Result:** Components initialize too early, leading to "cannot read property X of undefined" errors.

### **5. Debug System Refactor Removed Behavior the UI Counted On**
*   **Root Cause:** The debug system shifted from "State Manipulator" to "System Diagnostic".
*   **Impact:** The legacy debug UI forced state to exist (backfilling). The new system tests the environment but does not patch game state.
*   **Result:** The game starts in an uninitialized state without the forced defaults the UI previously relied on.

### **6. Styling Tokens Changed Render Order**
*   **Root Cause:** Moving from inline classes to an async imported token registry.
*   **Impact:** Styles are no longer applied instantly/synchronously. Token availability depends on module load order.
*   **Result:** Dynamic class construction fails if tokens aren't loaded, leading to unstyled components or layout shifts on first render.

### **Synthesis**
The legacy version worked because UI re-renders covered timing gaps, ephemeral memory kept drafts alive, context guaranteed data existence, and debug tools backfilled missing state. The refactor removed these crutches without implementing the necessary "Initialization Guards" and "Persistent Draft Stores" to replace them.

---

## 8. Remediation Plan

The following steps outline the repair blueprint to restore functionality while maintaining the improved architecture. This plan addresses the critical regressions identified in §7.

### 8.1 Persistent Draft Store (Era I Fix)
*   **Issue:** Addresses §2 and §7.1. Switching players currently resets Era I drafts (geography features, resources) because they rely on ephemeral component `useState`.
*   **Solution:** Create a dedicated Zustand slice for `eraDrafts` (e.g., `Record<playerId, DraftState>`). This allows drafts to persist across component mounts/unmounts and player switching.
*   **Action:**
    *   Implement `eraDrafts` in `gameStore.ts` (or a new slice).
    *   Refactor `EraCreationContent.tsx` and its children to read from this store instead of local `useState`.

### 8.2 Initialization Guards (Timing Fix)
*   **Issue:** Addresses §4 and §7.4. Components render before global state is fully hydrated, leading to crashes (e.g., accessing `currentEra` or `players[0]` when `undefined`).
*   **Solution:** Implement an explicit `ready` flag in the store and enforce it at the layout level.
*   **Action:**
    *   Add `isGameReady` flag to `gameStore`.
    *   In `AppLayout.tsx`, return a loading screen if `!isGameReady`.
    *   Ensure `startGame` or hydration logic sets `isGameReady = true` only after critical data exists.

### 8.3 Explicit AI Service Inputs (Service Decoupling)
*   **Issue:** Addresses §3 and §7.3. The AI service runs asynchronously and may read stale state if not passed explicitly, causing "undefined config" errors.
*   **Solution:** Decouple the AI service from implicit global state. Pass all required context (config, player, elements) as arguments at the time of the call.
*   **Action:**
    *   Update `aiService.ts` to accept a complete context object.
    *   Update `useAIGeneration` hook to assemble this context from the store *before* invoking the service.

### 8.4 Restore Debug State Seeder (Dev Tool Fix)
*   **Issue:** Addresses §5 and §7.5. The loss of the "Prepopulate" button makes testing difficult as the app often starts in an empty state.
*   **Solution:** Reintegrate state seeding functionality into the new `UnifiedDebugSystem`, using the public store actions to ensure validity.
*   **Action:**
    *   Update `GameToolsTab.tsx` to call `startGame` with a preset configuration and mock players.
    *   Ensure this action triggers the `isGameReady` flag.

### 8.5 Token Loading Discipline (Styling Fix)
*   **Issue:** Addresses §6 and §7.6. Dynamic token loading can cause unstyled flashes or layout shifts.
*   **Solution:** Treat style tokens as static constants.
*   **Action:**
    *   Verify `src/design/tokens.ts` contains only static objects.
    *   Ensure all components import tokens synchronously.
