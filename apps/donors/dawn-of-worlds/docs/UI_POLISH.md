# 🎨 UI Polish Pack (v1.0)

This document outlines the **last-mile polish** systems: semantic tokens, haptic feedback, and guided onboarding. These layer cleanly on top of the existing UI with zero gameplay impact.

## 1. Component-Level Tailwind Tokens

*(Design system, not a theme)*

### Goals
* Consistent feel across desktop + mobile
* Easy to reskin later
* Animations + haptics reference the **same semantic tokens**
* Avoid “random Tailwind soup”

### Token Structure (`ui.tokens.ts`)

Define **semantic tokens**, not colors-as-meaning.

```ts
export const ui = {
  color: {
    bg: {
      base: "bg-slate-950",
      panel: "bg-slate-900",
      raised: "bg-slate-800",
    },
    text: {
      primary: "text-slate-100",
      secondary: "text-slate-400",
      muted: "text-slate-500",
    },
    accent: {
      focus: "ring-sky-400",
      action: "text-sky-400",
      confirm: "text-emerald-400",
      danger: "text-red-400",
      warn: "text-amber-400",
    },
    state: {
      disabled: "opacity-40",
      selected: "bg-sky-900/40",
      hover: "hover:bg-slate-800",
    },
  },

  radius: {
    panel: "rounded-xl",
    button: "rounded-lg",
    chip: "rounded-full",
  },

  spacing: {
    panel: "p-3",
    section: "space-y-2",
    item: "px-3 py-2",
  },

  motion: {
    fast: "duration-100",
    normal: "duration-200",
    slow: "duration-300",
    ease: "ease-out",
  },
};
```

### Component Contracts (Examples)

#### Action Row

```tsx
<li
  className={clsx(
    ui.spacing.item,
    ui.radius.button,
    ui.color.state.hover,
    ui.color.text.primary,
    "transition",
    ui.motion.normal,
    enabled ? "" : ui.color.state.disabled
  )}
>
```

#### Inspector Panel

```tsx
<div className={clsx(
  ui.color.bg.panel,
  ui.radius.panel,
  ui.spacing.panel,
  ui.color.text.primary
)} />
```

#### Timeline Row (Selected)

```tsx
<div className={clsx(
  ui.spacing.item,
  selected && ui.color.state.selected
)} />
```

### Why This Matters
* You can later swap **entire visual identity** by editing one file.
* Animations + haptics can reference **semantic intent**.
* Makes Figma → code trivial.

## 2. Haptic Feedback Mapping

*(Mobile-first, meaning-driven)*

### Principles
* Haptics = **confirmation**, not decoration
* Never spam
* Mirror **animation semantics**

### Haptic Types

```ts
type Haptic =
  | "tap"
  | "confirm"
  | "reject"
  | "warning"
  | "turn";
```

### Central Haptic Dispatcher

```ts
export function haptic(type: Haptic) {
  if (!("vibrate" in navigator)) return;

  const patterns: Record<Haptic, number | number[]> = {
    tap: 10,
    confirm: [20, 30, 20],
    reject: [30, 30, 30],
    warning: [15, 20, 15, 20],
    turn: [10, 10, 10],
  };

  navigator.vibrate(patterns[type]);
}
```

### Mapping Table (Strict)

| Interaction         | Haptic    |
| ------------------- | --------- |
| Tap hex / action    | `tap`     |
| Action confirmed    | `confirm` |
| Server rejection    | `reject`  |
| Protected / warning | `warning` |
| Turn begins         | `turn`    |

### Why This Works
* Players *feel* authority changes
* Errors are learned faster
* No reliance on sound
* Works silently in public spaces

## 3. Guided Onboarding Animations

*(First session only, non-intrusive)*

This is **not a tutorial modal**. It’s a **contextual, animated hint system** that fades away.

### Onboarding State (Client-Only)

```ts
type OnboardingStep =
  | "MAP_TAP"
  | "INSPECTOR"
  | "ACTION_PREVIEW"
  | "END_TURN"
  | "DONE";

type OnboardingState = {
  step: OnboardingStep;
  dismissed: boolean;
};
```
Persist in `localStorage`.

### Step Flow

#### Step 1 — Tap the map
`👆 Tap a hex to inspect it`
* Arrow pulse animation on map
* Hex pulse on first tap
* Advance automatically

#### Step 2 — Inspector appears
`ℹ️ This panel shows what exists here`
* Inspector slides in
* Highlight “World Objects” section
* Auto-advance after 2 seconds or interaction

#### Step 3 — Take an action
`⚡ Choose an action to shape the world`
* Action Palette tab pulses
* Disabled actions still visible (teaching legality)
* Advance on first preview

#### Step 4 — End turn
`⏭️ End your turn when ready`
* End Turn button pulses
* Turn banner animation on success

#### Done
`🌍 You’re in control now`
* One-time toast
* Onboarding disabled forever

### Animation Primitives

Reuse existing animation classes (`hex--pulse`, `preview-sheet--open`, `turn-banner`) plus one helper:

```css
@keyframes hint-bounce {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.hint {
  animation: hint-bounce 800ms ease-in-out infinite;
}
```

### Dismissal Rules
* Any **real action** advances onboarding
* `Skip` always available
* Never blocks gameplay
* Never reappears once dismissed
