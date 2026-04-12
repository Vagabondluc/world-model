# 📄 SPEC — Quick Delve Procedural Workflow

### **A Comprehensive, Deterministic, Multistage, Scene-Based Procedural Dungeon System**

**Version:** 3.0
**Mode:** Procedural-First (AI Optional)
**Purpose:**
Transform Quick Delve into a *fully deterministic*, deeply detailed, offline-capable dungeon generator that builds a **mini-adventure** across **five strongly-authored procedural stages**, with optional AI enhancements.

---

# 0. **Design Mandates**

### **1. Procedural logic must stand alone.**

The dungeon must work **fully offline**, with no AI calls.

### **2. AI is optional.**

* When enabled, AI can *augment narrative text*.
* When disabled, procedural systems produce high-quality output.
* Procedural output must be complete, playable, and self-sufficient.

### **3. Narrative scenes must be generated from procedural rules.**

Every room produces:

* a **real-time narrative scene**
* a **sensory package**
* a **mechanical package**
* a **dramatic/emotional beat**

All without AI unless requested.

### **4. The delve follows a dramatic arc**

Each room = a **stage** of a 5-act mini-adventure.

### **5. Rooms are interconnected**

Procedural algorithms ensure:

* continuity
* foreshadowing
* resource management
* thematic cohesion

---

# 1. **Five-Stage Procedural Dungeon Model**

The procedural model mirrors the classic 5-Room Dungeon pattern, but expanded to **scene-level** procedural detail:

```
1. Guardian (Threshold)
2. Puzzle (Insight or Logic Trial)
3. Trick (Subversion / Disruption)
4. Climax (Final Confrontation)
5. Reward (Resolution / Consequence)
```

Each stage defines:

* narrative logic
* mechanical logic
* environmental logic
* encounter logic
* emotional logic
* thematic logic

AI can refine text — but **all content is generated procedurally first**.

---

# 2. **Procedural Generation Architecture (Offline Deterministic Engine)**

Procedural logic is layered:

```
Base Theme Rules       (Crypt, Ruin, Sewer…)
  ↓
Biome Overrides        (Swamp Crypt, Mountain Tower)
  ↓
Faction Modifiers      (Cult, Necromancer, Bandits)
  ↓
Room Stage Rules       (Guardian, Puzzle...)
  ↓
Mechanics Layer        (Encounter, Trap, Puzzle)
  ↓
Narrative Layer        (Templates + combinators)
  ↓
Sensory Layer          (sound/smell/vibe tables)
  ↓
Continuity Layer       (callbacks using previous rooms)
```

This produces **detailed, multi-dimensional scenes** without any AI.

---

# 3. **Procedural Layers in Detail**

## 3.1 **Theme Rules**

Each theme defines:

* architectural style
* room purpose tables
* material palettes
* common foes
* typical traps
* environmental constant effects

Example (Crypt):

* Architecture: stone coffers, bone altars, sarcophagi
* Monsters: undead, grave spirits
* Traps: necrotic wards, collapsing floors
* Sensory: cold, stale, dust, whispered breaths

---

## 3.2 **Biome Overrides**

A theme + biome combination adjusts:

* humidity
* natural hazards
* monster variants
* fungal/mold hazards
* flooding or air quality
* light levels

Example:
*Crypt + Swamp = sinking mausoleum, rot, methane pockets, bog mummies*

---

## 3.3 **Faction Modifiers**

If factions influence the delve:

* graffiti
* rituals in progress
* barricades
* supply caches
* patrol routes
* dialogue clues

Factions add:

* motives
* symbols
* enemy names
* treasure tags

Example:
Cult of the Serpent adds:

* venom altars
* serpentine motifs
* poison traps
* “Shed Skin Initiates”

---

## 3.4 **Room Stage Rules (Procedural Drama Engine)**

Each room has **its own procedural grammar**.

### ⭐ Guardian Room

Goal: Threshold test
Procedural outputs:

* A guardian (creature/trap/sentinel)
* Portal/door/warning inscriptions
* Foreshadowing of deeper rooms
* Dramatic beat: tension rising

### ⭐ Puzzle Room

Goal: Trial of intellect
Procedural outputs:

* Puzzle structure (3–5 steps)
* DCs
* Hints
* Sensory signals
* Fail consequences

### ⭐ Trick Room

Goal: Subversion
Procedural outputs:

* Illusion layer
* False choices
* Environmental betrayal
* Emotional beat: surprise → realization

### ⭐ Climax Room

Goal: Peak threat
Procedural outputs:

* Boss construction
* Phase system
* Terrain shifts
* Reinforcement tables
* Victory/failure states

### ⭐ Reward Room

Goal: Emotional + mechanical release
Procedural outputs:

* Treasure (scaled)
* Lore fragments
* New hooks
* Faction consequences
* Thematic closing image

---

## 3.5 **Mechanics Layer**

Each room determines which mechanical modules activate:

* **Encounter Mechanic**

  * Monster list
  * Roles (brute, controller, skirmisher)
  * Difficulty curve based on party level
  * Tactics tags
  * Terrain interaction

* **Trap Mechanic**

  * Trigger
  * Effect (damage, condition)
  * DC scaling
  * Foreshadow clue

* **Puzzle Mechanic**

  * Logic structure
  * Steps
  * Failure consequences

Everything is procedural-first.

---

## 3.6 **Narrative Layer (Procedural Scene Generator)**

Narrative must be **real-time** and built without AI:

### Uses:

* sentence combinators
* weighted microtemplates
* encounter verbs (advance, retreat, strain, shift)
* emotional beat tables

Example structure:

```
[Atmospheric opener] + [PC prompt] + [Threat shift] + [Sensory reinforcement] + [Emotional beat]
```

Procedural example:

```
Cold air roils across the cracked flagstones. 
A faint vibration hums behind the sealed iron door. 
As you lean closer, the whispering grows sharper—like bones clicking in the dark. 
Your breath turns white as the chamber seems to inhale before the guardian awakens.
```

This comes fully from procedural rules.

---

## 3.7 **Sensory Layer**

Each room generates:

* sound table
* smell table
* feel (temperature, vibration, pressure)
* magical resonance
* visual motifs

Procedural example:

* Sound: distant scraping, heartbeat-like thumps
* Smell: old blood, wet stone
* Feel: pressure, cold air pockets

These add atmosphere without AI.

---

## 3.8 **Continuity Layer**

Each room inherits:

* themes introduced earlier
* emotional beats
* faction marks
* hazard patterns
* narrative threads

Example:

Room 2 foreshadows Room 3’s betrayal by showing:

* false footprints
* damaged wards
* the boss's shadow on the wall

---

# 4. **Quick Delve Workflow (Multiscreen UI) — Procedural First**

Each of the five rooms becomes a **stage** with:

```
1. Input controls
2. Procedural draft (mandatory)
3. Optional AI enhancement
4. Merged scene editor
5. Save room
```

---

# 5. **Room Output Format (SceneNode)**

Each room produces a **SceneNode**:

```ts
interface DelveSceneNode {
  id: string;
  stage: "guardian" | "puzzle" | "trick" | "climax" | "reward";
  title: string;

  narrative: string;          // procedural or AI-enhanced
  sensory: SensoryPackage;    // procedural only
  mechanics: MechanicsPackage;// encounter/trap/puzzle
  features: string[];         // environmental

  emotionalBeat: string;      // procedural emotional arc
  thematicTags: string[];     // symbolic motifs

  continuityRefs: string[];   // references to earlier rooms (Link Registry per `docs/specs/persistence.md`)
}
```

---

# 6. **AI Optional Integration**

AI, when enabled, **never replaces** procedural logic.
It can:

* rephrase/add flourish to narrative
* heighten emotion
* suggest alternate descriptions
* generate NPC dialogue options

AI must read:

* mechanics
* sensory
* themes
* emotional beats
* faction tags
* prior rooms

AI output is **overlay, not foundation**.

---

# 7. **Final Output**

The final Quick Delve produces:

### ✔ A **fully deterministic** 5-stage dungeon

### ✔ 10–25 narrative scenes

### ✔ Sensory + emotional progression

### ✔ Mechanical scaffolding (encounters, traps, puzzles)

### ✔ Treasure and lore

### ✔ Thematic closure

All playable without AI.

---

# 8. **End of Procedural Spec**
## Addendum: Multi-Step Pipeline Integration

- Pipeline: Delve Outline -> Room and Encounter Gen -> Populate NPCs and Items -> Stitch Scenes -> GM Output.
- Rooms must link to encounters, locations, and key NPCs.
- Provide an export step to attach the delve to an adventure stage.
