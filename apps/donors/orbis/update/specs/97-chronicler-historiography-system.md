# 97 Chronicler Historiography System (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`chronicler system contract`, `ledger-vs-chronicle dual archive model`]
- `Writes`: [`chronicle and historiography outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/97-chronicler-historiography-system.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model how civilizations record, reinterpret, preserve, suppress, and weaponize history over time.

## Core Principle
Maintain two parallel archives:
- canonical ledger (objective event truth)
- chronicled memory (interpreted, source-dependent narrative)

Divergence between these archives is a first-class simulation variable.

## Layer A: Canonical Event Ledger
The canonical ledger is deterministic and append-only.

Required fields:
```ts
interface CanonicalEventV1 {
  eventId: string
  worldId: string
  tick: number
  scope: "world" | "civ" | "faction" | "institution" | "actor"
  eventType: string
  actors: Record<string, string>
  causes: string[]
  outcome: Record<string, string | number | boolean>
  reasonCodes: number[]
}
```

## Layer B: Chronicled History
Chronicles are source-generated interpretations of canonical events.

```ts
interface ChronicleEntryV1 {
  chronicleId: string
  derivedFromEventId: string
  sourceId: string
  title: string
  tone: "heroic" | "tragic" | "neutral" | "bureaucratic" | "propagandist"
  blame: string[]
  heroes: string[]
  suppressedDetails: string[]
  narrativeClaims: Record<string, number>
}
```

## Chronicle Sources
Allowed source families:
- state media
- rebel media
- corporate media
- academic institutions
- religious authorities
- foreign influence networks

Each source has:
- reach
- credibility
- bias profile
- archival persistence policy

## Memory Drift Engine
Over time:
- factual granularity declines
- symbolic framing increases
- hero/villain concentration increases

Drift is deterministic and source-specific.

```ts
interface MemoryDriftRuleV1 {
  sourceType: string
  detailDecayPPMPerTick: number
  symbolismGainPPMPerTick: number
  suppressionBiasPPM: number
}
```

## Myth Solidification
Persistent narratives can become myth artifacts.

```ts
interface MythArtifactV1 {
  mythId: string
  originChronicleIds: string[]
  adoptionPPM: number
  identityEffectsPPM: Record<string, number>
  tabooEffectsPPM: Record<string, number>
}
```

Myths feed back into:
- trust
- legitimacy
- faction alignment
- diplomacy stance

## Selective Preservation
Regime/institution policy determines archival survival:
- preserve_all
- selective_preserve
- suppress_opposition
- purge_and_rewrite

Suppression does not delete canonical ledger, only chronicled visibility.

## Rediscovery Mechanics
Hidden/suppressed canonical events can re-enter public chronicle:
- archive leak
- scholarship breakthrough
- whistleblower chain

Rediscovery emits instability and reform pressure effects.

## UI Requirements (Log Screen)
Mandatory modes:
- timeline mode
- theme mode
- actor mode
- institution mode
- myth mode

Mandatory features:
- reality vs chronicle toggle
- causality trace drilldown
- era heatmap
- character legacy pages

## Auto-Writing Templates
Chronicles can be rendered via style packs:
- crisis report
- heroic saga
- bureaucratic memo
- propaganda bulletin

Template selection is source-dependent and deterministic.

## Determinism Requirements
- canonical event IDs stable and immutable
- chronicle generation order by `(tick, sourceId, eventId)`
- fixed-point weighting for claim emphasis
- no random text variation in authoritative mode

## Audit Events
```ts
interface HistoriographyAuditEventV1 {
  tick: number
  sourceId: string
  eventId: string
  chronicleId: string
  divergencePPM: number
  reasonCode: number
}
```

## Integration Loop
technology
-> pressure
-> ideology
-> factions
-> institutions
-> actors
-> narrative/perception
-> canonical events
-> chronicles and myths
-> back to trust/legitimacy/behavior

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
