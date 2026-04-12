# Domain Selection

**Onboarding Panel Target:** `[data-onboard="domain"]`

## Overview

Domains are thematic categories that influence the visual style of generated icons. Each domain has an associated color palette and symmetry affinities that automatically configure the generator for coherent, thematic results. Selecting a domain provides a curated starting point while still allowing manual customization.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx:144)
- **Location:** Left sidebar, Frame section
- **Dropdown options:** 12 faction domains + "None (manual colors)"

## Data Structures

### Faction Domain Type

```typescript
// From domainPalettes.ts
export type FactionDomain =
  | "divine"
  | "order"
  | "chaos"
  | "nature"
  | "shadow"
  | "arcane"
  | "primal"
  | "death"
  | "life"
  | "forge"
  | "storm"
  | "trickery";
```

### Domain Palette

```typescript
// From domainPalettes.ts
export type DomainPalette = {
  primary: string;    // Main color
  secondary: string;  // Supporting color
  accent: string;     // Highlight color
  shadow: string;     // Dark accent
  highlight: string;  // Light accent
};
```

### Domain Symmetry Affinity

```typescript
// From domainSymmetryAffinities.ts
type DomainAffinity = {
  primary: SymmetryId;      // Recommended symmetry
  secondary: SymmetryId[];  // Alternative options
};
```

## Code Execution Path

### 1. Domain Selection Flow

```
User selects domain from dropdown (ConfigForm.tsx:144-150)
    ↓
onDomainChange(domain) callback triggered
    ↓
Domain palette fetched via getDomainPalette(domain)
    ↓
Colors applied via applyColorAction({ type: "select-domain", palette })
    ↓
Symmetry suggestions retrieved via getDomainSymmetrySuggestions(domain)
    ↓
UI updates to show recommended symmetries
```

### 2. Color Application Flow

```
Domain selected
    ↓
getDomainPalette(domain) returns DomainPalette
    ↓
domainPaletteToColorPalette() converts to ColorPalette
    ↓
applyColorAction() updates IconConfig colors
    ↓
ownerByChannel set to "domain" for all channels
    ↓
Icon regenerated with new colors
```

### 3. Symmetry Suggestion Flow

```
Domain changed
    ↓
getDomainSymmetrySuggestions(domain) called
    ↓
Returns { primary: SymmetryId, secondary: SymmetryId[] }
    ↓
UI highlights recommended symmetries in dropdown
    ↓
User can accept suggestion or choose different symmetry
```

## Key Functions

### [`getDomainPalette()`](../src/icon-generator/domainPalettes.ts)

Retrieves the color palette for a given domain.

**Domain Color Mappings:**
| Domain | Primary | Secondary | Accent | Shadow |
|--------|---------|-----------|--------|--------|
| divine | #ffd700 | #ffffff | #ff8c00 | #b8860b |
| order | #1e3a5f | #4a90d9 | #c0c0c0 | #0a1628 |
| chaos | #8b0000 | #ff4500 | #9932cc | #2d0a0a |
| nature | #228b22 | #90ee90 | #8b4513 | #0a2a0a |
| shadow | #2f2f2f | #696969 | #9400d3 | #0a0a0a |
| arcane | #4b0082 | #9370db | #00ffff | #1a0a2e |

### [`getDomainSymmetrySuggestions()`](../src/icon-generator/domainSymmetryAffinities.ts:24)

Returns recommended symmetries for a domain.

```typescript
export function getDomainSymmetrySuggestions(
  domain?: FactionDomain
): { primary: SymmetryId | null; secondary: SymmetryId[] } {
  if (!domain) return { primary: null, secondary: [] };
  const affinity = DOMAIN_SYMMETRY_AFFINITIES[domain];
  if (!affinity) return { primary: null, secondary: [] };
  return { primary: affinity.primary, secondary: affinity.secondary };
}
```

### Domain-Symmetry Affinities

Defined in [`domainSymmetryAffinities.ts`](../src/icon-generator/domainSymmetryAffinities.ts:9):

| Domain | Primary Symmetry | Secondary Options |
|--------|-----------------|-------------------|
| divine | radial-6 | radial-8, hybrid-hex, hybrid-oct |
| order | hybrid-quad | rot-4, radial-4, rot-8 |
| chaos | none | rot-2, rot-3, rot-6 |
| nature | radial-6 | rot-6, rot-3, mirror-h |
| shadow | mirror-v | rot-2, none, mirror-h |
| arcane | rot-8 | radial-8, hybrid-oct, rot-6 |
| primal | rot-6 | rot-3, mirror-v, none |
| death | rot-2 | mirror-v, none, radial-4 |
| life | radial-6 | radial-8, mirror-h, rot-6 |
| forge | rot-4 | hybrid-quad, mirror-vh, radial-4 |
| storm | rot-8 | radial-8, radial-12, hybrid-oct |
| trickery | hybrid-tri | rot-3, mirror-v, none |

## State Management

### Domain in IconConfig

```typescript
export type IconConfig = {
  domain?: FactionDomain;
  // Colors derived from domain or set manually
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  // Tracks color ownership
  ownerByChannel?: OwnerByChannel;
  colorPresetKey?: ColorPresetKey | null;
};
```

### Color Ownership

When a domain is selected, the `ownerByChannel` tracks which colors come from the domain:

```typescript
// Default after domain selection
{
  primaryColor: "domain",
  secondaryColor: "domain",
  accentColor: "domain",
  backgroundColor: "domain"
}
```

### Domain Change Handler

In [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx), domain changes trigger:

1. Color palette update
2. Symmetry suggestion update
3. Optional regeneration with new domain settings

## Domain Influence on Generation

### Color Influence

- Domain palette becomes the default color scheme
- Colors can be overridden by presets or manual selection
- `ownerByChannel` tracks the source of each color

### Symmetry Influence

- Primary suggestion highlighted in UI
- Secondary suggestions shown as alternatives
- User can override with any symmetry mode
- Domain-symmetry pairs designed for thematic coherence

### Symbol Influence

While not directly enforced, domains guide symbol choices:
- **divine**: sun, star, crown, mandala
- **order**: shield, square geometric shapes
- **chaos**: asymmetric, irregular patterns
- **nature**: organic shapes, leaves, trees
- **shadow**: dark motifs, crescents, eyes
- **arcane**: mystical symbols, runes, stars

## Related Files

| File | Purpose |
|------|---------|
| [`domainPalettes.ts`](../src/icon-generator/domainPalettes.ts) | Domain color definitions |
| [`domainSymmetryAffinities.ts`](../src/icon-generator/domainSymmetryAffinities.ts) | Domain-symmetry mappings |
| [`types.ts`](../src/icon-generator/types.ts) | FactionDomain type |
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Domain selection UI |
| [`colorReducer.ts`](../src/icon-generator/colorReducer.ts) | Color state management |
