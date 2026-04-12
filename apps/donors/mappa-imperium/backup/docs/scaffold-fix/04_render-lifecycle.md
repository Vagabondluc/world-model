# 04_render-lifecycle.md

## Title
Render Lifecycle & Initialization Repair Specification

## Problem Summary
The removal of an unstable callback ("force settle" loop) from the Scaffold version has revealed hidden initialization bugs. Components are now initializing too early, attempting to access properties on undefined objects before the data is fully settled, causing crashes on the first render.

## Scaffold Working Logic
*   **Mechanism:** Passed an unstable `handleContentReady` callback to child components.
*   **Behavior:** This triggered infinite/extra render loops that inadvertently "force settled" the state.
*   **Result:** Data was initialized and available before the user saw the UI, masking underlying timing issues.

## Src Broken Logic
*   **Mechanism:** Stabilized the callback using `useCallback`.
*   **Behavior:** Efficient rendering means components mount immediately.
*   **Result:** Without the extra render cycles, components attempt to read deep properties (e.g., `gameSettings.turnDuration`) before the parent has finished hydrating the state, leading to "cannot read property X of undefined".

## Proposed Fix
Implement **Explicit Loading Gates** and **Safe Accessors**.

1.  **Global Loading Gate:**
    *   In `AppLayout`, checking the `isGameReady` flag (see File 01).
    *   Render a `<LoadingSpinner />` or `null` instead of the `EraContent` children until `isGameReady` is true.

2.  **Component-Level Guards:**
    *   In era components (e.g., `EraDiscoveryContent`), add immediate checks at the top of the render function:
        ```typescript
        if (!gameSettings || !currentPlayer) return <LoadingSpinner />;
        ```
    *   This ensures that subsequent code paths (hooks, calculations) are never executed against undefined core data.

3.  **Safe Access Patterns:**
    *   Replace direct access chains (e.g., `gameSettings.turnDuration`) with optional chaining (`gameSettings?.turnDuration`) or default fallbacks in `useMemo` hooks.

## Migration / Patch Notes
*   **Files Affected:** `src/components/layout/AppLayout.tsx`, all `src/components/era-interfaces/Era*Content.tsx` files.
*   **Code Change:** Wrap main component returns in conditional rendering blocks.

## Optional Test Scenarios
1.  **Cold Start:** Open the application in a new Incognito window (no local storage). Proceed to setup. Start game. The transition to the game view should be smooth, with no white-screen crashes.
2.  **Hard Refresh:** While in Era 3, hard refresh the page (Cmd+Shift+R). The app should recover gracefully without console errors regarding undefined `gameSettings`.