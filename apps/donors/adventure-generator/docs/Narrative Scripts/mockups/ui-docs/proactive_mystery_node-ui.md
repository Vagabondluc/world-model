# UI Explanation: proactive_mystery_node

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Trigger Condition Manager:** A dedicated list where the DM defines the "Red Flags" that would cause this node to appear. It helps the DM recognize when the investigation has stalled.
- **Phase-Based Content Switcher:** A unique UI element that allows the DM to toggle between different versions of the node (Early, Mid, Late investigation). This ensures the "Proactive" help remains relevant to the current plot.
- **Lead-Back Connection Mapper:** A visual tool showing how the clues in this node link back to the core nodes of the 5-node or Node Cloud structures. It ensures that the "Lifeline" actually leads players back to the winning track.
- **Injection Guide Panel:** Provides flavor-text and mechanical suggestions for *how* to spontaneously introduce the scene (e.g., "The PCs are approached by a mysterious courier during their long rest").

## Interaction Logic
- **Adaptive Lead Generation:** Clues in this node are "Soft-Linked." The UI suggests which lead to emphasize based on which pieces of evidence the players have already missed in the main nodes.
- **Dynamic NPC Response Toggles:** Changes the NPC's dialogue options based on the "Current Phase" setting, allowing for a character who knows more as the mystery deepens.
- **Non-Invasive Integration:** The system ensures that the proactive node provides the minimum necessary information to get players moving again, without solving the mystery *for* them.

## Visual Design
- **Support-Focused HUD:** Uses an "Emergency/Alert" color palette (Golds and Oranges) to distinguish it from standard investigation nodes.
- **Path Branching visualization:** Shows a "Return to Track" icon on all outbound leads.
- **State-Aware Previews:** The preview panel updates instantly when the "Current Phase" slider is moved, showing exactly what information will be revealed.
