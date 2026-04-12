# SPECIFICATION — Narrative Encounter Designer

**Version:** 1.1
**Mode:** Procedural First, AI Optional
**Applies To:** Adventure Maker → Encounter Designer module

---

# **0. Design Mandates**

### **Procedural engine is the foundation.**

*   Mechanical rules, DCs, monster tactics, environmental hazards, emotional beats, twists, and consequences come from deterministic procedural generation.

### **AI is optional & supplemental.**

*   AI may “flesh out” narrative, pacing, emotion, and description.
*   **All AI prompts MUST consume the structured output of the procedural engine for that stage as explicit context.** This ensures the AI is enhancing the mechanics, not inventing its own.
*   All AI versions must never contradict procedural data and never be required for the tool to function.

### **Every stage = multi-screen real-time scene generation.**

*   Each stage produces 1–3 scene nodes.
*   The GM edits or accepts these nodes.

### **UX uses the Generator Shell pattern:**

*   Left: Controls
*   Center: Procedural Draft
*   Right: AI Draft (optional)
*   Bottom: Final Editor (merged output)

---

# **1. The Six Stages**

Each stage produces **EncounterSceneNode[]**.

---

## **Stage 1 — Setup & Foreshadowing**

**Purpose:** Establish setting, tone, and immediate stakes.

### Inputs (Controls Panel)

*   Location (text or from world map)
*   Biome
*   Faction influence
*   Threat tone (ominous, frantic, mysterious, tragic)
*   Danger hint level (subtle → explicit)

### Procedural Output

*   Sensory package (sound, smell, temperature, pressure)
*   Environmental motifs
*   Clues and foreshadow details
*   Stakes summary (“If ignored…”)

### AI Output

*   Atmospheric opening scene
*   Enhanced sensory descriptions
*   Emotional shading

### Final Node(s)

`EncounterSceneNode` with:

*   narrative (merged or procedural-only)
*   sensory
*   thematic tags
*   foreshadow references

---

## **Stage 2 — Approach & Rising Tension**

**Purpose:** Establish suspense and player agency.

### Inputs

*   Approach mode (stealth, aggressive, cautious, diplomatic)
*   Obstacles toggle (hazards, patrols, puzzles)
*   Tension curve (slow build → sharp spike)

### Procedural Output

*   Skill challenge structure (DCs, steps, consequences)
*   Hazards list
*   Progressive sensory escalation
*   Decision point prompts

### AI Output

*   Real-time “walkthrough scene”
*   Dynamic description of obstacles

### Final Node(s)

*   Approach scene(s)
*   Mechanical block: skill checks / hazards
*   Emotional beat (anticipation, doubt, curiosity)

---

## **Stage 3 — The Twist / Disruption**

**Purpose:** The encounter swerves into something unexpected.

### Inputs

*   Twist type (betrayal, reinforcement, reveal, environment collapse, moral dilemma)
*   Severity

### Procedural Output

*   Twist mechanics (reinforcements, trap shifts, environmental collapse DCs)
*   Narrative pivot beat
*   Surprise emotional beat

### AI Output

*   Revelation scene
*   Emotional reactions / perspective shifts

### Final Node(s)

*   Twisted version of the encounter direction
*   Updated stakes

---

## **Stage 4 — Core Challenge (Combat, Social, Puzzle, Skill, Hybrid)**

**Purpose:** The main challenge.

### Inputs

*   Challenge type
*   Party level / size
*   Intended difficulty
*   Terrain modifiers

### Procedural Output

**For Combat:**

*   Enemy roster with roles
*   Behavior script (round-by-round)
*   Terrain interactions
*   Reinforcement triggers

**For Non-Combat:**

*   Puzzle structure
*   Skill challenge steps
*   Negotiation conditions
*   Fail-forward outcomes

### AI Output

*   Action scene in real-time writing
*   NPC dialogue
*   Tactical narration

### Final Node(s)

*   Full actionable challenge scene
*   Mechanical details
*   Sensory & emotional reinforcement

---

## **Stage 5 — Climax & Turning Point**

**Purpose:** Deliver the highest emotional + mechanical impact.

### Inputs

*   Climax type (combat peak, revelation, sacrifice, escape, collapse)

### Procedural Output

*   Climax structure
*   High-danger DCs
*   Tactics shift
*   Consequence model

### AI Output

*   Cinematic climax scene

### Final Node(s)

*   The turning point moment
*   Consequences prepared for next stage

---

## **Stage 6 — Aftermath & Consequences**

**Purpose:** Transition out of the encounter.

### Inputs

*   Resolution tone (grim, hopeful, uncertain, victorious)
*   Long-term consequences toggle

### Procedural Output

*   Loot parcel
*   XP
*   NPC reactions
*   Faction score shifts
*   Hooks into next scene

### AI Output

*   Narrative outro scene

### Final Node(s)

*   Resolution
*   Transition text
*   Rewards

---

# **2. Data Model**

```typescript
// Defined in schemas/encounter.ts
interface EncounterMechanics {
  combatants?: Array<{ monsterId: string; count: number; role?: string; }>; // Link to Bestiary IDs
  traps?: GeneratedTrap[]; // Embed the full trap object from the Trap Generator
  skillChallenge?: { dc: number; steps: string[]; success: string; failure: string; };
  environment?: string; // Markdown description of interactive elements
}

interface EncounterSceneNode {
  id: string;
  stage: EncounterStageId;
  narrative: string;
  sensory?: EncounterSensory;
  mechanics?: EncounterMechanics;
  emotionalShift?: string;
  thematicTags?: string[];
  worldStateChanges?: string[];
  consequences?: EncounterConsequences;
  transition?: string;
}
```

Encounters are saved as:

```typescript
interface Encounter {
  id: string;
  title: string;
  stages: EncounterSceneNode[];
  linkedMonsters?: string[]; // Link Registry references per `docs/specs/persistence.md`
  linkedNPCs?: string[];     // Link Registry references per `docs/specs/persistence.md`
  linkedLocations?: string[]; // Link Registry references per `docs/specs/persistence.md`
}
```

---

# **3. Workflows & Integration**

The Encounter Designer must integrate with:

*   **Hex Map Manager**: auto-fills biome, location
*   **Bestiary**: enemy selection
*   **Tavern / Job Board**: converting jobs into encounters
*   **Adventure Workflow**: attaching scenes to acts

---

# **4. UX & State Management Requirements**

*   **Flexible Navigation**: Users can navigate between stages (`Back`, `Next`) and are not forced into a linear order.
*   **State Management**: A dedicated Zustand store, `useEncounterWizardStore`, will manage the ephemeral state of the creation process (`currentStage`, `nodes`, `locationContext`, `factionContext`, etc.). This store will be persisted to IndexedDB to save state between sessions.
*   **Offline Support**: Full offline support for all procedural outputs.
*   **Optional AI**: The AI panel never blocks procedural generation.
*   **Editor**: A smooth markdown or rich text editor for the final output.
*   **Preview**: A scene list preview should be visible at all times.

---

# **5. Export Requirements**

Export encounter as:

*   Markdown
*   JSON (SceneGraph, with Link Registry references per `docs/specs/persistence.md`)
*   Foundry-ready stub (future)
## Addendum: Multi-Step Pipeline Integration

- Map the 6 narrative stages to pipeline steps and expose progress status per stage.
- Add a dependency bind step that links encounters to NPCs, locations, factions, and adventure stages.
- Stitch output must merge mechanical constraints with narrative text before GM rewrite.
