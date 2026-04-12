# 131 Information Control And Media Engine

SpecTier: Contract

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`, `docs/brainstorm/130-narrative-and-myth-production-engine.md`, `docs/brainstorm/129-legitimacy-and-authority-engine.md`]
- `Owns`: [`MediaEngineInputsV1`, `MediaPropagationResultV1`]
- `Writes`: [`distribution/adoption deltas`, `distortion/polarization/fatigue outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/131-information-control-and-media-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`
- `SUPERCEDES`: `docs/brainstorm/86-information-narrative-engine.md` (distribution/control scope)

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.
## Purpose
Define how information is produced, distributed, distorted, trusted, suppressed, and converted into political effect.

## Context
This engine operationalizes narrative distribution after `130` and determines propagation velocity and contestation range.

## Core Principle

Truth does not determine adoption. Distribution does.

Narratives do not spread uniformly. They propagate through infrastructure, institutions, incentives, and trust networks with measurable latency, distortion, and decay.

## Transmission Chain

```text
source -> channel -> reach -> interpretation -> adoption
```

## Input Contract

```ts
type NarrativeArtifactIdV1 = string
type SourceIdV1 = string
type ChannelIdV1 = string

interface MediaEngineInputsV1 {
  narrativeArtifactId: NarrativeArtifactIdV1
  sourceId: SourceIdV1
  channelId: ChannelIdV1
  channelCapacityPPM: PpmInt
  channelLatencyTicks: TickInt
  censorshipIntensityPPM: PpmInt
  counterMessageIntensityPPM: PpmInt
  trustBaselinePPM: PpmInt
  regionConnectivityPPM: PpmInt
  messageLoadPPM: PpmInt
  attentionCapacityPPM: PpmInt
}
```

## Output Contract

```ts
interface MediaPropagationResultV1 {
  narrativeArtifactId: NarrativeArtifactIdV1
  reachedPopulationPPM: PpmInt
  adoptionDeltaPPM: SignedPpmInt
  distortionDeltaPPM: SignedPpmInt
  polarizationDeltaPPM: SignedPpmInt
  confidencePPM: PpmInt
  fatigueDeltaPPM: SignedPpmInt
}
```

## Information Is A Resource

Information objects must support:

- production
- channeling/distribution
- delivery cost
- reach
- distortion
- decay

## Channel Classes

- state broadcast
- institutional/clerical network
- market media
- local rumor mesh
- encrypted/underground network
- foreign relay network

Each channel has different throughput, latency, and trust profile.

## Source Classes

Sources may include:

- state authorities
- formal institutions
- factions
- intellectuals
- religious bodies
- foreign powers
- informal networks
- individuals

Each source has:

- credibility
- reach
- frequency
- agenda alignment

## Transmission Infrastructure

Propagation depends on carriers:

- roads and trade routes
- markets and assemblies
- print systems
- radio/broadcast
- digital mesh
- magical relay (setting-specific)
- rumor webs

Infrastructure quality affects:

- propagation speed
- distortion profile
- synchronization breadth

## Control Actions

Institutions and actors may:

- amplify narrative
- throttle/suppress narrative
- issue counter-frame
- jam competitor channels
- flood with noise
- declassify records

All actions must emit reason-coded effects and costs.

## Bandwidth and Saturation

Populations have finite attention capacity.

If message load exceeds attention capacity:

- processing fatigue rises
- trust collapses to prior in-group channels
- polarization susceptibility increases

## Trust and Credibility Rules

- repeated contradiction with lived outcomes reduces source trust
- transparent corrections can recover trust partially
- coercive suppression increases short-term silence but raises long-term distrust

Trust drivers include:

- tradition
- identity affinity
- past predictive accuracy
- institutional alignment

## Message Competition

Narratives can suppress each other via:

- ridicule and delegitimization
- censorship/legal pressure
- economic sanction
- algorithmic ranking priority
- spectacle/event hijacking

Competition outcomes modify adoption and distortion rates.

## Propagation Speed Regimes

- slow spread -> regional myths and local divergence
- fast spread -> civilizational narrative alignment
- near-instant spread -> synchronized shocks and rapid mass swings

## Distortion Over Distance

Uncontrolled channels accumulate mutation with hop count.  
Controlled channels reduce mutation but can increase credibility fragility if later exposed as manipulated.

## Geographic and Infrastructure Modulation

- low connectivity regions have slower spread and higher local narrative divergence
- high connectivity regions synchronize faster but can polarize faster under conflict framing

## Crisis Propagation Mode

When crisis intensity exceeds threshold:

- spread speed increases
- distortion risk increases
- polarization sensitivity increases

## Authority Coupling

- high legitimacy boosts official narrative propagation efficiency
- low legitimacy boosts alternative channel growth

## Media Capture Dynamics

Media capture can stabilize short-term control but increases long-term brittleness:

- suppressed contradictions accumulate
- delayed release shocks amplify unrest and legitimacy collapse

## Fragmentation Rule

When group-level information overlap drops below threshold:

- shared fact base collapses
- policy consensus probability drops
- civil fracture risk rises sharply

## External Influence

External actors can inject narratives with asymmetric effect, especially under low trust + high grievance conditions.

## Deterministic Constraints

- propagation order must be deterministic by `(tick, sourceId, channelId, regionId)`
- no non-seeded stochastic broadcast behavior
- identical inputs must produce identical spread outputs

## Cross-Layer Outputs

Feeds:

- `130` narrative adoption and myth hardening
- `129` legitimacy and obedience recalculation
- `96` fragmentation and civil conflict escalation
- `87` player-facing media/propaganda control surfaces

## Why This Matters

Without this engine, narratives are static labels.  
With this engine, belief becomes a transmissible, contested strategic resource.

## Compliance Vector (v1)
Input:
- `channelCapacityPPM = 800_000`
- `trustBaselinePPM = 600_000`
- `messageLoadPPM = 900_000`
- `attentionCapacityPPM = 700_000`
- `censorshipIntensityPPM = 200_000`

Expected:
- Reach remains high (`reachedPopulationPPM > 0`).
- Fatigue delta is positive (`fatigueDeltaPPM > 0`) due to overload.
- Adoption is reduced versus non-overload baseline under identical trust/reach inputs.

## Promotion Notes
- Supersedes: `docs/brainstorm/86-information-narrative-engine.md` (distribution/control scope).


