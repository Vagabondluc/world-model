# 🔒 CANONICAL METRIC REGISTRY SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/77-registry-reason-codes.md`, `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`]
- `Owns`: [`MetricKeyV1`, `MetricUnitV1`, `MetricBoundPPM`, `MetricDefV1`, `MetricRegistryV1`]
- `Writes`: [`canonical metric definitions`]

## Purpose
Provide one canonical registry for shared simulation/governance metrics to prevent cross-spec drift.

## Type Contracts
```ts
type MetricKeyV1 =
  | "legitimacy"
  | "unrest"
  | "divergence"
  | "pressure"
  | "clout"
  | "asabiya"
  | "authority_effective"

type MetricUnitV1 = "ppm"

interface MetricBoundPPM {
  minPPM: PpmInt
  maxPPM: PpmInt
}

interface MetricDefV1 {
  metric: MetricKeyV1
  unit: MetricUnitV1
  bounds: MetricBoundPPM
  ownerSpec: string
  updateCadence: "tick" | "epoch" | "event"
  readsBy: string[]
}

interface MetricRegistryV1 {
  version: "v1"
  metrics: MetricDefV1[]
}
```

## Canonical Registry (v1)
| Metric | Unit | Bounds | Owner | Cadence | Reads By |
|---|---|---|---|---|---|
| `legitimacy` | ppm | `0..1_000_000` | `84-legitimacy-and-authority-engine.md` | tick | `81,82,83,85,88` |
| `unrest` | ppm | `0..1_000_000` | `79-impact-propagation-engine.md` | tick | `80,81,82,83,84,88` |
| `divergence` | ppm | `0..1_000_000` | `85-narrative-and-myth-production-engine.md` | tick | `86,87,88,109` |
| `pressure` | ppm | `0..1_000_000` | `79-impact-propagation-engine.md` | tick | `80,81,82,83,84,88` |
| `clout` | ppm | `0..1_000_000` | `84-legitimacy-and-authority-engine.md` | tick | `80,83,88` |
| `asabiya` | ppm | `0..1_000_000` | `84-legitimacy-and-authority-engine.md` | tick | `80,83,84,88` |
| `authority_effective` | ppm | `0..1_000_000` | `84-legitimacy-and-authority-engine.md` | tick | `82,83,88` |

## Rules
- All listed metrics are bounded and saturating-clamp.
- No spec may redefine bounds for these keys locally.
- Extensions must append new keys in a versioned registry update.

## Compliance Vector (v1)
Input:
- metric lookup: `clout`

Expected:
- unit is `ppm`
- bounds are exactly `0..1_000_000`
- owner is `84-legitimacy-and-authority-engine.md`

## Promotion Notes
- No predecessor; new canonical contract.
