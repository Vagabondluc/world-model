# Specification Index & Status Tracker

**Date:** 2026-01-31
**Status:** Living Document

## 🟢 Active Epics (To Do / In Progress)
These specs define the work currently ahead of us.

| ID | Title | Status | Link |
| :--- | :--- | :--- | :--- |
| **037** | **AI Advanced Intelligence** | 🚧 Planned | [Link](037-ai-advanced-intelligence.md) |
| **038** | **Multiplayer Polish** | 🚧 Planned | [Link](038-multiplayer-polish.md) |
| **042** | **Pre-Runtime Globe Gen** | 🚧 Planned | [Link](042-pre-runtime-globe-generation.md) |
| **043** | **Region Selection UI** | 🚧 Planned | [Link](043-region-selection-interface.md) |
| **044** | **Globe-to-Game Integration** | 🚧 Planned | [Link](044-globe-to-game-integration.md) |
| **045** | **Smooth Globe Architecture** | 🏗️ Architecture | [Link](045-smooth-spherical-globe-architecture.md) |
| **046** | **Smooth Sphere Geometry** | 🏗️ Component | [Link](046-smooth-sphere-geometry.md) |
| **047** | **Hex Overlay Rendering** | 🏗️ Component | [Link](047-hex-overlay-rendering.md) |
| **048** | **Pole Mitigation** | 🏗️ Component | [Link](048-pole-mitigation.md) |
| **049** | **Spatial Indexing** | 🏗️ Component | [Link](049-spatial-indexing.md) |
| **050** | **Risk Assessment** | 🛡️ Safety | [Link](050-risk-assessment-mitigation.md) |
| **020** | **Chronicler: Data Models** | 📋 Spec Done | [Link](020-chronicler-data-models.md) |
| **021** | **Chronicler: Trigger System** | 📋 Spec Done | [Link](021-chronicler-trigger-system.md) |
| **022** | **Chronicler: Templates** | 📋 Spec Done | [Link](022-chronicler-template-engine.md) |
| **023** | **Chronicler: Backlog** | 📋 Spec Done | [Link](023-chronicler-backlog-management.md) |
| **024** | **Chronicler: Auto Mode** | 📋 Spec Done | [Link](024-chronicler-auto-mode.md) |
| **025** | **Chronicler: History UI** | 📋 Spec Done | [Link](025-chronicler-history-book-ui.md) |
| **026** | **Chronicler: Forms** | 📋 Spec Done | [Link](026-chronicler-form-system.md) |

## ✅ Completed Core (Implemented)
These underlying systems are largely built (though maintenance continues).

| ID | Title | Status | Link |
| :--- | :--- | :--- | :--- |
| **007** | **Meta Game System** | ✅ Done | [Folder](007-meta-game) |
| **012** | **Multiplayer Lobby** | ✅ Done | [Link](012-multiplayer-lobby.md) |
| **014** | **Event Engine** | ✅ Done | [Link](014-event-engine.md) |
| **015** | **World Counselor** | ✅ Done | [Link](015-world-counselor.md) |
| **016** | **Conflict & Dice** | ✅ Done | [Link](016-conflict-and-dice.md) |
| **036** | **AI Controller Skeleton** | ✅ Done | [Link](036-ai-controller.md) |



## ❌ Deprecated / Obsolete
Old ideas or superseded specs.

| ID | Title | Reason |
| :--- | :--- | :--- |
| **008** | Chronicler (Old) | Replaced by 020-026 series. |
| **030-035** | Globe (Old Core) | Replaced by new Smooth Globe Architecture (036/045). |
| **DEPRECATED** | Globe Icosahedron | Explicitly marked. |

---

## Action Plan for Re-Organization
1. **Rename** `036-smooth-spherical-globe-architecture.md` -> `045-smooth-spherical-globe-architecture.md` (Use 045 as the master Globe Epic).
2. **Move** `036-ai-controller.md` is fine as 036.
3. **Rename** `037-smooth-sphere-geometry.md` -> `045a-smooth-sphere-geometry.md` (Sub-spec).
4. **Rename** `038-hex-overlay-rendering.md` -> `045b-hex-overlay-rendering.md` (Sub-spec).
5. **Delete** `045-smooth-spherical-globe-architecture.md` (if exact duplicate) or keep as master.
