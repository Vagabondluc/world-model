# Style Token & Component Class Analysis

## 1. Overview

The styling system centers on a single CSS bundle embedded in `index.html`. It exposes design tokens via CSS custom properties and composes reusable classes (buttons, cards, navigation) without relying on Tailwind's `@apply`. Tailwind's CDN runtime still delivers utility classes for layout tweaks, but the tokens and semantic classes in `index.html` are the authoritative source of truth.

## 2. Token Inventory

Two layers of tokens exist:

- **Color Tokens**: `--c-primary-*`, `--c-primary-dark-*`, `--c-neutral-*`, `--c-red-*`, `--c-green-*`, `--c-blue-*` supply palettes for light and dark contexts.
- **Semantic Variables**: `--bg-layout`, `--bg-card`, `--bg-nav-active`, `--text-heading`, `--border-default`, `--ring-focus`, etc., translate raw colors into specific UI roles. Dark mode values live in the `@media (prefers-color-scheme: dark)` block and the `[data-theme="dark"]` override.

When extending the system, add new semantic variables rather than hard-coding a palette value directly into a class.

## 3. Core Component Classes

Below is a non-exhaustive catalogue of the semantic classes defined in `index.html` and where they are used.

| Class | Purpose | Key Characteristics | Primary Usage |
| --- | --- | --- | --- |
| `.layout-centered-card` | Auth/setup canvas | Centers content, fills viewport, uses `--bg-layout` | `GameSetup`, `PlayerSelection`
| `.page-card` | Hero card container | 2.5rem padding, 8px top border, ambient shadow | Setup & player selection cards
| `.content-box-main` | Main app surface | 2rem padding, 4px accent border, large shadow | `AppLayout`
| `.header-main` | Sticky app header | Amber background, sticky positioning, header text color | `AppLayout`
| `.nav-button`, `.nav-button-active` | Primary navigation pills | Shared padding & transitions, active state uses `--bg-nav-active` | Layout navigation components
| `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-destructive` | Button system | Rounded corners, weight 600, primary uses amber ramp, destructive uses red ramp | Buttons across app, step actions
| `.btn-era-*` | Era progress controls | Visual differentiation for completed/current/locked states | Era selectors and completion tracker
| `.form-label`, `.input-base`, `.input-range`, `.checkbox-base` | Form elements | Consistent typography, focus rings, spacing | Setup forms, gameplay inputs
| `.table-container`, `.table-base`, `.table-header`, `.table-row` | Tabular data | Scroll handling, zebra hover states, 0.875rem font size | Element Manager, rule tables
| `.pill-badge`, `.you-badge`, `.badge-*` | Status chips | Rounded capsules, token-driven colors | Progress tracker, status callouts
| `.modal-overlay`, `.modal-content` | Dialog shell | Frosted overlay, centered content, max height safeguards | Shared modal components

For a full visual reference, open `docs/current/style_guide.html` in a browser.

## 4. Tailwind Utility Usage

- Utilities (`grid`, `flex`, `gap-*`, responsive `md:*`) continue to provide layout structure. Reserve them for composition; avoid recreating colors, typography, or elevation that already exist as semantic classes.
- If a component requires more than a couple of ad-hoc utilities, promote that styling into a new semantic class inside `index.html` and document it in this file.

## 5. Inline Style Exceptions

Inline `style={{ ... }}` appears only where dynamic values are unavoidable:

- Progress bars (`width` derived from completion percentage).
- Tooltip positioning (`top`/`left` calculated from trigger geometry).
- Analytics/visualization components that must compute canvas dimensions at runtime.

Any new inline style must be justified and, when possible, backed by CSS variables so that themes remain in sync.

## 6. Maintenance Workflow

1. **Add Token**: Define or update semantic variables in the `:root` block plus dark-mode overrides.
2. **Create Class**: Declare the new class in `index.html` using those variables.
3. **Reference Class**: Apply the semantic class in the relevant React component. Keep JSX readable by pairing the new class with existing layout utilities when necessary.
4. **Document**: Update this analysis and the Markdown style guide with the new class so contributors know it exists.

Following this workflow prevents drift between the documented system and the CSS that actually ships with the app.

