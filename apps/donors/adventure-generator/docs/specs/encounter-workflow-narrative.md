# 📄 **SPEC — Narrative Encounter Workflow**

## **The Multistage, Multiscreen System for Crafting Dramatic D&D Encounters**

**Version:** 1.0
**Purpose:**
To define a workflow that doesn't merely generate *encounters*, but **scene-driven micro-stories**, woven into the living world of the adventure.
Each encounter is treated as a **self-contained narrative arc**, with emotional rise and fall, thematic coherence, real-time action, and dramatic significance.

---

# **0. Principles (Shared With Narrative Workflow)**

All encounters generated in this workflow must:

### **1. Deliver Real-Time Scene Writing**

Events unfold second-by-second—not summarized, but *experienced*.

### **2. Combine Mechanics With Drama**

Monsters, traps, and environmental effects are not mechanical add-ons
—they are **story elements**, shaping tension and player agency.

### **3. Anchor Every Moment in Setting & Theme**

Each encounter must feel born from the world:

* places with history
* NPCs with motives
* factions with agendas
* environments with story weight

### **4. Support Emotional Dynamics**

Every encounter must have emotional beats:

* dread
* anticipation
* realization
* adrenaline
* triumph
* doubt
* catharsis

### **5. Integrate Character Goals**

Encounters must explicitly tie to the PCs’ goals or force them to adapt them.

### **6. Maintain Cohesion**

The output must *fit* into the adventure’s overarching narrative arc
(even when generated independently).

---

# **1. Workflow Overview — The Encounter as Its Own Mini-Story**

The encounter workflow mirrors the six-stage narrative structure:

```
1. Setup & Foreshadowing
2. Rising Tension & Approach
3. Disruption / Revelation (Mid-Encounter Twist)
4. Challenge Execution (Puzzle, Combat, Social)
5. Turning Point & Climax
6. Aftermath & Transition
```

Each stage contains **1–3 screens**.
Each screen may generate **1–3 real-time scenes**.

---

# **2. Stage Breakdown**

## ⭐ **Stage 1 — Setup & Foreshadowing**

### Purpose

Introduce the encounter as a **moment in the world**, not an isolated fight.

### What This Stage Generates

* Where the encounter takes place
* Why it matters
* What mood it evokes
* What is *about* to happen
* Sensory immersion (smell, sound, air quality, light)
* Symbolic/thematic elements relevant to the adventure arc

### Screens

1. **Location Context**

   * biome
   * faction control
   * weather
   * magical anomalies
   * recent events
2. **Foreshadow Elements**

   * audio clues
   * environmental hazards
   * NPC warnings
   * emotional color (dread, urgency, confusion)

### Scene Outputs

* Real-time sensory introduction
* Emotional priming scene
* Player expectation framing

---

## ⭐ **Stage 2 — Rising Tension & Approach**

### Purpose

Build suspense as players approach the heart of the encounter.

### What This Stage Handles

* Exploration
* Stealth movement
* Clues that deepen the situation
* Player decisions that shape the approach
* Roleplay or investigation opportunities

### Possible Procedural Elements

* Tracks
* Displaced objects
* Whispering voices
* A wounded NPC staggering into view
* Environmental hazards revealing danger

### Screens

1. **Approach Mode Selection** (combat, stealth, social, investigative)
2. **Tension Builder**

   * procedural obstacles
   * AI-generated real-time writing

### Scene Outputs

* One or more approach scenes with decision points
* Embedded emotion (fear, determination, suspicion)

---

## ⭐ **Stage 3 — Mid-Encounter Twist / Disruption**

### Purpose

Interrupt expectations.
Escalate the story.
Break patterns.

### Possible Twists

* Reinforcements arrive
* The “enemy” is a victim or misunderstood
* Environmental collapse
* The trap was bait
* Another faction intervenes
* The monster reveals unexpected intelligence
* Illusion breaks, revealing the true threat

### Screens

1. **Twist Selector**
2. **AI Real-Time Revelation**
3. **Procedural Disruption Rules**

### Scene Output

A shocking scene that pivots the encounter into something deeper.

---

## ⭐ **Stage 4 — Challenge Execution**

### Purpose

Here lies the **core challenge**:

* Combat
* Puzzle
* Trap sequence
* Skill challenge
* Social confrontation
* Moral dilemma

### Mechanics Must Support Drama

The workflow must merge:

* DCs
* terrain modifiers
* monster tactics
* environmental effects

*with*

* pacing
* tension
* emotional stakes

### Screens

1. **Challenge Type Selector**
2. **Mechanical Builder**
3. **AI Real-Time Action Scene**

### Scene Outputs

* Step-by-step unfolding of the challenge
* Player-facing sensory beats
* NPC motivations and personality
* Monster behavior with intention and emotion

---

## ⭐ **Stage 5 — Turning Point & Climax**

### Purpose

Deliver the peak emotional + narrative moment of the encounter.

This might be:

* The final blow in combat
* A moment of revelation
* A collapse of the environment
* A desperate sacrifice
* A confrontation of ideals in dialogue
* The climax of a puzzle

### Screens

1. **Climax Dynamics**
2. **AI Cinematic Escalation**
3. **Outcome Modeling**

### Scene Outputs

* High-intensity real-time writing
* Emotional payoff
* Meaningful consequences

---

## ⭐ **Stage 6 — Aftermath & Transition**

### Purpose

Resolve the encounter—emotionally, narratively, and mechanically—while positioning the story for what comes next.

### What This Must Produce

* Consequences
* Loot
* XP
* NPC reactions
* World-state changes
* Faction score shifts
* Hooks for next scene

### Screens

1. **Outcome Builder (Success vs Failure)**
2. **Transition Path Selector**
3. **Scene Assembly**

### Scene Outputs

A real-time resolution scene with:

* character development
* thematic closing beats
* setup for the next narrative arc

---

# **3. Data Model (Narrative-Oriented)**

Encounters must be saved as **EncounterSceneNodes** rather than single blocks.

```ts
interface EncounterSceneNode {
  id: string;
  stage: EncounterStageId;
  narrative: string;              // real-time scene text
  thematicTags: string[];
  emotionalShift: string;

  mechanics?: EncounterMechanics; // combat/trap/etc
  sensory?: EncounterSensory;     // smell/feel/etc
  worldStateChanges?: string[];
  consequences?: EncounterConsequences;
  transition?: string;
}
```

Encounters output **1–12 scene nodes**, depending on complexity.

---

# **4. Dual Generation Engine (Procedural + AI)**

The workflow uses the same dual pattern as your Adventure Generator:

### Procedural

* structure
* mechanics
* environmental physics
* monster pools
* trap math
* challenge DCs
* tactical layout

### AI

* prose
* tension
* emotion
* pacing
* NPC personality
* dialogue
* inner conflict

Both appear in split-screen:

```
Procedural Draft | AI Draft
       ⬇ merge into
Final Editor
```

---

# **5. Multiscreen Layout (Consistent Across All Stages)**

Every stage uses the standardized UI:

```
[Controls Panel]
[Procedural Draft] | [AI Draft]
[Final Editor]
[Next→]
```

The DM may:

* Choose procedural
* Choose AI
* Merge
* Edit
* Regenerate either side

---

# **6. Integration Points**

This Encounter Workflow connects directly into:

* ⚙️ **Encounter Builder (mechanics model)**
* 🧱 **Monster Creator**
* 🎭 **NPC persona system**
* 🗺️ **Hex Map (location integration)**
* 🧩 **Puzzle engine (optional future)**
* 📚 **SceneGraph in the Adventure Workflow**
* 📌 **Job Board (encounters as contracts)**

---

# **7. Export**

Encounter outputs must export to:

* Markdown (Homebrewery style)
* JSON (SceneGraph nodes, with Link Registry references per `docs/specs/persistence.md`)
* Foundry-ready structure (future)

---

## Addendum: Multi-Step Pipeline Integration

- Insert a Dependency Resolution step between Approach and Twist to bind NPC, location, and faction links.
- Each encounter scene must store back-references to parent adventure and stage IDs.
- Add a stitch step that merges mechanics output with narrative output before GM rewrite.

---

# **8. End of Spec**
