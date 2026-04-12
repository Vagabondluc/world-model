# SPEC-DASHBOARD-ENDPOINT.md

## 1) Purpose
Deliver a fully working secondary endpoint at `/dashboard.html` in this Vite/React repo.
The dashboard must be a distinct surface while reusing shared application platform contracts.

## 2) Scope (This Phase)

### In Scope
- Multi-entry frontend delivery:
  - `/index.html` (main app)
  - `/dashboard.html` (dashboard app)
- Shared provider shell used by both entries.
- Dashboard-specific chrome around shared generator workflow.
- Router safety for dashboard entry.
- Test + CI gates D1-D4.

### Out of Scope
- New backend service/API contracts.
- OpenAPI/auth/rate-limit design.
- Staging/prod deployment automation.
- CSP/infra policy work.

## 3) Architecture Contract

### 3.1 Entry Points
- `index.html -> /src/main.tsx`
- `dashboard.html -> /src/main-dashboard.tsx`
- `vite.config.ts` must include both inputs in `build.rollupOptions.input`.

### 3.2 Shared Provider Shell (Required)
- `src/app/AppProviders.tsx` is canonical owner for:
  - `QueryClientProvider`
  - `TooltipProvider`
  - `DiscoveryProvider`
  - `Toaster` + `Sonner`
- `App` and dashboard entry must consume `AppProviders`.
- No duplicated provider stacks in entry apps.

### 3.3 Dashboard Surface (Required)
Dashboard must not be a direct remount of main `Index`.
Minimum required composition:
- `DashboardHeader`
- `DashboardWorkspace`
- `DashboardSidebarRail` (placeholder/chrome acceptable)

A deterministic marker is required for first-paint checks:
- `#dashboard-root` and/or `body.dashboard-entry`.

### 3.4 Router Policy
Dashboard entry defaults to `MemoryRouter` so shared components with routing hooks are safe.
If bookmarkable sub-pages are introduced later, migrate to `BrowserRouter` with explicit `basename` policy.

### 3.5 Entry Diagnostics
Set global runtime marker in each entry:
- `window.__APP_ENTRY__ = "main" | "dashboard"`

## 4) Acceptance Gates (D1-D4)

### D1: Dashboard Load Smoke
- `/dashboard.html` loads without uncaught runtime errors.

### D2: First-Paint Distinction
- Dashboard marker (`#dashboard-root` or `body.dashboard-entry`) exists.
- Main entry does not present dashboard marker.

### D3: Shared Provider Contract
- Both entries resolve through `AppProviders`.
- No duplicate provider ownership in `App`/`DashboardApp`.

### D4: Functional Dashboard Flow
- In dashboard endpoint, user can:
  - generate variants,
  - select a variant,
  - trigger an export action.

## 5) Build/CI Contract (This Phase)
- `npm run build` must emit:
  - `dist/index.html`
  - `dist/dashboard.html`
- CI gate must fail if either artifact is missing.
- Dashboard smoke test must be part of CI checks.

## 6) Test Requirements
- **Vitest**:
  - provider contract assertions,
  - dashboard mount smoke.
- **Playwright**:
  - D1 load smoke,
  - D2 marker distinction,
  - D4 interaction flow.

## 7) Deferred Work (Phase 2+)
- Backend/API/auth enhancements.
- Staging rollout automation.
- Lint-level provider duplication enforcement.
- Advanced dashboard feature flags and analytics segmentation.

## 8) Definition of Done
- Dashboard endpoint is distinct from main endpoint.
- Shared providers are centralized and consumed by both entries.
- Dashboard has router-safe runtime setup.
- D1-D4 tests pass.
- Build artifacts include both HTML entry outputs.
