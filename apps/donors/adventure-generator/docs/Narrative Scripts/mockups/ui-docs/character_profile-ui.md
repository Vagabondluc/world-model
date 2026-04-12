# UI Explanation: Character Portrait & Backstory Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Immersive Personality Wizard:** A conversational UI module based on the `personality_questionnaire.txt`. It uses sensory-rich text blocks and a hidden point allocation system (Roles.json) to help the user identify their "Intrinsic Gameplay Motivation."
- **Multimodal Backstory Studio:** A tabbed interface implementing the `character_profile.md` structure. It allows for the gradual expansion of character details from "Basic" to the 1500-word "Deep Profile."
- **Arc Timeline Plotter:** A visual map based on the "Hero's Journey" and "Story Structure 101" scripts. Users can drag-and-drop 'Plot Beats' (Inciting Incident, Mirror Moment) to plan their character's narrative evolution.
- **Localized Surface Card:** A dedicated output for the `profil_npc_westmarsh.txt` logic, allowing for the generation of "Surface-Only" profiles (Name, Job, Look, Persona) in French or English for rapid player distribution.

## Interaction Logic
- **Psychological Mirroring:** The UI "shuffles and rephrases" (Step 166 of Style Prompt) the character's profile based on the MBTI/Enneagram inputs, suggesting consistent "Mannerisms" and "Speech Patterns."
- **Sensory Progression:** When writing history (Step 222 of Profile), the UI prompts for the "happiest/saddest/earliest memories" using the five-senses approach from the questionnaire script.
- **The "Heavy Price" Check:** Implementing Step 6 of Story Structure 101, the UI periodically asks: "What heavy price did the character pay for achieving their last goal?" to ensure narrative weight.

## Visual Design
- **Sophisticated & Literary:** The design uses a clean, serif font palette (e.g., Merriweather/Playfair) for a "leather-bound journal" aesthetic.
- **Thematic Color Accents:** Sections are color-coded based on the "Roles.json" archetypes (e.g., Purple for Narrative/Actor, Blue for Strategy/Engineer).
- **Progressive Detail Loading:** Low-priority fields (Income Level, Handwriting Style) are tucked into an "Advanced/Flavor" drawer to prevent cognitive overload during initial creation.
