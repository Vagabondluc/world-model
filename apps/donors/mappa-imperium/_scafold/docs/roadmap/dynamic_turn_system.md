
> **_Note: This document describes an aspirational feature for the Mappa Imperium roadmap. It outlines a target architecture. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Dynamic Turn Duration System - Specification

## 1. Overview

This system allows players to customize the number of years each turn represents in Eras IV, V, and VI. It provides fine-grained control over the game's narrative pacing, allowing for stories that span intimate, personal timelines or vast historical epochs.

## 2. Core Feature Requirements

-   **Game Setup Configuration**: Players can select a turn duration from a list of presets or enter a custom value during game setup.
-   **Timeline Calculation**: A central service (`TimelineCalculator`) will manage the world's current year based on the selected turn duration and game progress.
-   **Context-Aware AI**: AI-generated content must adapt its scope and tone based on the turn duration and the specific year of an event.
-   **UI Integration**: The UI must display the current year and allow users to specify event years.
-   **Data Model Update**: Element cards created from Era IV onward will be timestamped with the exact year of their creation.
-   **Export System**: Exports will include the timeline configuration and chronological event data.

## 3. Implementation Details

### 3.1. Game Setup & Configuration

-   **UI Component (`TurnDurationConfig.tsx`)**:
    -   A set of preset buttons for common turn durations (e.g., 5, 10, 15, 20 years).
    -   A "Custom" button that, when selected, reveals a number input field for the user to specify an exact number of years per turn.
    -   A toggle for "Era-Specific Durations" which, if enabled, reveals separate configuration options for Eras IV, V, and VI.
    -   A `TimelinePreview` component that dynamically shows the total calculated history length based on the current settings.
-   **State Management (`GameSettings`)**:
    -   The `GameSettings` object in `src/types.ts` will be extended:
        ```typescript
        export interface GameSettings {
          players: number;
          length: 'Short' | 'Standard' | 'Long' | 'Epic';
          turnDuration: number; // e.g., 10
          variableTurns: boolean;
          eraSpecificDurations: {
            4: number; // Age of Discovery
            5: number; // Age of Empires
            6: number; // Age of Collapse
          };
        }
        ```

### 3.2. Timeline Calculation Engine (`TimelineCalculator.ts`)

A new service responsible for all date-related calculations.

-   `calculateTotalYears()`: Calculates the full length of the chronicle based on game length and turn duration settings. (Era III is fixed at 30 years).
-   `getCurrentYear(gameState)`: Calculates the current year based on the current era and turn number.
-   `getTurnYearRange(gameState)`: Returns an object `{ start: number, end: number }` for the current turn.
-   `getEraTurnDuration(eraId)`: Returns the number of years per turn for a specific era.

### 3.3. Year-Specific Event Creation

To enhance narrative precision, players must specify the exact year an event occurs.

-   **Form Integration**: All element creation forms for Eras IV-VI (e.g., for `Event`, `Character`, `War` cards) will include a mandatory "Year of Event" number input.
-   **Input Validation**: This field will be constrained to the range provided by `timelineCalculator.getTurnYearRange()`. The UI must provide clear feedback if the user enters a year outside the current turn's range.
-   **Data Storage**: The user-provided value will be stored in the `createdYear` property of the `ElementCard`.

### 3.4. AI Guidance Adaptation

The core of this system's narrative impact. The `aiTemplateService` must be enhanced.

-   **Prompt Injection**: Before sending a request to the AI, inject a "Temporal Context" into the prompt that includes both the turn duration and the specific year.
    -   **Example for a 5-Year Turn, Event in Year 122**: *"TEMPORAL CONTEXT: The historical scale is intimate. This event occurs in the year 122, during a 5-year turn (120-124). Focus on immediate, personal-scale consequences. Character actions should have direct, visible results within 1-3 years."*
    -   **Example for a 20-Year Turn, Event in Year 255**: *"TEMPORAL CONTEXT: The historical scale is grand. This event occurs in the year 255, during a 20-year turn (250-269). Focus on historical patterns and civilizational change. The event's impact should be described as it unfolds over the following decade."*
-   **Template Adaptation**: The AI templates themselves (e.g., `5_1_empire-events-prompts.md`) should be reviewed to ensure their narrative outputs can be scaled appropriately by the temporal context.

### 3.5. Element Card & UI Updates

-   **`ElementCard` Interface**: Add a `createdYear: number` field for elements created in Era IV or later.
-   **`CurrentYearDisplay.tsx`**: A new UI component, likely in the top-left of the main header, that displays the output of `timelineCalculator.getCurrentYear()`. It should be clearly labeled "Current Year".
-   **Card Display**: Element cards could display their age ("Created in Year 120", "Age: 80 years").

### 3.6. Export System (`exportService.ts`)

-   **Chronological Export**: The primary HTML/PDF export should be a "chronicle" that organizes events by year, not just by era.
-   **Foundry VTT Integration**: Create a "Timeline" journal entry that includes the settings and a summary of major events organized by year.
-   **JSON Export**: The main JSON export must include the full turn duration configuration to ensure the session can be imported correctly.

### 3.7. Element Manager Integration

-   **Timeline View**: The Element Manager will include a new "Timeline" view mode.
    -   When activated, elements will be displayed as a vertical chronological list, sorted by their `createdYear`.
    -   Each entry should clearly display the year, the element's name, type, and a brief summary.
    -   This view provides a narrative-first way to review the world's history as it unfolded.

## 4. Development & Integration Plan

1.  **Backend First**: Implement the `TimelineCalculator` and update the `GameSettings` type.
2.  **UI Integration**: Add the configuration UI to `GameSetup.tsx` and the `CurrentYearDisplay` to the main layout.
3.  **Data Model**: Add `createdYear` to the `ElementCard` type and ensure it's populated upon creation for Eras IV+. This includes adding the "Year of Event" input to the relevant forms.
4.  **AI Adaptation**: Update the AI service to inject the temporal context into all relevant prompts.
5.  **Element Manager**: Implement the new "Timeline View" for chronological sorting.
6.  **Export Enhancement**: Refactor the export service to produce chronological outputs.
7.  **Testing**: Create a dedicated test suite for the `TimelineCalculator` with various configurations.

This system will transform Mappa Imperium from a turn-based game into a true historical chronicle, allowing for deeper and more varied storytelling.