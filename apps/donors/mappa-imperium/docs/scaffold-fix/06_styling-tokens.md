# 06_styling-tokens.md

## Title
Styling & Token Bootstrapping Repair Specification

## Problem Summary
The move from synchronous styles to an asynchronous JavaScript object (`src/design/tokens.ts`) for style tokens causes layout shifts and unstyled flashes (FOUC). Dynamic class construction fails if the token module hasn't finished loading when the component renders.

## Scaffold Working Logic
*   **Mechanism:** Styles were hardcoded strings or standard CSS files.
*   **Behavior:** Styles were applied instantly and synchronously upon render by the browser.
*   **Result:** Stable layout on first paint.

## Src Broken Logic
*   **Mechanism:** Uses a JavaScript object (`src/design/tokens.ts`) as a Style Registry.
*   **Behavior:** Token availability depends on module load order.
*   **Result:** Dynamic class construction (e.g., `${componentStyles.button.primary}`) evaluates to `undefined` or `null` if the module isn't ready, causing the component to render without classes.

## Proposed Fix
Enforce **Synchronous Token Resolution**.

1.  **Static Constants:**
    *   Ensure `src/design/tokens.ts` exports a simple, static `const` object, not a function or a promise.
    *   Remove any async logic from the token definition file.

2.  **Direct Imports:**
    *   Components must import `componentStyles` directly at the top of the file.
    *   Do not use dynamic imports (`await import(...)`) for styling tokens.

3.  **Fallback Safety:**
    *   Create a utility function `getStyle(path)` that returns a safe default (e.g., a basic tailwind string) if the requested token is missing, preventing the `className` attribute from receiving `undefined`.

    ```typescript
    // Example safe accessor
    export const getStyle = (path: string) => get(componentStyles, path) || 'bg-gray-500'; 
    ```

## Migration / Patch Notes
*   **Files Affected:** `src/design/tokens.ts`, and core UI components (`Button.tsx`, `Card.tsx`).
*   **Code Change:** Verify `tokens.ts` is purely declarative JSON-like data.

## Optional Test Scenarios
1.  **Network Throttle:** Set browser network throttling to "Slow 3G". Reload the page. Verify that buttons and cards render with their correct colors and shapes immediately, rather than popping into existence after a delay.