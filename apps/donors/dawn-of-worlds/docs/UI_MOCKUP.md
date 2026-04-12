# UI Mockup — World Builder (v1.0)

Here is the clear, implementable UI mockup for v1.0. This serves as the wireframe and interaction contract for the React/Tailwind layer.

## Overall Layout (Desktop-First)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Top Bar                                                                  │
│ [Room: Dawn-01] [Age II · Round 3 · Turn: P2]      [AP: 2]   [Search / ] │
├───────────────┬───────────────────────────────┬─────────────────────────┤
│ Action Palette│            Map Canvas          │        Inspector        │
│ (Left)        │            (Center)            │        (Right)          │
│               │                               │                         │
│               │                               │                         │
│               │                               │                         │
│               │                               │                         │
├───────────────┴───────────────────────────────┴─────────────────────────┤
│ Timeline / Log (Bottom, collapsible)                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

## 1. Top Bar (Global Context)

```text
┌──────────────────────────────────────────────────────────────┐
│ Room: Dawn-01                                                │
│ Age II · Round 3 · Turn: Player Red                           │
│                                                              │
│ AP: ●●○○○   (2 / 5)        [ / Search… ]        [ End Turn ] │
└──────────────────────────────────────────────────────────────┘
```

### Behavior
- **AP meter** animates when cost applied / rejected.
- **End Turn** disabled until:
  - ≥1 action taken (server-enforced).
- `/` focuses search.
- Server errors appear as toast + context highlight.

## 2. Action Palette (Left)

```text
┌────────────────────────────┐
│ Actions                    │
│ Age II — Peoples & Cities  │
├────────────────────────────┤
│ ▶ Found City        (3 AP) │  ← disabled (AP)
│ ▶ Create Race       (2 AP) │
│ ▶ Culture Trait     (1 AP) │
│ ───────────────────────── │
│ ▶ Name Region       (1 AP) │
│ ▶ Add Landmark      (3 AP) │
└────────────────────────────┘
```

### States
- **Enabled** → hover shows preview.
- **Disabled** → tooltip explains *why*.
- **Selected** → ghost preview on map.

### Keyboard
- `↑` / `↓` select
- `Enter` = preview / confirm
- `Esc` = cancel

## 3. Map Canvas (Center)

```text
┌──────────────────────────────────────────────┐
│                Hex Map                       │
│                                              │
│        ◇──◇──◇                               │
│       / \ / \ / \                            │
│      ◇──◇──◇──◇   ← hover highlights         │
│       \ / \ / \                              │
│        ◇──◇──◇                               │
│                                              │
│  Ghost preview: semi-transparent overlay     │
└──────────────────────────────────────────────┘
```

### Interaction
- Click hex → Inspector focuses HEX.
- Hover timeline event → highlight affected hexes.
- Ghost previews never mutate state.

## 4. Inspector (Right)

### 4.1 Hex Inspector

```text
┌────────────────────────────┐
│ Hex (2, -1)                │
│ Terrain: Mountains         │
├────────────────────────────┤
│ World Objects              │
│ • Race: Karthi             │
│ • City: Ashkel             │
│ • Landmark: Black Spire    │
├────────────────────────────┤
│ Timeline                   │
│ Age II · R2 · P.Red        │
│  Created City (3 AP)       │
│ Age I · R1 · P.Blue        │
│  Created Mountains (2 AP)  │
└────────────────────────────┘
```

**Interaction**:
- Click **world object** → switches to World Inspector.
- Click **event** → focuses that event.

### 4.2 World Inspector

```text
┌────────────────────────────┐
│ City of Ashkel              │
│ SETTLEMENT · P.Red          │
│ Created: Age II, Round 2    │
├────────────────────────────┤
│ Location                    │
│ • Hex (2, -1)               │
├────────────────────────────┤
│ Attributes                  │
│ • settlementType: CITY      │
├────────────────────────────┤
│ Timeline                    │
│ Created (3 AP)              │
│ Modified (1 AP)             │
└────────────────────────────┘
```

**State**: Read-only. Always authoritative.

## 5. Timeline (Bottom)

```text
┌──────────────────────────────────────────────────────────────┐
│ Timeline  [Players ▾] [Types ▾] [Hide revoked ✓]             │
├──────────────────────────────────────────────────────────────┤
│ Age II · R3 · P.Blue  | Created Race (2 AP)                  │
│ Age II · R3 · P.Red   | Attempted Found City ❌ (No Race)    │
│ Age II · R2 · P.Red   | Created City (3 AP)                  │
│ Age I  · R1 · P.Blue  | Created Mountains (2 AP)             │
└──────────────────────────────────────────────────────────────┘
```

### Behavior
- Click row → Inspector focuses event.
- Hover row → map highlights.
- Filters reduce noise.
- Keyboard `↑` / `↓` navigates rows.

## 6. Search Overlay ( `/` )

```text
┌────────────────────────────┐
│ 🔍 Search                  │
│ > hex:2,-1                 │
│   world:Ashkel             │
│   player:P2                │
└────────────────────────────┘
```

### Results
- **Hex** → focus map + inspector.
- **World** → focus world inspector.
- **Player / type** → timeline filter.

## 7. Error Feedback (Structured)

Example: "Found City requires Race"

```text
❌ Cannot Found City
Race required on Hex (2, -1)

[Hex highlighted in red]
[Inspector auto-focused]
```

This is powered entirely by **structured server errors**.

## 8. Implementation Skeleton

Minimal Tailwind-style layout skeleton (React).

```tsx
<div className="grid grid-rows-[auto_1fr_auto] h-screen">
  <TopBar />
  <div className="grid grid-cols-[280px_1fr_360px]">
    <ActionPalette />
    <MapCanvas />
    <Inspector />
  </div>
  <Timeline />
</div>
```

## Goals

This UI mockup achieves:
1.  **Clear mental model**
2.  **Zero rule confusion**
3.  **Power-user friendly**
4.  **New-player friendly**
5.  **Engine-aligned (no lies)**
