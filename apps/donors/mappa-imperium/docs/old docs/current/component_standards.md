# Component & Code Quality Standards

This document formalizes the development standards for the Mappa Imperium application. Its purpose is to ensure the codebase remains consistent, maintainable, and high-quality as it evolves. All new code and refactoring efforts must adhere to these guidelines.

## 1. File & Component Organization

-   **Feature-Based Grouping**: Components are organized by the feature or era they belong to.
    -   Era-specific interfaces are located in `/src/components/era-interfaces/`.
    -   Truly reusable, cross-feature components reside in `/src/components/shared/`.
-   **Single Responsibility**: Each component should have a single, clearly defined purpose.
-   **File Naming**: Use `PascalCase` for all component files (e.g., `PlayerSelection.tsx`).

## 2. Strict File Size Limits

To prevent components from becoming monolithic and difficult to maintain, we enforce strict line counts.

-   **React Components (`.tsx`)**: Maximum **200 lines** (excluding imports and comments).
-   **Hooks (`.ts`)**: Maximum **100 lines**.
-   **Utilities (`.ts`)**: Maximum **80 lines**.

**A warning should be considered for files approaching these limits.** If a component exceeds these limits, it **must** be refactored into smaller, more focused sub-components and custom hooks.

## 3. Component Structure

Components should follow a consistent internal structure for readability.

1.  **Imports**: All import statements at the top.
2.  **Type/Interface Definitions**: Props and local state interfaces (if not imported from `src/types.ts`).
3.  **Component Function**: The main component function declaration.
4.  **State Management**: `useState`, `useReducer`, and context hook calls (`useGame`, `useAI`).
5.  **Memoization**: `useMemo` hooks for expensive calculations.
6.  **Side Effects**: `useEffect` hooks.
7.  **Event Handlers**: `useCallback` for memoized event handlers.
8.  **Render Logic**: The main JSX return statement.

## 4. State Management

-   **Local State First**: Use `useState` for state that is confined to a single component.
-   **Shared State via Context**: For state that needs to be shared across multiple components, use the appropriate React Context.
    -   **`GameContext`**: For global application state (players, elements, game settings).
    -   **`AIContext`**: For managing AI API interactions.
    -   **`EraCreationContext`**: For the specific, complex state of the Era I interface.
-   **Avoid Prop Drilling**: If you find yourself passing props down through more than two levels of components, consider whether that state belongs in a context.

## 5. Styling

-   **Component Class Library**: **All styling must prioritize using the predefined component classes from `index.html`**.
-   **No Inline Utility Strings**: Avoid long, complex strings of Tailwind utility classes in the `className` prop. The goal is semantic and clean JSX.
    -   **Incorrect**: `<button className="px-4 py-2 bg-amber-700 text-white font-bold...">`
    -   **Correct**: `<button className="btn btn-primary">`
-   **One-Off Styles**: For unique, non-reusable styles, utility classes are acceptable but should be used sparingly.

## 6. Accessibility (A11y)

Accessibility is a mandatory requirement for all components.

-   **Semantic HTML**: Use correct HTML5 tags for their intended purpose (`<nav>`, `<main>`, `<button>`, etc.). Do not use `<div>` for interactive elements.
-   **Keyboard Navigability**: All interactive elements must be focusable and operable using the keyboard alone.
-   **Focus States**: All focusable elements must have a clear and visible focus state (e.g., `focus:ring-2`).
-   **ARIA Attributes**: Use ARIA (`Accessible Rich Internet Applications`) attributes where necessary to provide context, especially for complex or custom components.
    -   `aria-label`: For buttons with only an icon.
    -   `aria-expanded`: For dropdowns and collapsible sections.
    -   `aria-current`: For active navigation links.
    -   `role`: To define the purpose of an element (e.g., `role="dialog"` for modals).

## 7. Imports

-   **Centralized Types**: All shared data structures (e.g., `ElementCard`, `Player`) **must** be imported from `src/types.ts`. Avoid defining duplicate interfaces locally within components.
-   **Absolute Paths**: Configure and use absolute paths for imports (e.g., `import { useGame } from 'src/contexts/GameContext'`) to improve clarity and simplify refactoring. (Note: Currently using relative paths, will be updated).