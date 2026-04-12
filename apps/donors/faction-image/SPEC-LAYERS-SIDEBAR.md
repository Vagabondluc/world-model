# Layers Sidebar Specification (SPEC-LAYERS-SIDEBAR.md)

**Status:** DESIGN PHASE  
**Version:** 1.0  
**Date:** 2026-03-10  
**Scope:** Collapsible layers management sidebar for Sacred Sigil Generator with reordering, visibility, and composition control

---

## 1. Overview

### Purpose
The Layers Sidebar is a dedicated panel for managing composition layers in the Sacred Sigil Generator. It allows users to:
- View all layers in a symbol composition (stack order)
- Show/hide individual layers
- Lock/unlock layers to prevent accidental edits
- Rename layers for organization
- Reorder layers via drag-and-drop
- Delete layers
- Collapse/expand the sidebar
- Access layer-specific properties (opacity, blend mode, etc.)

### Goals
- ✅ Provide visual hierarchy of composition layers (base + accents)
- ✅ Enable non-destructive layer management (drag-drop, lock, hide)
- ✅ Support persistent layer state (opacity, visibility, lock state)
- ✅ Allow sidebar collapse to maximize canvas space
- ✅ Integrate seamlessly with SPEC-ICON-BOUNDARIES (composition model)
- ✅ Support layer-level undo/redo (Phase 2)
- ✅ Enable batch layer operations (Phase 3)

---

## 2. Sidebar Layout & Visual Design

### 2.1 Sidebar Container

**Position:** Right panel (opposite of logo/domain in left panel)

```
┌────────────────────────────────────────────────────────────────┐
│                          Main Canvas                            │
├───────────────────────┬───────────────┬──────────────────────────┤
│   Left Panel          │    Canvas     │    Layers Sidebar        │
│  (Domain/Complexity)  │   (Symbol)    │    [Minimize]            │
│                       │               │  ────────────────────    │
│                       │               │  Layers (3)              │
│                       │               │  ────────────────────    │
│                       │               │                          │
│                       │               │  + Add Layer             │
│                       │               │  ────────────────────    │
│                       │               │                          │
│                       │               │  👁 ● base-circle        │
│                       │               │  ─ ✎ ✕ ⬆ ⬇              │
│                       │               │                          │
│                       │               │  👁 ◯ accent-star        │
│                       │               │  ─ ✎ ✕ ⬆ ⬇              │
│                       │               │                          │
│                       │               │  👓 ◯ glow (hidden)      │
│                       │               │  🔒 ✎ ✕ ⬆ ⬇              │
│                       │               │                          │
│                       │               │  ────────────────────    │
│                       │               │  Layer Properties        │
│                       │               │  ────────────────────    │
└───────────────────────┴───────────────┴──────────────────────────┘
```

**Dimensions:**
- Width: 250px (default, resizable)
- Height: Full viewport height (minus header)
- Collapse button: Top-right corner
- Dock position: Right edge (fixed)

### 2.2 Header Section

```
┌─────────────────────────────────────┐
│ Layers                [−] [⚙] [×]   │  ← Layers title
│ (3 items)                           │  ← Count of layers
└─────────────────────────────────────┘
```

**Controls:**
- `[−]` Minimize/collapse sidebar (toggle, keyboard shortcut: `L`)
- `[⚙]` Layer settings menu (future: Phase 2)
- `[×]` Close sidebar (hides completely, button in top menu to restore)

**Auto-hide Behavior (Phase 3):**
- Option to auto-hide sidebar during canvas interaction
- Re-appears on manual toggle or layer selection from canvas

### 2.3 Add Layer Button

```
┌─────────────────────────────────────┐
│ + Add Layer                         │  ← Click to expand
│   ○ Blank Layer                     │     menu
│   ◆ Asset from Library              │
│   ⚙ Procedural Generator            │
│   📎 Clone Selected Layer            │
└─────────────────────────────────────┘
```

**Options:**
- **Blank Layer** - Empty group, user fills
- **Asset from Library** - Browse game-icons.net (Phase Y+ integration)
- **Procedural Generator** - Generate new base symbol
- **Clone Selected** - Duplicate currently selected layer

---

## 3. Layer Items & Interactions

### 3.1 Layer Item Structure

```
┌─────────────────────────────────────┐
│ [👁] [icon] Layer Name      [✎] [✕] │
│      ─────────────────────────      │
│      Opacity: [▓▓▓▓░] 80%           │
│      Blend: Normal                  │
│      Lock: [○] Unlock               │
└─────────────────────────────────────┘
```

**Components (left to right):**
1. **Visibility Toggle** `[👁]` or `[👓]`
   - Click to hide/show layer
   - Eye icon = visible, crossed-eye = hidden
   - Hidden layers not rendered in preview
   
2. **Lock/Unlock Toggle** (optional on hover)
   - `[●]` = locked, prevents edits/reorder
   - `[○]` = unlocked, editable
   - Shown on hover or always (toggle in settings)

3. **Layer Icon** (future)
   - Preview thumbnail of layer content
   - Phase 2: Add 32×32 thumbnail

4. **Layer Name**
   - Editable text ("base-circle", "accent-star", etc.)
   - Double-click to rename
   - Auto-generate default names: "Layer 1", "Layer 2", etc.

5. **Delete Button** `[✕]` (on hover)
   - Removes layer from composition
   - Undo-able (Phase 2)

6. **Expand/Collapse** `[▶] [▼]` (if nested, Phase 2)
   - For grouped layers or layer properties
   - Default: collapsed/expanded based on user preference

### 3.2 Active Layer Indicator

**Selected layer highlighted:**
```
┌─────────────────────────────────────┐
│ 👁 ◆ accent-star             ✎ ✕   │  ← Blue background
│ └─ Opacity: [▓▓▓▓░] 80%             │     indicates selected
│    Blend: Overlay                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👁 ● base-circle             ✎ ✕   │  ← Gray text (inactive)
│                                     │
└─────────────────────────────────────┘
```

**Selection:**
- Click layer item to select
- Selected layer canvas interactions affects this layer
- Properties panel shows selected layer's settings
- Multiple selection with Shift+Click (Phase 2)

### 3.3 Hover States

**Hover row shows additional controls:**
```
┌─────────────────────────────────────┐
│ 👁 ● accent-star             ✎ ✕   │  ← On hover: show delete
│                              (✎ ✕)  │
└─────────────────────────────────────┘
```

**On hover display:**
- Delete button (✕) becomes visible/highlighted
- Rename button (✎) becomes visible
- Move up/down arrows (Phase 1)

---

## 4. Layer Reordering

### 4.1 Drag-and-Drop

**Behavior:**
```
User drags layer "accent-star" above "base-circle"

Before:
  Layer Stack (rendered top to bottom on canvas)
  ├─ glow (top, rendered last)
  ├─ accent-star
  └─ base-circle (bottom, rendered first)

User drags accent-star ↓↓

After:
  ├─ glow
  ├─ base-circle
  └─ accent-star (bottom now, renders under base)
```

**Drag Mechanics:**
- Click and hold on layer item (or reorder handle if added)
- Drag up/down to reorder
- Visual feedback: gray highlight zone where layer will land
- Drop to finalize; canvas updates immediately
- Undo-able (Phase 2)

**Constraints:**
- Can reorder any unlocked layers
- Locked layers cannot be moved (visual feedback: locked icon)
- Minimum: 1 layer must remain in composition

### 4.2 Arrow Keys (Keyboard Reordering)

**If layer is selected:**
- `↑` Move up one position
- `↓` Move down one position
- `Shift + ↑` Move to top
- `Shift + ↓` Move to bottom

**Disabled if:**
- Layer is locked
- Layer at boundary (↑ on topmost = no-op)

### 4.3 Reorder Handles (Phase 2)

**Optional visual handle for drag:**
```
┌─────────────────────────────────────┐
│ ≡ 👁 ● accent-star          ✎ ✕   │  ← ≡ = drag handle
│                                     │
└─────────────────────────────────────┘
```

**Benefits:**
- Visual clarity that item is draggable
- Separate target from text (easier mobile touch)
- Phase 1: Drag whole item; Phase 2: Add handle

---

## 5. Layer Properties & Inspector

### 5.1 Properties Panel (Below Layer List)

The properties panel appears below the layer list when a layer is selected, allowing users to adjust layer properties including visibility, opacity, blending, and transforms.

```
┌─────────────────────────────────────┐
│ Layer Properties                    │
├─────────────────────────────────────┤
│ Name: [accent-star ──────────────]  │
│                                     │
│ VISIBILITY & LOCK                   │
│ [●] Visible  [●] Locked             │
├─────────────────────────────────────┤
│ OPACITY                             │
│ [▓▓▓▓░▓▓▓▓] 80% (slider + text)    │
├─────────────────────────────────────┤
│ BLEND MODE (Phase 1)                │
│ [Normal ▼]  (dropdown)              │
│  - Normal                           │
│  - Multiply                         │
│  - Screen                           │
│  - Overlay                          │
│  [+] Phase 2: Lighten, Darken,     │
│       Color-dodge, Color-burn,     │
│       Hard-light, Soft-light,      │
│       Difference, Exclusion         │
├─────────────────────────────────────┤
│ TRANSFORM (Phase 1 Properties,     │
│           Phase 2 Canvas Gizmo)     │
│                                     │
│ Rotation:                           │
│  [────45°────] ° (dial + text)     │
│  ↑↓: ±5°  | Shift+↑↓: ±45°         │
│                                     │
│ Scale:                              │
│  [─1.2──] × X (slider, 0.1-3.0)   │
│  [─1.2──] × Y (slider, 0.1-3.0)   │
│  [🔗] Link X/Y (uniform scale)     │
│  ⚠ <0.1x or >3.0x: warn           │
│                                     │
│ Position (Phase 1 Input)            │
│  X: [100px] Y: [50px]               │
│                                     │
│ Reset Transform                     │
│  [🔄 Reset] (rotation=0, scale=1,  │
│              position=0,0)          │
├─────────────────────────────────────┤
│ COLOR ADJUSTMENT (Phase 2):         │
│  Brightness: [▓▓▓░░] Normal         │
│  Saturation: [▓▓▓░░] 100%           │
│  Hue Shift:  [▓░░░░] 0°             │
├─────────────────────────────────────┤
│ ACTIONS                             │
│ [✂ Copy] [📋 Paste] [🗑 Delete]    │
│ Copy: Copy transform+opacity+blend  │
│ Paste: Paste onto another layer     │
└─────────────────────────────────────┘
```

**Sections:**

1. **Name** (always visible)
   - Text input, editable
   - Default: "Layer 1", "Layer 2"
   - Tab to next property

2. **Visibility Toggle** (Phase 1)
   - Radio buttons or toggle
   - Mirrors eye icon in layer item

3. **Blending Mode** (Phase 2)
   - Standard CSS blend modes: Normal, Multiply, Screen, Overlay, Lighten, Darken
   - Updates canvas preview in real-time
   - SVG feBlend for rendering

4. **Opacity Slider** (Phase 1)
   - Range: 0-100%
   - Slider + numeric input
   - Real-time preview on canvas

5. **Lock Toggle** (Phase 1)
   - Prevents layer from being selected/edited
   - Locked layers still render
   - Visual: icon changes to 🔒

6. **Position/Size** (Phase 2)
   - X, Y, Width, Height inputs
   - For transform-based positioning

7. **Color Adjustment** (Phase 2+, advanced)
   - Brightness, Saturation, Hue shift
   - Advanced sliders

### 5.2 Transform Rendering Contract

**When a layer has transforms applied:**
1. Transform is applied to the SVG `<g>` (group) wrapping the layer content
2. SVG transform attribute: `<g transform="rotate(45) scale(1.2, 1.2) translate(100, 50)">`
3. Transforms compose in order: **rotate → scale → translate** (position offset)
4. Transform origin applies to rotation/scale (default: bounding box center)
5. Blending applies via CSS `mix-blend-mode` on the group element
6. Rendering pipeline:
   ```
   layer.content (SVG element)
     ↓ (wrapped in <g>)
   <g transform="..." opacity="0.8" style="mix-blend-mode: multiply;">
     <path d="..."/> (original SVG)
   </g>
     ↓ (rendered on canvas)
   Composited with layers below
   ```

### 5.3 Draft Persistence Lifecycle

**Phase 1 Persistence Strategy:**
1. All property changes (opacity, transform, blend mode, visibility, lock) immediately update LayersState in memory
2. LayersState is serialized to localStorage every 500ms (debounced, not on every change)
3. No explicit "Save" button; persistence is transparent to user
4. Browser reload: full LayersState restored from localStorage (draft survives)
5. Clearing browser cache or explicit "Clear" button: localStorage erased
6. On successful export: localStorage optionally cleared (user choice)

### 5.4 Context Menu (Right-Click)

**Right-click on layer item:**
```
───────────────────────────
│ Rename (Shift+R)        │
│ Duplicate (Ctrl+D)      │
│ ──────────────────────  │
│ Move Up   (↑)           │
│ Move Down (↓)           │
│ To Front  (Shift+↑)     │
│ To Back   (Shift+↓)     │
│ ──────────────────────  │
│ Delete (Del)            │
│ ──────────────────────  │
│ Merge Down (M)          │ [Phase 2]
│ ──────────────────────  │
│ Copy Transform (Ctrl+Alt+C) │
│ Paste Transform (Ctrl+Alt+V)│
│ ──────────────────────  │
│ Duplicate Style         │ [Phase 3]
└───────────────────────────┘
```

**Keyboard Shortcuts (in parentheses)**
- Note: 'R' reserved for future "Rotate mode"; rename uses Shift+R to avoid conflicts

---

## 6. State & Data Model

### 6.1 Layer Data Structure

```typescript
interface LayerTransform {
  // Rotation (degrees, 0-360+, unbounded)
  rotation: number;             // default: 0
  
  // Scale (multipliers, 0.1-3.0x)
  scaleX: number;               // default: 1.0
  scaleY: number;               // default: 1.0
  scaleLinked: boolean;          // if true, changing one updates both; default: true
  
  // Position (pixels, can be negative)
  offsetX: number;              // default: 0
  offsetY: number;              // default: 0
  
  // Origin point (where transforms pivot)
  transformOriginX: "left" | "center" | "right";  // default: "center"
  transformOriginY: "top" | "center" | "bottom";  // default: "center"
}

type BlendMode = 
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "lighten"
  | "darken";
  // Phase 2+: "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"

interface LayerItem {
  // Identity
  layerId: string;              // UUID or hash
  name: string;                 // "base-circle", user-editable
  
  // Visibility
  visible: boolean;             // true = render, false = hidden preview skip
  locked: boolean;              // true = prevent edits
  
  // Rendering
  opacity: number;              // 0-100, default: 100
  blendMode: BlendMode;         // default: "normal"
  
  // Transform (new in Phase 1)
  transform: Partial<LayerTransform>;  // allow partial edits
  
  // Content (Phase 1: blank only; Phase 2+: extend)
  content: {
    type: "blank" | "asset" | "procedural";
    assetId?: string;           // if type="asset"
    seed?: string;              // if type="procedural"
    elements?: SVGElement[];    // The actual SVG content (cached, computed from assetId or seed)
  };
  
  // Metadata
  createdAt: string;            // ISO timestamp
  modifiedAt: string;
  
  // Position in stack
  zIndex: number;               // Render order (0 = back, N = front)
}

interface LayersState {
  layers: LayerItem[];          // Array of layers in stack order
  selectedLayerId: string | null;  // Currently selected layer
  
  // UI state
  sidebarOpen: boolean;         // true = sidebar visible
  sidebarWidth: number;         // pixels
  
  // History (Phase 1: infrastructure ready; UI deferred to Phase 2)
  undoStack: LayerOperation[];  // Track all operations (populated in Phase 1)
  redoStack: LayerOperation[];  // Prepare for Phase 2 UI
}

interface LayerOperation {
  type: "add" | "delete" | "reorder" | "update" | "rename" | "merge" | "transform";
  affectedLayerIds: string[];   // Layer IDs affected by this operation
  before: LayerItem[];          // Previous state(s)
  after: LayerItem[];           // New state(s)
  timestamp: string;
}

// Undo/Redo Granularity (Phase 1):
// - Debounced slider drags create a SINGLE undo entry on release (not per pixel)
// - Text field edits create entries on Enter or blur
// - Fast sequential property changes collapse into one undo action (within 200ms)
// - Max 50 entries in undoStack; oldest entries discarded when limit reached
```

### 6.2 Composition Integration

**Layers sidebar serves as editor for composition:**

```typescript
// From SPEC-ICON-BOUNDARIES
interface CompositionConfig {
  mode: "overlay-center" | "overlay-top" | "overlay-bottom" | ...;
  layers: LayerItem[];         // ← Populated from sidebar layers
  revisionId: string;
  compositionVersion: string;
  updatedAt: string;
}

// When user modifies sidebar layers, composition updates
function onLayerChange(operation: LayerOperation) {
  const newComposition = {
    ...currentComposition,
    layers: layersState.layers,
    revisionId: recomputeHash(),
    updatedAt: now()
  };
  updateComposition(newComposition);
  renderCanvas();
}
```

---

## 7. User Interactions & Workflows

### 7.1 Workflow: Add New Layer

```
1. User clicks "+ Add Layer"
2. Menu appears with options:
   ○ Blank Layer
   ○ Asset from Library
   ○ Procedural Generator
   ○ Clone Selected

3. User selects "Blank Layer"
4. New layer created with:
   - Name: "Layer X" (auto-increment)
   - Visible: true
   - Opacity: 100%
   - BlendMode: Normal
   - Position: Top of stack (rendered last = visible on top)

5. Layer added to sidebar
6. Canvas refreshes with new blank layer (transparent)
7. Layer is selected and ready for editing
```

### 7.2 Workflow: Rename Layer

```
1. User double-clicks layer name or right-click → "Rename"
2. Name field becomes editable (text highlights)
3. User types new name "my-base-symbol"
4. User presses Enter or clicks elsewhere
5. Layer renamed in sidebar and composition state
6. revisionId updated
```

### 7.3 Workflow: Hide/Show Layer

```
1. User clicks eye icon [👁] next to layer
2. Layer set visible = false
3. Eye icon changes to crossed-eye [👓]
4. Layer not rendered in preview (transparent in composition)
5. Clicking again makes visible
6. Canvas updates immediately
```

### 7.4 Workflow: Reorder Layers (Drag-and-Drop)

```
1. User clicks and holds on "accent-star" layer item
2. Cursor changes to "grab" (grabbing hand)
3. User drags down below "base-circle"
4. Gray highlight zone shows drop position
5. User releases mouse
6. Layer stack reorders:
   Before: [glow, accent-star, base-circle]
   After: [glow, base-circle, accent-star]
7. zIndex values updated (glow=2, base=1, accent=0)
8. Canvas re-renders with new layer order
9. Undo/redo stack updated (Phase 2)
```

### 7.5 Workflow: Lock/Unlock Layer

```
1. Layer item shows [●] lock icon on hover or always visible
2. User clicks lock icon
3. Layer state: locked = true
4. Layer cannot be:
   - Selected for editing
   - Dragged to reorder (grab cursor disabled)
   - Deleted
   - Properties edited
5. Layer still renders (visible)
6. Visual feedback: icon becomes [🔒] and slightly grayed out
7. Click lock icon again to unlock
```

### 7.6 Workflow: Adjust Opacity

```
1. User selects layer (clicks layer item in sidebar)
2. Properties panel shows "Opacity: [▓▓▓▓░] 80%"
3. User drags slider left (decrease) or right (increase)
4. Opacity property updates in real-time
5. Canvas preview updates: layer becomes more/less transparent
6. User releases slider
7. Final opacity value stored
```

### 7.7 Workflow: Delete Layer

```
1. User hovers over layer item, delete button [✕] appears
2. User clicks [✕]
3. Confirmation dialog (Phase 2): "Delete layer 'accent-star'?"
   [Cancel] [Delete]
4. If no layers remain, prevent deletion
5. Layer removed from sidebar and composition
6. Previous selected layer or layer below becomes selected
7. Canvas re-renders without deleted layer
8. Operation added to undo stack (Phase 2)
```

### 7.8 Workflow: Collapse Sidebar

```
1. User clicks [−] button in sidebar header
2. Sidebar slides left off screen (or collapses to icon bar)
3. Canvas expands to full width
4. Icon bar shows "Layers [3]" with expand arrow
5. User can click icon bar to expand sidebar again
6. Position/width of sidebar persists across sessions
```

---

## 8. Phase Breakdown

### Phase 1: Core Layers Sidebar + Transform Editing (25-30 hours)
**Goal:** Complete layer management with visibility, opacity, transforms (rotation, scale, position), blending, reordering, rename, and undo infrastructure

**Scope:**

**Layer Management (Sidebar UI):**
- ✅ Sidebar container + header (minimize, gear, close buttons)
- ✅ Layer item list with visibility toggle [👁] & lock toggle [●]
- ✅ Layer name display + rename (double-click to edit, Enter to confirm)
- ✅ Add Layer button (blank only, no menu)
- ✅ Delete layer button [✕]
- ✅ Drag-and-drop reordering (no handles)
- ✅ Layer selection (highlight selected row)
- ✅ Keyboard shortcuts (↑, ↓, Del, Shift+R for rename, Ctrl+D for duplicate)
- ✅ Integration with CompositionConfig
- ✅ Real-time canvas preview updates
- ✅ Undo/Redo infrastructure (undoStack/redoStack state with granular tracking)
- ✅ Export/import layer metadata (align with ICON-BOUNDARIES)

**Layer Properties & Transform Editing (Properties Panel):**
- ✅ Properties panel (Name, Visibility, Lock, Opacity, Blend Mode, Transform)
- ✅ Opacity slider (0-100%) with real-time preview
- ✅ Blend Mode dropdown (Normal, Multiply, Screen, Overlay, Lighten, Darken)
  - Rendering via CSS mix-blend-mode
  - Fallback to "normal" on unsupported browsers (silent, no error)
- ✅ Transform properties:
  - Rotation (0-360°, input field + keyboard shortcuts ↑↓ ±5°, Shift+↑↓ ±45°)
  - Scale X/Y (0.1-3.0x, sliders with linked/unlinked toggle, keyboard Ctrl+↑↓ ±0.1x)
  - Position X/Y (pixel offsets, text inputs, Phase 2: canvas drag)
  - Transform origin (fixed to center in Phase 1)
  - Reset Transform button
- ✅ Locked/Hidden layer behavior (properties still editable, canvas gizmo disabled, reorder disabled)
- ✅ Transform serialization (JSON export/import with full transform data)
- ✅ Debounced real-time preview (50ms tick-based updates, no 60fps thrashing)
- ✅ localStorage persistence (debounced every 500ms, transparent to user)
- ✅ Tests: L1-L18 (layer CRUD, transforms, blending, persistence) + L25-L26 (performance)

**Not in Phase 1 Scope:**
- ❌ Layer thumbnails
- ❌ Canvas gizmo (drag-to-rotate handles, scale handles, move handles)
- ❌ Position offset via canvas drag (input fields only)
- ❌ Pivot/transform origin chooser (center only)
- ❌ Color adjustments (brightness, saturation, hue)
- ❌ Undo/redo UI buttons (infrastructure complete, UI deferred to Phase 2)
- ❌ Batch operations
- ❌ Layer groups
- ❌ Copy/Paste transforms (Phase 2)
- ❌ SVG feBlend filters (CSS mix-blend-mode only)

**Exit criteria:**
- [ ] All layer CRUD operations work (create, update, delete)
- [ ] Drag-and-drop reordering smooth (no visual jank)
- [ ] Opacity changes reflected immediately on canvas
- [ ] Visibility toggle hides/shows layer on canvas
- [ ] Lock toggle prevents selection/reorder and disables gizmo
- [ ] Hidden layers show properties but canvas preview disabled
- [ ] Transform properties (rotation, scale, position) update canvas in real-time
- [ ] Blend mode dropdown applies CSS mix-blend-mode correctly
- [ ] Transform data persists to localStorage and survives reload
- [ ] Undo/redo infrastructure tracking all operations (undoStack populated)
- [ ] Layer export/import includes all transform and property data
- [ ] Performance: 50 layers <500ms render, <10MB DOM (L25-L26)
- [ ] L1-L18 acceptance tests passing

### Phase 2: Layer Enhancements & Canvas Gizmos (12-15 hours)
**Goal:** Add undo/redo UI, canvas transform gizmos, advanced blending, and refinements

**New features:**
```
+ Undo/redo buttons in toolbar (using Phase 1 undoStack) + keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
+ Layer thumbnails (32×32 preview)
+ Canvas transform gizmo (interactive handles for rotation, scale, position)
  - Rotation handle: drag in arc to rotate
  - Scale handles: drag outward/inward to scale (corners, edges, or both)
  - Move handle: drag to reposition (Phase 2, offset from properties panel input)
  - All gizmo changes sync to properties panel in real-time
+ Merge down (merge with layer below)
+ Advanced blending modes via SVG feBlend (color-dodge, color-burn, hard-light, soft-light, difference, exclusion)
+ Transform origin / pivot point chooser (corners, edges, custom)
+ Color adjustments (Brightness, Saturation, Hue)
+ Context menu (right-click) with full feature set
+ Copy/Paste transforms (JSON clipboard)
+ Multi-select (Shift+Click) [Phase 3 candidate]
+ Drag-resize sidebar width
```

**Tests:** L19-L28 (canvas gizmo, blending, undo/redo UI, copy/paste transforms)

**Exit criteria:**
- [ ] Canvas rotation gizmo works (drag → rotation updates)
- [ ] Canvas scale gizmo works (drag → scale updates)
- [ ] Canvas move gizmo works (drag → position updates)
- [ ] All gizmo changes sync to properties panel
- [ ] Undo/redo buttons functional (Ctrl+Z, Ctrl+Shift+Z)
- [ ] SVG feBlend filters apply for advanced blend modes
- [ ] Transform origin chooser works
- [ ] Copy/Paste transforms between layers
- [ ] Merge down combines two layers
- [ ] Context menu all options work
- [ ] L19-L28 tests passing

### Phase 3: Advanced Layer Management (8-10 hours)
**Goal:** Add layer groups, batch operations, and polish

**New features:**
```
+ Layer groups/folders (nest layers)
+ Batch operations (select multiple, delete all, change opacity batch)
+ Duplicate with cloning
+ Layer templates/presets
+ Export layer as asset
+ Layer blend presets (common combinations)
+ Batch visibility toggle
+ Layer search/filter
+ Auto-hide sidebar during canvas work
+ Layer history panel
+ Advanced transform constraints (snap-to-angle, snap-to-grid, aspect ratio lock)
```

**Tests:** L31-L35 (grouping, batch ops, advanced constraints)

**Exit criteria:**
- [ ] Layer groups expand/collapse with nested transform inheritance
- [ ] Batch delete/hide/opacity works across multiple selection
- [ ] Duplicate layer creates exact copy with unique name
- [ ] Sidebar auto-hides with keyboard shortcut
- [ ] Snap-to-angle constraint works (snap rotation to 15° increments)
- [ ] L31-L35 tests passing

---

## 9. Integration with Specs

### 9.1 Depends On
- ✅ SPEC-ICON-BOUNDARIES: CompositionConfig model
- ✅ SPEC-SYMMETRY: Symmetry applied to base layer only
- ⚠️ Color ownership (SPEC-ICON-BOUNDARIES): Opacity on layers affects color rendering

### 9.2 Feeds Into
- ✅ Canvas rendering (Layers sidebar → CompositionConfig → Render pipeline)
- ✅ Export/import (Layer state → ExportPayload)
- ⚠️ Asset library (Phase Y+): Add Layer → Asset picker

### 9.3 Composition Flow

```
User edits Layers Sidebar
  ↓
onLayerChange() reducer dispatches
  ↓
LayersState updated
  ↓
CompositionConfig.layers = LaersState.layers
  ↓
Render() with new composition
  ↓
Canvas displays updated symbol
```

---

## 10. Acceptance Test Matrix (L1-L24)

### Phase 1 Tests
```
✅ Phase 1 Core Tests (Layer Management):

L1 [Phase 1]: Add blank layer creates new layer item
  Input: Click [+ Add Layer] → Select "Blank Layer"
  Expected: New layer appears in sidebar with default name "Layer N"
  Verification: Layer item visible in list, selected
  Type: UI interaction
  
L2 [Phase 1]: Layer visibility toggle hides/shows on canvas
  Input: Click eye icon [👁] on layer item
  Expected: Layer becomes hidden ([👓]), disappears from preview
  Verification: Canvas re-renders without layer, eye icon changes
  Type: rendering
  
L3 [Phase 1]: Lock toggle prevents layer selection
  Input: Click lock icon [●] on layer item
  Expected: Layer cannot be selected; lock icon becomes [🔒]
  Verification: Clicking layer item has no effect; try to drag = cursor disabled
  Type: interaction
  
L4 [Phase 1]: Delete layer removes from sidebar and canvas
  Input: Right-click layer → Delete or click [✕]
  Expected: Layer removed, composition updates
  Verification: Layer gone from sidebar; canvas missing element
  Type: integration
  
L5 [Phase 1]: Opacity slider changes layer alpha
  Input: Select layer, adjust opacity slider to 50%
  Expected: Layer opacity = 0.5, canvas shows transparency
  Verification: Slider value = 50%, canvas element has opacity:0.5
  Type: rendering
  
L6 [Phase 1]: Drag-and-drop reorders layers
  Input: Drag "accent-star" above "base-circle"
  Expected: Layer order swapped in sidebar; zIndex updated
  Verification: Sidebar shows new order; canvas changes render order
  Type: interaction
  
L7 [Phase 1]: Keyboard shortcuts ↑↓ move selected layer
  Input: Select layer, press ↑ key
  Expected: Layer moves up one position
  Verification: Sidebar reordered; canvas updated
  Type: interaction
  
L8 [Phase 1]: Multiple layers render with correct z-order
  Input: Create 3 layers (base, middle, top)
  Expected: All render, top layer on front, base in back
  Verification: Visually verify stacking order; canvas shows correct layering
  Type: rendering
  
L9 [Phase 1]: Layer selection highlights in sidebar
  Input: Click layer item
  Expected: Row background turns blue; properties panel updates
  Verification: Visual highlight; properties show selected layer
  Type: UI
  
L10 [Phase 1]: Sidebar collapse toggle works
  Input: Click [−] minimize button
  Expected: Sidebar collapses/hides, icon bar remains
  Verification: Sidebar off-screen; icon bar visible; click expands
  Type: UI layout
  
L11 [Phase 1]: Export includes layers in metadata
  Input: Create 2 layers, export JSON
  Expected: exportJSON.composition.layers has both layers
  Verification: Schema validation; revisionId updated
  Type: integration
  
L12 [Phase 1]: Import restores layer state
  Input: Import JSON with 2 layers + metadata
  Expected: Sidebar shows both layers; canvas renders both; properties match
  Verification: Layer count matches import; names, opacity, lock state restored
  Type: integration

✅ Phase 1 Core Tests (Transform & Properties):

L13 [Phase 1]: Opacity slider changes layer alpha
  Input: Select layer, adjust opacity slider to 50%
  Expected: Layer opacity = 0.5, canvas shows transparency
  Verification: Slider value = 50%, canvas SVG element has opacity:0.5
  Type: rendering

L14 [Phase 1]: Rotation property updates canvas
  Input: Select layer, change rotation to 45° via text input
  Expected: Layer rotates 45° around transform origin (center)
  Verification: Canvas shows rotated element; SVG has transform="rotate(45)"
  Type: rendering

L15 [Phase 1]: Scale properties update canvas
  Input: Select layer, set scaleX to 1.5 and scaleY to 0.8 (unlinked)
  Expected: Layer scales non-uniformly
  Verification: Canvas shows squashed/stretched layer; SVG has transform="scale(1.5, 0.8)"
  Type: rendering

L16 [Phase 1]: Position offset updates canvas
  Input: Select layer, set offsetX=50px, offsetY=20px
  Expected: Layer shifts position
  Verification: Canvas shows displaced layer; SVG transform includes translate(50, 20)
  Type: rendering

L17 [Phase 1]: Blend mode dropdown applies CSS mix-blend-mode
  Input: Select layer, change blend mode to "Multiply"
  Expected: Layer darkens (multiplies with background)
  Verification: Canvas shows blended result; SVG group has style="mix-blend-mode: multiply"
  Type: rendering

L18 [Phase 1]: Transform data persists to localStorage on blur/Enter
  Input: Adjust transform property, reload browser
  Expected: Transform preserved after reload
  Verification: Property values match pre-reload; canvas renders same transformation
  Type: persistence

L19 [Phase 1]: Reset Transform button restores defaults
  Input: Set rotation=45°, scale=1.5, position=50px; click Reset
  Expected: All reset to rotation=0°, scale=1.0, position=0,0
  Verification: Properties panel shows default values; canvas returns to original state
  Type: interaction

L20 [Phase 1]: Keyboard shortcuts adjust transform
  Input: Select layer with rotation=0°, press ↑ (Up arrow shortcut)
  Expected: Rotation increases by 5°
  Verification: Properties panel shows rotation=5°; canvas rotates slightly
  Type: interaction

L25 [Phase 1]: Render 50 layers performs within <500ms
  Input: Programmatically create 50 layers with transforms and blending
  Expected: Canvas renders all 50; total paint time <500ms
  Verification: Chrome DevTools Performance profiler confirms <500ms
  Type: performance

L26 [Phase 1]: SVG DOM size stays under 10MB for 50 layers
  Input: Create 50 layers with visible content and transforms
  Expected: DOM size <10MB (measured via Elements inspector)
  Verification: Memory profiler confirms no leaks after add/delete 100 ops
  Type: performance
```

### Phase 2 Tests
```
⏳ Phase 2 Tests:

L21 [Phase 2]: Canvas rotation gizmo rotates layer
  Input: Select layer, drag rotation handle on canvas gizmo
  Expected: Layer rotates; rotation value in properties updates
  Verification: Visual rotation on canvas; properties panel shows new angle
  Type: interaction

L22 [Phase 2]: Canvas scale gizmo stretches/squashes layer
  Input: Select layer, drag corner scale handle on canvas gizmo
  Expected: Layer scales proportionally; scaleX and scaleY update
  Verification: Visual scale on canvas; linked scale toggle affects behavior
  Type: interaction

L23 [Phase 2]: Canvas move gizmo resets position
  Input: Select layer, drag center move handle on canvas
  Expected: Layer repositions; offsetX and offsetY update
  Verification: Visual displacement on canvas; position inputs reflect change
  Type: interaction

L24 [Phase 2]: Undo/redo buttons functional with keyboard shortcuts
  Input: Make layer edits, click Undo button or press Ctrl+Z
  Expected: Previous state restored
  Verification: Layer state reverted; canvas updated
  Type: state management

L25 [Phase 2]: Advanced blend modes via SVG feBlend
  Input: Select layer, change blend mode to "Color Dodge" (Phase 2 mode)
  Expected: Canvas shows color-dodged result
  Verification: SVG feBlend filter applied; visual difference from Phase 1 modes
  Type: rendering

L26 [Phase 2]: Transform origin / pivot point chooser works
  Input: Select layer, change transform origin from center to top-left
  Expected: Rotation/scale now pivot from top-left corner
  Verification: Visual change in rotation/scale behavior; properties reflect origin
  Type: interaction

L27 [Phase 2]: Copy/Paste transforms between layers
  Input: Copy transform from layer A, select layer B, paste
  Expected: Layer B takes transform (rotation, scale, position) of layer A
  Verification: Layer B visually identical transform to A; properties match
  Type: composition

L28 [Phase 2]: Merge down combines two layers preserving transforms
  Input: Two layers with different transforms; right-click → Merge Down
  Expected: Layers merged, composite shows both transforms
  Verification: One fewer layer; result visually combines both transformed layers
  Type: composition

L29 [Phase 2]: Context menu all transform options present
  Input: Right-click layer item
  Expected: Menu includes Rename, Delete, Move, Merge Down, Copy/Paste Transforms
  Verification: All options clickable and functional
  Type: UI

L30 [Phase 2]: Layer thumbnails show preview with transforms
  Input: Select layer with rotation=45°, scale=1.5
  Expected: 32×32 thumbnail displays rotated/scaled preview
  Verification: Thumbnail visually recognized; transforms visible in preview
  Type: rendering
```

### Phase 3 Tests
```
⏳ Phase 3+ Tests:

L21 [Phase 3]: Layer groups expand/collapse
  Input: Create group, add layers to group, click expand arrow
  Expected: Group expands showing nested layers
  Verification: Hierarchy visible; nesting controls work
  Type: UI
  
L22 [Phase 3]: Batch delete multiple selected layers
  Input: Shift+Click select 2 layers, right-click → Delete All
  Expected: Both layers deleted
  Verification: Sidebar reduced by 2 items; canvas updated
  Type: bulk operation
  
L23 [Phase 3]: Duplicate layer creates exact copy
  Input: Right-click layer → Duplicate
  Expected: New layer created below original with same properties
  Verification: Two identical layers in sidebar; both render identically
  Type: composition
  
L24 [Phase 3]: Auto-hide sidebar during canvas work
  Input: Click on canvas, toggle auto-hide in settings
  Expected: Sidebar hides after timeout; re-appears on layer action
  Verification: UI hides/shows; canvas work uninterrupted
  Type: UX
```

---

## 11. Type Definitions

```typescript
// Layer item in sidebar
type LayerId = string & { readonly __brand: "LayerId" };

interface LayerItem {
  // Identity & Content
  layerId: LayerId;
  name: string;
  content: LayerContent;
  
  // Visibility & State
  visible: boolean;
  locked: boolean;
  opacity: number;              // 0-100
  blendMode: BlendMode;
  
  // Transform (Phase 2+)
  transform?: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
  };
  
  // Color Adjust (Phase 2+)
  colorAdjust?: {
    brightness?: number;        // -100 to +100
    saturation?: number;        // -100 to +100
    hueShift?: number;          // 0-360
  };
  
  // Metadata
  createdAt: string;
  modifiedAt: string;
  zIndex: number;
}

type LayerContent = 
  | { type: "blank" }
  | { type: "asset"; assetId: string }
  | { type: "procedural"; seed: string }
  | { type: "group"; children: LayerId[] };

type BlendMode = 
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "lighten"
  | "darken"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion";

interface LayersState {
  // Data
  layers: LayerItem[];
  selectedLayerId: LayerId | null;
  
  // UI
  sidebarOpen: boolean;
  sidebarWidth: number;
  sidebarAutoHide: boolean;     // Phase 3
  
  // History (Phase 2+)
  undoStack: LayerOperation[];
  redoStack: LayerOperation[];
}

interface LayerOperation {
  type: "add" | "delete" | "reorder" | "update" | "rename" | "merge";
  affectedLayers: LayerId[];
  before: LayerItem[];
  after: LayerItem[];
  timestamp: string;
}

interface CompositionWithLayers extends CompositionConfig {
  layers: LayerItem[];          // Replaces old layers format
}
```

---

## 12. Dependencies & Constraints

### 12.1 Canvas Rendering
- Layers rendered in zIndex order (0 = bottom, N = top)
- opacity property applied via SVG <g> opacity attribute
- blendMode applied via SVG <feBlend> or CSS mix-blend-mode
- Locked layers still render (can't edit, but visible)

### 12.2 Undo/Redo (Phase 1 Infrastructure, Phase 2 UI)
**Phase 1:** undoStack & redoStack structures created, operations tracked internally
- Each layer operation stored in undoStack as it happens
- Max 50 operations in history (configurable, Phase 2 setting)
- Operations: add, delete, reorder, rename, property change
- Merge/unmerge treated as single operation (Phase 2)

**Phase 2:** Add undo/redo UI buttons
- Buttons in toolbar (⟲ Undo, ⟳ Redo)
- Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- Disabled when stack empty
- Visual feedback: operation description in status bar

### 12.3 Performance & Constraints
**Phase 1 Exit Criteria (Acceptance Tests L25-L26):**
- Render 50 layers with <500ms total paint time
- SVG DOM size <10MB for 50-layer composition
- No memory leaks after 100 layer operations
- Render time per layer: <10ms average (profile if slow, optimize in Phase 2)

**Phase 2+ Optimization:**
- Thumbnail generation: async with progress indicator
- Layer culling: hide off-screen layers from rendering
- Path simplification: reduce path point count if >1000 per layer

### 12.4 Persistence
- Layer state saved to localStorage (draft)
- Full layer state in export payload
- Index-based layer identity (Phase 1); UUID-based in Phase 2+

---

## 13. Open Questions

1. **Should locked layers be selectable?** (Phase 1 clarification)
   - Option A: No selection allowed (current spec)
   - Option B: Selectable but properties read-only
   - Recommendation: Option A (prevent accidental edits)

2. **Layer grouping scope** (Phase 3 planning)
   - How many nesting levels? (1, 2, unlimited?)
   - Do groups have blend mode / opacity? (Yes, probably)
   - Can blend inside a group override parent? (Research in Phase 3)

3. **Merge behavior** (Phase 2 design)
   - Merge keeping both properties (interpolate)?
   - Or favor top layer properties?
   - Flatten to single path or keep separate SVG structure?

4. **Multi-select keyboard shortcut** (Phase 2 decision)
   - Shift+Click for range, Ctrl+Click for individual?
   - Or dedicated toggle in UI?

5. **Layer templates/presets** (Phase 3 scope)
   - Save common layer combos as templates?
   - Share templates across projects?
   - Build-in library of templates?

---

## 13. Keyboard Shortcuts (Phase 1 Reference)

**Layer Selection & Reordering:**
- ↑ / ↓ = Move selected layer up/down one position
- Shift+↑ / Shift+↓ = Move to front/back

**Transform Properties (require layer selected):**
- ↑ / ↓ = Rotation ±5°
- Shift+↑ / Shift+↓ = Rotation ±45°
- Ctrl+↑ / Ctrl+↓ = Scale ±0.1x (10%)
- Alt+↑ / Alt+↓ = Opacity ±5%

**Layer Operations:**
- Del = Delete layer
- Shift+R = Rename (or double-click layer name)
- Ctrl+D = Duplicate layer

**Phase 2+ Additions:**
- Ctrl+Z = Undo
- Ctrl+Shift+Z = Redo
- Ctrl+Alt+C = Copy transforms
- Ctrl+Alt+V = Paste transforms
- M = Merge down

---

## 14. Resolved Design Items

The following items from the brainstorm critique have been addressed in this revised spec:

- ✅ **Transform rendering contract**: SVG <g> with transform attribute; compose order (rotate → scale → translate)
- ✅ **Undo/redo granularity**: Debounced slider drags = single entry; text edits = entry per Enter/blur
- ✅ **Persistence lifecycle**: Immediate LayersState update, localStorage syncs every 500ms (debounced)
- ✅ **CompositionPayload schema**: Content types clarified (blank, asset, procedural with optional SVG)
- ✅ **Blend mode support**: Phase 1 = 6 modes (Normal, Multiply, Screen, Overlay, Lighten, Darken); Phase 2+ = SVG feBlend
- ✅ **Reset button scope**: Transform only (rotation, scale, position); separate from opacity/blend
- ✅ **Locked/Hidden layer behavior**: Properties editable, canvas gizmo disabled, reorder prevented
- ✅ **Serialization format**: Fixed transformOriginX typo, defined complete export schema
- ✅ **Position inputs**: Phase 1 = text fields only; Phase 2 = canvas drag-to-move gizmo
- ✅ **Icon-aware scale constraints**: Warn if result <8px or >512px in pixel dimensions
- ✅ **Keyboard shortcuts**: Shift+R for rename (avoids Rotate mode conflict in Phase 2+)
- ✅ **Copy/Paste transforms**: Defined as { rotation, scaleX, scaleY, offsetX, offsetY, opacity, blendMode } JSON

---

## 15. Remaining Open Questions (Phase 2+ Planning)

1. **Canvas Gizmo Implementation (Phase 2)**
   - Implement all gizmo types (rotate, scale, move) in single release, or phased?
   - Recommendation: All three together (Phase 2a) for best UX

2. **Transform Origin Chooser (Phase 2 Design)**
   - Fixed 9-point system (corners, edges, center) or allow freeform custom point?
   - Recommendation: Fixed 9 points Phase 2; custom point Phase 3+

3. **Merge Behavior (Phase 2 Design Decision)**
   - How are blend modes/opacity handled in merge? (favor top, interpolate, or both?)
   - Recommendation: SVG structure-preserving merge (layer below as base)

4. **Phase 2 Blend Mode Implementation (Scope Confirmation)**
   - Implement all 8 additional modes (color-dodge, color-burn, hard-light, soft-light, difference, exclusion, lighten, darken)?
   - Or MVP subset in Phase 2, remainder Phase 3?
   - **Action**: Confirm scope before Phase 2 kickoff

---

## Summary

This spec defines a comprehensive layers sidebar UI with complete layer management and transform editing:

- ✅ Core layer management (add, delete, rename, reorder, visibility, lock)
- ✅ Layer properties editing (opacity, blend mode, transforms)
- ✅ Transform controls (rotation, scale, position with keyboard shortcuts)
- ✅ Real-time canvas preview with debounced updates
- ✅ localStorage persistence (draft state survives reload)
- ✅ Integration with composition model
- ✅ Drag-and-drop reordering
- ✅ Phased rollout (25-30h Phase 1 with full transform editing, 12-15h Phase 2 with canvas gizmos, 8-10h Phase 3 with groups/batch ops)
- ✅ Acceptance tests L1-L30 (Phase 1 + 2 coverage)

**MVP (Phase 1):** Full layer CRUD + rename + visibility + opacity + transforms (rotation, scale, position) + blending (CSS mix-blend-mode) + undo infrastructure (25-30h)  
**Extended (Phase 2):** Canvas gizmos (interactive handles) + undo/redo UI + SVG feBlend filters + thumbnails + copy/paste transforms (12-15h)  
**Polish (Phase 3):** Groups + batch ops + advanced constraints + auto-hide (8-10h)

**Key Changes from Brainstorm Critique Application:**
- ✅ Full transform editing (rotation, scale, position) added to Phase 1 (was deferred to Phase 2)
- ✅ Blend mode dropdown added to Phase 1 (CSS mix-blend-mode, SVG feBlend deferred to Phase 2)
- ✅ All critical gaps from critique resolved (rendering contract, persistence, undo granularity, schema)
- ✅ Phase 1 estimate expanded: 17-21h → 25-30h (reflects full scope)

**Prerequisites for Phase 1 Kickoff:**
- SPEC-SYMMETRY Phase 1: 10-12h (confirmed "already implemented")
- SPEC-LAYERS-SIDEBAR Phase 1 (revised): 25-30h (complete layer management + transforms + blending)
- **Combined Phase 1: 35-42h** (needs timeline reconciliation with 78h original plan)

**Status: ✅ READY FOR IMPLEMENTATION**

Next steps:
1. Confirm Phase 1 scope and timeline (35-42h vs. original 78h)
2. Implement Phase 1 features in priority order
3. Execute acceptance tests L1-L20
4. Plan Phase 2 canvas gizmo and advanced features

**Status: ✅ READY FOR PHASE 1 IMPLEMENTATION**

**Next Steps:**
1. Review phase breakdown with team (35-42h Phase 1 scope vs. original 78h plan)
2. Confirm resource allocation and timeline
3. Implement Phase 1 features (layer CRUD, transforms, blending, properties panel)
4. Execute acceptance tests L1-L20
5. Plan Phase 2 canvas gizmo design
