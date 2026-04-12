# Sacred Sigil Generator: Implementation Specification

**Date:** March 10, 2026  
**Status:** Ready for Build  
**Based on:** Decision Document: Sacred Sigil Generator Ergonomics

---

## 1. Collapsible Section State Persistence

**Feature:** Generate and Style sections in left panel are collapsible.

**Behavior:**
- Both sections open by default on first load
- User collapses/expands by clicking section header chevron
- Collapsed state is saved to localStorage per section
- Persists across page reloads and sessions

**Storage Keys:**
```
localStorage:
  - "ui.sidebarSections.generate.collapsed" (boolean)
  - "ui.sidebarSections.style.collapsed" (boolean)
  - "ui.sidebarSections.properties.collapsed" (boolean)
  - "ui.sidebarSections.transform.collapsed" (boolean)
  - "ui.sidebarSections.batchOps.collapsed" (boolean)
  - "ui.sidebarSections.templates.collapsed" (boolean)
```

**Default State (first load):**
```json
{
  "generate": false,
  "style": false,
  "properties": false,
  "transform": false,
  "batchOps": false,
  "templates": false
}
```

**Implementation Notes:**
- Use `useEffect` hook to sync state to localStorage on change
- Use `useEffect` hook to restore from localStorage on mount
- Add throttle (100ms) to localStorage writes if updates are frequent

---

## 2. Variant Grid Scroll UX

**Feature:** Grid displays 2 rows × 3 columns (6 variants) with overflow handling.

**Behavior:**

### Desktop (Mouse/Trackpad)
- Horizontal scroll enabled on grid container
- Mouse wheel / trackpad swipe scrolls horizontally
- Scroll shadows on left/right edges indicate overflow (CSS `::-webkit-scrollbar` styling)

### Mobile/Tablet
- **Left/Right Chevron Buttons** visible on grid edges
- Click chevron to scroll by 1 item (72–80px)
- Buttons disabled when at start/end of grid

### Keyboard
- Focus grid container or variant item
- Left/Right arrow keys cycle through variants
- Home/End keys jump to first/last variant
- Enter/Space to select focused variant

**Variant Counter:**
- Display format: `"1–6 of 12 ▸"` when overflow exists
- Located top-right, above grid
- Hidden if total variants ≤ 6
- Right arrow (▸) is clickable to scroll next set

**CSS Scroll Snap:**
```css
.variant-grid {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
.variant-item {
  scroll-snap-align: start;
}
```

**Accessibility:**
- Use `role="listbox"` on grid
- Use `role="option"` on variants
- `aria-selected="true"` on selected variant
- `aria-label="Variant 1 of 12"` on each variant

---

## 3. Layer Properties Empty/Group State

**Feature:** Properties section shows contextual content based on selection.

**Behavior:**

### No Selection
- Section header visible with chevron
- Body shows centered placeholder text (muted color)
- Placeholder text: *"Select a layer to edit properties"*
- Section does NOT auto-collapse
- Clicking section header toggles visibility (same as other sections)

### Single Layer Selected
- Section header visible
- All properties shown:
  - Name
  - Visible toggle
  - Locked toggle
  - Opacity slider (0–100)
  - Blend Mode dropdown
  - All Transform controls

### Group Selected
- Section header visible
- **Limited properties only:**
  - Name
  - Visible toggle
  - Locked toggle
  - Opacity slider
  - Blend Mode dropdown
- **Transform section completely hidden** (no toggle, no placeholder)
- No special label needed for group — absence of Transform is self-explanatory

### Multiple Layers Selected (2+)
- Display "Select 1 layer for details" placeholder
- Same behavior as no selection
- Properties section shows placeholder

**Placeholder Styling:**
```css
.properties-placeholder {
  padding: 24px 16px;
  text-align: center;
  color: rgb(107, 114, 128); /* Tailwind gray-500 */
  font-size: 13px;
  line-height: 1.5;
}
```

---

## 4. Batch Operations Visibility

**Feature:** Batch Operations section is always visible but contextually enabled/disabled.

**Behavior:**

### When Nothing Selected
- Section header visible
- Below header: muted helper text (14px, gray-600)
  - Text: *"Select layers to batch edit"*
- All buttons visible but disabled (`cursor: not-allowed`, opacity 0.5)
- Helper text hidden when selection exists

### When 1+ Layer Selected
- Section header visible
- Helper text hidden
- **Delete Selected** button: **enabled and red** (`bg-red-500 hover:bg-red-600`)
  - Can delete single layer or multiple selected layers
  - Confirm dialog before delete

### When 2+ Layers Selected
- Section header visible
- Helper text hidden
- **All buttons enabled and interactive:**
  - **Show All** — sets selected layers visible
  - **Hide All** — sets selected layers hidden
  - **Set to 50% Opacity** — applies 50% opacity to selected
  - **Set Blend to Overlay** — applies overlay blend mode
  - **Delete Selected** — stays red, applies batch delete

**Button Styling (disabled):**
```css
button:disabled {
  background: rgb(243, 244, 246);
  color: rgb(156, 163, 175);
  cursor: not-allowed;
  opacity: 0.5;
}
```

**Delete Button Behavior:**
- **Always follows selection state:** enabled when 1+ layer selected, disabled when nothing selected
- Stays red: `bg-red-500 hover:bg-red-600` when enabled
- Disabled state: same gray as other buttons
- Clear destructive intent; confirm dialog prevents accidental deletion

---

## 5. Export Button Topology

**Feature:** Replace 5 buttons with 1 dropdown + no secondary quick-action.

**Current State (to replace):**
```
[Copy SVG] [Download .svg] [Download .png] [Download .json] [Copy React]
```

**New State:**
```
[Export ▾]   [Copy SVG]
```

**Export Dropdown Contents (in order):**
1. Copy SVG
2. Download SVG
3. Download PNG
4. Download JSON
5. Copy React

**Keyboard Interaction:**
- `E` key opens dropdown (global shortcut, when no input focused)
- Arrow Up/Down cycles through options
- Enter executes selected option
- Escape closes without action
- After export: dropdown auto-closes

**Styling:**
- Primary button: full width or standard width depending on layout
- Secondary (Copy SVG): small icon-button or text button, sits right of dropdown
- Hover state: subtle background change
- Active/focus state: clear focus ring (2px, blue-500)

**Copy SVG Button:**
- Icon: clipboard icon
- Tooltip on hover: "Copy SVG to clipboard"
- Visual feedback on click: button background flash green for 200ms, text "Copied!" briefly

---

## 6. Layer Row Scrolling Strategy — Virtual Scroll

**Feature:** Layer list uses virtual scroll windowing for performance.

**Behavior:**

### Virtual Scroll Windowing
- Render visible rows + 3 rows buffer above/below
- Example: if 10 rows visible, render rows [visible_start - 3] to [visible_end + 3]
- Hide off-screen rows from DOM

### Row Height
- **Minimum 44px** on desktop
- Touch target: 44px height ensures accessible hit area
- Two-line layout:
  - Line 1: Thumbnail (32px) + Name + Visibility toggle (right-aligned)
  - Line 2: Blend mode label + Opacity value (right-aligned, muted text)

### Soft Warning (30+ Layers)
- Display inline warning when layer count ≥ 30
- Message: *"Large layer counts may slow preview rendering."*
- Style: yellow/amber background, small type (12px), dismissible
- Type: `<div class="warn-large-layers">...</div>`
- **Show once per session:** Check `sessionStorage.getItem('layer-warning-dismissed')`
- On first appearance, show warning with dismiss button (✕)
- User clicks dismiss → set `sessionStorage.setItem('layer-warning-dismissed', 'true')`
- Warning does not reappear until page reload (session boundary)
- SessionStorage clears on browser tab close, so warning shows again next session

### No Hard Cap
- Allow unlimited layers
- Power users will manage their own constraints
- Performance monitoring in dev tools (log render time per list update)

**Implementation Library:**
- Recommend: `react-window` or `react-virtualized` (industry standard)
- Or: Custom implementation with `IntersectionObserver` for simpler cases

---

## 7. Scale Link Toggle — Lock-Only Behavior

**Feature:** Chain-link icon between X/Y scale fields toggles linked/unlinked state.

**Behavior:**

### When Unlinked (default)
- Chain-link icon shows "broken" state (icon: `link-2-off` or similar)
- User can change X and Y independently
- Icon is clickable

### When Linked
- Chain-link icon shows "connected" state (icon: `link-2` or similar)
- User changes X → Y updates to match X immediately
- User changes Y → X updates to match Y immediately
- Values stay in sync on all future edits

### On Toggle Link → Unlinked
- **No snap.** Current values preserved exactly.
- Example: X=1.2, Y=0.8 → click link → unlink. Still X=1.2, Y=0.8.
- User must manually adjust if they want different values.

### On Toggle Unlinked → Link
- Link takes effect immediately for future changes
- **No snap to average or larger value.**
- Example: X=1.2, Y=0.8 → click unlink → link. Future edits sync both fields.

**Visual Design:**
- Icon positioned between X and Y labels (centered horizontally)
- Icon color: gray-400 (unlinked), gray-700 (linked)
- Hover: cursor pointer, icon color brightens to gray-600

**Storage:**
- Persist linked state to LayersState or local component state
- Optional: save preference to localStorage (`ui.scaleLinked: boolean`)

---

## 8. Keyboard Shortcut Map

**Global Shortcuts (full conflict check):**

```
Ctrl+Z                   Undo (existing)
Ctrl+Y                   Redo (existing)
Ctrl+Shift+D             Duplicate layer
Ctrl+G                   Group selected layers
Ctrl+Shift+G             Ungroup
Ctrl+E                   Open Export dropdown
Ctrl+Enter               Generate (primary action)
[  / ]                   Select previous / next layer (in list order)
Shift+H                  Toggle visibility of selected layer
Shift+L                  Toggle lock of selected layer
Shift+D                  Open Dev/Debug settings modal
```

**Conflict Analysis:**
- Ctrl+Z, Y: Existing undo/redo — no change
- **Ctrl+Shift+D:** Safe (mirrors Figma's duplicate behavior; avoids Chrome devtools conflicts with Ctrl+D)
- Ctrl+G: Safe (browser doesn't use this)
- Ctrl+Shift+G: Safe
- Ctrl+E: Safe (browser "edit" is not standard shortcut)
- Ctrl+Enter: Safe (form convention, works well for "confirm/submit" action)
- [ / ]: Safe (no conflicts)
- Shift+H, L: Safe (no standard conflicts)
- Shift+D: Safe (we control debug modal)

**Focus Management:**
- All shortcuts disabled when user is typing in an input field (name field, seed field, opacity input, etc.)
- Detect focus: `document.activeElement.tagName === 'INPUT'` → skip shortcut
- Use a global `keydown` listener at app root, check focus before executing

**Implementation:**
```typescript
export const KEYBOARD_SHORTCUTS = {
  UNDO: { key: 'z', ctrl: true },
  REDO: { key: 'y', ctrl: true },
  DUPLICATE: { key: 'd', ctrl: true, shift: true },
  GROUP: { key: 'g', ctrl: true },
  UNGROUP: { key: 'g', ctrl: true, shift: true },
  EXPORT: { key: 'e', ctrl: true },
  GENERATE: { key: 'Enter', ctrl: true },
  PREV_LAYER: { key: '[' },
  NEXT_LAYER: { key: ']' },
  TOGGLE_VISIBLE: { key: 'h', shift: true },
  TOGGLE_LOCK: { key: 'l', shift: true },
  DEBUG: { key: 'd', shift: true },
} as const;
```

---

## 9. Composition Toggle Relocation

**Feature:** Move Ornamental Ring, Halo Wash, Glyph Dust toggles from Preview column to Generate section.

**Current Location:**
- Preview column, below preview canvas

**New Location:**
- Generate section (left panel)
- After Base Shape, before Mood
- Visual grouping: separates structural parameters from styling

**Rationale:**
- These affect generation output, not preview display
- Moving clarifies they are generation parameters, not view toggles
- Reduces confusion about what these controls modify

**After Move:**
- Preview column has white space (acceptable for future features)
- Generate section gains 3 checkboxes

---

## 10. Settings Modal for Debug Hooks

**Feature:** Remove Phase 2/3 hooks from sidebar; move to Settings modal.

**Current Location (to remove):**
- Dev / Phase Hooks section in sidebar
- Shows: `Canvas Games on`, `CopyPaste on`, etc.

**New Location:**
- **Settings Modal** (opened via `Shift+D` or ⚙ icon)
- Tab or section: "Developer / Debug"
- Checkboxes for each hook:
  - Phase 2 Copy/Paste Transform
  - Phase 2 Gizmo
  - Phase 3 Template Search
  - (future hooks)

**Modal Behavior:**
- Keyboard: `Shift+D` opens
- Mouse: ⚙ icon in top-right corner of sidebar
- Escape closes
- Settings persist to localStorage (`ui.debugHooks`)

**Icon Location:**
- Small ⚙ icon, top-right corner of sidebar header
- Gray-400 color, hover: gray-600
- Tooltip: "Debug Settings"
- Only visible in dev/local builds (check `process.env.NODE_ENV === 'development'`)

**Modal Structure:**
```
┌─────────────────────────────────────┐
│ Settings                         [X] │
├─────────────────────────────────────┤
│ Developer / Debug                   │
│ ☐ Phase 2: Copy/Paste Transform   │
│ ☐ Phase 2: Canvas Gizmo           │
│ ☐ Phase 3: Template Search        │
│                                     │
│ [Close] [Reset to Defaults]         │
└─────────────────────────────────────┘
```

---

## Build Order (Recommended Sequence)

1. **Collapsible Generate/Style sections** + move Composition toggles ← Start here
2. Seed field lock state + single Generate button
3. Variant grid 72px with horizontal overflow + counter
4. Collapsible sidebar sections with empty/group state specs
5. Virtual scroll layer list + 44px rows + thumbnail
6. Scale X/Y link toggle (lock-only)
7. Export dropdown consolidation
8. Batch ops always-visible with disabled state
9. Settings modal + remove Phase Hooks from sidebar
10. Full keyboard shortcut implementation

---

## Accessibility Checklist

- [ ] Collapsible sections: `aria-expanded` on headers
- [ ] Variant grid: `role="listbox"`, options have `role="option"`, `aria-selected`
- [ ] Layer rows: semantic HTML, proper heading hierarchy
- [ ] Color contrast: all text ≥ 4.5:1 (WCAG AA)
- [ ] Focus visible: all interactive elements have clear focus ring
- [ ] Keyboard: all features accessible via keyboard
- [ ] Screen reader: test with NVDA/JAWS (variant grid, layer list, modal)

---

## Testing Scope

**Unit:**
- Reducer dispatch for new section state actions
- localStorage read/write logic

**Component:**
- Collapsible section render + toggle behavior
- Variant grid scroll (desktop, mobile, keyboard)
- Layer row virtual scroll (50+ layer performance)
- Settings modal open/close

**Integration:**
- Keyboard shortcuts don't conflict with form inputs
- Export dropdown keyboard navigation
- Batch ops enable/disable based on selection count

**E2E (Playwright):**
- Generate → tweak color → regenerate workflow
- Variant selection → export
- Drag layer, reorder, scroll list, select multiple, batch edit
- Debug modal hidden in prod, visible in dev

---

## Notes for Implementer

- **Start QA early:** Accessibility testing (WCAG) should run in parallel with phase builds
- **Performance:** Monitor Lighthouse Performance score; target >90
- **Mobile testing:** Test variant grid on actual devices (iPhone, iPad, Android tablet)
- **Figma mock:** Recommend quick wireframe of two-line layer rows at 44px before coding; verify spacing looks good
