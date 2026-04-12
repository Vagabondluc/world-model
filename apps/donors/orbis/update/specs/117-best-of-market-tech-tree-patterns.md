# 117 Best Of Market Tech Tree Patterns (Adoption Contract)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`market pattern shortlist`, `adopted pattern rationale`]
- `Writes`: [`pattern adoption decisions`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/117-best-of-market-tech-tree-patterns.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Lock exact market-derived tech-tree patterns for Orbis with unambiguous rules and acceptance checks.

## Status Keywords
- `MUST`: mandatory for authoritative mode
- `SHOULD`: recommended default
- `MAY`: optional extension

## Pattern Decisions
| Pattern | Decision | Orbis Rule |
|---|---|---|
| Era pacing (`Civ`) | `MUST ADOPT` | Research progression is era-gated in authoritative mode. |
| Gateway techs (`Civ`) | `MUST ADOPT` | Each era has explicit gateway nodes that unlock core branches. |
| Context boosts (`Civ VI Eurekas`) | `MUST ADOPT` | Boosts are deterministic and state-derived only. |
| Weighted research offers (`Stellaris`) | `MAY ADOPT` | Allowed only as deterministic offer-set generation; no non-deterministic draws. |
| Web specialization (`Endless/Beyond Earth`) | `SHOULD ADOPT` | Branch-web inside era bands, with bounded branch count. |
| Tech as societal force | `MUST ADOPT` | Every tech emits pressure impacts; no unlock-only nodes. |

## Hard Rules (Authoritative Mode)
- `MUST` use fixed-point ppm math for all tech effects.
- `MUST` produce identical offers/unlocks for identical `(seed, state, tick)`.
- `MUST` include reason-coded explainability for boosts and blocked research.
- `MUST NOT` use hidden random card draws in authoritative simulation.

## Concrete Defaults
- Era spillover cap: `<= 2` techs ahead of current era.
- Gateway count per era: `2..4`.
- Branch-web depth per era: `<= 3` prerequisite hops.
- Context boost magnitude cap: `<= 50%` of base research cost.
- Concurrent offered techs (if offer-set mode enabled): `3`.

## Mandatory Node Coverage
Each tech node `MUST` have:
- `prerequisites[]`
- at least `1` pressure emission (`79` axis key)
- at least `1` event/narrative hook
- at least `1` multiplier link (`104` key)

## Rejected Patterns
- Fully hidden/random research trees in authoritative mode.
- Pure cosmetic unlock trees with no causal outputs.
- Unbounded branch-web growth without era caps.

## Acceptance Tests
- Determinism: same seed/state/tick => same unlock set and boost outcomes.
- Coverage: `100%` of tech nodes satisfy mandatory node coverage.
- Balance: no era has fewer than `2` viable strategic branches.
- Explainability: each boost/lock decision returns reason code + driver.

## Immediate Actions
- Add gateway registry fields to `tech-tree-comprehensive-v1.md`.
- Add `research_context_modifiers` to tech node schema.
- Add coverage audit report: missing emissions/hooks/multipliers.
- Add deterministic offer-set contract if using weighted offer mode.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
