# Voxel Planet Documentation (Expanded from PDF)

This documentation system expands the source PDF into organized Markdown specs and implementation guides.

## Source
- `google ai studio help line - What is a Voxel.pdf`

## Structure
- `docs/01-voxel-fundamentals.md`: Core voxel concepts and tradeoffs
- `docs/02-typescript-voxel-core.md`: Minimal TypeScript voxel/chunk/world architecture
- `docs/03-hex-to-voxel-pipeline.md`: Hex biome authority to voxel terrain generation pipeline
- `docs/04-multi-scale-lod-model.md`: Multi-scale authority model (planet to tactical)
- `docs/05-planetary-scale-estimation.md`: Voxel count and memory estimation at planetary scales
- `docs/06-baked-texture-spec.md`: Canonical per-hex baked texture format spec
- `docs/07-subhex-grid-spec.md`: 3-mile parent-hex to sub-hex math and seam-safe rules
- `docs/08-data-contracts.md`: Versioned serialized data contracts
- `docs/09-test-and-determinism-spec.md`: Determinism and measurable acceptance tests
- `docs/10-edit-propagation-policy.md`: Local-to-authority edit lifecycle and policy
- `docs/11-gemini-crosswalk.md`: Mapping Gemini specs onto L0-L8 architecture
- `docs/12-geology-matter-matrix-spec.md`: Geologic voxel-to-matter ontology and resolver contract
- `docs/13-hydrology-erosion-sediment-spec.md`: Deterministic erosion/incision/transport kernels
- `docs/14-coastal-orchestrator-spec.md`: Long-term coastal feature evolution orchestration
- `docs/15-magnetosphere-dynamo-spec.md`: Optional planetary field and space-weather model
- `docs/16-semantic-overlay-resolver-spec.md`: Layered semantic override resolver contract
- `docs/17-runtime-lod-chunking-performance-spec.md`: Runtime chunk/LOD scheduler and performance architecture
- `docs/voxel-source/README.md`: Fresh extraction artifacts for the modified voxel source PDF
- `docs/glossary.md`: Shared terminology
- `docs/reports/spec-critique-brainstorm.md`: Audit findings and solution brainstorm
- `docs/reports/ui-spec-alignment-viewers-workspace.md`: UX/spec comparison and workspace-viewer refinement report
- `docs/reports/porting-viewers-workspace-refinements.md`: Portable reconstruction spec for workspace/viewer changes
- `docs/reports/tdd-spec-current-codebase.md`: Test-driven development blueprint derived from current implementation
- `docs/reports/spec-ambiguity-pass.md`: Ambiguity audit and decision requests across active specs
- `docs/reports/spec-ambiguity-resolution-brainstorm.md`: Resolution options and recommended decisions for ambiguity closure
- `docs/reports/voxel-pdf-resync-note.md`: Resync status and impact after voxel PDF source modification
- `docs/reports/docs-critique-features-and-ui-dials.md`: Doc architecture critique, feature brainstorm, and full simulation dial UI inventory
- `docs/reports/dial-ui-implementation-matrix.md`: Strict dial-to-UI/validation/persistence/telemetry handoff matrix
- `docs/gemini/README.md`: Expanded docs package for `Google Gemini.pdf`
- `docs/gemini-2/README.md`: Expanded docs package for `Google Gemini 2.pdf`
- `docs/gemini/01-framework-and-axes.md`: Curated framework spec from `Google Gemini.pdf`
- `docs/gemini-2/01-system-overview.md`: Curated technical spec from `Google Gemini 2.pdf`

## Recommended Read Order
1. `docs/01-voxel-fundamentals.md`
2. `docs/02-typescript-voxel-core.md`
3. `docs/03-hex-to-voxel-pipeline.md`
4. `docs/04-multi-scale-lod-model.md`
5. `docs/06-baked-texture-spec.md`
6. `docs/07-subhex-grid-spec.md`
7. `docs/08-data-contracts.md`
8. `docs/09-test-and-determinism-spec.md`
9. `docs/10-edit-propagation-policy.md`
10. `docs/12-geology-matter-matrix-spec.md`
11. `docs/13-hydrology-erosion-sediment-spec.md`
12. `docs/14-coastal-orchestrator-spec.md`
13. `docs/15-magnetosphere-dynamo-spec.md`
14. `docs/16-semantic-overlay-resolver-spec.md`
15. `docs/17-runtime-lod-chunking-performance-spec.md`
16. `docs/05-planetary-scale-estimation.md`
