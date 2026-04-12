# Color Presets

**Onboarding Panel Target:** `[data-onboard="color-preset"]`

## Overview

Color presets provide pre-configured color palettes that can be quickly applied to generated icons. Presets offer a convenient way to achieve specific visual styles without manually adjusting individual color channels. The system includes several built-in presets, and presets can be applied to all channels or only to non-manually-edited channels.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Style section
- **Options:**
  - domain (uses domain palette)
  - default
  - high-contrast
  - muted
  - vivid
  - monochrome

## Data Structures

### Color Preset Key

```typescript
// From types.ts
export type ColorPresetKey =
  | "domain"
  | "default"
  | "high-contrast"
  | "muted"
  | "vivid"
  | "monochrome";
```

### Color Palette

```typescript
// From colorReducer.ts
export type ColorPalette = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
};
```

### Preset Palettes

```typescript
// From colorReducer.ts
export const PRESET_PALETTES: Record<Exclude<ColorPresetKey, "domain">, ColorPalette> = {
  "default": {
    primaryColor: "#1a1a2e",
    secondaryColor: "#16213e",
    accentColor: "#e94560",
    backgroundColor: "#0f3460"
  },
  "high-contrast": {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#ffcc00",
    backgroundColor: "#111111"
  },
  "muted": {
    primaryColor: "#46505a",
    secondaryColor: "#6b7280",
    accentColor: "#9ca3af",
    backgroundColor: "#2b3138"
  },
  "vivid": {
    primaryColor: "#0ea5e9",
    secondaryColor: "#8b5cf6",
    accentColor: "#f43f5e",
    backgroundColor: "#1e1b4b"
  },
  "monochrome": {
    primaryColor: "#202020",
    secondaryColor: "#7a7a7a",
    accentColor: "#d4d4d4",
    backgroundColor: "#101010"
  },
};
```

## Code Execution Path

### 1. Preset Selection Flow

```
User selects preset from dropdown
    ↓
onApplyPreset(preset, applyToAll) callback triggered
    ↓
PRESET_PALETTES[preset] retrieves palette
    ↓
applyColorAction({ type: "select-preset", preset, palette, applyToAll })
    ↓
ownerByChannel updated to "preset" (for affected channels)
    ↓
Icon regenerated with new colors
```

### 2. Apply to All vs. Preserve Manual

```
if (applyToAll) {
  // All channels set to "preset" owner
  all channels → preset colors
} else {
  // Only non-manual channels updated
  if (ownerByChannel[channel] !== "manual") {
    channel → preset color
    ownerByChannel[channel] = "preset"
  }
}
```

## Key Functions

### [`applyColorAction()`](../src/icon-generator/colorReducer.ts:56)

Main color state reducer function.

**Preset Selection Handler (lines 77-95):**
```typescript
if (action.type === "select-preset") {
  const nextOwners = { ...owners };
  (Object.keys(nextOwners) as ColorChannel[]).forEach((channel) => {
    if (action.applyToAll || nextOwners[channel] !== "manual") {
      nextOwners[channel] = "preset";
    }
  });
  const next = { ...config };
  (Object.keys(nextOwners) as ColorChannel[]).forEach((channel) => {
    if (nextOwners[channel] === "preset") {
      next[channel] = action.palette[channel];
    }
  });
  return {
    ...next,
    ownerByChannel: nextOwners,
    colorPresetKey: action.preset,
  };
}
```

### Reset Domain Colors

```typescript
if (action.type === "reset-domain") {
  return {
    ...config,
    ...action.palette,
    ownerByChannel: { ...DEFAULT_OWNER_BY_CHANNEL },
    colorPresetKey: "domain",
    manualColorDirtyByChannel: {},
  };
}
```

## Color Owner Tracking

The system tracks which source owns each color channel:

```typescript
export type ColorOwner = "domain" | "preset" | "manual";

export type OwnerByChannel = Record<ColorChannel, ColorOwner>;

export const DEFAULT_OWNER_BY_CHANNEL: OwnerByChannel = {
  primaryColor: "domain",
  secondaryColor: "domain",
  accentColor: "domain",
  backgroundColor: "domain",
};
```

## Preset Visual Characteristics

| Preset | Primary | Secondary | Accent | Background | Style |
|--------|---------|-----------|--------|------------|-------|
| default | Dark navy | Darker navy | Red-pink | Dark blue | Classic, balanced |
| high-contrast | Black | White | Yellow | Near black | Maximum visibility |
| muted | Gray-blue | Gray | Light gray | Dark gray | Subtle, understated |
| vivid | Sky blue | Purple | Rose | Deep purple | Bold, vibrant |
| monochrome | Dark gray | Mid gray | Light gray | Black | Grayscale, minimal |

## State Management

### Preset in IconConfig

```typescript
export type IconConfig = {
  colorPresetKey?: ColorPresetKey | null;
  ownerByChannel?: OwnerByChannel;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  manualColorDirtyByChannel?: Partial<Record<ColorChannel, boolean>>;
  // ...
};
```

## Related Files

| File | Purpose |
|------|---------|
| [`colorReducer.ts`](../src/icon-generator/colorReducer.ts) | Color state management |
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Preset selection UI |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
| [`domainPalettes.ts`](../src/icon-generator/domainPalettes.ts) | Domain color palettes |
