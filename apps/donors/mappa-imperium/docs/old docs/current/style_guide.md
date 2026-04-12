# Mappa Imperium Style Guide

## 1. Design Language Overview

Mappa Imperium leans on a warm, parchment-inspired palette anchored by amber accents and deep neutral shadows. Visual consistency is driven by CSS custom properties declared at the top of `index.html`; the React components consume these design tokens through semantic utility classes (e.g., `.page-card`, `.btn-primary`). The interactive HTML style guide at `docs/current/style_guide.html` mirrors these rules with live examples for designers.

### Theme Tokens

The stylesheet defines foundation variables for light and dark themes.

- **Surfaces**: `--bg-layout`, `--bg-card`, `--bg-card-alt`, `--bg-modal`
- **Content**: `--text-default`, `--text-heading`, `--text-on-primary`, `--text-muted`
- **Framing**: `--border-card-top`, `--border-default`, `--border-interactive-hover`
- **Actions**: `--bg-nav-active`, `--bg-btn-secondary`, `--ring-focus`

Dark mode flips these values when the `ThemeProvider` toggles `data-theme="dark"` on `<html>`, so avoid hard-coded colors inside components.

### Accent Palette

- **Amber (Primary)**: `--c-primary-400` → soft highlights, `--c-primary-600/700` → primary actions, `--c-primary-900` → navigation header.
- **Status Colors**: `--c-green-*` (success), `--c-blue-*` (informational/available), `--c-red-*` (destructive).
- **Neutrals**: `--c-neutral-50` through `--c-neutral-900` cover background layers and typography.

## 2. Typography & Spacing

- **Font Stack**: System sans-serif (`-apple-system, Segoe UI, Roboto, sans-serif`). Rulebook or lore content can pull in serif typography case-by-case.
- **Hierarchy**: Component classes encode font sizing—`.section-header` for key headings, `.pill-badge` for emphasis labels, `.subtitle-text` for supporting copy. Do not override these in JSX unless you are creating a new reusable token.
- **Spacing Scale**: Layout classes rely on multiples of 4px (4/8/16/24/32). When composing new structures, pick the nearest value to keep rhythm aligned with `.btn`, `.panel-base`, and `.filter-bar` spacing.

## 3. Core Component Classes

The inline library in `index.html` is the source of truth. Preferred classes:

- **Layouts**: `.layout-centered-card`, `.content-box-main`, `.panel-base`, `.table-container`
- **Navigation**: `.header-main`, `.nav-container`, `.nav-button`, `.nav-button-active`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-destructive`, `.btn-era-*`
- **Forms**: `.form-label`, `.input-base`, `.input-range`, `.checkbox-base`
- **Feedback**: `.pill-badge`, `.you-badge`, `.error-text`, `.dropdown-menu`

Compose these with Tailwind utilities only when the class library lacks the layout behaviour you need. If you reach for more than three ad-hoc utilities, build a new semantic class in `index.html` instead.

## 4. Usage Guidance

- **Primary Actions**: `.btn-primary` for singular, high-impact decisions (start, confirm, save). The amber hover lift communicates emphasis.
- **Secondary/Neutral Actions**: `.btn-secondary` or `.btn btn-secondary bg-amber-600` patterns provide softer contrast. Maintain accessible color contrast against the active surface.
- **Cards & Panels**: `.page-card` for hero surfaces (setup screens), `.panel-base` for supporting content. Keep content widths aligned with existing components (`max-width: 32rem` for single-column flows).
- **Tables & Lists**: `.table-base` and `.table-header` manage zebra striping and hover states. Apply `.table-row` to list rows so the shared hover color is preserved.
- **Modals/Overlays**: `.modal-overlay` and `.modal-content` already include motion, blur, and z-index. Reuse them for all dialogs instead of rolling bespoke wrappers.

## 5. Light vs Dark Mode

- Let the theme controller drive color—avoid inline `style` overrides for `background`, `color`, or `border`.
- For custom visuals (charts, rich text), read CSS variables directly (`const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-card')`).
- When extending the token set, provide both light and dark definitions and update the `@media (prefers-color-scheme: dark)` block plus `[data-theme="dark"]` override.

## 6. Status & Messaging Patterns

- **Success/Completion**: `.btn-era-completed`, `.badge-success`, and `--c-green-*` palette.
- **Warnings/In Progress**: `.badge-warning` and `--c-primary-400` or `--c-blue-500` depending on context.
- **Errors**: `.btn-destructive`, `.error-text`, and the `--c-red-*` ramp. Pair with clear text explanations; icons alone are insufficient.

## 7. Reference Assets

- Interactive reference: `upload/mappa_style_guide (1).html` (open in a browser to inspect tokens, buttons, tables, and navigation states).
- Source of truth: `index.html` `<style>` block defines all classes and theme variables—update this file when introducing new tokens or semantic classes.

Follow these guidelines to keep emerging features visually aligned while we work toward a component-driven design system backed by Zustand-managed state.

