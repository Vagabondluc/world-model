# 139 Macro-Economic Input-Output Model

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/104-civilization-multipliers-catalog.md`]
- `Owns`: [`economic sector interdependency matrix`, `resource shock propagation`]
- `Writes`: [`sector productivity`, `market equilibrium deltas`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/139-macro-economic-input-output-model.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a quantitative economic model that maps how shocks in one sector (e.g., Energy) ripple through the entire civilization using an Input-Output (I-O) matrix approach.

## 1. The Interdependency Matrix
The economy is divided into `N` sectors (Agriculture, Energy, Manufacturing, Services, R&D).

### 1.1 Technical Coefficients (Leontief)
- Each sector `j` requires inputs from sector `i` to produce one unit of output.
- Stored as `PpmInt` in a fixed-size `NxN` matrix.
- **MVP Sectors**:
  - **Primary**: Extraction, Agriculture.
  - **Secondary**: Industrial, Infrastructure.
  - **Tertiary**: Governance, Science.

## 2. Shock Propagation
When `environment.resource_availability` drops for a specific niche:
1. **Direct Impact**: Sector `i` output is reduced by `X` PPM.
2. **Matrix Ripple**: Every sector `j` that depends on `i` has its `EfficiencyModifier` reduced proportionally.
3. **Price/Need Feedback**: Shortages increase the `NeedWeight` for that sector's output in the Utility AI (Spec 138).

## 3. Equilibrium Scaling & Stability
- The simulation calculates the "Total Requirements Matrix" (Inverse Leontief) once every era.
- **Stability Clamping (Lyapunov)**: To prevent economic explosions, технические coefficients are capped such that the sum of any column in the input matrix must be `< 1,000,000 PPM`.
- **Bottleneck Detection**: If any sector's requirements exceed its output capacity, trigger `thr_economic_stagnation`.

## 4. Deterministic Integration
- **Fixed-Point Matrix Math**: Matrix multiplications use 64-bit integers to maintain precision.
- **Tick-Based Update**: Sector health is recalculated every `CivTick`.

## 5. Performance
- For `N=8` sectors, matrix operations are negligible (< 0.1ms).
- Matrix inverse is precomputed or cached.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
