# 📄 **SPEC: Tavern – Narrative AI Hub**

**File:** `/docs/specs/tavern.md`
**Version:** 1.0
**Status:** Draft
**Subsystem:** Adventure Generator → Narrative Tools
**Author:** ChatGPT
**Environment:** React 19 (AI Studio), Zustand, Gemini AI, No Bundler

---

# 0. Purpose & Scope

The **Tavern** is the centralized, diegetic UI hub for all narrative-generation tools in the Adventure Generator.
It unifies:

* NPC conversations
* quest/rumor generation
* boxed text creation
* emergent scene reactions
* AI-based portraits and landscapes

The Tavern acts as a "DM Lounge" where the user can rapidly produce story content, improvise scenes, and enrich the narrative through high-level AI interactions.

---

# 1. Functional Overview

The Tavern includes six panels:

1. **Job Board**
2. **NPC Chat Simulator**
3. **Oracle (What Happens Next?)**
4. **Read-Aloud Text Generator**
5. **Portrait Studio**
6. **Scene Generator**

Each panel is independent but shares context through the global compendium graph and the active scene/hex.

---

# 2. System Requirements

## 2.1 UI Integration

* The Tavern is accessed via:

  * Hotkey: **Ctrl + Alt + T** (Win) / **Cmd + Opt + T** (Mac)
  * Sidebar Navigation → “Tavern”
* The Tavern UI is a full-screen panel divided into **tabs** for each feature.
* Integrates with the Command Palette (Ctrl+Alt+P).

## 2.2 State Management (Zustand)

All panels share a single store:

```
useTavernStore = {
  activePanel: "job-board" | "npc-chat" | "oracle" | "boxed-text" | "portrait" | "scene",
  lastUsedNPC?: npcId,
  chatHistory: Record<npcId, ChatMessage[]>,
  jobPosts: JobPost[],
  aiLoading: boolean
}
```

No local component state is allowed for persistent data.

## 2.3 AI Integration

Gemini AI must:

* use streaming where possible
* receive full context from compendium graph
* produce results in structured formats (not plain text unless required)

---

# 3. Panel Specifications

---

# 3.1 Job Board Panel

## 3.1.1 Description

A board where AI generates:

* quest hooks
* rumors
* city jobs
* downtime tasks
* faction missions
* political tensions

## 3.1.2 Inputs

* Setting (region, active hex, or location)
* Theme (optional): undead, infernal, political, wilderness, heist
* Difficulty slider (flavor only)

## 3.1.3 Outputs

Each job post returns:

```
{
  title: string,
  summary: string,
  complications: string[],
  rewards: string[],
  involvedNPCs?: npcId[],
  tags?: string[]
}
```

Multiple posts can be pinned or saved.

---

# 3.2 NPC Chat Simulator

## 3.2.1 Purpose

Simulates real-time NPC dialogue.
Allows the DM to rehearse scenes or quickly build NPC personalities.

## 3.2.2 Data Sources

AI receives:

* NPC biography
* secrets
* goals
* pronouns
* relationships (graph)
* current scene
* unresolved quests

## 3.2.3 Chat Format

Stored as:

```
interface ChatMessage {
  sender: "npc" | "dm";
  content: string;
  timestamp: number;
}
```

History persists until manually cleared.

## 3.2.4 Persona Stability

Gemini prompts must anchor the NPC persona to prevent drift.

---

# 3.3 Oracle Panel (“What Happens Next?”)

## 3.3.1 Description

Rapid improvisation tool.
The DM enters a player action or situation; AI returns **three** plot pivots.

## 3.3.2 Inputs

* Player action summary
* Active scene / NPCs present
* Current tension level (optional slider)

## 3.3.3 Outputs

```
{
  outcomes: [
    { title: string, result: string, consequences: string[] },
    { ... },
    { ... }
  ]
}
```

Always returns exactly three results.

---

# 3.4 Read-Aloud Text Generator (Boxed Text)

## 3.4.1 Purpose

Generates sensory-rich room/scene descriptions formatted for DM reading.

## 3.4.2 Input

* Scene summary (entered manually or auto-filled from location data)
* Desired length: short / medium / long
* Tone: mysterious, warm, grim, epic, whimsical

## 3.4.3 Output Requirements

* 4–6 sentences
* Focus on sensory experience (smell, sound, texture, light)
* No mechanics
* No metagame references
* No breaking immersion

---

# 3.5 Portrait Studio

## 3.5.1 Description

Generates AI portraits of NPCs and monsters.

## 3.5.2 Inputs

* NPC stats (race, class, appearance)
* Style selection (realistic, illustrated, painterly)

## 3.5.3 Outputs

* Portrait image (base64 or blob URL)
* Stored under `npc.images.portrait`

## 3.5.4 Requirements

* Must work offline if no image model available (fallback mode: random portrait from local library)

---

# 3.6 Scene Generator

## 3.6.1 Purpose

Generates environmental art for scenes or locations.

## 3.6.2 Inputs

* Location type (forest, ruins, desert, dungeon)
* Time of day
* Weather

## 3.6.3 Outputs

* Wide landscape or interior illustration
* Stored under `location.images.scene`

---

# 4. Integration with Global Systems

## 4.1 Compendium Graph

All panels must read the global graph to provide accurate:

* NPC names
* relationships
* known secrets
* scene context

## 4.2 Hotkey System

The Tavern integrates with the global hotkey protocol:

```
Ctrl + Alt + T → open tavern
```

Only multi-modifier shortcuts allowed.

## 4.3 Scene Context Bridge

The active scene or hex is passed into:

* Oracle
* Boxed Text generator
* Job Board
* Chat Simulator

This ensures high narrative consistency.

---

# 5. Data Persistence

* Tavern state stored in Zustand with localStorage persistence.
* Chat history stored in IndexedDB (large text + streaming safe).
* Images saved as blobs in IndexedDB.
* Job posts persisted per campaign.

---

# 6. Blockers & Dependencies

## 6.1 Dependencies

* Compendium graph must be implemented (NPCs, Locations, Factions)
* Basic NPC data must exist in TS modules
* Active map/scene context must be functional

## 6.2 Non-Blocking

* Image generation can be stubbed
* Portrait Studio can fall back to local assets

---

# 7. Open Questions

(To be resolved in v1.1)

* Should NPC chat be exportable as a transcript?
* Should Job Board entries be linkable to Quests in the quest log?
* Should portraits auto-attach to Compendium entries?
* Should the Tavern support “Random Tables”?
## Addendum: Multi-Step Pipeline Integration

- Pipeline: Tavern Concept -> Staff and Patrons (NPCs) -> Menu and Items -> Local Hooks -> GM Summary.
- Hooks must emit typed links to locations, factions, and adventure stages using the Link Registry contract in `docs/specs/persistence.md`.
- Add an export step to push a hook into the Adventure pipeline as a scene seed.
