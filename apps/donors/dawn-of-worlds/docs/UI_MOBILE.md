# 📱 Responsive / Mobile UI Variant (v1.0)

This document outlines the **mobile / responsive variant** for Dawn of Worlds. It keeps the **engine semantics intact** while making the game usable on phones or small tablets. This is **not** a shrunken desktop UI, but a **mode switch**: same data, different affordances.

## Design Principles (Non-Negotiable)

* ✅ **One primary surface at a time**
* ✅ Inspector is always reachable
* ✅ Timeline is never hidden behind state
* ✅ No drag-precision requirements
* ✅ Thumb-reachable controls
* ❌ No simultaneous 3-panel layouts

## 1. Global Mobile Layout

```text
┌───────────────────────────────┐
│ Top Bar                      │
│ Age II · R3 · P.Red   AP ●●○ │
│                               │
│ [ ☰ ]        [ 🔍 ]  [ End ] │
├───────────────────────────────┤
│                               │
│        MAIN SURFACE            │
│                               │
│  (Map / Actions / Inspector)  │
│                               │
├───────────────────────────────┤
│ Bottom Tabs                   │
│ [Map] [Actions] [Inspect] [Log]│
└───────────────────────────────┘
```

**Rule:** 👉 Only **one surface visible** at a time.

## 2. Bottom Tab Model (Primary Navigation)

```ts
type MobileTab = "MAP" | "ACTIONS" | "INSPECTOR" | "TIMELINE";
```

| Tab     | Purpose             |
| ------- | ------------------- |
| Map     | Spatial interaction |
| Actions | What can I do       |
| Inspect | What is this        |
| Log     | What happened       |

This replaces the desktop side panels.

## 3. Map View (Primary Surface)

```text
┌───────────────────────────────┐
│  ⬡ ⬡ ⬡                         │
│ ⬡ ⬡ ⬡ ⬡    ← tap hex           │
│  ⬡ ⬡ ⬡                         │
│                               │
│ [Tap hex to inspect]          │
└───────────────────────────────┘
```

### Interaction

* **Tap hex** → auto-opens **Inspector tab**
* **Pinch** → zoom
* **Pan** → map move
* **Long-press hex** → quick action menu (optional)

*No hover assumptions.*

## 4. Actions View (Mobile-First)

```text
┌───────────────────────────────┐
│ Actions (Age II)              │
├───────────────────────────────┤
│ Create Race        2 AP       │
│ Found City         3 AP  🔒   │
│ Culture Trait      1 AP       │
│ ─────────────────────────── │
│ Name Region        1 AP       │
└───────────────────────────────┘
```

### Behavior

* Disabled actions show **lock + reason**
* Tap action → switches to **Map view** with ghost preview
* Sticky **Confirm / Cancel** bar at bottom

```text
┌───────────────────────────────┐
│ Preview: Found City (3 AP)    │
│ [ Cancel ]        [ Confirm ]│
└───────────────────────────────┘
```

## 5. Inspector View (Stacked Cards)

Inspector becomes **card-based** and scrollable.

### 5.1 Hex Inspector (Mobile)

```text
┌───────────────────────────────┐
│ Hex (2, -1)                   │
│ Terrain: Plains               │
├───────────────────────────────┤
│ World Objects                 │
│ ▸ Race: Karthi                │
│ ▸ City: Ashkel                │
│ ▸ Landmark: Black Spire       │
├───────────────────────────────┤
│ Timeline (this hex)           │
│ Created City (3 AP)           │
│ Created Race (2 AP)           │
└───────────────────────────────┘
```

* Tapping a world object → **pushes World Inspector card**
* Back swipe or ⬅️ returns to hex

### 5.2 World Inspector (Mobile)

```text
┌───────────────────────────────┐
│ City of Ashkel                │
│ SETTLEMENT · P.Red            │
│ Age II · Round 2              │
├───────────────────────────────┤
│ Location                      │
│ Hex (2, -1)                   │
├───────────────────────────────┤
│ Attributes                    │
│ settlementType: CITY          │
├───────────────────────────────┤
│ Timeline                      │
│ Created (3 AP)                │
│ Modified (1 AP)               │
└───────────────────────────────┘
```

Inspector **never mutates**, same as desktop.

## 6. Timeline View (Full-Screen)

```text
┌───────────────────────────────┐
│ Timeline                      │
│ [Filter ▾] [Search]           │
├───────────────────────────────┤
│ Age II · R3 · P.Blue           │
│ Created Race (2 AP)            │
│                               │
│ Age II · R3 · P.Red            │
│ ❌ Found City (No Race)        │
│                               │
│ Age II · R2 · P.Red            │
│ Created City (3 AP)            │
└───────────────────────────────┘
```

### Interaction

* Tap event → Inspector opens focused on event
* Error rows highlighted red
* Filters slide up from bottom

## 7. Mobile Search (Overlay)

Triggered via 🔍 icon or `/` on hardware keyboard.

```text
┌───────────────────────────────┐
│ 🔍 Search                     │
│ > hex:2,-1                    │
│   world:Ashkel                │
│   player:P2                   │
└───────────────────────────────┘
```

**Search actions:**

* Hex → Map + Inspector
* World → Inspector
* Player / type → Timeline filter

## 8. Error UX (Mobile)

Example: **Illegal Found City**

```text
❌ Cannot Found City
Race required on this hex

[ Go to Hex ]   [ OK ]
```

* “Go to Hex” switches to Map + highlights hex
* Inspector auto-focuses context

Powered entirely by **structured server errors**.

## 9. Responsive Breakpoints

| Width      | Mode                           |
| ---------- | ------------------------------ |
| ≥ 1024px   | Desktop (3-panel)              |
| 640–1023px | Tablet (2-panel: Map + Drawer) |
| < 640px    | Mobile (Tabs)                  |

**Tablet mode:**
* Map always visible
* Inspector / Actions slide in as right drawer

## 10. Implementation Skeleton (React)

```tsx
if (isMobile) {
  return (
    <MobileLayout>
      <TopBar />
      <MainSurface tab={activeTab} />
      <BottomTabs />
    </MobileLayout>
  );
}
```

Everything else (selectors, inspectors, timeline) is **shared code**.

## Goals

This mobile variant achieves:
1.  **Fully playable on phone**
2.  **No precision UI traps**
3.  **No rule confusion**
4.  **Same authority, same engine**
5.  **Zero duplicated logic**

This is the **correct** mobile compromise for a deep strategy/world-building game.
