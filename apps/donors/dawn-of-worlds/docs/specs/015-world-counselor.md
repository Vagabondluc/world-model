
# SPEC-015: The World Counselor (Divine Intelligence)

**Feature:** AI Integration / UX Assistance
**Dependencies:** SPEC-008 (Chronicler), SPEC-014 (Event Engine)
**Status:** Approved for Implementation

## 1. Executive Summary
The World Counselor is a Gemini-powered strategic HUD element. To ensure high accuracy and low cost, we implement strict context management.

## 2. Grounding: The World Bible
Every AI request includes a "World Bible" header to prevent hallucinations:
*   **Registry:** A flat list of all active `RACE`, `CITY`, and `NATION` names.
*   **Constraints:** "Do not mention entities or locations not listed in the registry."

## 3. token Optimization: Lore-Compression
Sending raw JSON event logs to Gemini is prohibited as it creates "noise."
* **The Compressor:** Before a request, the engine converts the event log into a structured Natural Language Summary.
    * *Raw:* `{"type":"WORLD_CREATE", "payload":{"kind":"TERRAIN", "q":2, "r:-1"}}`
    * *Compressed:* "Architect P1 raised mountains in the northern sector."
* **Result:** Token usage is reduced by ~70%, and the model remains focused on the narrative arc rather than schema keys.

## 4. Interaction Model (Heuristic Triggers)
Gemini is NOT watching the world constantly. Requests are triggered only by local spatial heuristics:
* `CONFLICT_PROXIMITY`: Nations adjacent with no Treaty.
* `STAGNATION`: 3 turns without a `WORLD_CREATE` event.

## 5. Visual Design: The Divine Orb
* **Pulsing Orb:** Changes color based on advice type:
    * `NEUTRAL` (White): Standard advice.
    * `WARNING` (Red Pulse): Conflict or resource crisis.
    * `INSIGHT` (Cyan): Narrative opportunity.
