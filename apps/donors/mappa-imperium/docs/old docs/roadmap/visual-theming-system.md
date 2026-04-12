# Feature Proposal: Light/Dark Mode Theming System

## 1. Overview

This document proposes the implementation of a dynamic theming system for Mappa Imperium, deprecating the previous multi-theme approach. The new system will focus on a simpler, more modern implementation of a light/dark/system mode toggle.

This will enhance personalization and accessibility by respecting user's operating system preferences while still allowing for manual overrides. The architecture will leverage CSS Custom Properties (variables) defined at the `:root` level and the `@media (prefers-color-scheme: dark)` media query.

## 2. Architecture

The system will be built on three core concepts:

1.  **CSS Variable-based Styling**: All colors in the application's component class library (`index.html`) will be refactored to use CSS variables instead of hardcoded Tailwind color classes.
2.  **Light & Dark Palettes**: We will define two complete color palettes using CSS variables. The light mode palette will be the default, and the dark mode palette will be applied via a media query.
3.  **User Override**: A simple UI toggle in the settings will allow the user to select "Light," "Dark," or "System." This will apply a `data-theme` attribute to the `<html>` element (`<html data-theme="dark">`), which can override the system preference.

### Example CSS Structure
```css
/* in index.html */
:root {
  /* Default: Light Theme */
  --color-background: #e5e7eb; /* gray-200 */
  --color-text: #1f2937;       /* gray-800 */
  --color-primary: #b45309;   /* amber-700 */
  /* ... all other color variables ... */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Dark Theme (when system preference is dark and no override is set) */
    --color-background: #1f2937; /* gray-800 */
    --color-text: #f3f4f6;       /* gray-100 */
    --color-primary: #fcd34d;   /* amber-300 */
    /* ... */
  }
}

[data-theme="dark"] {
  /* Dark Theme (when user explicitly selects dark mode) */
  --color-background: #1f2937;
  --color-text: #f3f4f6;
  --color-primary: #fcd34d;
  /* ... */
}
```

## 3. Implementation Plan

1.  **Refactor `index.html` Styles**: Systematically replace all hardcoded color classes (e.g., `bg-amber-700`, `text-gray-800`) in the `@apply` directives with their corresponding CSS variable (e.g., `bg-[var(--color-primary)]`, `text-[var(--color-text)]`).
2.  **Define Color Palettes**: Define the full set of light and dark mode color variables inside the `:root` and media query blocks.
3.  **Implement UI Toggle**: Add a simple Light/Dark/System toggle component to `SettingsModal.tsx`.
4.  **Update `ThemeContext`**: The existing `ThemeContext` will be simplified to manage this toggle's state, applying the `data-theme` attribute to the `<html>` element.

This approach provides a robust, modern, and maintainable theming system that is far simpler than the previous multi-theme JavaScript implementation, while better aligning with modern web standards.