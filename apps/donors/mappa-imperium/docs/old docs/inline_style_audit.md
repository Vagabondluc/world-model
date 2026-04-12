# Inline Style Audit

This document inventories all uses of inline CSS styles (`style="..."` or `style={{...}}`) in the Mappa Imperium application. Its purpose is to justify necessary uses of inline styling and flag any instances that should be refactored to use the centralized component class library in `index.html`.

A core principle of the application's styling architecture is to avoid inline styles for static, reusable layouts. However, a few specific cases require inline styles for dynamic functionality.

---

## 1. Necessary Dynamic Inline Styles

These are instances where inline styles are required to dynamically calculate a value based on application state or user interaction. They are considered acceptable and do not need to be refactored.

### Progress Bar Widths

-   **Files**:
    -   `src/components/layout/CompletionTracker.tsx`
    -   `src/components/shared/StepProgressBar.tsx`
-   **Style**: `style={{ width: \`${percentage}%\` }}`
-   **Justification**: The `width` of the progress bar's fill element must be calculated dynamically based on the completion percentage, which is derived from game state. This cannot be achieved with static CSS classes.

### Tooltip Positioning

-   **Files**:
    -   `src/components/shared/ElementTooltip.tsx`
    -   `src/components/shared/HelpTooltip.tsx`
-   **Style**: `style={{ top: ..., left: ..., visibility: ... }}`
-   **Justification**: The `top` and `left` positions of the tooltip element must be calculated in JavaScript based on the screen position and dimensions of the element the user is hovering over. This ensures the tooltip appears in the correct place relative to its trigger, which is not possible with static CSS.

### UI State & Theme Previews

-   **Files**:
    -   `src/components/shared/RichTextEditor.tsx`
-   **Style**: `style={{ backgroundColor: ... }}`
-   **Justification**: In `RichTextEditor`, the background color changes based on the `isReadOnly` prop. This cannot be handled by static classes alone.

---

## 2. Styles in Static & Mockup Content

These styles are found in non-React, static HTML files that are used for mockups or as shareable assets. They fall outside the main application's styling system and are not considered a high priority for refactoring, but their presence is noted here for completeness.

### Mockup Files

-   **Files**:
    -   `docs/example/dynamic_event_form_mockup.html`
    -   `upload/theme-switcher-system.tsx` (Example file)
-   **Style**: Various `style="..."` or `style={{...}}` attributes for layout, positioning, and color.
-   **Justification**: These are self-contained mockup or example files intended to demonstrate UI concepts. The inline styles are used for simplicity and to ensure the mockup renders correctly on its own, without dependency on the main application's stylesheet.

---

## 3. Conclusion

The core React application is clean of unnecessary or static inline styles. All identified instances are justified by the need for dynamic, state-driven calculations that cannot be handled by the static component class library. The application adheres to the principle of using centralized CSS classes for all static styling.