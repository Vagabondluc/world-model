
# Feature Proposal: AI Narrator & Scene Management System

**TO:** Mappa Imperium Development Team  
**CC:** Project Stakeholders, UI/UX Team  
**FROM:** Lead Frontend Engineer  
**DATE:** October 28, 2023  
**SUBJECT:** Feature Proposal: AI Narrator for Cohesive Storytelling

## 1. Overview

This document proposes the development of an **AI Narrator** to generate transitional story segments between gameplay "scenes." The goal is to weave player actions into a cohesive chronicle, adding narrative depth and improving the flow of the game, especially in asynchronous (Play-by-Email) formats. This system will introduce a formal concept of "scenes" tied directly to the game's progress tracker.

## 2. The Concept of "Scenes"

A "scene" is a significant gameplay milestone that is considered complete only when all active players have finished their required actions for that milestone. This creates natural breakpoints in the story for the AI Narrator to fill.

-   **Era I-III (Foundation Eras)**: A scene corresponds to the completion of a major, numbered gameplay step from the rulebook (e.g., "2.2 Pantheon Creation" in Era II, "3.4 Early Settlers" in Era III).
-   **Era IV-VI (Turn-Based Eras)**: A scene corresponds to a full "round" of turns, where every active player has completed one turn.

## 3. The AI Narrator Workflow

1.  **Trigger**: When the `CompletionTracker` component detects that all active players have met the requirements for the current scene, a "Generate Interlude" button will appear for the player who completed the final action.
2.  **Generation**: The player clicks the button, which opens a modal. The system then compiles a detailed context from the completed scene and sends it to the AI.
3.  **Prompt Context**: The AI prompt will include:
    -   A summary of all elements created or significantly modified during the scene.
    -   The current game year, era, and scene number.
    -   The player(s) who acted in the scene and the player(s) whose turn is next.
    -   A directive to:
        -   Create a narrative bridge to the next scene.
        -   Describe the passage of time and the immediate consequences of recent events.
        -   Foreshadow potential future developments.
4.  **Review & Save**: The player reviews the generated text in the modal. They can "Accept," "Regenerate," or "Skip." If accepted, the narrative is saved as a new **`Narration`** element card, and the game progresses to the next scene.

## 4. Technical Implementation Details

### A. New Element Type: `Narration`

To store the generated interludes, a new `ElementCard` type will be created.

-   **`src/types.ts`**:
    -   Add `'Narration'` to the `ElementCard['type']` union.
    -   Create a new interface: `export interface Narration { id: string; description: string; sceneNumber: number; }`
    -   Add `Narration` to the `ElementCard['data']` union.
-   **Benefit**: This allows interludes to be timestamped with the current game year and appear chronologically in the Element Manager's timeline view, fully integrating them into the world's history.

### B. Scene Management in `GameContext`

The global state will be expanded to track scene progression.

-   **`src/contexts/GameContext.tsx`**:
    -   Add `sceneNumber: number` to the game state, initialized to `1`.
    -   Implement a new handler, `handleAdvanceScene()`, which will increment the `sceneNumber` and reset the turn-based completion flags for players.

### C. Integration with `CompletionTracker`

The `CompletionTracker` will become the central hub for managing scene transitions.

-   **`src/components/layout/CompletionTracker.tsx`**:
    -   The logic that determines when all players have completed their era tasks will now also check if a scene is complete.
    -   When a scene is complete, the "Advance Era" button's function will be replaced or supplemented by the "Generate Interlude" workflow.

## 5. Function Design

This feature requires new and modified functions in key parts of the application.

### `CompletionTracker.tsx`

-   **`calculateSceneCompletion()`**: A new function to determine if the current scene is complete.
    -   It will check the progress of all `isOnline` players.
    -   For Eras I-III, it verifies if all players have completed the tasks for the current major step.
    -   For Eras IV-VI, it verifies if all players have completed one turn within the current scene/round.

### `GameContext.tsx`

-   **`handleGenerateNarration()`**: An async function called when the user clicks "Generate Interlude."
    ```typescript
    // Pseudocode
    const handleGenerateNarration = async () => {
      // 1. Gather context from all elements created/modified in the current scene.
      const sceneContext = elements.filter(el => el.sceneCreated === sceneNumber);
      
      // 2. Build a detailed prompt using an AI template.
      const prompt = buildNarrationPrompt(sceneContext, gameSettings, players);
      
      // 3. Call the AI service.
      const narrativeText = await aiService.generate(prompt);

      // 4. Display the text in a modal for user review.
      showNarrationModal(narrativeText);
    };
    ```
-   **`handleAcceptNarration(narrativeText: string)`**: Called when the user accepts the generated text.
    ```typescript
    // Pseudocode
    const handleAcceptNarration = (narrativeText: string) => {
      // 1. Create the new Narration element.
      handleCreateElement({
        type: 'Narration',
        name: `Interlude: End of Scene ${sceneNumber}`,
        owner: 0, // System-owned
        era: currentEraId,
        data: { description: narrativeText, sceneNumber },
        createdYear: timelineCalculator.getCurrentYear(...)
      });

      // 2. Advance to the next scene.
      handleAdvanceScene();
    };
    ```

This architecture provides a robust framework for adding a powerful narrative layer to the game, enhancing the storytelling experience for all players.
