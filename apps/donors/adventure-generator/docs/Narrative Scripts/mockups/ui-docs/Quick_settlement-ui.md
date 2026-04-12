# UI Explanation: Quick_settlement

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Image-First Dashboard:** A unique interface that leads with visual inspiration (DALL-E) before diving into narrative text. It helps set the tone for the rest of the generation process.
- **Priority Input Module:** Captures the "UTMOST PRIORITY" elements early, ensuring the backend AI weighs these more heavily than standard tropes.
- **Sectioned Narrative Blocks:** Organizes the 10+ core domains (Governance, Economy, Customs, etc.) into clean, tabbed containers, each labeled with its expected style (e.g., [ND, D&T]).
- **Relational NPC Table:** A structured grid for "Prominent Individuals" that forces the user (and AI) to define specific "Goals" for every character, creating immediate plot momentum.
- **Multi-Vector Hook Builder:** A specialized tool to draft distinct types of adventures (Mysteries, Political Intrigue, Moral Dilemmas) that are cross-referenced with the settlement's conflicts.

## Interaction Logic
- **Visual-to-Text Consistency:** The UI allows the user to click "Sync" to ensure that architectural details described in the text match the visual features visible in the generated DALL-E image.
- **Automatic Table Expansion:** As the AI generates the "Society and Demographics" section, it automatically proposes entries for the NPC table (Leaders, Traders, etc.).
- **Style Enforcer:** The backend automatically applies the specific creative codes (C&S, D&T, ND) to the resulting text based on the section currently being edited.

## Visual Design
- **Sleek & Informative:** A professional, split-screen layout that balances rich visual media on the left with structured data on the right.
- **Role-Based Row Formatting:** In the NPC table, different colors or icons distinguish between "Political Leaders," "Heroes/Villains," and "Traders."
- **Code Badging:** Small, unobtrusive badges for style requirements (MS&L, AC&OT) provide at-a-glance status of the creative direction.