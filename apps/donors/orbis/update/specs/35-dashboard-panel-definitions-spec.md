# Dashboard Panel Definitions Spec

Purpose: define standard panel composition for each dashboard so implementation is consistent and reusable.

## 🔒 v1 Implementation Baseline
Status: `Frozen for implementation start` (LockedOn: `2026-02-12`)

Lock rules:
1. Panel template IDs are append-only in v1.
2. Existing dashboard-to-panel mappings are baseline behavior.
3. Breaking remaps require explicit version bump and migration notes.

## 1) Panel Template Types

```ts
type PanelTemplateId =
  | "P1_StatusOverview"
  | "P2_TrendInsights"
  | "P3_MapField"
  | "P4_TableBreakdown"
  | "P5_RiskForecast"
  | "P6_ActionBar"
  | "P7_PreviewExplainability"
  | "P8_Diagnostics"
  | "P9_ComparisonDiff"
  | "P10_Timeline"

interface DashboardPanelDef {
  panelId: string
  templateId: PanelTemplateId
  requiredComponents: string[]
  optionalComponents: string[]
}
```

## 2) Template Composition

```ts
const PANEL_TEMPLATES: Record<PanelTemplateId, DashboardPanelDef> = {
  P1_StatusOverview: {
    panelId: "status_overview",
    templateId: "P1_StatusOverview",
    requiredComponents: ["SectionHeader", "StatusBadgeRow", "KpiCardGrid"],
    optionalComponents: ["RiskFlagList"]
  },
  P2_TrendInsights: {
    panelId: "trend_insights",
    templateId: "P2_TrendInsights",
    requiredComponents: ["SectionHeader", "TrendLineChart"],
    optionalComponents: ["ForecastBandCard"]
  },
  P3_MapField: {
    panelId: "map_field",
    templateId: "P3_MapField",
    requiredComponents: ["SectionHeader"],
    optionalComponents: ["HeatmapPanel", "VectorMapPanel"]
  },
  P4_TableBreakdown: {
    panelId: "table_breakdown",
    templateId: "P4_TableBreakdown",
    requiredComponents: ["SectionHeader", "TablePanel"],
    optionalComponents: ["TagChipList", "EntityCard"]
  },
  P5_RiskForecast: {
    panelId: "risk_forecast",
    templateId: "P5_RiskForecast",
    requiredComponents: ["SectionHeader", "RiskFlagList", "ForecastBandCard"],
    optionalComponents: ["ExplainabilityDrawer"]
  },
  P6_ActionBar: {
    panelId: "action_bar",
    templateId: "P6_ActionBar",
    requiredComponents: ["CommandBar"],
    optionalComponents: []
  },
  P7_PreviewExplainability: {
    panelId: "preview_explainability",
    templateId: "P7_PreviewExplainability",
    requiredComponents: ["PreviewDrawer", "ExplainabilityDrawer"],
    optionalComponents: []
  },
  P8_Diagnostics: {
    panelId: "diagnostics",
    templateId: "P8_Diagnostics",
    requiredComponents: ["DiagnosticsPanel"],
    optionalComponents: ["TablePanel"]
  },
  P9_ComparisonDiff: {
    panelId: "comparison_diff",
    templateId: "P9_ComparisonDiff",
    requiredComponents: ["DiffPanel"],
    optionalComponents: ["TrendLineChart"]
  },
  P10_Timeline: {
    panelId: "timeline",
    templateId: "P10_Timeline",
    requiredComponents: ["TimelineRail", "TablePanel"],
    optionalComponents: ["DiffPanel"]
  }
}
```

## 3) Dashboard-to-Panel Mapping

```ts
const DASHBOARD_PANELS: Record<string, PanelTemplateId[]> = {
  planet_pulse: ["P1_StatusOverview", "P2_TrendInsights", "P5_RiskForecast", "P6_ActionBar"],
  atmosphere_console: ["P1_StatusOverview", "P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  wind_weather_viewer: ["P3_MapField", "P4_TableBreakdown", "P6_ActionBar"],
  ocean_currents_viewer: ["P3_MapField", "P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  biome_stability_atlas: ["P3_MapField", "P5_RiskForecast", "P6_ActionBar"],
  species_viewer: ["P1_StatusOverview", "P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  food_web_dashboard: ["P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  invasive_disease_watch: ["P3_MapField", "P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  civilization_pulse: ["P1_StatusOverview", "P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  settlement_viability_map: ["P3_MapField", "P4_TableBreakdown", "P6_ActionBar"],
  trade_supply_lanes: ["P3_MapField", "P4_TableBreakdown", "P5_RiskForecast", "P6_ActionBar"],
  conflict_forecast_board: ["P3_MapField", "P5_RiskForecast", "P6_ActionBar"],
  event_forge_v2: ["P4_TableBreakdown", "P5_RiskForecast", "P7_PreviewExplainability", "P6_ActionBar"],
  arc_composer_timeline: ["P10_Timeline", "P7_PreviewExplainability", "P6_ActionBar"],
  region_story_cards: ["P1_StatusOverview", "P5_RiskForecast", "P6_ActionBar"],
  solver_validity_monitor: ["P8_Diagnostics", "P4_TableBreakdown", "P6_ActionBar"],
  determinism_replay_integrity: ["P8_Diagnostics", "P2_TrendInsights", "P6_ActionBar"],
  benchmark_scenarios_panel: ["P8_Diagnostics", "P4_TableBreakdown", "P6_ActionBar"],
  parameter_provenance_explorer: ["P4_TableBreakdown", "P6_ActionBar"],
  tag_explorer: ["P4_TableBreakdown", "P2_TrendInsights", "P6_ActionBar"],
  world_compare_ab: ["P9_ComparisonDiff", "P2_TrendInsights", "P6_ActionBar"]
}
```

## 4) Panel Behavior Rules
1. Every dashboard must include `P6_ActionBar`.
2. Dashboards with forecast output must include `P5_RiskForecast` and link to explainability.
3. Dashboards supporting canon commits must include `P7_PreviewExplainability`.
4. Runtime trust dashboards must include `P8_Diagnostics`.
5. Branch comparison workflows must include `P9_ComparisonDiff`.

## 5) Validation Checklist
- [ ] All dashboard specs (`11-31`) have matching entries in `DASHBOARD_PANELS`.
- [ ] No panel uses components outside `docs/ui-ux/34-reusable-component-library-spec.md`.
- [ ] High-impact commands are always paired with preview panel templates.

## 6) Related Files
- `docs/ui-ux/34-reusable-component-library-spec.md`
- `docs/ui-ux/32-easy-win-dashboard-mockups.md`
- `docs/ui-ux/33-ui-implied-contracts-spec.md`
