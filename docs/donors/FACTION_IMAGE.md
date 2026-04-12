# Faction-Image (Sacred Sigil Generator) — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Faction-Image / Sacred Sigil Generator |
| Internal ID | `faction-image` |
| Class | **real app** |
| Adapter ID | `faction-image` (pending) |
| Manifest | not yet created |
| Source Root | `to be merged/faction-image/` |
| Source Kind | TypeScript — React 18, Vite, Shadcn/Radix UI, Tailwind, Vitest, Playwright, Stryker |
| Canonical Lane | asset / sigil — SVG layer composition, icon keyword index, faction-symbol generation |
| Phase 7 Methodology | behavioral capture |
| Adapter Status | **unregistered** |

---

## What It Is

The Sacred Sigil Generator is a web application for creating faction symbols (sigils) by layering composable SVG shapes, applying color palettes, symmetry rules, and filter effects. It draws from a game-icons.net SVG icon library and provides keyword-based search to discover symbols.

This is the most documented donor application: it has 20+ specification and critique documents written iteratively throughout its development, providing explicit behavioral contracts with no ambiguity about intended behavior.

**Primary use case in world-model context:** Generating faction/organization `AssetRecord`s — specifically SVG sigil assets that can be owned by an `EntityRecord` (faction, nation, order, deity).

---

## Application Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (?), TypeScript, Vite |
| UI | Shadcn/Radix UI, Tailwind CSS |
| Tests | Vitest (unit), Playwright (E2E), Stryker (mutation testing) |
| Icon source | game-icons.net SVG library (`game-icons.net.svg.zip`) |
| Built by | Lovable (AI-assisted UI builder, lovable.dev) |

---

## Canonical Contribution Surface

### 1. SigilLayerType — 25 SVG Layer Shapes

```typescript
type SigilLayerType =
  | "circle"  | "ring"    | "triangle" | "square" | "diamond"
  | "pentagon"| "eye"     | "sun"      | "moon"   | "serpent"
  | "hand"    | "cross"   | "arc"      | "rays"   | "dots"
  | "text"    | "symbol"  | "hammer"   | "mandala"| "rune"
  | "beast"   | "star"    | "crown"    | "shield" | "raw-svg";
```

Source: `src/icon-generator/types.ts`. Named `LayerType` in source — canonical alias `SigilLayerType` to avoid collision with spatial `LayerType`.

### 2. Layer Composition Model

A sigil is a stack of `Layer` objects, each with:

```typescript
type Layer = {
  id: string;
  type: SigilLayerType;
  rawSvg?: string;             // for "raw-svg" type
  transform?: string;          // CSS transform
  opacity?: number;
  fill?: string;               // CSS color
  stroke?: string;
  strokeWidth?: number;
  align?: AlignMode;           // "center" | "north" | "south" | "east" | "west"
  blendMode?: BlendMode;       // 12 CSS blend mode values
  r?: number;                  // radius for circle/ring
  points?: string;             // SVG points for polygon
  d?: string;                  // SVG path data
  text?: string;               // for "text" type
  fontSize?: number;
  cx?: number; cy?: number;    // center coordinates
  x?: number; y?: number;
  width?: number; height?: number;
};
```

### 3. Color System

| Type | Values |
|---|---|
| `ColorChannel` | `"primaryColor" \| "secondaryColor" \| "accentColor" \| "backgroundColor"` |
| `ColorOwner` | `"domain" \| "preset" \| "manual"` |
| `ColorPresetKey` | `"domain" \| "default" \| "high-contrast" \| "muted" \| "vivid" \| "monochrome"` |
| `BlendMode` | 12 values: `normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, difference, exclusion, soft-light` |

Domain palettes (`domainPalettes.ts`) — pre-defined color themes per faction/world domain (e.g. arcane, infernal, nature, law).

### 4. Symmetry Engine

`symmetry.ts`, `symmetryDefinitions.ts`, `symmetryCompatibility.ts` define a full sigil symmetry system:
- Symmetry types: radial, bilateral, rotational, none (exact definitions in `symmetryDefinitions.ts`)
- `symmetryCompatibility.ts` — not all layer types support all symmetry modes
- `domainSymmetryAffinities.ts` — faction domains have preferred symmetry types

### 5. Filter System

```typescript
type FilterPreset = "none" | "glow" | "etch" | "mist";
type FilterDef = {
  id: string;
  preset: Exclude<FilterPreset, "none">;
  intensity: number;
};
```

### 6. Icon Discovery System

`src/icon-discovery/` — keyword-based search over the game-icons.net library.

Scripts:
- `scripts/auto-tag-icons.mjs` — auto-tagging pipeline
- `scripts/build-keyword-index.mjs` — builds searchable keyword index
- `scripts/validate-keywords.mjs` — validates index integrity

This is a standalone extractable sub-system. The keyword index and auto-tagger can operate independently of the sigil composer.

### 7. Seed-Based Variant Generation

`src/icon-generator/seedManager.ts`, `rng.ts` — deterministic variant generation. A seed produces a reproducible sigil configuration. This means sigils can be stored as seeds (small integer) rather than full layer stacks (large SVG data).

### 8. Asset Library

`src/icon-generator/assetLibrary.ts` — manages the loaded SVG icon asset set. Entry point for icon discovery and composition.

---

## Specification Surface (20+ Docs)

The faction-image folder contains a complete specification history. Key documents:

| Doc | Content |
|---|---|
| `IMPLEMENTATION-SPEC.md` | Feature spec: collapsible sidebar sections, variant grid scroll UX, layer properties empty/group states |
| `SPEC-SYMMETRY.md` | Symmetry engine specification |
| `SPEC-LAYERS-SIDEBAR.md` | Layer sidebar UI specification |
| `SPEC-DASHBOARD-ENDPOINT.md` | Dashboard API endpoint specification |
| `SPEC-ICON-BOUNDARIES.md` | Icon area bounds and positioning |
| `SPEC-ICON-IMPLEMENTATION.md` | Icon rendering implementation spec |
| `SPEC-ONBOARDING-UI.md` | First-use onboarding specification |
| `CRITIQUE-SPEC-IMPLEMENTATION.md` | Gap analysis between spec and implementation |
| `CRITIQUE-COMPLIANCE-PLAN.md` | Plan to close spec/implementation gaps |
| `CRITIQUE-LAYERS-SIDEBAR.md` | Sidebar specific critique |
| `UI-UX-SPEC.md` | Full UI/UX specification |
| `FIELD-REFERENCE.md` | All LayerSpec field definitions |
| `SPIKE-EXIT.md` | Technical spike resolution |

---

## Implied Canonical Contribution: SigilAttachment

The natural canonical promotion from faction-image is a `SigilAttachment` on `AssetRecord` or `EntityRecord`. This would allow factions, nations, orders, and deities to carry a machine-regenerable sigil definition.

```typescript
type SigilSpec = {
  layers: SigilLayer[];           // ordered composable layers
  seed?: number;                   // optional seed for variant regeneration
  symmetry: SymmetryType;
  filter_preset: FilterPreset;
  domain_palette?: string;         // faction domain key
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
};
```

A `SigilAttachment` on `EntityRecord` would allow:
- Faction entities to own canonical SVG sigils
- Deterministic regeneration from seed
- Domain palette integration (faction domain → color theme)

---

## Test Coverage

| Layer | Tool | Notes |
|---|---|---|
| Unit | Vitest | `src/icon-generator/*.test.ts` — composition, symmetry, color reducer, seed manager, export utils |
| E2E | Playwright | `tests/e2e/dashboard-endpoint.spec.ts`, performance specs |
| Mutation | Stryker | `stryker.config.json` — mutation testing on core logic |

This is the most thoroughly tested donor in the inventory.

---

## What Is NOT Canonical

- Dashboard (`dashboard.html`, `DashboardApp.tsx`) — donor-local diagnostic surface
- `src/mutation-testing-demo/` — Stryker demo; not domain logic
- Lovable-generated boilerplate routing — donor-local

---

## Registration Steps Required

1. Create `world-model/adapters/faction-image/manifest.yaml`
2. Copy source snapshot (core: `src/icon-generator/`, `src/icon-discovery/`, `data/`)
3. Write `world-model/adapters/faction-image/mappings/concept-map.yaml`
4. Add `FactionImage` variant to `SpecDonor`, `SourceSystem`, `DonorSystem` enums
5. Register spec source TOML at `spec-sources/faction-image.toml`
6. Define `SigilAttachment` canonical type and add to `AssetRecord` or `EntityRecord`
7. Add `SigilLayerType` to canonical primitives in `CANONICAL_MODEL.md` ✓ (already done)
8. Add Phase 7 route `/donor/faction-image`
