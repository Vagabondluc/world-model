# UI/UX Specification — Sacred Sigil Generator

This document captures the current user interface and user experience of the Sacred Sigil
Generator. Its purpose is to explain how the controls are arranged, the behaviour users
should expect, and, crucially, the design intent behind major pieces of UI. This spec can
serve designers, QA, and new developers who need to understand not just what exists but why
it exists.

---

## Overall Design Principles

1. **Symbol‑First Mental Model** – the hero element (symbol) is the defining choice for a
   sigil. Everything else flows from that decision. The left panel emphasises this ordering by
   keeping the symbol picker always visible and collapsing secondary controls beneath it.

2. **Progressive Disclosure** – complex or infrequently changed settings are hidden behind
   collapsible sections (Frame, Style) so the interface feels uncluttered for newcomers.

3. **Consistency & Keyboard Accessibility** – keyboard shortcuts mirror common graphics tools
   (Ctrl+Z undo, Ctrl+E export). Every interactive component has focus styles and ARIA roles
   (see Accessibility Checklist).

4. **Immediate Feedback** – sliders and dropdowns update the preview canvas in real time
   whenever possible. Debouncing is used for expensive operations.

5. **Separation of Concerns** – the center column is purely about previewing and choosing
   variants, the right column manages layer structure, and the left column configures inputs
   used by generation/recolor engines.

---

## Left Column

### Symbol Picker (always expanded)

- **UI**: Search field at top, six‑column scrollable grid of thumbnails, selected‑symbol
  controls below.
- **Intent**: make browsing 4000+ icons fast and visual; textual search is too slow alone.
  The grid encourages exploration and makes it easy to recognise the right hero quickly.
- **UX Notes**: results update after a 300 ms debounce to avoid janky typing. Selection ring
  uses primary accent color to tie into the color picker. When no symbol is chosen the lower
  controls collapse to save space.

### Selected Symbol Controls

- Fill color, outline width/colour/position, opacity, blend; "Use Symbol" button.
- **Intent**: allow users to get a workable hero icon on the canvas with minimal clicks.
  Outline solves contrast issues without forcing them to manually draw a border.
  Opacity & blend support compositional effects that can often obviate later recoloring.
  The button commits the choice into the layer stack, making the action explicit.

### Frame Section (collapsible)

- Seed, domain, complexity, base shape, composition toggles, Generate Frame button, seed
  lock.
- **Intent**: encapsulate procedurally‑generated background elements separate from the
  symbol. Seed lock and dice icon provide standard randomness controls familiar to game
  designers. Domain and complexity tune the generator without exposing implementation
  details. Collapsed by default to avoid overwhelming symbol‑first workflow.

### Style Section (collapsible)

- Color presets, swatches, size, include text, apply‑to‑all toggle.
- **Intent**: global styling options that affect all layers but are adjusted less frequently
  than symbol or frame parameters. Holds utility controls rather than core design inputs.

---

## Center Column

### Preview & Variants

- Large canvas with live render. Variant thumbnails below with horizontal scroll.
- **Intent**: provide immediate visual feedback for every parameter change. The variant
  grid mimics photo‑editing film strips to make iteration feel natural. Keyboard arrows
  permit quick scanning.

### Composition Controls

- Blend mode, filter, filter intensity, final touches overlay controls.
- **Intent**: give users post‑generation tools to tweak output without regenerating the
  frame. Final Touches is intentionally placed in the center because overlays are still part
  of the creative core, but their parameters are light and not required for every sigil.
  Defaults (blend=normal, opacity=1.0) were chosen to avoid unintentional invisibility.

### Export Controls

- Dropdown with SVG/PNG/JSON options, copy actions.
- **Intent**: single access point for all outputs to keep top‑level UI tidy. Keyboard
action and confirmation feedback reduce friction.

---

## Right Column

### Layer List & Properties

- Virtualized vertical list, drag handles, visibility/lock toggles, context menu.
- Properties panel shows transform, compositing, naming, and low‑level flags.
- **Intent**: provide power‑user control over the build up of the sigil. Layers are the
  only place where manual edits can be made, so they are visually robust and keyboard
  navigable. Virtual scrolling keeps performance solid with many layers.

### Batch Operations & Templates

- Batch visibility/opacity/blend, delete selected.
- Templates insert predefined combinations of symbols (e.g. Heraldic Duo).
- **Intent**: speed up common repetitive tasks. Templates embody ergonomic patterns we
  observed in playtests.

### Sidebar Width Slider

- Persisted to localStorage; ranges 220–520px.
- **Intent**: accessibility for different screen sizes and user preferences.

---

## Global UX Notes

- **History & Undo/Redo**: globally available, coalesces quick successive tweaks (slider
  drags, color picker moves) into a single action to make undo predictable.
- **Keyboard Focus**: every interactive element can be reached via Tab/Shift+Tab; custom
  components implement `aria-label` where visual text is absent.
- **Responsive Behaviour**: on narrow viewports the right column can collapse to a floating
  panel; the variant grid becomes a vertical strip.
- **Error States**: the large‑layer warning dialog appears once per session when layer count
  exceeds 30, emphasising performance without blocking creativity.

---

## Interaction Flow Examples

1. **Quick symbol-and-export**: type keyword → select thumbnail → adjust fill color →
   click "Use Symbol" → export `Copy SVG`.
2. **Design with procedural frame**: pick symbol → open Frame → set seed and lock → choose
   domain → Generate Frame → use variant slider to pick a look → export.
3. **Layer fine‑tuning**: use symbol picker to add multiple asset layers → open right
   sidebar → reorder, set opacity, apply batch overlay blend → export high‑resolution
   PNG.

---

## Design Intent Summary

- Keep creative flow flowing: symbol choice leads, generation is optional, styling is
 ancillary.
- Hide complexity until needed; defaults should ‘‘just work’’ and make artifacts visible.
- Treat layers like a sandbox—users may undo, experiment, and template their way through
   sigil design.
- Maintain accessibility and performance at scale (4000 symbols, many layers).

---

This spec can be updated as the interface evolves. It is referenced by QA checklists,
handoffs to design, and developer onboarding materials.