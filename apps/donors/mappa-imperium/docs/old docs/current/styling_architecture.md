# Styling Architecture & Component Class Library

## 1. Overview & Rationale

This document explains the styling architecture for the Mappa Imperium application. The goal is to deliver a consistent, maintainable design system that works in both the local Vite workflow and Google AI Studio's read-only sandbox.

**Key Constraints**
- AI Studio cannot install dependencies or fetch generated CSS files reliably.
- The application still makes heavy use of Tailwind utility classes inside React components.
- We maintain a theming layer that must react instantly to the `ThemeProvider` toggling the `data-theme` attribute on `<html>`.

**Resulting Solution**
We keep Tailwind's CDN script for utility classes and hand-author a component class library directly inside `index.html`. The library is plain CSS that leans on CSS custom properties instead of Tailwind's `@apply`, which keeps the file compatible with both the CDN runtime and Vite builds.

---

## 2. The Inlined Architecture

Our styling is built on two cooperating pieces:

1. **Tailwind CSS CDN Script** – The `<script src="https://cdn.tailwindcss.com"></script>` tag loads Tailwind JIT at runtime so standard utility classes (e.g., `grid`, `bg-amber-600`) remain available in JSX.
2. **Inline Component Library** – A large `<style>` block in `index.html` defines semantic classes such as `.btn-primary`, `.page-card`, and `.card-base`. These rules use CSS custom properties (`--bg-card`, `--text-heading`, etc.) to support light/dark theming and keep spacing, borders, and shadows consistent across the app.

### How It Works

When the document loads, Tailwind attaches its utilities to the page, then the inline `<style>` block is parsed as standard CSS. Because the rules are authored directly in CSS, no special directives (`@layer`, `@apply`) are required, and both the CDN runtime and the Vite compiler treat the sheet identically. The `ThemeProvider` sets `data-theme="dark"` or removes it entirely, which flips the CSS custom properties declared at the top of the sheet.

This approach provides:
- A single design token source of truth in `index.html`.
- Predictable behaviour in AI Studio (no extra network requests for stylesheets).
- Compatibility with local Vite builds, which simply include the inline CSS in the generated HTML.

---

## 3. History of Previous Approaches

Earlier iterations attempted to load a generated CSS file at runtime:
1. **Fetching from `/src`** – Failed because the dev server refused to serve files outside `/public`.
2. **Fetching `index.css`** – Reduced errors but still relied on a fetch that AI Studio intermittently blocked.
3. **Using `@import`** – Embedding `@import url('/index.css')` inside the inline block conflicted with the CDN processing order.
4. **Hosting in `/public/styles/`** – Also produced 404s inside AI Studio, confirming the environment was the root cause.

Inlining the CSS eliminated these issues and removed a fragile runtime dependency.

---

## 4. Benefits of the Current Model

- **Single Source of Truth** – All reusable tokens and component styles live in one file (`index.html`).
- **Readable Components** – JSX can stay focused on structure, using semantic classes like `.btn-primary` while still mixing in Tailwind utilities where helpful.
- **Fast Theming** – CSS custom properties update instantly when the theme changes, without recalculating Tailwind output.
- **Zero Extra Requests** – Especially important in AI Studio, where additional asset requests can fail silently.

---

## 5. File Structure Impact

- **`index.html`** houses the entire component class library (along with the import-map used in AI Studio).
- **`index.css`** remains intentionally empty except for a comment, ensuring Vite has a placeholder but no runtime fetch occurs.
- **`tailwind.config.js`** stays empty; the CDN build does not read it, and local development relies on the inline sheet for customisations.

---

## 6. Reference Assets

- **Interactive HTML guide**: `docs/current/style_guide.html` mirrors the palette, components, and spacing tokens with live examples. Update it alongside the inline CSS when visuals change.
- **Markdown summaries**: See `docs/current/style_guide.md` and `docs/current/style_token_analysis.md` for contributor-facing guidance.


