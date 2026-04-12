

# Style Token & Component Class Analysis

## 1. Overview & Purpose

This document serves as a comprehensive analysis of the application's styling, identifying duplicated style patterns and hardcoded CSS. It **proposed** a new, centralized CSS architecture using Tailwind's `@apply` directive to create a reusable component class library. **This proposal has been implemented, with the final class library located directly inside `index.html`.**

This refactor will address the following critical issues:
-   **Code Duplication**: Eliminates long, repeated strings of Tailwind classes in TSX components.
-   **Inconsistency**: Provides a single source of truth for the visual appearance of common UI elements.
-   **Maintainability**: Allows for theme-wide style changes by editing a single file (`index.html`).
-   **Separation of Concerns**: Moves styling logic out of components and into the stylesheet where it belongs.

## 2. Component Class Library

The following classes are defined in **`index.html`** inside the `<style type="text/tailwindcss">` block, under the `@layer components` directive.

---

### Page Layouts & Containers

#### `.layout-centered-card`
- **Description**: The main container for the setup and selection screens, which centers a single large card.
- **Tailwind Utilities**: `min-h-screen flex items-center justify-center bg-gray-200 relative`
- **Found In**: `GameSetup.tsx`, `PlayerSelection.tsx`

#### `.page-card`
- **Description**: The large, prominent card used on setup and selection screens.
- **Tailwind Utilities**: `bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg border-t-8 border-amber-600`
- **Found In**: `GameSetup.tsx`, `PlayerSelection.tsx`

#### `.content-box-main`
- **Description**: The primary content container used in the main app layout.
- **Tailwind Utilities**: `w-full p-8 bg-white rounded-lg shadow-xl border-t-4 border-amber-600`
- **Found In**: `AppLayout.tsx`

#### `.filter-bar`
- **Description**: Container for the filter and view controls in the Element Manager.
- **Tailwind Utilities**: `mb-4 p-4 bg-gray-50 rounded-lg border flex flex-col md:flex-row gap-4 items-center`
- **Found In**: `ElementManager.tsx`

---

### Buttons

#### `.btn` (Base Button Style)
-   **Description**: Base styles for all buttons, ensuring consistent padding, font, and transitions.
-   **Tailwind Utilities**: `px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out`
-   **Found In**: `EraButton.tsx`, `NavigationHeader.tsx`, `GameSetup.tsx`, etc.

#### `.btn-primary`
-   **Description**: The primary call-to-action button.
-   **Tailwind Utilities**: `bg-amber-700 text-white font-bold py-3 px-4 hover:bg-amber-800 transition-transform transform hover:scale-105 shadow-lg`
-   **Found In**: `GameSetup.tsx`, `PlayerSelection.tsx`

#### `.btn-secondary`
-   **Description**: For secondary actions like "Cancel" or "Clear".
-   **Tailwind Utilities**: `bg-gray-200 text-gray-800 hover:bg-gray-300`
-   **Found In**: `EditElementModal.tsx`, `ConfirmationModal.tsx`

#### `.btn-destructive`
-   **Description**: For dangerous actions like "Delete".
-   **Tailwind Utilities**: `bg-red-600 text-white hover:bg-red-700`
-   **Found In**: `ConfirmationModal.tsx`, `PlayerStatus.tsx` (Debug)

#### `.btn-era`
-   **Description**: The base style for the main era selection buttons.
-   **Tailwind Utilities**: `flex items-center gap-3 px-4 py-2 rounded-md font-semibold transition-all duration-200 ease-in-out transform hover:-translate-y-1 shadow-md border-b-4`
-   **Found In**: `EraButton.tsx`

#### `.btn-era-completed`, `.btn-era-current`, `.btn-era-locked`, `.btn-era-available`
-   **Description**: State modifiers for `.btn-era`.
-   **Tailwind Utilities**:
    -   `bg-green-600 text-white border-green-800 hover:bg-green-500`
    -   `bg-amber-600 text-white border-amber-800 ring-4 ring-amber-300 ring-offset-2 ring-offset-amber-900`
    -   `bg-gray-400 text-gray-200 border-gray-600 cursor-not-allowed`
    -   `bg-blue-600 text-white border-blue-800 hover:bg-blue-500`
-   **Found In**: `EraButton.tsx`

#### `.btn-toggle`
- **Description**: A two-state button used for selections like game length.
- **Tailwind Utilities**: `px-4 py-2 rounded-md font-semibold transition-colors duration-200 border-2 bg-gray-100 text-gray-700 border-gray-300 hover:bg-amber-100 hover:border-amber-400`
- **Found In**: `GameSetup.tsx`, `PlayerSelection.tsx`

#### `.btn-toggle-active`
- **Description**: The active state for `.btn-toggle`.
- **Tailwind Utilities**: `bg-amber-600 text-white border-amber-800`
- **Found In**: `GameSetup.tsx`, `PlayerSelection.tsx`

#### `.btn-icon`
-   **Description**: A square button used for icons, like settings and debug.
-   **Tailwind Utilities**: `w-9 h-9 rounded-md font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2`
-   **Found In**: `NavigationHeader.tsx`

#### `.btn-menu-trigger`
- **Description**: The small, subtle button (e.g., vertical ellipsis) to open a dropdown menu.
- **Tailwind Utilities**: `p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors`
- **Found In**: `ResourceCard.tsx`, `DeityCard.tsx`, etc.

---

### Cards

#### `.card-base`
-   **Description**: The base structure for all element display cards.
-   **Tailwind Utilities**: `bg-white p-4 rounded-lg shadow-sm border flex flex-col`
-   **Found In**: `ElementCardDisplay.tsx`, `ResourceCard.tsx`, `DeityCard.tsx`, etc.

#### `.card-interactive`
-   **Description**: Hover effects for cards that are clickable.
-   **Tailwind Utilities**: `hover:shadow-md hover:border-amber-400 transition-all cursor-pointer`
-   **Found In**: `ElementCardDisplay.tsx`, `ElementListRow.tsx`

---

### Navigation & Headers

#### `.header-main`
- **Description**: The main sticky application header.
- **Tailwind Utilities**: `bg-amber-900 text-amber-100 p-4 shadow-lg sticky top-0 z-50`
- **Found In**: `NavigationHeader.tsx`

#### `.nav-container`
- **Description**: The rounded container for the view-switching navigation buttons.
- **Tailwind Utilities**: `flex items-center gap-2 bg-amber-900/50 p-1 rounded-lg`
- **Found In**: `NavigationHeader.tsx`

#### `.nav-button`
-   **Description**: A simpler button style used for the main 'Rulebook'/'Element Manager' view toggle.
-   **Tailwind Utilities**: `px-4 py-2 rounded-md font-semibold transition-colors duration-200`
-   **Found In**: `NavigationHeader.tsx`

#### `.nav-button-active`
- **Description**: The active state for a `.nav-button`.
- **Tailwind Utilities**: `bg-amber-700 text-white`
- **Found In**: `NavigationHeader.tsx`

#### `.nav-button-inactive`
- **Description**: The inactive state for a `.nav-button`.
- **Tailwind Utilities**: `bg-amber-800 hover:bg-amber-700`
- **Found In**: `NavigationHeader.tsx`

---

### Forms & Inputs

#### `.input-base`
-   **Description**: Consistent styling for all `input`, `textarea`, and `select` elements.
-   **Tailwind Utilities**: `block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white text-gray-900 disabled:bg-gray-100`
-   **Found In**: `EditElementModal.tsx`, `FactionForm.tsx`, `ResourcePlacer.tsx`, etc.

#### `.input-range`
- **Description**: Style for a slider/range input.
- **Tailwind Utilities**: `w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600`
- **Found In**: `GameSetup.tsx`

#### `.form-label`
-   **Description**: Consistent styling for form field labels.
-   **Tailwind Utilities**: `block text-sm font-medium text-gray-700 mb-1`
-   **Found In**: All form components.

---

### Typography & Sections

#### `.section-header`
-   **Description**: The primary header for a rulebook section.
-   **Tailwind Utilities**: `text-3xl font-bold text-amber-800 border-b-2 border-amber-200 pb-2 mb-4`
-   **Found In**: `RuleSection.tsx`

#### `.rule-text`
- **Description**: Standard paragraph styling for rulebook content.
- **Tailwind Utilities**: `text-gray-700 leading-relaxed`
- **Found In**: All `Era*Rules.tsx` components.

---

### UI Elements

#### `.pill-badge`
-   **Description**: A small, rounded element for displaying status or metadata.
-   **Tailwind Utilities**: `text-sm font-semibold text-amber-200 bg-amber-800/70 px-3 py-1 rounded-full whitespace-nowrap`
-   **Found In**: `NavigationHeader.tsx` (Current Year Display)

#### `.reference-link`
- **Description**: A styled link used in rulebooks to open modal tables.
- **Tailwind Utilities**: `text-amber-800 underline font-bold hover:text-amber-600 bg-none border-none p-0 cursor-pointer`
- **Found In**: `Era*Rules.tsx` components.

---

### Tables

#### `.table-container`, `.table-base`, `.table-header`, `.table-th`, `.table-td`, `.table-body`, `.table-row`
- **Description**: A complete set of classes for creating standardized, responsive rulebook tables.
- **Tailwind Utilities**:
    - `.table-container`: `overflow-x-auto my-4 rounded-lg border border-gray-200 shadow-sm`
    - `.table-base`: `min-w-full divide-y-2 divide-gray-200 bg-white text-sm`
    - `.table-header`: `bg-amber-50`
    - `.table-th`: `whitespace-nowrap px-4 py-3 text-left font-semibold text-amber-900`
    - `.table-td`: `px-4 py-3 text-gray-700`
    - `.table-body`: `divide-y divide-gray-200`
    - `.table-row`: `hover:bg-amber-50/50`
- **Found In**: `RuleTable.tsx` and all `Era*Rules.tsx` components.

---

### Modals & Dropdowns

#### `.dropdown-menu`
- **Description**: The container for a dropdown menu, like the Player Status or Actions menu.
- **Tailwind Utilities**: `absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50`
- **Found In**: `PlayerStatus.tsx`, `ElementCardDisplay.tsx`

#### `.dropdown-item`
- **Description**: A single clickable item within a dropdown menu.
- **Tailwind Utilities**: `w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md`
- **Found In**: `PlayerStatus.tsx`, `ElementCardDisplay.tsx`

---

### Progress Trackers

#### `.progress-bar-track` & `.progress-bar-fill`
- **Description**: Classes for the background track and filled portion of a progress bar.
- **Tailwind Utilities**:
    - `.progress-bar-track`: `w-full bg-gray-600 rounded-full h-4`
    - `.progress-bar-fill`: `bg-green-500 h-full rounded-full transition-all duration-500`
- **Found In**: `CompletionTracker.tsx`

---

### Miscellaneous UI Patterns

#### `.toggle-group`, `.toggle-btn`, `.toggle-btn-active`
- **Description**: A set of classes for a group of toggle buttons (like Grid/List/Timeline view).
- **Tailwind Utilities**:
    - `.toggle-group`: `flex items-center gap-1 bg-gray-200 p-1 rounded-lg`
    - `.toggle-btn`: `px-3 py-1 rounded-md transition-colors text-gray-600 hover:bg-gray-300`
    - `.toggle-btn-active`: `bg-white shadow text-amber-800 font-semibold`
- **Found In**: `ElementManager.tsx`