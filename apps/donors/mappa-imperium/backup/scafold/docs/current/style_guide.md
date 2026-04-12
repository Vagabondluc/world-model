# Mappa Imperium - Style Guide

This document defines the visual design standards for the Mappa Imperium application. Its purpose is to ensure a consistent, high-quality, and accessible user experience across all components.

## 1. Color Palette

Our color palette is designed to be thematic, evoking the feeling of old maps and chronicles, while maintaining clarity and accessibility.

-   **Primary (Amber)**: Used for headers, active states, and primary actions.
    -   `bg-amber-900`: Main header background.
    -   `bg-amber-800`: Navigation button background.
    -   `bg-amber-700`: Active navigation, Player Status button.
    -   `bg-amber-600`: Primary buttons, active form elements.
    -   `bg-amber-500`: Borders, accents.
    -   `bg-amber-300`: Focus rings.
    -   `bg-amber-200`: Hover states, secondary backgrounds.
    -   `bg-amber-100`: Light backgrounds, hover states.
    -   `bg-amber-50`: Very light backgrounds (e.g., rule sections).

-   **Neutral (Gray)**: Used for body text, backgrounds, and disabled states.
    -   `bg-gray-800`: Dark text.
    -   `bg-gray-600`: Secondary text.
    -   `bg-gray-400`: Disabled elements, borders.
    -   `bg-gray-200`: Main page background.
    -   `bg-gray-100`: Light UI backgrounds, hover states.
    -   `bg-gray-50`: Very light backgrounds (e.g., filter bar).

-   **Accent Colors (for status and feedback)**:
    -   **Success (Green)**: `bg-green-600` (completed era), `bg-green-500` (online status).
    -   **Informational (Blue)**: `bg-blue-600` (available era), `bg-blue-100` (debug buttons).
    -   **Destructive/Error (Red)**: `bg-red-600` (delete buttons), `bg-red-50` (error messages).

-   **Element Borders**: Used to visually distinguish element card types in sidebars.
    -   `border-orange-500`: Resource
    -   `border-purple-500`: Deity
    -   `border-green-500`: Location
    -   `border-blue-500`: Faction
    -   `border-gray-500`: Settlement
    -   `border-rose-500`: Character
    -   `border-amber-500`: Event, War, Monument

## 2. Typography

-   **Font Family**: The UI primarily uses the system's default sans-serif font stack for clarity. Serif fonts (`'Georgia', 'Times New Roman', serif`) are used for rulebook content to give a more classic feel.
-   **Headings**:
    -   `<h1>` (e.g., `text-5xl font-extrabold text-amber-900`): For main page titles.
    -   `<h2>` (e.g., `text-3xl font-bold text-amber-800`): For major section titles.
    -   `<h3>` (e.g., `text-2xl font-bold text-amber-900`): For sub-section titles.
-   **Body Text**: Default text is `text-gray-800`. Secondary or descriptive text is `text-gray-600`.

## 3. Component Styling

### Buttons

-   **Primary Action**: `.btn-primary` (`bg-amber-700`).
-   **Secondary Action**: `.btn-secondary` (`bg-gray-200`).
-   **Destructive Action**: `.btn-destructive` (`bg-red-600`).
-   **Era Buttons**: `.btn-era` with state modifiers like `.btn-era-completed`.

### Cards

-   **Base Card**: `.card-base` (`bg-white`, `rounded-lg`, `shadow-sm`, `border`).
-   **Interactive Card**: `.card-interactive` (adds hover effects).
-   **Setup/Selection Cards**: `.page-card` (larger, more prominent styling).

### Modals

-   **Overlay**: Semi-transparent black background (`bg-black bg-opacity-60`).
-   **Content**: White, padded, rounded, and shadowed content box.

### Forms

-   **Inputs/Textareas**: `.input-base` provides consistent styling, including a clear focus state.
-   **Labels**: `.form-label` ensures consistent typography for labels.

### Dropdowns (e.g., Player Status, Actions Menu)

-   **CRITICAL RULE**: All dropdown menu items that appear on a light background (`bg-white` or `bg-gray-100`) **MUST** have an explicit dark text color class (e.g., `text-gray-800`). Do not rely on inherited text colors.
-   **Container**: `.dropdown-menu` (`bg-white`, `rounded-lg`, `shadow-xl`, `border`).
-   **Items**: `.dropdown-item` (provides padding and hover effects).

## 4. Era Interface Conventions

-   **Two-Column Layout**: Era gameplay interfaces use a standardized two-column grid layout (`EraLayoutContainer.tsx`).
-   **Collapsible AI Sections**: AI generation tools are placed inside a standard, collapsible `<details>` element (`AIGenerationSection.tsx`).
-   **Colored Card Borders**: Element cards displayed within the era interfaces use a colored left border to denote their type for quick visual identification.