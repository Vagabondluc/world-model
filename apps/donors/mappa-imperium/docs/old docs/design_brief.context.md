# Design Brief Context Overview

## Visual & Style Governance
- UI must strictly follow the canonical style guide in `docs/current/style_guide.md` for color, typography, and component rules.

## AI Template Integration Strategy
- Generate forms dynamically from template metadata; keep form components under 150 lines and push complex logic into hooks or utilities.
- Maintain template-specific size caps: response displays <=100 lines, template hooks <=120 lines, validation utilities <=80 lines.
- Provide a template-aware response renderer that swaps display components by template type and keeps formatting concerns isolated.

## File Size & Organization Standards
- Every PR reports file line counts; files over 200 lines require a decomposition plan and anything above 300 lines is rejected.
- Include a leading documentation header comment in every file so its purpose is explicit, satisfying the brief's checklist requirement.
- Favor feature-based folders (`components/`, `hooks/`, `utils/`) with single-responsibility files to avoid monoliths.
- Enforce limits via ESLint `max-lines`, pre-commit checks, CI failures beyond 300 lines, and an explicit review checklist.
- Run monthly audits by (1) generating the file-size report, (2) flagging files above 250 lines, (3) opening refactor tickets, and (4) revisiting guidelines for adjustments.

## Template Form & Continuity Systems
- Implement a reusable `TemplateForm` that maps required inputs into dynamic controls and centralizes submit handling.
- Build continuity tracking hooks that surface entity appearances, relationships, and causality chains across templates.

## Core UI Component Requirements
- `CompletionTracker` must label the overall progress bar with the current era and expose turn counts (for example, "Era IV Progress (Turn 3 of 6)").
- Add a tooltip clarifying that the main bar represents combined group progress for the active era.

## Component Backlog by Era
- Era I: `FeatureSelector`, `LandmassSelector`, `AIAdvicePanel`, `CustomResourceCreator`, `ResourcesList`, `EmojiPicker`.
- Era II: `DeityCreationWizard`, `PantheonRelationshipMapper`, `SacredSitePlacement`, `CulturalConsistencyChecker`, `PantheonExportView`.
- Era III: `FactionDevelopmentSuite`, `HeroLocationCreator`, `SettlementBuilder`, `NeighborRelationshipManager`, `TradeRouteVisualizer`.
- Eras IV-VI: `DiscoveryEventProcessor`, `LandmarkGenerator`, `EmpireEventChronicler`, `CollapseNarrativeBuilder`, `BattleChronicleSystem`.
- Cross-Era Systems: `WorldStateManager`, `ChronicleSystem`, `ExportEngine`, `QualityValidationSystem`, `ContinuityTracker`.

## Data & Processing Model
- Entity schema tracks id, type, owner, era, template metadata, relationship arrays (causal, cultural, geographic, political), and narrative summaries.
- `processTemplateResponse` selects template-specific parsers to extract the primary entity, related entities, narrative beats, relationships, and future hooks.

## Quality & Collaboration Focus
- `validateTemplateCompliance` pulls template-specific requirements via `getTemplateRequirements`, checks originality, detail specificity, causality, cultural fit, and continuity, then returns pass or fail plus remediation suggestions.
- Planned collaboration stack: real-time WebSocket sync, conflict resolution strategies, template-aware permissions, change broadcasting, and end-to-end version auditing.

## Testing Expectations
- Component tests must confirm template outputs match schema requirements and respect cultural alignment checks.
- Integration tests cover cross-template continuity, real-time collaboration, export fidelity, performance under maximum load, and automated compliance validation.
