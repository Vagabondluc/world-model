# UI Explanation: NPC Creator Bot

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Identity Synthesis Studio:** A high-level input area where the DM sets the NPC's core identifiers (Name, Role, Vibe). This acts as the "Seed" for the AI/Procedural generation.
- **Personality & Physicality Matrix:** A dense collection of toggles and dropdowns used to fine-tune the NPC's behavior and appearance. This allows for rapid iteration without typing long prompts.
- **Linguistic / Bot Persona Engine:** An optional sub-panel that simulates the NPC's "Voice." It uses the persona logic to translate the data into specific dialogue styles (e.g., gruff, flowery, suspicious).
- **Motivation & Hook Generator:** Automatically derives plot relevance from the NPC's role. It focuses on "Actionable Intel" for the DM—what the NPC wants and how they interact with the PCs.
- **Real-Time Profile Preview:** A sidebar or floating panel that updates the NPC's "Dossier" as the DM makes selections.

## Interaction Logic
- **Constraint-Based Generation:** Selecting a Role (e.g., "Assassin") automatically pre-selects suggested traits (e.g., "Secretive," "High Dexterity Vibe") which the DM can then override.
- **Flavor Overlays:** Choosing a "Campaign Flavor" (e.g., Steampunk) modifies the generated physical features and equipment lists to match the setting.
- **The "Ask the Bot" Workflow:** A text field where the DM can test the NPC's voice by asking them a question, helping the DM prepare for live roleplay.

## Visual Design
- **Clipboard/Dossier Aesthetic:** The UI uses a "Paper-like" background with handwriting-style fonts for the profile, evoking a DM's notebook.
- **High-Information Density:** Uses compact dropdowns and multi-select tags to allow for complex character creation on a single screen.
- **Dynamic Portraits:** (Optional) A placeholder for an AI-generated portrait that updates based on the "Physical Feature" selections.
