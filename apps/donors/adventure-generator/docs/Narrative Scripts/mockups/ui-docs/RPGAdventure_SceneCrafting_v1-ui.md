# UI Explanation: RPGAdventure_SceneCrafting_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Stage-Based Timeline Strip:** A horizontal navigation bar at the top that breaks the adventure into the 6 required stages. 
- **Dynamic Scene Stack:** Under each stage, users can stack multiple "Scene Cards". Each card represents a real-time event.
- **Focused Scene Editor:** A large central writing space designed for "Real-Time" narrative. It includes a "Detail Density Gauge" to ensure the user isn't relying on summary.
- **Element Blender Checklist:** A sidebar component that monitors the active scene and checks off required elements: Setting, Character, Goal, Action, Conflict, Emotion, and Theme.
- **Revelation Tracker:** A dedicated panel for "Layers of Intrigue", tracking when specific mysteries are introduced and when they are revealed.

## Interaction Logic
- **Organic Weaving:** Dragging a "Story Thread" from one scene to a later one creates a visual link in the storyboard, ensuring continuity.
- **Tension Mapping:** The UI generates a line graph of "Dramatic Tension" based on the "Combat" and "Conflict" markers in each scene.
- **Outcome Branching:** Clicking the edge of a Scene Card allows users to create "A/B paths" based on success or failure, leading to different future scenes.

## Visual Design
- **Cinematic Storyboard Look:** Scene cards use large thumbnails and evocative headers.
- **Progressive Disclosure:** Sub-stages (like "Facing Inner Demons") are hidden until the parent stage is reached, preventing story spoilers during the design phase.
- **Color-Coded Elements:** Setting details (Green), Character Dev (Blue), and Conflict (Red) are highlighted within the text editor for easy auditing.
