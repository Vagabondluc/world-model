# 📄 SPEC — Adventure Maker UX Blueprint

**Version:** 1.0
**Scope:** Quick Delve · Encounter Workflow · Tavern / Job Board · Adventure Stages
**Mode:** Procedural-First, AI Optional
**Goal:** Define a coherent, multi-screen UX where **procedural generation** and **AI generation** coexist cleanly, without dumbing down the system.

---

## 0. UX Principles

1. **Procedural-first, AI-optional**

   * Every major generator (Delve, Encounter, Job Board, Scenes) must be usable **offline**, with **full procedural logic**.
   * AI adds *flavor*, *density*, or *variation*, but never replaces the structured logic.

2. **Multi-stage workflows, not one-shot buttons**

   * Quick Delve, Encounter Design, Adventure Builder, and Tavern ↔ each are **wizards** with stages, not one-screen toys.
   * Each stage = one meaningful step in the creative process.

3. **Dual-Engine Layout: Procedural vs AI**

   * When relevant, there is a **canonical three-panel pattern**:

     * Left: **Controls & Context**
     * Center: **Procedural Draft**
     * Right: **AI Draft**
     * Bottom: **Merged Editor / Final Output**

4. **Scene-first thinking**

   * Most outputs are **SceneNodes** or collections thereof.
   * UI is built to manipulate scenes, not just raw text blobs.

5. **Keyboard-friendly**

   * No hard dependency on Ctrl+K, but:

     * Navigation shortcuts (Next, Back, Toggle Procedural/AI, Generate, Save)
     * Optional command palette with rebindable shortcuts later.

---

## 1. Global App Structure

Top-level nav (left sidebar):

* **World / Map**
* **Tavern (Job Board & NPC Chat)**
* **Adventure Workflow**
* **Quick Delve**
* **Encounter Designer**
* **Bestiary & Monster Creator**
* **Compendium**
* **Settings / Shortcuts**

### 1.1 Layout Skeleton

All creation tools share this structural skeleton:

```
┌───────────────────────────────────────────┐
│ Top Bar: [App Title] [Mode] [Stagecrumb] │
├───────────────────────────────────────────┤
│ Left Column  │   Center Panel   │ Right  │
│ (Controls)   │   Procedural     │ Panel  │
│              │   Output         │ (AI)   │
├───────────────────────────────────────────┤
│ Bottom: Final Editor / Details / Actions │
└───────────────────────────────────────────┘
```

**Stagecrumb**: something like
`Adventure / Stage 2: Overcoming Challenges / Screen 1: Location Context`

---

## 2. Reusable UX Pattern: Generator Shell

We’ll define a **Generator Shell** used by:

* Quick Delve
* Encounter Workflow
* Job Board / Tavern
* (Later) Scene Builder for full adventures

### 2.1 Shell Regions

1. **Left: Context & Controls**

   * Setting/biome/faction/party-level inputs
   * Checkboxes (include traps, puzzles, roleplay scenes)
   * Danger sliders, complexity sliders
   * Seed handling (lock / regenerate)

2. **Center: Procedural Panel**

   * Shows pure procedural result
   * Read-only (or lightly editable)
   * Has “Re-roll” buttons for local sections (e.g., “Re-roll guardian”, “Re-roll trap”)

3. **Right: AI Panel (Optional)**

   * Only visible when:

     * AI is enabled *and*
     * A valid prompt context exists
   * Shows AI-generated alternative based on:

     * Procedural mechanics
     * Context state
     * Past scenes

4. **Bottom: Final Editor**

   * DM chooses:

     * Procedural
     * AI
     * Merge
   * Rich text or markdown editor
   * Shows linked entities (NPCs, monsters, locations) as chip/tags

5. **Footer Actions**

   * `← Back` · `Save & Next →`
   * `Regenerate Procedural`
   * `Ask AI for Variant` (if AI enabled)

---

## 3. Quick Delve UX Flow (5-Room Procedural Mini-Adventure)

Mode: **Quick Delve**

### 3.1 Stage 0: Setup Screen

**Screen:** `Delve Setup`

Left (Controls):

* Theme: dropdown (Crypt, Ruin, Cavern, Sewer, Tower, etc.)
* Biome: dropdown (Forest, Swamp, Mountain, Urban, etc.)
* Faction Influence: multi-select (Cult, Bandits, Undead Legion, etc.)
* Party Level: slider (1–20)
* Danger Rating: slider (Low…Deadly)
* Rooms: *fixed at 5 for now* (future: toggle more)
* Seed: text field (`[lock]` icon next to it)

Center:

* Procedural Preview: high-level outline:

  * Room 1: Guardian — “Chamber of Bone Lanterns”
  * Room 2: Puzzle — “Runic Floodgate”
  * Room 3: Trick — “False Tomb of Ash”
  * Room 4: Climax — “Lord of Rusted Chains”
  * Room 5: Reward — “Hall of Echoed Oaths”

Right:

* (Optional AI) A short “Module Blurb” describing the delve as a one-sentence hook.

Bottom:

* `Generate Rooms` button
* `Back` (returns to Adventure Maker main menu)

---

### 3.2 Stages 1–5: One Screen per Room (Guardian → Puzzle → Trick → Climax → Reward)

Each room screen uses the **Generator Shell** pattern.

#### Example: Guardian Room Screen

**Header:**
`Quick Delve / Room 1 — Guardian (Threshold Scene)`

Left (Controls):

* Guardian Type: dropdown (Creature, Trap, Ward, Hybrid)
* Intensity Slider: (Soft Warning ←→ Hard Stop)
* Environmental Options: checkboxes (Collapsed floors, Necrotic haze, Ghost echoes)
* “Include Puzzle Hooks?” checkbox (optional link to Room 2)

Center (Procedural Panel):

* `TITLE`: "Bone Lantern Vestibule"
* `NARRATIVE (procedural)`: short but real-time scene based on template stacks
* `SENSORY` block (sound, smell, feel)
* `MECHANICS` summary:

  * Encounter (if any) with tags (e.g. `Undead · Brute`)
  * Trap (if any) with trigger and DC
  * Features list

Right (AI Panel):

* If AI is enabled:

  * Richer, longer version of the same opening scene
  * Pulls mechanical structure from center panel

Bottom (Final Editor):

* Text editor seeded either with:

  * Procedural only
  * AI only
  * Merged (procedural skeleton + AI flourish)
* Tabs:

  * `Scene Text`
  * `GM Notes`
* Chips at bottom for:

  * `Guardian: [Skeleton Legionnaires]`
  * `Trap: [Bone Lantern Ward]`
  * `Faction: [Cult of the Serpent]`

Actions:

* `Use Procedural`
* `Use AI`
* `Merge`
* `Save Room & Continue → Room 2`

Repeat this pattern for Puzzle, Trick, Climax, Reward with different controls per stage.

---

## 4. Encounter Designer UX Flow (Narrative Encounter Workflow)

Mode: **Encounter Designer**

The Encounter Designer has **6 Stages** (Setup, Approach, Twist, Challenge, Climax, Aftermath).

### 4.1 Stage 1: Setup & Foreshadowing

Screen: `Encounter / Stage 1 — Setup & Foreshadowing`

Left:

* Location: dropdown & text (e.g. “Sewer Junction beneath the Old Temple”)
* Biome / Sub-biome
* Faction presence
* Weather / ambient magical effect
* Encounter Hook: dropdown (Patrol, Ambush, Ritual, Negotiation, Chase)

Center (Procedural):

* Scene:

  * Setting paragraph (light, sound, smell, layout)
  * Foreshadow lines (broken weapons, blood, markings)
* Suggested stakes:

  * “If ignored, cult completes summon in 3 in-game hours.”
* Optional mechanical hints:

  * Cover spots
  * Choke points

Right (AI, optional):

* More vivid first-person scene, still consistent with procedural structure.

Bottom:

* Editor with:

  * `Use procedural` / `Use AI` / `Merge`
* `Save & Go to Stage 2`

---

### 4.2 Stage 4: Challenge Execution (Where Mechanics & Drama Meet)

Screen: `Encounter / Stage 4 — Core Challenge`

This is where you really see **side-by-side mechanical + narrative**.

Left (Controls):

* Challenge Type:

  * Combat · Skill Challenge · Puzzle · Social · Mixed
* Party Level & Size
* Target Difficulty: Easy / Standard / Hard / Deadly
* Special Rules toggles:

  * Time pressure
  * Environmental hazard
  * Morale system
  * Retreat conditions

Center (Procedural):

* For Combat:

  * Enemy lineup with roles (Brute, Skirmisher, Controller)
  * Initiative hints (surprise? ambush?)
  * Terrain interaction (e.g. “Central pit: DC 14 Athletics to jump”)
  * Round-by-round behavior scripting (e.g. “Round 3: Reinforcements appear if alarm is raised”)

* For Non-Combat challenges:

  * DC ladder (Primary DC, Secondary checks)
  * Fail-forward consequences
  * Steps & phases

Right (AI):

* A dynamic action scene:

  * Written as if playing out in real-time
  * Incorporates mechanics tags (enemy behavior, environment)
  * But remains optional decoration

Bottom:

* Editor where DM stitches:

  * “What the players see/feel”
  * “How the mechanics happen at the table”
* Actions:

  * `Save Challenge Scene`
  * `← Back to Stage 3` · `Next → Stage 5`

---

## 5. Tavern / Job Board UX Flow

Mode: **Tavern**

Tavern has multiple panels: `Job Board`, `NPC Chat`, `Oracle`, `Boxed Text`.

Here we focus on **Job Board**, since you already have the generator.

### 5.1 Job Board Main Screen

We already have code, so this spec focuses mostly on *workflow additions*:

Layout:

* **Top Controls Row**:

  * Setting field (free text)
  * Theme dropdown
  * Buttons:

    * `✨ Ask AI` (AI jobs)
    * `⚡ Quick Post` (procedural jobs)
* **Main Grid**: job cards
* **Right Sidebar (optional)**:

  * Filter by tags
  * Filter by difficulty
  * “Pin to Adventure” button once deeper integration exists

**Improvement for multi-stage workflow:**

Add a **Job Details Panel** when a job is clicked:

* Left: job card recap
* Center: structured breakdown:

  * Hook
  * Complications
  * Rewards
  * Ties to factions or locations
* Right:

  * Button: `Generate Encounter`
  * Button: `Add as Scene Seed to Adventure`

Selecting `Generate Encounter` opens Encounter Designer pre-seeded:

* Location = job location
* Enemy types pulled from job tags
* Stakes = job summary

This reuses the **Generator Shell** again in the Encounter Designer.

---

## 6. Adventure Workflow Integration UI

Mode: **Adventure Workflow**

You already have stages (Prep & Intro, Challenges, Midpoint, Puzzles/RP, Climax, Resolution).

### 6.1 Stage Screen Layout

For any stage:

* Left:

  * Context:

    * current act
    * main factions
    * PCs goals
    * clock/timers
  * Tools:

    * “Pull from Job Board”
    * “Insert Quick Delve”
    * “Insert Encounter”
* Center:

  * Procedural scaffolding (scene skeletons)
* Right:

  * AI alternate versions (optional)
* Bottom:

  * `Scene List`:

    * Each scene = card with:

      * Title
      * Type (travel, RP, combat)
      * Tags: NPCs, locations, factions
    * Drag to rearrange

Clicking a scene opens **Scene Editor** in the same Generator Shell.

---

## 7. Keyboard / Power-User UX

Goal: Very keyboard-friendly, but no hard-coded single shortcut like Ctrl+K.

### 7.1 Navigation

* `Alt + ←` : Previous stage/screen
* `Alt + →` : Next stage/screen
* `Ctrl + Enter` : “Generate” in current generator panel
* `Alt + 1` : Focus left (Controls)
* `Alt + 2` : Focus center (Procedural)
* `Alt + 3` : Focus right (AI panel)
* `Alt + E` : Focus bottom editor

### 7.2 Optional Command Palette

If implemented later:

* Default: `Ctrl + P` or user-configurable
* Actions:

  * `Go to Quick Delve`
  * `Go to Encounter Designer`
  * `New Job Board Post`
  * `Insert Scene from Delve`
  * `Toggle AI Panel`

But: **nothing in this spec relies on it**.

---

## 8. Linking & Cross-Feature UX

This is where complexity pays off.

### 8.1 From Job to Encounter

Flow:

1. DM generates job(s) in Tavern → Job Board.
2. Click job card → open detail.
3. Click `Generate Encounter`.
4. Encounter Designer opens:

   * Stage 1 pre-populated with location & stakes from job.
   * Opposition tags used to suggest enemy types.

### 8.2 From Encounter to Adventure Stage

In Encounter Designer footer, add:

* `Attach to Adventure Stage…` button

This opens:

* Modal listing current adventure acts/stages
* When chosen, the Encounter’s SceneNodes are added to that stage’s Scene List.

### 8.3 From Quick Delve to Adventure

In Quick Delve final screen:

* Buttons:

  * `Export as One-Shot`
  * `Insert as Side Dungeon into Adventure`

    * Prompts for:

      * Which stage it belongs to
      * Which job/rumor it ties to (optional)

### 8.4 Entity Linking (NPCs, Monsters, Locations)

In any editor:

* Selecting recognized names (NPC, monster, location) surfaces inline controls:

  * `Link to NPC`
  * `Link to Monster`
  * `Link to Location`

These show up as chips, and in compendium sidebars.
Links should be persisted using the Link Registry contract in `docs/specs/persistence.md`.

---

## 9. Summary

This UX blueprint gives you:

* A **consistent generator shell** for all tools:

  * Controls · Procedural · AI · Editor
* Multi-stage flows for:

  * Quick Delve (5 rooms, procedural-first)
  * Encounter Designer (6 narrative stages)
  * Job Board → Encounter/Adventure integration
  * Adventure Workflow with scene lists
* Clear **linkages between systems**:

  * Job ↔ Encounter ↔ Adventure
  * Quick Delve ↔ Adventure
  * Monsters/NPC/Locations as linked entities
* Keyboard-conscious design without forcing a single weird shortcut choice.
## Addendum: Multi-Step Pipeline Integration

- Add a per-tool pipeline stepper that maps to each tool's existing stages (e.g., Quick Delve rooms, Encounter stages).
- Require all generators to emit link chips backed by stable entity IDs.
- Provide a dependency panel that shows missing links and blocked steps across the workflow.
