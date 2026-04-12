# Settings

**Onboarding Panel Targets:** `[data-onboard="settings-gear"]`, `[data-onboard="settings-modal"]`

## Overview

The Settings system provides access to debug options and advanced features. The settings modal contains toggles for experimental features organized by development phase. These settings persist across sessions and allow power users to access features before they are fully released.

## UI Components

### Settings Gear Button

- **Location:** Header or toolbar
- **Target:** `[data-onboard="settings-gear"]`
- **Action:** Opens settings modal

### Settings Modal

- **Location:** Modal dialog
- **Target:** `[data-onboard="settings-modal"]`
- **Contents:** Debug toggle switches organized by phase

## Data Structures

### Debug Hook Settings

```typescript
// From types.ts
export type DebugHookSettings = {
  phase2CanvasGizmos: boolean;
  phase2Thumbnails: boolean;
  phase2CopyPasteTransforms: boolean;
  phase2AdvancedBlendModes: boolean;
  phase3SearchFilter: boolean;
  phase3Templates: boolean;
};
```

### UI Preferences

```typescript
// From types.ts
export type UiPreferences = {
  sidebarSections: Record<SidebarSectionKey, boolean>;
  scaleLinked: boolean;
  debugHooks: DebugHookSettings;
};
```

### Default Settings

```typescript
// From layersFeatureFlags.ts
export const DEFAULT_DEBUG_HOOK_SETTINGS: DebugHookSettings = {
  phase2CanvasGizmos: false,
  phase2Thumbnails: false,
  phase2CopyPasteTransforms: false,
  phase2AdvancedBlendModes: false,
  phase3SearchFilter: false,
  phase3Templates: false,
};
```

## Code Execution Path

### 1. Settings Modal Open Flow

```
User clicks settings gear button
    ↓
onOpenDebugSettings() callback triggered
    ↓
Settings modal state set to open
    ↓
Modal renders with current settings
```

### 2. Settings Toggle Flow

```
User toggles a debug setting
    ↓
onChange handler triggered
    ↓
persistDebugHooks(key, value) called
    ↓
Settings saved to localStorage
    ↓
Features enabled/disabled in UI
```

## Key Functions

### [`persistDebugHooks()`](../src/icon-generator/uiPreferences.ts)

Saves debug settings to localStorage.

```typescript
export function persistDebugHooks(
  key: keyof DebugHookSettings,
  value: boolean
): void {
  const prefs = loadUiPreferences();
  prefs.debugHooks[key] = value;
  persistUiPreferences(prefs);
}
```

### [`loadUiPreferences()`](../src/icon-generator/uiPreferences.ts)

Loads preferences from localStorage.

```typescript
export function loadUiPreferences(): UiPreferences {
  const stored = localStorage.getItem("icon-generator-ui-preferences");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
    return {
      sidebarSections: {},
      scaleLinked: true,
      debugHooks: DEFAULT_DEBUG_HOOK_SETTINGS,
    };
  }
  return {
    sidebarSections: {},
    scaleLinked: true,
    debugHooks: DEFAULT_DEBUG_HOOK_SETTINGS,
  };
}
```

## Available Debug Settings

### Phase 2 Features

| Setting | Description |
|--------|-------------|
| `phase2CanvasGizmos` | Canvas editing helpers |
| `phase2Thumbnails` | Layer thumbnails in list |
| `phase2CopyPasteTransforms` | Transform clipboard operations |
| `phase2AdvancedBlendModes` | Additional blend mode options |

### Phase 3 Features

| Setting | Description |
|--------|-------------|
| `phase3SearchFilter` | Advanced layer filtering |
| `phase3Templates` | Template system access |

## State Management

### Settings in UiPreferences

```typescript
const [uiPreferences, setUiPreferences] = useState<UiPreferences>({
  sidebarSections: {},
  scaleLinked: true,
  debugHooks: DEFAULT_DEBUG_HOOK_SETTINGS,
});
```

### Persistence

Settings are persisted to `localStorage` under the key `icon-generator-ui-preferences`.

## Related Files

| File | Purpose |
|------|---------|
| [`uiPreferences.ts`](../src/icon-generator/uiPreferences.ts) | Persistence functions |
| [`layersFeatureFlags.ts`](../src/icon-generator/layersFeatureFlags.ts) | Default settings |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Settings UI |
