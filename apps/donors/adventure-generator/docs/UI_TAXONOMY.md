# Narrative UI Taxonomy

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

This document defines the standardized visual and functional patterns for the "Narrative Script" interfaces. These components are located in `src/components/narrative-kit/`.

## Core Philosophy
*   **Card-Based**: Every tool is framed as a "Card" or "Screen" with a clear boundary.
*   **Header-Driven**: Title and Goal are always top-left; AI actions are top-right.
*   **Two-Column**: Complex data is split into "Context" (Left) and "Action" (Right).
*   **Tactical**: Lists use icons to denote function (Attack, Defense, Info) rather than just bullets.

## Components

### 1. NarrativeCard
The main container.
```tsx
import { NarrativeCard } from '@/components/narrative-kit/NarrativeCard';

<NarrativeCard variant="default">
  {/* Content */}
</NarrativeCard>
```

### 2. NarrativeHeader
Standard top bar for titles and primary actions.
```tsx
import { NarrativeHeader } from '@/components/narrative-kit/NarrativeHeader';

<NarrativeHeader 
  title="Crossroads Ambush" 
  goal="Break the Barricade" 
  onAiFastFill={() => {}} 
/>
```

### 3. NarrativeGrid
Responsive 2-column layout for the body.
```tsx
import { NarrativeGrid } from '@/components/narrative-kit/NarrativeGrid';

<NarrativeGrid 
  leftLabel="Environment"
  left={<MyEnvComponent />}
  rightLabel="Challenges"
  right={<MyChallengeComponent />}
/>
```

### 4. NarrativeTextarea
Styled input for prose/sensory descriptions.
```tsx
import { NarrativeTextarea } from '@/components/narrative-kit/NarrativeTextarea';

<NarrativeTextarea label="Description" value={val} onChange={setVal} />
```

### 5. TacticalList
Icon-enhanced lists for mechanics and behaviors.
```tsx
import { TacticalList } from '@/components/narrative-kit/TacticalList';

<TacticalList items={[
  { id: '1', text: 'Archers hold high ground', icon: 'defense' },
  { id: '2', text: 'Captain charges on sight', icon: 'attack' }
]} />
```

### 6. NarrativeFooter
Sticky action bar.
```tsx
import { NarrativeFooter } from '@/components/narrative-kit/NarrativeFooter';

<NarrativeFooter 
  leftActions={<button>Export</button>} 
  rightActions={<button>Done</button>} 
/>
```
