# Roadmap: Pangea Rule Implementation

> This document describes a planned feature.

## 1. Overview

This document outlines the technical steps required to fully implement the "Alternate Pangea Rule" for Era I gameplay. The goal is to make the `usePangeaRule` setting in `GameSettings` have a functional impact on the world creation process.

## 2. Target Behavior

When `gameSettings.usePangeaRule` is `true`:

1.  **Landmass Selection is Bypassed**: In the `GeographyAdvisor` (`FeatureSelector.tsx`), the "Select Your Landmass Structure" dropdown (Rule 1.1) should be disabled or hidden. The game logic will override any individual player rolls.
2.  **Unified Landmass**: All players will place their geography features onto a single, shared landmass named "Pangea."
3.  **Landmass Assignment UI**: In the feature assignment table within `FeatureSelector.tsx`, the dropdown for assigning a feature to a landmass should contain only one option: "Pangea."
4.  **Rulebook Indication**: The `EraCreationRules.tsx` component should display a prominent notice at the top, indicating that the Pangea rule is active for this session.

## 3. Implementation Plan

### Step 1: Pass `gameSettings` to Era I Context

The `EraCreationProvider` needs access to the global `gameSettings`.

-   **File**: `src/components/era-interfaces/EraCreationContent.tsx`
-   **Action**: Modify the `EraCreationProvider` instantiation to pass down the `gameSettings` prop.

```tsx
// EraCreationContent.tsx
<EraCreationProvider currentPlayer={currentPlayer} gameSettings={gameSettings}>
    {/* ... */}
</EraCreationProvider>
```

-   **Files**: `src/contexts/EraCreationContext.tsx`, `src/types.ts`
-   **Action**: Update the `EraCreationProviderProps` interface to accept the optional `gameSettings` prop.

### Step 2: Modify Landmass Logic

The logic for determining available landmasses is centralized in `EraCreationContext.tsx`.

-   **File**: `src/contexts/EraCreationContext.tsx`
-   **Action**: Modify the `getLandmassOptions` function to account for the Pangea rule.

```typescript
// EraCreationContext.tsx

const getLandmassOptions = (landmassType: string, usePangeaRule?: boolean): string[] => {
    if (usePangeaRule) {
        return ['Pangea'];
    }
    // ... existing switch statement logic ...
};

// Inside the EraCreationProvider component:
const { gameSettings } = props;
const landmassOptions = getLandmassOptions(currentPlayerState.landmassType, gameSettings?.usePangeaRule);
```

### Step 3: Update UI Components

The UI needs to reflect the active rule.

-   **File**: `src/components/era-interfaces/era-creation/FeatureSelector.tsx`
    -   The landmass dropdown should be disabled if `gameSettings.usePangeaRule` is true. A helpful tooltip or text should explain why.
    -   The "Assign to Landmass" dropdowns will automatically update with the `['Pangea']` option from the context, requiring no direct changes.

-   **File**: `src/components/era-interfaces/common/rules/EraCreationRules.tsx`
    -   Use the `useGame()` hook to get `gameSettings`.
    -   Conditionally render a styled alert box at the top of the rules if `gameSettings.usePangeaRule` is true.

```tsx
// EraCreationRules.tsx
const { gameSettings } = useGame();

// Inside the return statement:
{gameSettings?.usePangeaRule && (
    <div className="p-4 mb-6 bg-amber-50 border-l-4 border-amber-500 text-amber-800">
        <p><strong>Alternate Pangea Rule is ACTIVE.</strong> All players will place geography on a single, shared continent.</p>
    </div>
)}
```

## 4. Impact

These changes will make the Pangea rule a fully functional gameplay modifier, enhancing the collaborative worldbuilding experience as intended by the original rulebook.