# Implicit Type Specification

This document identifies **dynamically calculated shapes** in the codebase that should be formalized into explicit TypeScript interfaces. Formalizing these types acts as a "contract" to prevent AI-assisted refactoring from accidentally removing or altering core business logic.

---

## 1. PlayerProgress

**Source:** `CompletionTracker.tsx`, `PlayerDashboard.tsx`

Tracks how far each player has progressed through each Era.

```typescript
export interface EraProgressDetail {
    completed: number;
    total: number;
    progress: number; // 0-1 ratio
}

export interface PlayerProgress {
    playerNumber: number;
    name: string;
    eras: Record<number, EraProgressDetail>;
    totalGamePercentage: number;
}
```

---

## 2. ChronicleStats

**Source:** `GameEndScreen.tsx`

Summary statistics generated at the end of a game session.

```typescript
export interface PrimeFactionSummary {
    name: string;
    ownerName: string;
}

export interface ChronicleStats {
    totalYears: number;
    primeFactions: PrimeFactionSummary[];
    totalElements: number;
    elementCounts: Record<string, number>;
}
```

---

## 3. ResourceTotals

**Source:** `ResourcePanel.tsx`

Aggregates all resources per player.

```typescript
export type ResourceTotals = Record<string, number>;
// Example: { Gold: 100, Food: 50, Mana: 0, Iron: 5, 'Darksteel': 1 }
```

---

## 4. EraBreakdown

**Source:** `GameSetup.tsx`

Pre-game calculation of how many years each Era will span based on settings.

```typescript
export interface EraBreakdown {
    era3: number;
    era4: number;
    era5: number;
    era6: number;
}

export interface GameDurationPreview {
    totalYears: number;
    eraBreakdown: EraBreakdown;
}
```

---

## 5. StepProgress

**Source:** `EraFoundationContent.tsx`, `EraDiscoveryContent.tsx`, `EraMythContent.tsx`, `EraEmpiresContent.tsx`

Tracks completion within a single Era across multiple steps.

```typescript
export interface StepProgressItem {
    completed: number;
    total: number;
}

export type StepProgress = Record<string, StepProgressItem>;
// Example: { faction: { completed: 1, total: 1 }, neighbor: { completed: 0, total: 1 } }
```

---

## 6. EraGoals

**Source:** `CompletionTracker.tsx`, `PlayerDashboard.tsx`

A configuration object defining completion logic per Era.

```typescript
export interface EraGoal {
    name: string;
    getTaskCount: (player: Player, elements: ElementCard[]) => {
        completed: number;
        total: number;
        normalizedCompleted?: number;
        normalizedTotal?: number;
    };
}

export type EraGoals = Record<number, EraGoal>;
```

---

## 7. CurrentYearDisplay

**Source:** `NavigationHeader.tsx`

The current in-game year, calculated dynamically.

```typescript
export type CurrentYearDisplay = string | null;
// Example: "Year 45" or null if not applicable
```

---

## 8. EraCreationState

**Source:** `useEraCreationState.ts`

State for the Era I (Creation) form, already partially typed but included for completeness.

```typescript
export interface EraCreationFeature {
    id: number;
    type: string;
    landmassIndex: string | number;
}

export interface EraCreationState {
    landmassType: string;
    featureCount: number;
    features: EraCreationFeature[];
    advice: string;
    isLoading: boolean;
    error: string;
    userInputAdvice: string;
}
```

---

## Recommended Actions

1. **Formalize Types:** Add the above interfaces to `src/types/progress.types.ts` (new file).
2. **Update Logic:** Refactor `useMemo` blocks to return explicitly typed objects.
3. **Add JSDoc Comments:** Document each type with its source component.

---

## Verification

- [ ] All listed types added to `src/types/progress.types.ts`.
- [ ] Components updated to use explicit type annotations.
- [ ] TypeScript compilation passes with no errors.
