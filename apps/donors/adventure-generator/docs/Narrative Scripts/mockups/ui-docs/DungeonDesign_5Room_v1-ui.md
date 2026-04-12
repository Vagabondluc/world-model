# UI Explanation: DungeonDesign_5Room_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Environment Setup:** Top bar for setting the overall vibe (Theme, Level/Difficulty, Seed).
- **5-Pillar Layout:** The core of the UI. Each pillar represents one "Room" (Room 1-5).
- **Room Cards:**
    - **Header:** Role name (e.g., "The Trick") and a customizable icon.
    - **Type Dropdown:** Presets based on the script (Guardian, Puzzle, Trap, Boss, Reward). Selecting one populates the card with relevant placeholders.
    - **Content Area:** Textbox for specific room details.
    - **Quick AI Button:** A button on each card to regenerate *just* that room.

## Interaction Logic
- **Progressive Flow:** Visual arrows between pillars indicate the sequential nature of the rooms.
- **Bulk Generation:** A single "Generate All" button uses the Seed to fill all 5 rooms while maintaining thematic consistency.
- **Preset Libraries:** The "Guard" dropdown pulls from a list of golems, robots, traps, and hazards as suggested in the source text.

## Visual Design
- **Gradient Moods:** Each pillar has a subtle background gradient reflecting its mood:
    - Room 1: Mystery (Deep Purple)
    - Room 2: Intellect (Blue)
    - Room 3: Suspense (Orange/Red)
    - Room 4: Intensity (Dark Red)
    - Room 5: Revelation (Gold)
