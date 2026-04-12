# Code Review Checklist

This checklist must be used during code review to ensure all contributions adhere to the project's quality standards.

## 1. Functionality & Requirements

-   [ ] **Meets Requirements**: Does the code successfully implement all requirements of the linked task in `to_do.md`?
-   [ ] **Works Correctly**: Have you tested the feature and confirmed it works as expected without any obvious bugs?
-   [ ] **Handles Edge Cases**: Does the code gracefully handle unexpected inputs, empty states, and potential errors?

## 2. Code Quality & Readability

-   [ ] **Clarity**: Is the code easy to understand? Are variable and function names clear and descriptive?
-   [ ] **File Size**: Does the file adhere to the line limits defined in the [Component & Code Quality Standards](./component_standards.md)?
    -   Components: < 200 lines
    -   Hooks: < 100 lines
    -   Utilities: < 80 lines
-   [ ] **No Dead Code**: Is there any commented-out or unreachable code?
-   [ ] **TypeScript Usage**: Is `any` avoided where possible? Are types used effectively to prevent errors?

## 3. Component Standards Compliance

-   [ ] **Single Responsibility**: Does each component have a single, well-defined purpose?
-   [ ] **Styling**: Does the component use the centralized component classes from `tailwind-components.css` instead of long utility class strings?
-   [ ] **State Management**: Is state managed appropriately?
    -   Local state (`useState`) is used for component-specific data.
    -   Shared state is correctly managed via the appropriate Context (`GameContext`, `AIContext`, etc.).
    -   Prop drilling is avoided.

## 4. Accessibility (A11y)

-   [ ] **Semantic HTML**: Are appropriate HTML5 tags used? (`button` for buttons, `nav` for navigation, etc.)
-   [ ] **Keyboard Navigation**: Can all interactive elements be accessed and operated using only the keyboard?
-   [ ] **Visible Focus**: Is there a clear visual indicator for the currently focused element?
-   [ ] **ARIA Attributes**: Are `aria-*` attributes used correctly where needed (e.g., `aria-label` for icon buttons, `aria-expanded` for toggles)?

## 5. Documentation

-   [ ] **Code Comments**: Is complex or non-obvious logic explained with comments?
-   [ ] **Documentation Update**: If this change affects a core architectural pattern, have the relevant documents in `/docs/current/` been updated?
    -   `current_architecture_overview.md`
    -   `component_standards.md`
    -   `ai_interaction_patterns.md`
    -   etc.
