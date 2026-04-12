# Feature Proposal: Meta Characters

**TO:** Mappa Imperium Development Team
**FROM:** Lead Frontend Engineer
**DATE:** October 27, 2023
**SUBJECT:** Feature Proposal: "Meta Character" AI Player Type

## 1. Overview

This document proposes the addition of a "Meta Character" option for AI-controlled players. This feature introduces a new layer of dynamic, unpredictable storytelling by allowing certain AI players to operate under a different set of rules for worldbuilding, acting as wildcards or narrative catalysts within the game.

## 2. The Concept

A "Meta Character" is an AI player that is not bound by the standard, balanced rules of element creation that human players (and standard AI players) must follow. When an AI is flagged as "meta," the system is permitted to give it more powerful, unusual, or narratively significant actions.

**Purpose:**
-   **Introduce Unpredictability**: Meta characters can introduce unexpected challenges or boons, forcing human players to adapt their strategies.
-   **Simulate "GM" Actions**: They can act as a stand-in for a Game Master, creating world-shaking events, legendary monsters, or powerful artifacts that drive the story forward.
-   **Enhance Solo Play**: A solo player can add a "meta" AI opponent to create a more challenging and dynamic world to react to.
-   **Break Stalemates**: In multiplayer games, a meta character can be used to break political or military stalemates with a dramatic event.

## 3. Implementation

### A. The "Is Meta" Flag

A new boolean property, `isMeta`, will be added to the `Player` interface in `src/types.ts`. This flag will be controlled by a checkbox in the `AiPlayerSetup.tsx` component for each AI player.

### B. "Alternate Rules" Logic

The core of this feature is the implementation of "alternate rules." This will be achieved primarily through modifications to the AI prompting and potentially the game logic itself.

**1. AI Prompt Modification:**
When the game engine needs to generate a turn or an action for a meta AI, the prompt sent to the language model will be modified.

-   **Standard AI Prompt**: "Based on the Mappa Imperium rules for Era IV, generate a plausible discovery event for this faction..."
-   **Meta AI Prompt**: "This is a 'Meta Character' AI player, not bound by standard rules. Based on the Mappa Imperium rules for Era IV, generate a **legendary and world-altering** discovery event for this faction. The outcome should be significantly more powerful or impactful than a standard player's turn. Prioritize narrative drama over balanced gameplay."

**2. Bypassing Gameplay Constraints:**
In later development, game logic could be adjusted for meta AIs. For example:
-   A standard AI might be limited to placing a new settlement adjacent to its territory. A meta AI could be allowed to place a colony anywhere on the map.
-   A standard AI's "Monster Awakens" event creates a challenging but beatable foe. A meta AI's version could create a truly apocalyptic, world-ending threat.

## 4. User Interface

-   A checkbox labeled **"Is Meta Character?"** will be present in the configuration panel for each AI player in `AiPlayerSetup.tsx`.
-   A tooltip will explain: "Meta characters may use alternate, more powerful rules for creating their world elements."
-   When an element is created by a meta AI, its card in the Element Manager could have a special flair or icon to indicate its unusual origin.

## 5. Benefits

-   **Increased Replayability**: The presence of meta characters ensures that no two games will unfold the same way.
-   **Dynamic Storytelling**: Creates dramatic, memorable story beats that players must react to.
-   **Empowers Solo Players**: Gives solo players a powerful tool to create a living, breathing world that doesn't just wait for their input.

## 6. Next Steps

The initial implementation will focus on adding the `isMeta` flag and modifying the AI prompts. Further integration into the core game logic can be explored as a future enhancement. This feature should be clearly documented as an advanced option for players seeking a more unpredictable worldbuilding experience.