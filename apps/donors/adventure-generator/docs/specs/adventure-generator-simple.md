
# SPEC: Quick Delve Generator (DEC-025)

## 1. Overview
The **Quick Delve** is the third generation method for the Adventure Generator. Unlike the "Arcane Library" (Hooks) or "Plot Patterns" (Complex Outlines), the Quick Delve produces a **playable, linear 5-room dungeon** instantly. It bridges the gap between a simple prompt and a complex campaign outline.

## 2. The "5-Room Dungeon" Model
The generator follows the classic 5-room dungeon philosophy to ensure pacing and variety:
1.  **Entrance/Guardian:** A combat or hazard that prevents entry.
2.  **Puzzle/Roleplay:** A non-combat challenge.
3.  **Trick/Setback:** A resource drain or false hope.
4.  **Climax:** The boss fight or primary conflict.
5.  **Reward/Revelation:** Loot or a plot twist.

## 3. Data Structures

### 3.1 Interfaces (`types/delve.ts`)
```typescript
export type DelveTheme = 'crypt' | 'ruin' | 'cavern' | 'tower' | 'sewer';

export interface DelveRoom {
  id: string;
  type: 'guardian' | 'puzzle' | 'trick' | 'climax' | 'reward';
  title: string;
  description: string;
  features: string[];
  encounter?: {
    monsters: string[]; // Names or IDs
    difficulty: string;
  };
  trap?: {
    trigger: string;
    effect: string;
  };
  treasure?: string[];
}

export interface Delve {
  id: string;
  title: string;
  theme: DelveTheme;
  level: number;
  rooms: DelveRoom[];
}
```

## 4. Procedural Generation Logic

### 4.1 Templates (`data/delveData.ts`)
We will define arrays of templates for each room type, keyed by `DelveTheme`.

*Example (Crypt - Guardian):*
- "Skeletal sentries stand motionless in alcoves until the threshold is crossed."
- "A gargoyle statue asks a riddle; failure animates it."

*Example (Ruin - Trick):*
- "The floor is rotten; a Dex save is needed to avoid falling into the basement."
- "A classic pit trap covered by an illusion of a rug."

### 4.2 Generator (`utils/delveGenerator.ts`)
The function `generateDelve(theme: DelveTheme, level: number)` will:
1.  Select templates for each of the 5 steps based on the Theme.
2.  Inject monster encounters using the existing `srd_monster_index` or procedural logic based on CR/Level.
3.  Inject traps using the existing `TrapGenerator` logic (DEC-001 implementation) if possible, or simple templates.
4.  Inject loot using the existing `LootGenerator` logic.

## 5. UI/UX
*   **Location:** `components/adventure/steps/QuickDelveStep.tsx`.
*   **Inputs:**
    *   Theme Selector (Dropdown)
    *   Party Level (Slider 1-20)
    *   "Generate Delve" Button
*   **Output:**
    *   A vertical list of the 5 rooms cards.
    *   Each card shows the room title, description, and mechanics.
    *   "Export to text" button.

## 6. Integration
*   Add "Quick Delve" as a 3rd option in `MethodSelector.tsx`.
*   Store the result in `AdventureDataStore` (new field: `activeDelve`).
