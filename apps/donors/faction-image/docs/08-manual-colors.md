# Manual Colors

**Onboarding Panel Target:** `[data-onboard="color-channels"]`

## Overview

Manual color controls allow users to customize individual color channels independently. Each of the four color channels (primary, secondary, accent, background) can be adjusted via color pickers. The system tracks which channels have been manually edited, preserving these changes when presets or domains are changed (unless explicitly overridden).

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Style section
- **Controls:** Four color picker inputs, one per channel
- **Indicators:** Owner icon shows source (🌐 domain, 🎨 preset, ✏️ manual)

## Data Structures

### Color Channel Type

```typescript
// From types.ts
export type ColorChannel =
  | "primaryColor"
  | "secondaryColor"
  | "accentColor"
  | "backgroundColor";
```

### Color Owner Type

```typescript
// From types.ts
export type ColorOwner = "domain" | "preset" | "manual";
```

### Owner by Channel

```typescript
// From types.ts
export type OwnerByChannel = Record<ColorChannel, ColorOwner>;

// Default state
export const DEFAULT_OWNER_BY_CHANNEL: OwnerByChannel = {
  primaryColor: "domain",
  secondaryColor: "domain",
  accentColor: "domain",
  backgroundColor: "domain",
};
```

### Color Action Types

```typescript
// From colorReducer.ts
export type ColorAction =
  | { type: "select-domain"; palette: ColorPalette }
  | { type: "select-preset"; preset: ColorPresetKey; palette: ColorPalette; applyToAll: boolean }
  | { type: "manual-edit"; channel: ColorChannel; value: string }
  | { type: "reset-domain"; palette: ColorPalette }
  | { type: "reset-preset"; preset: ColorPresetKey; palette: ColorPalette };
```

## Code Execution Path

### 1. Manual Color Edit Flow

```
User changes color picker value
    ↓
onManualColorChange(channel, value) callback triggered
    ↓
applyColorAction({ type: "manual-edit", channel, value })
    ↓
config[channel] = value
ownerByChannel[channel] = "manual"
manualColorDirtyByChannel[channel] = true
    ↓
Icon regenerated with new color
```

### 2. Owner Tracking Flow

```
Color change initiated
    ↓
Check current ownerByChannel[channel]
    ↓
If manual edit:
  - Set owner to "manual"
  - Mark channel as dirty
If preset apply:
  - Check applyToAll flag
  - If false, skip manual channels
  - If true, override all channels
```

## Key Functions

### [`applyColorAction()`](../src/icon-generator/colorReducer.ts:56) - Manual Edit Handler

```typescript
export function applyColorAction(config: IconConfig, action: ColorAction): IconConfig {
  const owners = { ...ownerByChannel(config) };

  if (action.type === "manual-edit") {
    return {
      ...config,
      [action.channel]: action.value,
      ownerByChannel: { ...owners, [action.channel]: "manual" },
      manualColorDirtyByChannel: {
        ...(config.manualColorDirtyByChannel || {}),
        [action.channel]: true
      },
    };
  }
  // ... other action types
}
```

### Owner Icon Display

```typescript
// From ConfigForm.tsx
const OWNER_ICON: Record<ColorOwner, string> = {
  domain: "🌐",
  preset: "🎨",
  manual: "✏️",
};

function OwnerLabel({ owner, text }: { owner: ColorOwner; text: string }) {
  return <Label className="text-xs">{OWNER_ICON[owner]} {text}</Label>;
}
```

## Color Application Pipeline

### From Config to SVG

```
IconConfig colors
    ↓
buildIconSpec() reads color values
    ↓
Colors applied to Layer properties:
  - fill: primary or accent
  - stroke: secondary or accent
  - background: backgroundColor
    ↓
SVGRuntimeRenderer renders layers
    ↓
SVG elements receive color attributes
```

### Color Resolution Priority

1. **Manual color** - Highest priority, explicitly set by user
2. **Preset color** - Applied from selected preset palette
3. **Domain color** - Default from selected domain palette
4. **Fallback default** - Hardcoded default if nothing specified

## Channel Purposes

| Channel | Typical Use | SVG Attribute |
|---------|-------------|---------------|
| primaryColor | Main shapes, fills | `fill` |
| secondaryColor | Supporting elements, strokes | `stroke` |
| accentColor | Highlights, details, emphasis | `fill`, `stroke` |
| backgroundColor | Background shape fill | `fill` |

## State Management

### Manual Color State

```typescript
export type IconConfig = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  ownerByChannel?: OwnerByChannel;
  manualColorDirtyByChannel?: Partial<Record<ColorChannel, boolean>>;
  // ...
};
```

### Dirty Channel Tracking

The `manualColorDirtyByChannel` flag prevents preset applications from overwriting manual edits:

```typescript
// When applying preset (applyToAll = false):
if (nextOwners[channel] !== "manual") {
  nextOwners[channel] = "preset";
  next[channel] = palette[channel];
}
```

## Reset Options

### Reset to Domain Colors

```typescript
// Action: reset-domain
{
  ...config,
  ...domainPalette,
  ownerByChannel: { ...DEFAULT_OWNER_BY_CHANNEL },
  colorPresetKey: "domain",
  manualColorDirtyByChannel: {},
}
```

### Reset to Preset Colors

```typescript
// Action: reset-preset
{
  ...config,
  ...presetPalette,
  ownerByChannel: {
    primaryColor: "preset",
    secondaryColor: "preset",
    accentColor: "preset",
    backgroundColor: "preset",
  },
  colorPresetKey: preset,
  manualColorDirtyByChannel: {},
}
```

## Related Files

| File | Purpose |
|------|---------|
| [`colorReducer.ts`](../src/icon-generator/colorReducer.ts) | Color state management |
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Color picker UI |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Color application to layers |
