# 110 Wonder Generator System (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`wonder generator model`, `wonder procedural generation contract`]
- `Writes`: [`generated wonder archetype outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/110-wonder-generator-system.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Generate unique civilization wonders that are historically durable, mechanically meaningful, and narratively persistent.

## Goals
- each wonder feels singular
- wonders affect simulation systems beyond cosmetic value
- most wonders survive long horizons unless major destruction events occur
- destroyed wonders still leave cultural/memory residue

## Core Principle
Wonders are long-lived civilizational anchors:
- material artifact
- institutional project
- symbolic narrative object

## Wonder Identity Contract
```ts
type WonderDomainV1 =
  | "architectural"
  | "scientific"
  | "religious"
  | "military"
  | "ecological"
  | "infrastructural"
  | "cultural"

interface WonderIdentityV1 {
  wonderId: string
  worldId: string
  civId: string
  domain: WonderDomainV1
  nameSeed: string
  eraCreated: number
  locationId: string
  uniquenessHash: string
}
```

## Generation Inputs
- civilization profile (ideology, institutions, government form)
- pressure context (what problem/opportunity the civ is facing)
- available tech set
- biome/geology/location constraints
- narrative context (myths, prior epochs, rivalries)

## Uniqueness Rules
- one canonical wonder per `wonderId`
- no duplicate wonder archetype in same civ within cooldown horizon
- global uniqueness score must pass threshold before acceptance
- stable deterministic naming from seed + civ + era + domain

## Wonder Blueprint Contract
```ts
interface WonderBlueprintV1 {
  blueprintId: string
  domain: WonderDomainV1
  prerequisites: string[] // tech/government/institution requirements
  buildCostPPM: {
    labor: number
    material: number
    political: number
  }
  constructionTicks: number
  effects: Array<{ key: string; deltaPPM: number }>
  narrativeHooks: string[]
  fragilityProfile: {
    warDamagePPM: number
    disasterDamagePPM: number
    neglectDecayPPM: number
  }
}
```

## Survival and Decay Model
Wonders track health and resilience:
```ts
interface WonderStateV1 {
  wonderId: string
  healthPPM: number
  resiliencePPM: number
  maintenancePPM: number
  legitimacyShieldPPM: number
  status: "active" | "damaged" | "ruined" | "restored"
}
```

Per tick:
- apply maintenance recovery
- apply environmental/war/disaster damage
- apply neglect decay if maintenance below threshold
- clamp health and update status

## “Usually Survives” Policy
Default balancing target:
- wonders should persist through routine unrest and moderate conflict
- only severe war, long neglect, or major catastrophe should cause ruin
- ruins remain persistent artifacts and continue narrative effects

## Wonder Effects (Systemic)
Wonder effects can modify:
- legitimacy
- cohesion
- tourism/trade complexity
- research speed
- military defense/projection
- restoration/extraction balance
- narrative trust and myth adoption

## Ruin and Legacy Mechanics
When ruined:
- material effects reduced or disabled
- memory effects persist (identity, myth, grievance, pride)
- restoration project can be initiated

```ts
interface WonderLegacyV1 {
  wonderId: string
  memoryEffectPPM: Record<string, number>
  grievanceEffectPPM: Record<string, number>
  restorationDifficultyPPM: number
}
```

## Event Hooks
Mandatory wonder events:
- `wonder_construction_started`
- `wonder_completed`
- `wonder_damaged`
- `wonder_ruined`
- `wonder_restored`
- `wonder_repurposed`

All emit reason codes and causality references.

## AI and Player Interaction
Actions:
- commission wonder
- fund maintenance
- militarize/protect wonder zone
- politicize wonder narrative
- restore ruin

Preview must show:
- cost horizon
- expected pressure effects
- risk of abandonment/damage
- faction/institution support and opposition

## UI Requirements
Wonder panel must show:
- origin and purpose
- current health and maintenance
- active effects
- historical timeline
- narrative interpretations (official vs contested)

## Determinism Requirements
- wonder generation is seed-driven and reproducible
- blueprint selection order is stable
- survival/decay equations use fixed-point ppm only
- identical world state + action path -> identical wonder lifecycle

## Validation Rules
- reject wonder creation if prerequisites fail
- reject duplicate uniquenessHash in same world scope
- reject effects outside bounded ranges
- reject invalid domain/location pairing

## MVP Slice
Start with:
- 3 wonder domains (`architectural`, `scientific`, `religious`)
- 1 wonder per civ max
- health + maintenance + ruin + restoration loop
- basic legacy effects into legitimacy/cohesion/trust

## TypeScript Interfaces (Implementation Draft)
```ts
export type WonderDomain =
  | "architectural"
  | "scientific"
  | "religious"
  | "military"
  | "ecological"
  | "infrastructural"
  | "cultural";

export type WonderStatus = "active" | "damaged" | "ruined" | "restored";

export interface WonderGeneratorInput {
  worldId: string;
  civId: string;
  tick: number;
  seed: bigint;
  eraLevel: number;
  domainBias: WonderDomain[];
  unlockedTechIds: string[];
  ideologyVectorPPM: Record<string, number>;
  pressureStatePPM: Record<string, number>;
  candidateLocationIds: string[];
}

export interface WonderBlueprint {
  blueprintId: string;
  domain: WonderDomain;
  requiredTechIds: string[];
  minEraLevel: number;
  buildCostPPM: {
    labor: number;
    material: number;
    political: number;
  };
  constructionTicks: number;
  effectsPPM: Array<{ key: string; deltaPPM: number }>;
  fragilityPPM: {
    warDamage: number;
    disasterDamage: number;
    neglectDecay: number;
  };
  narrativeHooks: string[];
}

export interface GeneratedWonder {
  wonderId: string;
  worldId: string;
  civId: string;
  name: string;
  domain: WonderDomain;
  locationId: string;
  eraCreated: number;
  uniquenessHash: string;
  blueprintId: string;
  status: WonderStatus;
  healthPPM: number;
  resiliencePPM: number;
  maintenancePPM: number;
  legitimacyShieldPPM: number;
  effectsPPM: Array<{ key: string; deltaPPM: number }>;
}

export interface WonderUpdateInput {
  wonder: GeneratedWonder;
  warIntensityPPM: number;
  disasterIntensityPPM: number;
  maintenanceSpendPPM: number;
}

export interface WonderUpdateResult {
  wonder: GeneratedWonder;
  emittedEventKeys: string[];
  emittedReasonCodes: number[];
}
```

## Procedural Functions (Deterministic Draft)
```ts
const PPM_ONE = 1_000_000;

function hash64(s: string): bigint {
  // Placeholder deterministic hash. Replace with your canonical 64-bit hash.
  let h = 1469598103934665603n;
  for (let i = 0; i < s.length; i++) h = (h ^ BigInt(s.charCodeAt(i))) * 1099511628211n;
  return h & 0xffff_ffff_ffff_ffffn;
}

function prngStep(state: bigint): bigint {
  // SplitMix64-style step.
  let z = (state + 0x9e3779b97f4a7c15n) & 0xffff_ffff_ffff_ffffn;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & 0xffff_ffff_ffff_ffffn;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & 0xffff_ffff_ffff_ffffn;
  return z ^ (z >> 31n);
}

function pickIndex(seed: bigint, count: number): number {
  if (count <= 0) throw new Error("count must be > 0");
  const n = Number(prngStep(seed) & 0x7fff_ffffn);
  return n % count;
}

function clampPPM(x: number): number {
  if (x < 0) return 0;
  if (x > PPM_ONE) return PPM_ONE;
  return x;
}

function buildWonderSeed(input: WonderGeneratorInput): bigint {
  return hash64(`${input.worldId}|${input.civId}|${input.tick}|${input.seed.toString()}`);
}

function eligibleBlueprints(
  input: WonderGeneratorInput,
  catalog: WonderBlueprint[]
): WonderBlueprint[] {
  const unlocked = new Set(input.unlockedTechIds);
  return catalog.filter((bp) =>
    bp.minEraLevel <= input.eraLevel &&
    bp.requiredTechIds.every((id) => unlocked.has(id))
  );
}

function scoreBlueprint(input: WonderGeneratorInput, bp: WonderBlueprint): number {
  // Simple deterministic utility: pressure need + ideology affinity.
  const unrest = input.pressureStatePPM["population.unrest"] ?? 0;
  const legitimacy = input.pressureStatePPM["governance.legitimacy"] ?? 0;
  const progress = input.ideologyVectorPPM["progress"] ?? 0;

  if (bp.domain === "religious") return unrest + (PPM_ONE - legitimacy);
  if (bp.domain === "scientific") return progress + (input.pressureStatePPM["science.research_speed"] ?? 0);
  if (bp.domain === "architectural") return legitimacy + (input.pressureStatePPM["culture.cohesion"] ?? 0);
  return legitimacy;
}

export function generateWonder(
  input: WonderGeneratorInput,
  catalog: WonderBlueprint[]
): GeneratedWonder {
  const candidates = eligibleBlueprints(input, catalog);
  if (candidates.length === 0) throw new Error("No eligible wonder blueprint");

  const baseSeed = buildWonderSeed(input);
  const ranked = [...candidates].sort((a, b) => {
    const da = scoreBlueprint(input, a);
    const db = scoreBlueprint(input, b);
    if (da !== db) return db - da;
    return a.blueprintId.localeCompare(b.blueprintId);
  });
  const blueprint = ranked[0];

  const locIdx = pickIndex(baseSeed ^ hash64("loc"), input.candidateLocationIds.length);
  const locationId = input.candidateLocationIds[locIdx];

  const nameSeed = prngStep(baseSeed ^ hash64(blueprint.blueprintId));
  const name = `The ${blueprint.domain} of ${nameSeed.toString(16).slice(0, 6).toUpperCase()}`;

  const wonderId = `wonder_${hash64(`${input.civId}|${blueprint.blueprintId}|${locationId}`).toString(16).slice(0, 12)}`;
  const uniquenessHash = hash64(`${input.worldId}|${name}|${locationId}`).toString(16);

  const resilienceBase = 650_000 + (pickIndex(baseSeed ^ hash64("res"), 250_000)); // 0.65..0.90

  return {
    wonderId,
    worldId: input.worldId,
    civId: input.civId,
    name,
    domain: blueprint.domain,
    locationId,
    eraCreated: input.eraLevel,
    uniquenessHash,
    blueprintId: blueprint.blueprintId,
    status: "active",
    healthPPM: PPM_ONE,
    resiliencePPM: resilienceBase,
    maintenancePPM: 500_000,
    legitimacyShieldPPM: 150_000,
    effectsPPM: blueprint.effectsPPM
  };
}

export function updateWonderState(
  input: WonderUpdateInput,
  blueprint: WonderBlueprint
): WonderUpdateResult {
  const w = { ...input.wonder };
  const events: string[] = [];
  const codes: number[] = [];

  const warDamage = (input.warIntensityPPM * blueprint.fragilityPPM.warDamage) / PPM_ONE;
  const disasterDamage = (input.disasterIntensityPPM * blueprint.fragilityPPM.disasterDamage) / PPM_ONE;
  const neglectPenalty = ((PPM_ONE - input.maintenanceSpendPPM) * blueprint.fragilityPPM.neglectDecay) / PPM_ONE;
  const resilienceAbsorb = (w.resiliencePPM * 300_000) / PPM_ONE;

  const grossDamage = warDamage + disasterDamage + neglectPenalty;
  const netDamage = Math.max(0, grossDamage - resilienceAbsorb);
  const recovery = (input.maintenanceSpendPPM * 80_000) / PPM_ONE;

  w.healthPPM = clampPPM(w.healthPPM - netDamage + recovery);
  w.maintenancePPM = input.maintenanceSpendPPM;

  const prevStatus = w.status;
  if (w.healthPPM <= 200_000) w.status = "ruined";
  else if (w.healthPPM <= 550_000) w.status = "damaged";
  else if (prevStatus === "ruined" && w.healthPPM >= 700_000) w.status = "restored";
  else w.status = "active";

  if (prevStatus !== w.status) {
    if (w.status === "damaged") { events.push("wonder_damaged"); codes.push(110201); }
    if (w.status === "ruined") { events.push("wonder_ruined"); codes.push(110301); }
    if (w.status === "restored") { events.push("wonder_restored"); codes.push(110401); }
  }

  return { wonder: w, emittedEventKeys: events, emittedReasonCodes: codes };
}
```

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
