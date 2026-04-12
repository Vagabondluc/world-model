# Release Notes - v1.0.0

## 🌟 Dawn of Worlds: World Builder v1.0

We are thrilled to announce the official v1.0 release of the World Builder engine! This release marks a major milestone, delivering a stable, refactored, and fully traversable world-building experience.

### 🚀 Key Features

*   **Complete Gameplay Loop**: Play through all three Ages (Creation, Expansion, Conflict) with a fully functional turn-based system.
*   **Procedural Generation**: Generate unique, massive hex-based worlds with the click of a button.
*   **Interactive Map**: 
    *   Dynamic terrain shaping (mountains, forests, oceans).
    *   Civilization tracking (cities, boundaries, avatars).
    *   Beautiful visual feedback with biome-specific glows and icons.
*   **The Chronicler**: An automated history system that records every action, actively writing the lore of your world as you play.
*   **Export Tools**: save your world state or export your generated history as a Markdown file for use in TTRPG campaigns.

### 🛠 Technical Improvements (DRY Refactoring)

This release includes a massive architectural overhaul to ensure stability and maintainability:
*   **Consolidated Logic**: Over 260+ lines of duplicate code eliminated.
*   **Unified Utilities**: New shared modules for Validation, Serialization, and Event Building.
*   **Type Safety**: Comprehensive TypeScript coverage with 60+ passing integration tests.
*   **Performance**: Optimized rendering with a unified biome configuration system.

### 🌍 Standalone Globe Project (Bonus)
Included in this release is the **Standalone Globe Project** (`localhost:4180`), a proof-of-concept 3D visualization tool featuring:
*   Icosphere-based planet rendering.
*   Tectonic plate simulation.
*   Real-time biome mapping bridge.

### 📦 Installation
1.  Clone the repository.
2.  Run `npm install`.
3.  Start with `npm run dev` or build with `npm run build`.

---
*Thank you to all the Architects who helped shape this world.*
