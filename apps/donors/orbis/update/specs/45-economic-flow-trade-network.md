# 🔒 ECONOMIC FLOW & TRADE NETWORK SPEC v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

Derived from root `spec4.md` heading lock. This doc formalizes the missing contract.

## 0) Purpose

Convert geography, settlement suitability, movement cost, and resource generation into deterministic trade flows and economic pressure fields.

## 1) Core Entities

```ts
interface TradeNode {
  nodeId: uint64
  biomeId: uint64
  settlementTier: uint8
  productionPPM: uint32
  demandPPM: uint32
  storagePPM: uint32
}

interface TradeEdge {
  edgeId: uint64
  fromNodeId: uint64
  toNodeId: uint64
  travelCostPPM: uint32
  capacityPPM: uint32
  riskPPM: uint32
}
```

## 2) Deterministic Inputs

- settlement layer (`27-settlement-suitability.md`)
- movement/travel field (`28-movement-cost.md`)
- resource layer (`25-resource-generation.md`)
- hydrology/coast corridors (`20`, `21`)

## 3) Flow Solve (Per Tick)

For each commodity class, solve bounded flows:

```text
flow = min(edgeCapacity, sourceSurplus, sinkDemandAdjusted)
```

Priority order is deterministic:

1. lower travel cost
2. lower risk
3. higher sink deficit
4. stable tie-break by node/edge ID

## 4) Economic State Output

```ts
interface EconomicTickState {
  time: AbsTime
  nodeProsperityPPM: Record<uint64, uint32>
  nodeScarcityPPM: Record<uint64, uint32>
  edgeUtilizationPPM: Record<uint64, uint32>
  networkStabilityPPM: uint32
}
```

## 5) Coupling Rules

Economic outcomes emit world deltas only:

- migration pressure
- conflict pressure
- infrastructure growth/decay pressure
- extraction pressure

No direct mutation outside delta commit.

## 6) Shock Handling

Disaster events and domain mode changes may invalidate the network.
Rebuild rule:

- local rebuild first for affected regions
- full rebuild only if invalidation ratio exceeds threshold

## 7) Explainability

Expose per node:

- top imported deficits
- top exported surpluses
- bottleneck edges
- instability contributors

## 8) Performance Constraints

- bounded edge fan-out per node
- capped iterations per tick
- deterministic truncation when over budget

## 9) Modding

Mods may add:

- commodity classes
- adapter scoring tables
- demand/production modifiers

Mods may not:

- bypass deterministic ordering
- inject hidden mutable trade state

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
