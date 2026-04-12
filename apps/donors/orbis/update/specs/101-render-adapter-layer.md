# 🔒 RENDER ADAPTER LAYER SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/40-actions-gameplay/99-dice-orchestration-bridge.md`, `docs/specs/40-actions-gameplay/100-roguejs-orbis-responsibility-matrix.md`, `docs/specs/60-projection-performance/24-performance-lod.md`]
- `Owns`: [`Dice101RenderProfileV1`, `Dice101AdapterStatusV1`, `Dice101EffectPresetV1`, `Dice101AdapterRequestV1`, `Dice101AdapterCompletionV1`, `Dice101TelemetryV1`]
- `Writes`: `[]`

## Purpose
Define the boundary layer that translates authoritative runtime envelopes into renderer payloads and completion signals, without granting gameplay authority to renderer/physics subsystems.

## Design Critique (Applied)
The Three.js/TypeScript ecosystem is high leverage only when ownership remains strict:
- physics, effects, cameras, and asset loaders stay in presentation only.
- gameplay authority remains in Orbis + Rogue runtime.
- renderer acts as deterministic consumer of authoritative envelopes.

Failure mode to avoid:
- physics-driven gameplay outcomes (desync risk, replay breakage, platform drift).

## Owned Contracts
```ts
type Dice101RenderProfileV1 = "desktop" | "mobile" | "low_power"
type Dice101AdapterStatusV1 = "done" | "degraded" | "failed" | "timeout"
type Dice101EffectPresetV1 = "none" | "combat_standard" | "combat_heavy" | "critical_hit"

interface Dice101AdapterRequestV1 {
  requestId: string
  actionId: string
  adapterContractVersion: string
  profile: Dice101RenderProfileV1
  effectPreset: Dice101EffectPresetV1
  cameraScriptId?: string
  overloadHint?: boolean
}

interface Dice101TelemetryV1 {
  fpsAvg: number
  droppedFrames: number
  settleMs: number
  fallbackTier?: "full_3d" | "low_poly" | "chip_2d"
}

interface Dice101AdapterCompletionV1 {
  requestId: string
  actionId: string
  status: Dice101AdapterStatusV1
  durationMs: number
  reasonCode?: number
  telemetry: Dice101TelemetryV1
}
```

## Canonical Flow Contract
`Orbis authority -> Rogue runtime -> render adapter -> Three.js scene -> completion envelope -> runtime resume`

Completion is acknowledgment only, never authority.

## Responsibilities
- Convert canonical action/result envelopes to renderer-safe payloads.
- Preserve stable ids across request, scene node, and completion envelope.
- Apply deterministic degradation ladder when budgets/capabilities fail.
- Emit reason-coded failure metadata for diagnostics.

## Non-Responsibilities
- No combat math.
- No policy/AI scoring.
- No RNG authority.
- No canonical state mutation.

## Curated Ecosystem Profile
Primary:
- `cannon-es` or `@dimforge/rapier3d-compat`
- `three-mesh-bvh`
- `postprocessing`

Secondary:
- `gsap`, `camera-controls`, `three-stdlib`

Optional:
- `react-three-fiber` (UI bridge only)
- `bitecs` (view-side ECS only)
- `three-pathfinding` (local cinematic movement only)

## Library Selection Rules
- Mobile/low-power profile: lower rigid-body count and reduced post effects.
- Large battle profile: prefer Rapier for high body count throughput.
- Dice-focused profile: `cannon-es` preferred for ecosystem fit and face alignment workflows.
- Never run multiple physics authorities for gameplay-relevant objects in same tick.

## Asset Pipeline Rules
- Use glTF loading path with optional Draco compression for heavy geometry.
- Enforce strict allowlist for remote assets/themes.

## Deterministic Versioning Gate
- Adapter handshake MUST verify `adapterContractVersion`.
- On mismatch or failed handshake: enforce `degraded` profile immediately.
- No silent behavior changes are allowed.

## Degradation Ladder
1. Disable heavy post effects.
2. Reduce rigid body quality/count.
3. Switch to low-poly path.
4. Use deterministic 2D chip fallback.

Rule:
- Degradation never changes canonical outcome values.

## Completion Signal Contract
Every completion event must include:
- `requestId`
- `actionId`
- `status`
- `durationMs`
- `reasonCode` when `status != done`
- `telemetry`

`done` acknowledges visual completion only.

## Performance and Security Policy
- Desktop target frame budget: `<=16.7ms`.
- Mobile/low-power targets may use relaxed budget but must remain deterministic.
- Asset allowlist required.
- No dynamic eval.
- Adapter payload sanitization required before GPU submission.

## Do-Not-Adopt List
- Unity-like gameplay frameworks that own simulation rules.
- State managers that replace Orbis/Rogue authority boundaries.
- Any path where physics outcomes are treated as canonical gameplay outcomes.

## Compliance Vector (v1)
Input:
- canonical outcome already resolved (`roll=[19]`, damage=`12`)
- adapter receives overload hint on mobile profile

Expected:
- completion status `degraded`,
- telemetry includes fallback tier,
- canonical outcome remains unchanged.

## Compliance Vector (v1b)
Input:
- unsupported adapter contract version

Expected:
- adapter completion status `failed` or `degraded` with reason code,
- runtime continues via deterministic fallback path.

## Promotion Notes
- No predecessor; new canonical contract.
- Integrated with spec 24 for LOD policy.
- Final renderer boundary gate for Three.js/Rogue integration.
- Supersedes ad-hoc renderer glue behavior from legacy `92` contract line.
- Canonical boundary now enforced in `101`.
