# Sacred Sigil Generator — Field Reference

This document explains every visible control and field on the Sacred Sigil Generator page: what it does, expected values, default behavior, keyboard shortcuts, and important implementation notes.

**Note on Left Column Layout**: The left panel is now organized by design priority: Symbol (primary, always visible) → Frame (secondary, collapsible) → Style (tertiary, collapsible). This reflects the new "symbol-first" mental model where users choose the hero element before wrapping it in a procedural frame.

---

## Left Column — Configuration (Symbol-First Layout)

### Symbol (Primary Control — Always Expanded)
- Purpose: Select the hero element of the sigil from 4000+ available SVG icons.
- Behavior: Search field with inline results grid; symbol is the foundational design choice.

#### Symbol Picker Controls
**Search Field**
- Placeholder: "Search 4000+ symbols..."
- Behavior: Fuzzy-match on filename and curated keywords; query is sent after a 300 ms debounce to avoid janky typing.
- Result count text updates as search completes; shows "Searching…" when the provider is loading and otherwise "X results" (e.g. "1,234 results").

**Symbol Grid (6 columns × scrollable)**
- Display: Six‑column grid of 72×72 px thumbnail buttons rendered inside a scrollable container (max‑height ≈240 px).
- Pagination: initial page shows 18 icons; clicking the "Load More" outline button appends 18 more results at a time.
- Selection: Clicking a thumbnail marks it selected with a primary‑color border + ring + shadow.
- Thumbnail content: each box renders the SVG symbol (currently placeholder text) along with a truncated identifier string inside the preview; full ID is available via tooltip/title.
- Keyboard: thumbnails are focusable; Enter activates.

**Selected Symbol Preview & Metadata**
- When a symbol is chosen a preview pane appears showing its ID and up to three keyword tags drawn from the index.
- This metadata helps confirm the correct icon was picked before applying color or outline.

**Selected Symbol Controls** (appears when symbol selected)
- Fill Color (color picker): Primary color of the symbol; defaults to #ffffff
- Outline Width (slider): 0–8px stroke; 0 = no outline, enables outline controls below
  - Outline Color (color picker): Stroke color; defaults to #000000; only visible if width > 0
  - Outline Position (dropdown): inside | center | outside; controls stroke-linecap behavior
- Opacity (slider): 0.1–1.0; defaults to 1.0; affects transparency of symbol
- Blend Mode (dropdown): normal (default) | multiply | screen | overlay | lighten | darken
- "Use Symbol" Button: Adds symbol as an asset layer with current properties

---

### Frame ▾ (Collapsible — Secondary Control)

**Seed (text + randomize icon + lock)**
- Purpose: Numeric or alphanumeric seed controlling procedural generation determinism.
- Values: Any short string. Empty → random seed generated when clicking Generate.
- Dice icon: generates a new random seed.
- Lock toggle (lock icon): when locked, regenerating uses the same seed. Clicking lock toggles lock state.
- Keyboard: `Ctrl+Enter` triggers Generate (when focus is not on an input), clicking Enter in the seed input should not auto-generate.

### Domain (dropdown)
- Purpose: Applies a themed palette / domain constraints for generation.
- Values: Domain names (e.g., "arcane", "sacred", "ruin"), or "None (manual colors)".
- Notes: When set to a domain, Color Preset and swatches update to domain defaults.

### Complexity (slider)
- Purpose: Controls level of detail / number of elements in the generated icon.
- Values: Low → High (discrete steps like 1..5 or labeled: Simple → Standard → Complex).
- Notes: Affects variant diversity and generation time.

### Base Shape (dropdown)
- Purpose: Choose a structural base (circle, shield, hexagon, random).
- Behavior: Selecting "Random" chooses a base each generation; specific selection fixes the base.

### Composition Toggles (Ornamental Ring, Halo Wash, Glyph Dust)
- Purpose: Structural generation flags that add/remove specific components.
- Behavior: Checkboxes in Frame section (these affect output, not visual-only).

### Generate Frame / Regenerate Frame Button
- Purpose: `Generate Frame` runs the frame generation with current parameters. 
- Behavior per decision doc: Single button + seed lock. If seed locked, clicking Generate uses same seed.
- Keyboard: `Ctrl+Enter` triggers Generate.
- Note: Frame is the procedural background ring/background element that supports the symbol.

### Seed Lock (toggle, repeated)
- Purpose: When ON, preserve seed for subsequent regenerations.
- Behavior: Indicated by lock icon in seed control.

---

## Left Column — Style section

This section contains global styling and procedural generation tweaks that are secondary to
symbol selection and frame parameters. It is collapsed by default and remembers its state
across sessions.

### Mood (dropdown)
- Purpose: High‑level color / aesthetic preset separate from domain palettes.
- Values: e.g. "stark", "vibrant", "muted".
- Notes: Changing the mood updates the default primary/secondary/accent/background colors but
  does not override user‑picked manual colors.

### Symmetry (dropdown)
- Purpose: Choose rotational/mirror symmetry for the frame and overlays.
- Values: grouped categories (None, Mirror, Rotation, Radial, Hybrid) with descriptive
  display names.
- UX: A small "Use Recommended" button appears when the app suggests a symmetry based on the
  current domain; warnings are shown if the selected base shape is incompatible.

### Main Symbol (dropdown)
- Purpose: Select a built‑in procedural glyph to incorporate as a central motif (e.g., cross,
  star) when the user is not using an imported asset.
- Values: list of names plus "None".

### Background Shape (dropdown)
- Purpose: Choose an extra decorative shape behind the frame (e.g. square, hexagon).
- Values: same as `BG_SHAPES` constant; "None" disables.

### Layer Count (slider)
- Purpose: Controls how many concentric layers the generator will create (1–8).
- Notes: "Auto" (blank) allows the engine to decide based on complexity.

### Stroke Width (slider)
- Purpose: Sets the default line thickness for generated elements (1–5 px).

### Color Preset (dropdown)
- Purpose: Apply a named swatch preset to the palette controls below.
- Values: presets defined by `COLOR_PRESETS` plus a special "domain" option.
- Controls: includes an `Apply Preset To All` toggle, `Reset Domain Colors` and `Reset
  Preset Colors` buttons (the latter disabled when using the domain preset).

### Color Swatches (Primary, Secondary, Accent, Background)
- Purpose: Manual color pickers for the base palette used by the recolor engine and
  overlays.
- Notes: Each swatch shows an `OwnerLabel` icon when a domain or preset is currently
  dominating the value; manual edits clear the ownership marker.

### Size (slider)
- Purpose: Choose the exported/preview image size (64–512 px, steps of 16).  Updates the
  `size` property used by export routines.

### Include Text (checkbox + optional input)
- Purpose: Toggle the rendering of a short text character overlaid on the sigil.
- Behavior: When enabled a 3‑character text input appears for the glyph; the input
  prevents more than 3 characters.

---


---

## Center Column — Preview & Variants

### Preview Canvas
- Purpose: Live rendered preview of the current selection/variant with current layers and composition settings.
- Notes: Interactive: supports click-to-select overlay symbols or drag gestures if implemented. Preview updates on parameter changes.

### Variants Count & Slider
- Purpose: Shows the number of available variants for the current parameter set and allows quick scrubbing among variants.
- Behavior: Slider updates the selected variant index; moving slider updates preview and active thumbnail.

### Variant Thumbnails (grid)
- Purpose: Select the visual variant to use as the base for editing.
- Behavior: 2 rows × 3 columns visible, horizontal scroll for overflow with chevrons; thumbnails are ~72–80px.
- Keyboard Accessibility: Arrow keys navigate thumbnails when grid focused; Enter/Space selects.
- Labeling: Hover shows variant number for easy reference (e.g., "Variant 3").

### Variant Counter (e.g., "1–6 of 8 ▸")
- Purpose: Indicates visible range and total variants; click the chevron to scroll.

---

## Center Column — Composition Controls

### Composition (Blend Mode dropdown)
- Purpose: Sets the base blend mode applied to the entire composition or previews blending behavior for overlays.
- Values: `normal`, `multiply`, `screen`, `overlay`, `soft-light`, `color-dodge`, etc.

### Filter (dropdown) & Filter Intensity (slider)
- Purpose: Apply an image filter (noise, blur, ink) and intensity (0.0–1.0).
- Notes: Filter is a render-time effect; can be baked at export.

### Final Touches (Overlay Symbol + Blend)
- Purpose: Add procedural symbol overlays on top of the frame. Note: This is now a secondary/overlay layer on top of the composed sigil.
- Overlay Symbol (dropdown): pick a procedural symbol to overlay (e.g., star, crown, rune)
- Blend (dropdown): blend mode for the overlay; defaults to `normal` (was `screen`, which made symbols vanish)
- Color (color picker): color of overlay; defaults to #ffffff
- Opacity (slider): 0–1 or 0–100% for overlay transparency; default changed to 1.0 from 0.45 for visibility
- Scale (slider): overlay scale multiplier
- Add Overlay (button): Inserts overlay as an editable layer in the layers panel
- Undo / Redo / Reset Layers (buttons): manage changes to overlays and layer stack
- Notes: Symbol assets (from SymbolPicker) are hero elements and render above frame. Procedural symbol overlays here are decorative additions.

### Add Overlay / Remove / Undo / Redo
- Add Overlay: creates an asset or symbol layer with overlay parameters saved
- Remove: deletes the active overlay layer
- Undo/Redo: operate on the layer action history (uses `undoStack` and `redoStack`) and respect gesture coalescing

---

## Center Column — Export Controls

### Export ▾ (dropdown)
- Purpose: Consolidated export formats (Copy SVG, Download SVG, PNG, JSON, Copy React code)
- Keyboard: `Ctrl+E` opens dropdown; arrow keys navigate; Enter executes; Escape cancels

### Copy SVG (quick action)
- Purpose: Copies the assembled SVG markup to the clipboard.
- Feedback: Brief visual confirmation ("Copied!") and clipboard fallback.

---

## Right Column — Layers & Layer Properties

### Layers Header and Controls
- `+ Add Layer` button: creates a new blank layer (calls `add-blank-layer` action)
- `Group` button: groups selected top-level layers (calls `group-selected`)
- Search layers (input): filters layer list by name
- Undo / Redo (buttons): mirror center controls; operate global undo/redo stacks

### Layer List (virtual scroll)
- Behavior: Virtualized list with 44px min row height, thumbnail at left, name and basic props on two lines.
- Drag handle: allows reorder; drop target highlighting shown
- Selection: click to select; `Shift`/`Ctrl` modifiers for multi-select behavior

### Layer Row Elements
- Thumbnail: small icon representing layer type (symbol, asset, group, blank)
- Name: editable inline or in Layer Properties
- Visible toggle (eye icon): toggles `visible` flag for layer
- Lock toggle (padlock): toggles `locked` flag
- Context menu: right-click for duplicate, delete, merge-down, rename

### Layer Properties Panel
- Name (text input): editable; trimming on save
- Visible (toggle): show/hide layer
- Locked (toggle): prevents mutation when enabled
- Opacity (slider 0–100): transparency of the layer, composed multiplicatively with parent groups
- Blend Mode (dropdown): blending for layer; `normal` inherits parent blend

#### Transform Subsection
- Rotation (angle input / slider): degrees, can be negative
- Scale X / Scale Y (numeric inputs): float values; default 1.0
- Link icon (chain): when linked, changes to one field mirror the other; toggling link does NOT snap values
- X / Y (numeric inputs): translation offsets in px
- Transform Origin (dropdown): `center`, `top-left`, `top-right`, etc.
- Copy Transform / Paste Transform (buttons): copy transform to clipboard-state and apply to another layer
- Reset Transform (button): reset to defaults (rotation=0, scaleX=1, scaleY=1, x=0, y=0)
- Merge Down (button): merges the selected layer into the one below and adjusts transform/composition accordingly

### Remove / Delete (per-layer)
- Remove: removes the active layer from the list
- Delete Selected (batch): deletes selected layer(s); enabled when 1+ selected; shows confirm dialog
- Confirm dialog: requires explicit confirmation to avoid accidental destructive actions

---

## Right Column — Batch Operations

This section contains only one persistent button. All other layer operations are
selection-contextual and belong in the **right-click context menu** on a layer row,
where they are only accessible when they can apply.

### Merge Visible (persistent button)
- Purpose: Flattens all currently visible layers into a single merged layer.
- Always visible; does not require a selection.
- Triggers a confirm dialog if the result is irreversible (i.e., no matching undo depth).
- Rationale: This is the one global action that doesn't target a specific selection —
  it's a "flatten what I see" command useful at any stage of the workflow.

### Layer Row — Right-click Context Menu
The following actions appear in the context menu when right-clicking a layer row.
They are NOT persistent buttons in the panel.

- **Group** — groups 2+ selected layers; enabled when 2+ selected
- **Duplicate** — duplicates the selected layer(s)
- **Delete** / **Delete Selected** — deletes 1+ selected; confirm dialog; undo supported
- **Show / Hide** — toggles `visible` flag; mirrors the eye icon shortcut
- **Set to 50% Opacity** — sets opacity to 50% on 2+ selected layers
- **Set Blend to Overlay** — applies `overlay` blend mode to 2+ selected layers
- **Rename** — opens inline rename input
- **Merge Down** — merges selected layer into the one below

### Auto‑hide Sidebar (toggle)
- Purpose: When enabled, the layers sidebar collapses automatically when focus moves away.
- Stored as `sidebarAutoHide` in state / localStorage.
- Location: inside the ⚙ settings popover on the Layers panel header (not in the batch area).

---

## Right Column — Templates & Sidebar

### Templates (list of presets)
- Each template inserts multiple symbol layers (see `phase3-apply-template` in reducer).
- Appears when the `phase3Templates` debug flag is enabled; otherwise the section is hidden.
- Example templates: `Heraldic Duo`, `Mystic Triad`, `War Sigil`

### Sidebar Width (slider)
- Purpose: Adjust the pixel width of the sidebar (min 220, max 520)
- Storage: Persisted to user state/localStorage via `sidebarWidth` property

### Auto‑hide Sidebar (toggle)
- Purpose: Same as in batch ops; duplicate control offered for convenience in the sidebar
  settings area.

---

## Global Controls & UX Notes

### Keyboard Shortcuts (summary)
- `Ctrl+Z` / `Ctrl+Y` — Undo / Redo
- `Ctrl+Shift+D` — Duplicate layer
- `Ctrl+G` / `Ctrl+Shift+G` — Group / Ungroup
- `Ctrl+E` — Open Export dropdown
- `Ctrl+Enter` — Generate
- `[` / `]` — Select previous / next layer
- `Shift+H` / `Shift+L` — Toggle visibility / lock for selected layer
- `Shift+D` — Open Dev/Debug Settings modal

### Accessibility
- All interactive elements should have keyboard focus styles and ARIA roles (see Accessibility Checklist in `IMPLEMENTATION-SPEC.md`).
- Variant grid: `role=listbox` and `role=option` with `aria-selected`.

### Performance & Limits
- Virtual scrolling used for layer list. Soft warning triggers at 30+ layers; dismiss persists for session.
- Generation and recolor operations should be debounced when driven by sliders to avoid blocking the UI.

---

## Implementation Hints for Developers

- Use `layersReducer.ts` actions for all layer mutations (e.g., `add-asset-layer`, `add-blank-layer`, `group-selected`, `batch-set-opacity`).
- **Symbol Picker Integration**: Asset symbols are created via `add-asset-layer` action with outline properties (`outlineWidth`, `outlineColor`, `outlinePosition`) passed through; renderer must implement stroke rendering.
- **Layer Semantics**: Each LayerItem has a `semanticRole` field: `symbol` (hero/primary), `frame` (background), `overlay` (decorative), or `unspecified` (legacy/uncategorized).
- **Fixed Defaults**: Symbol opacity defaults to 1.0 (not 0.45) and blend mode defaults to `normal` (not `screen`); these changes ensure symbols are visible immediately.
- Persist UI collapsible state and sidebar width to `localStorage`.
- Use `sessionStorage` to track the large-layer warning dismissal (`layer-warning-dismissed`).
- Use standard virtual list library (`react-window`) for the layer list to avoid re-renders.
- Symbol picker grid shows 6 columns of thumbnails; implement actual SVG thumbnail rendering from `assetPath` for full UX (currently shows text labels).

---

If you'd like, I can now:
- Convert this into a compact handout for QA testers,
- Generate a clickable Figma-like wireframe HTML mock for the new left-panel layout, or
- Add explicit ARIA attributes and example HTML snippets for each control.

Which would you prefer next?