# Reusable Component Library Spec

Purpose: define reusable UI components for all dashboard screens (`docs/ui-ux/11-33`) with consistent behavior, typing, and auditability.

## 🔒 v1 Implementation Baseline
Status: `Frozen for implementation start` (LockedOn: `2026-02-12`)

Lock rules:
1. New components require additive registration only.
2. Existing component semantics cannot change without version bump.
3. Dashboard panel mappings must stay compatible with this baseline.

## 1) Component Rules
1. Components are pure view primitives and never mutate authoritative simulation state.
2. Every component receiving numeric values must declare unit metadata.
3. High-impact action components must support preview-first flow.
4. Components must be deterministic for same snapshot input.

## 2) Core Types

```ts
type UiComponentId =
  | "ShellFrame"
  | "SectionHeader"
  | "StatusBadgeRow"
  | "KpiCardGrid"
  | "TrendLineChart"
  | "HeatmapPanel"
  | "VectorMapPanel"
  | "TablePanel"
  | "RiskFlagList"
  | "ForecastBandCard"
  | "TimelineRail"
  | "EntityCard"
  | "TagChipList"
  | "CommandBar"
  | "PreviewDrawer"
  | "ExplainabilityDrawer"
  | "DiffPanel"
  | "DiagnosticsPanel"
  | "ProvenancePanel"
  | "ScenarioRunPanel"

type UiComponentDensity = "compact" | "comfortable" | "expanded"

interface UiComponentMeta {
  componentId: UiComponentId
  title: string
  density: UiComponentDensity
  testId: string
}

interface UiUnitValue {
  raw: number
  display: string
  unit: "ppm" | "percent" | "ticks" | "years" | "celsius" | "kelvin"
}
```

## 3) Component Contracts

```ts
interface StatusBadgeRowProps {
  meta: UiComponentMeta
  badges: Array<{ key: string; label: string; severity: "ok" | "warn" | "critical" }>
}

interface KpiCardGridProps {
  meta: UiComponentMeta
  cards: Array<{ key: string; label: string; value: UiUnitValue; delta?: UiUnitValue }>
}

interface TrendLineChartProps {
  meta: UiComponentMeta
  series: Array<{ key: string; points: Array<{ tick: number; value: UiUnitValue }> }>
}

interface HeatmapPanelProps {
  meta: UiComponentMeta
  layerId: string
  legend: string[]
}

interface VectorMapPanelProps {
  meta: UiComponentMeta
  fieldId: string
  magnitudeUnit: UiUnitValue["unit"]
}

interface TablePanelProps {
  meta: UiComponentMeta
  columns: Array<{ key: string; title: string }>
  rows: Array<Record<string, string | number>>
}

interface ForecastBandCardProps {
  meta: UiComponentMeta
  metric: string
  band: { min: UiUnitValue; base: UiUnitValue; max: UiUnitValue }
  confidence: "low" | "medium" | "high"
}

interface CommandBarProps {
  meta: UiComponentMeta
  commands: Array<{ commandId: string; label: string; impact: "low" | "medium" | "high" | "critical" }>
}

interface PreviewDrawerProps {
  meta: UiComponentMeta
  previewId: string
  directEffects: string[]
  cascadeEffects: string[]
  riskFlags: string[]
}

interface ExplainabilityDrawerProps {
  meta: UiComponentMeta
  reasonCodes: string[]
  topDrivers: Array<{ key: string; contributionPPM: number }>
}

interface DiffPanelProps {
  meta: UiComponentMeta
  leftLabel: string
  rightLabel: string
  deltas: Array<{ metric: string; left: UiUnitValue; right: UiUnitValue }>
}

interface DiagnosticsPanelProps {
  meta: UiComponentMeta
  flags: Array<{ flag: "SATURATED" | "OUT_OF_RANGE" | "FALLBACK_USED" | "CLAMPED" | "DESYNC"; count: number }>
}

interface ProvenancePanelProps {
  meta: UiComponentMeta
  entries: Array<{ key: string; source: "earth" | "fitted" | "gameplay"; modelVersion: string }>
}

interface ScenarioRunPanelProps {
  meta: UiComponentMeta
  scenarios: Array<{ id: string; status: "pass" | "warn" | "fail"; lastRunIso: string }>
}
```

## 4) Interaction Policies
1. `CommandBar` must open `PreviewDrawer` before any `high` or `critical` command is committed.
2. `ForecastBandCard` must link to `ExplainabilityDrawer`.
3. `DiffPanel` is required for branch/canon comparison actions.
4. `DiagnosticsPanel` must be present on canon commit workflows.

## 5) Accessibility Baseline
1. All components must expose keyboard-focus order.
2. Severity states must use text/icon + color (not color alone).
3. Table headers and command labels must be screen-reader readable.

## 6) Acceptance Criteria
1. Every dashboard spec (`11-31`) can be composed exclusively from this component set.
2. No dashboard spec defines one-off bespoke components without registering new `UiComponentId`.
3. Preview/Explainability/Diagnostics are composable and reusable across domains.

## 7) Related Files
- `docs/ui-ux/10-easy-win-dashboard-catalog.md`
- `docs/ui-ux/11-planet-pulse-dashboard-spec.md`
- `docs/ui-ux/33-ui-implied-contracts-spec.md`
