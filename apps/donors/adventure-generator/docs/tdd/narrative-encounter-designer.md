
# TDD — Test-Driven Development Plan

### **Testing Philosophy**

The Encounter Designer must pass **deterministic procedural tests**, **non-deterministic AI tests**, **UI/UX tests**, and **integration tests**. All paths, including failures, must be covered.

### **Revised Process (State-First)**
To prevent integration errors, a "state-first" TDD approach will be used for new features:
1.  **State Contract Tests:** Write tests for the Zustand store *first*. Ensure actions correctly mutate state before any UI exists.
2.  **Data Source Tests:** Verify that static data structures (e.g., templates in `data/encounterData.ts`) are correctly formatted.
3.  **Component Unit Tests:** Test the new UI component in isolation, mocking the store to verify that UI interactions call the correct actions.
4.  **Integration & E2E Tests:** Finally, test the integrated component within its parent view to ensure correct conditional rendering and end-to-end data flow.

---

# **A. Unit Tests (Procedural Engine)**

### **1. Stage 1 Procedural Tests**

*   ✔ Generates sensory package
*   ✔ Produces foreshadowing clues
*   ✔ Produces thematic tags
*   ✔ Always returns ≥1 scene node

```ts
test("stage1 generates sensory, foreshadowing, thematic", () => {
  const result = generateStage1(context);
  expect(result.sensory).toBeDefined();
  expect(result.narrative.length).toBeGreaterThan(10);
});
```

---

### **2. Stage 2 Procedural Tests (State-First Approach)**
*   ✔ **Store Test:** `useEncounterWizardStore` correctly initializes `approachMode` and `obstacles`.
*   ✔ **Store Test:** `setApproachMode` and `setObstacles` actions correctly update the state.
*   ✔ **Data Test:** `ENCOUNTER_APPROACH_DATA` in `data/encounterData.ts` is correctly structured and accessible.
*   ✔ **UI Test (Controls):** `EncounterApproachControls` renders form elements (dropdown for mode, checkboxes for obstacles).
*   ✔ **UI Test (Controls):** Interacting with form elements correctly calls `setApproachMode` and `setObstacles` actions.
*   ✔ **Integration Test:** `EncounterWizard` correctly displays `EncounterApproachControls` when `currentStage` is "Approach".
*   ✔ **Procedural Test:** `generateApproachNode` function correctly uses `approachMode` and `obstacles` to generate a skill challenge.
*   ✔ **Procedural Test:** `generateApproachNode` correctly selects hazards based on theme/context.

---

### **3. Stage 3 Procedural Tests**

*   ✔ Twist type influences mechanic outputs
*   ✔ Reinforcement twist produces enemy additions
*   ✔ Reveal twist produces lore node

---

### **4. Stage 4 Procedural Tests**

**Combat:**
*   ✔ Enemy roles assigned
*   ✔ Round behavior script exists
*   ✔ Terrain interactions valid

**Puzzle:**
*   ✔ Steps array populated
*   ✔ DC scaling correct

---

### **5. Stage 5 Procedural Tests**

*   ✔ Climax node exists
*   ✔ High-danger DC scaling works
*   ✔ Consequences prepared

---

### **6. Stage 6 Procedural Tests**

*   ✔ Loot parcel generated
*   ✔ XP scaled correctly
*   ✔ Transition text present

---

# **B. UI Tests (Cypress)**

### **Stage Navigation**

*   ✔ Clicking “Next” moves to the next stage
*   ✔ “Back” returns to previous
*   ✔ Breadcrumb updates correctly

### **Generator Shell Tests**

*   ✔ Controls update procedural output
*   ✔ **Example:** When the 'Threat Tone' dropdown in Stage 1 is changed to 'tragic', the `[data-testid='procedural-output']` element should contain keywords like 'sorrow,' 'loss,' or 'despair'.
*   ✔ AI panel hidden when AI disabled
*   ✔ Merge button populates editor

### **Final Editor**

*   ✔ User edits persist between stages
*   ✔ Saving encounter produces EncounterSceneNodes[]

---

# **C. Integration Tests**

### **Map → Encounter**

*   ✔ Selecting a hex autofills biome + location

### **Job Board → Encounter**

*   ✔ Clicking “Generate Encounter” populates stakes + enemies

### **Encounter → Adventure Workflow**

*   ✔ Imported encounter creates SceneNodes inside chosen stage

---

# **D. AI Output Validation Tests**

### **1. Schema Validation**
*   ✔ AI outputs that should be structured (e.g., a list of outcomes) MUST pass a Zod `.safeParse()` check against the expected schema.

### **2. Guardrail Testing**
*   ✔ AI-generated narrative text MUST NOT contain metagame language (e.g., "the players", "the DM", "roll a check").
*   ✔ AI-generated narrative text MUST include key nouns/verbs from the procedural input context to ensure it is augmenting, not ignoring, the base content.

### **3. Snapshot Testing (Optional)**
*   ✔ For a given procedural input, the AI output should be reasonably consistent. Snapshot tests can be used to flag major, unexpected deviations in style or content between model versions or prompt changes.

---

# **E. Error & Edge Case Tests**

### **1. Procedural Engine**
*   ✔ `generateStageX()` functions handle null or incomplete context without crashing.
*   ✔ The engine produces a valid, if generic, output even if all specific context is missing.

### **2. AI Service**
*   ✔ The UI displays a clear, user-friendly error message if an AI API call fails (e.g., network error, invalid API key).
*   ✔ A loading indicator is properly displayed during AI generation and correctly removed on success or failure.

### **3. Application Logic**
*   ✔ The system gracefully handles an attempt to save an incomplete or invalid encounter (e.g., missing a title or core challenge).
*   ✔ Navigating away from the wizard and returning correctly restores the session state from the Zustand store.
