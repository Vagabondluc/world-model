# How to Update the Progress Tracker for a New Era

This guide explains the steps required to add progress tracking for a new gameplay era to the `CompletionTracker` component.

The core logic for tracking progress is centralized in `src/components/layout/CompletionTracker.tsx`. To add a new era, you need to modify the `ERA_GOALS` constant in this file.

## Step 1: Define Era Goals

Open `src/components/layout/CompletionTracker.tsx`. Locate the `ERA_GOALS` constant, which is defined inside a `useMemo` hook. Add a new entry for your era, following the existing structure.

### `ERA_GOALS` Structure

Each key in the object is the `eraId` (as a number). The value is an object with two properties:

1.  `name`: The display name of the era.
2.  `getTaskCount`: A function that calculates the number of completed tasks versus the total required tasks for a given player.

This function receives two arguments:
- `p: Player`: The player object for whom to calculate progress. This can be used to check for player-specific goals (e.g., `p.deityCount`).
- `els: ElementCard[]`: The complete list of all element cards in the game.

The function **must** return an object with two properties:
- `completed: number`: The count of tasks the player has completed for this era.
- `total: number`: The total number of tasks required for the player to complete the era. If the total is variable (e.g., depends on a player's choice), this function must calculate it. If the total is `0`, the era is considered not yet started for that player.

### Example: Adding Era III - Age of Foundation

Era III requires each player to create 1 Prime Faction, 1 Neighbor Faction, and 2 regular Settlements.

```typescript
// src/components/layout/CompletionTracker.tsx

3: { 
    name: 'Age of Foundation', 
    getTaskCount: (p: Player, els: ElementCard[]) => { 
        const f = els.filter(el => el.owner === p.playerNumber && el.era === 3 && el.type === 'Faction' && !el.isDebug); 
        const s = els.filter(el => el.owner === p.playerNumber && el.era === 3 && el.type === 'Settlement' && !el.isDebug); 
        const pF = f.some(i => !(i.data as Faction).isNeighbor) ? 1:0; 
        const n = f.some(i => (i.data as Faction).isNeighbor) ? 1:0; 
        const rS = s.filter(i => (i.data as Settlement).purpose !== 'Capital').length; 
        return { completed: pF + n + rS, total: 4 }; 
    } 
},
```

### Example: Adding Era IV - Age of Discovery (Turn-Based)

Progress for Eras IV, V, and VI is **turn-based**. The total number of turns depends on the `gameSettings` chosen at the start. The `getTaskCount` function must therefore use these settings to calculate the `total`.

The `ERA_GOALS` constant is defined inside a `useMemo` hook that has access to `gameSettings`. You can define a helper function like `getTurns` inside this hook.

```typescript
// src/components/layout/CompletionTracker.tsx

const ERA_GOALS = useMemo(() => {
    const getTurns = (eraId: 4 | 5 | 6) => {
        const length = gameSettings?.length || 'Standard';
        return TURNS_PER_ERA[length][eraId] || 0;
    };

    return {
        // ... other eras ...
        4: { 
            name: 'Age of Discovery', 
            getTaskCount: (p: Player, els: ElementCard[]) => ({ 
                completed: els.filter(el => el.owner === p.playerNumber && el.era === 4 && !el.isDebug).length, 
                total: getTurns(4) 
            }) 
        },
        // ... other eras ...
    };
}, [gameSettings]);
```

## Step 2: Update Tracked Era IDs

The `TRACKED_ERA_IDS` array, which controls which eras are displayed in the expanded view, is generated automatically from the keys of the `ERA_GOALS` object. As long as you add your new era to `ERA_GOALS` with a numeric key, this will update automatically.

## Step 3: Verify UI in Expanded View

The expanded view of the tracker automatically iterates over `TRACKED_ERA_IDS` to display per-player progress. Review the grid display in the UI and adjust the column count if necessary to maintain a clean layout.