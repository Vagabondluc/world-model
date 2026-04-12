# 🔒 SPECIES TEMPLATE & PROCEDURAL BIOLOGY CONTRACT v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

Goal:
Generate species deterministically from core genetic lines, modules, environmental constraints, trophic roles, tag ontology, and energy constraints.

---

## 0️⃣ Goal

Generate species deterministically from core genetic lines, modules, environmental constraints, trophic roles, tag ontology, and energy constraints.

---

## 1️⃣ Species Identity & Determinism

### SpeciesId Type

Canonical source: `docs/18-nomenclature.md` (`SpeciesId`).

The `SpeciesId` is derived deterministically from `SpeciesKey` via hash64.

### SpeciesKey Interface

```ts
interface SpeciesKey {
  worldSeed: uint64
  trunkId: uint32
  birthTick: uint64         // eco or geo tick depending on system
  parentSpeciesId: SpeciesId | null   // null if primordial
  branchIndex: uint32       // stable index in branching event
}
```

The `SpeciesKey` provides complete lineage tracking for deterministic species generation. Each field ensures reproducible species identity across different simulation runs.

### Hash64 Derivation

```ts
function deriveSpeciesId(speciesKey: SpeciesKey): SpeciesId {
  const hash = hash64(
    speciesKey.worldSeed,
    speciesKey.trunkId,
    speciesKey.birthTick,
    speciesKey.parentSpeciesId ?? "ROOT",
    speciesKey.branchIndex
  );
  return formatSpeciesId(speciesKey.trunkId, hash);
}
```

Determinism guarantees:
- Same `SpeciesKey` → same `SpeciesId`
- `SpeciesId` is derived deterministically from `SpeciesKey` via hash64
- No RNG state required

---

## 2️⃣ Trunk System (Core Genetic Lines)

### TrunkDef Interface

```ts
interface TrunkDef {
  trunkId: uint32
  requiredTags: TagInstance[]   // always present
  allowedModules: ModuleId[]    // module pool
  baselineParams: ParamSet      // metabolism, reproduction, etc
}
```

Trunks are the "physics constraints" for that life form. Examples include Prokaryote-like, Eukaryote-like, Fungi-like, Plant-like, and Animal-like.

### Trunk Types

#### Trunk Types

**Core Earth Trunks:**
- Prokaryote-like
- Eukaryote-like
- Fungi-like
- Plant-like
- Animal-like

**Fantasy Extensions:**
- Elemental-like
- Undead-like
- Construct-like

All trunks remain typed and define the physics constraints for that life form.

---

## 3️⃣ Module System (Anatomy/Physiology Building Blocks)

### ModuleDef Interface

```ts
type ModuleId = uint32

interface ModuleDef {
  moduleId: ModuleId
  requiresTags?: TagQuery
  forbidsTags?: TagQuery
  addsTags: TagInstance[]
  paramDeltas: ParamDelta[]
  energyCostPPM: uint32
  complexityPPM: uint32
}
```

A module is a named bundle of tags, parameter deltas, prerequisites, incompatibilities, and energy costs. Modules are what make species feel "designed" but still emergent.

### Example Modules

- Photosynthesis
- Endothermy
- Exoskeleton
- Flight
- Venom
- ToolGrip
- SocialCognition

---

## 4️⃣ SpeciesTemplate Output (Must-Have Fields)

### SpeciesTemplate Interface

```ts
interface SpeciesTemplate {
  speciesId: SpeciesId
  trunkId: uint32

  tags: TagInstance[]          // sorted by tagId
  modules: ModuleId[]          // sorted

  // Ecology
  trophicRole: TrophicRoleId
  dietProfile: DietProfile     // quantized
  habitatPrefs: HabitatPrefs   // tag queries + weights

  // Core Params (all quantized)
  params: {
    bodySizePPM: uint32
    metabolismPPM: uint32
    reproductionRatePPM: uint32
    lifespanPPM: uint32
    mobilityPPM: uint32
    intelligencePPM: uint32
    socialityPPM: uint32
    aggressionPPM: uint32
    resiliencePPM: uint32
  }

  // Constraints
  viability: ViabilityFlags
  nicheSignature: uint64       // hash of tags+params for dedup
}
```

Everything is quantized. No floats.

### DietProfile Interface

```ts
interface DietProfile {
  primaryDiet: string; // "herbivore", "carnivore", "omnivore", "detritivore"
  secondaryDiet?: string;
  preySizeRange: [number, number]; // [min, max] relative to self
  plantTypes: string[]; // ["broadleaf", "conifer", "grass", "algae", etc.]
}
```

### SpeciesParams (Quantized PPM)

All species parameters are quantized as PPM (Parts Per Million) values to ensure deterministic behavior:

```ts
interface SpeciesParams {
  bodySizePPM: uint32           // Physical size
  metabolismPPM: uint32         // Energy consumption rate
  reproductionRatePPM: uint32   // Reproduction frequency
  lifespanPPM: uint32           // Maximum lifespan
  mobilityPPM: uint32           // Movement capability
  intelligencePPM: uint32       // Cognitive capacity
  socialityPPM: uint32          // Social behavior tendency
  aggressionPPM: uint32         // Aggression level
  resiliencePPM: uint32         // Environmental tolerance
}
```

### TagInstance Interface

Canonical source: `docs/38-unified-tag-system.md` (`TagInstance`).

### TagQuery Interface

```ts
interface TagQuery {
  require: TagInstance[]
  exclude: TagInstance[]
}
```

### ParamDelta Interface

```ts
interface ParamDelta {
  param: keyof SpeciesParams
  deltaPPM: int32  // can be negative
}
```

### ParamSet Interface

```ts
interface ParamSet {
  bodySizePPM: uint32
  metabolismPPM: uint32
  reproductionRatePPM: uint32
  lifespanPPM: uint32
  mobilityPPM: uint32
  intelligencePPM: uint32
  socialityPPM: uint32
  aggressionPPM: uint32
  resiliencePPM: uint32
}
```

### ViabilityFlags Interface

```ts
interface ViabilityFlags {
  // Hard fail flags (species cannot exist)
  noEnergyStrategy: boolean      // neither producer nor consumer
  habitatMismatch: boolean       // no water tolerance in marine-only world
  oxygenToleranceFail: boolean   // atmosphere requires oxygen but species is anaerobic

  // Soft fail flags (species exists but unstable)
  energyDeficit: boolean         // too high metabolism for available energy
  lowReproduction: boolean       // too low reproduction for high mortality niche
}
```

### Viability Rules

#### Hard Fail (cannot exist)
- No energy strategy (neither producer nor consumer)
- Habitat tolerance mismatch (e.g., no water tolerance in marine-only world)
- Oxygen tolerance failure if atmosphere requires it

#### Soft Fail (exists but unstable)
- Too high metabolism for available energy
- Too low reproduction for high mortality niche

Soft fail sets flags and makes extinction likely.

### NicheSignature (Hash-based)

```ts
type NicheSignature = uint64
```

The `nicheSignature` is a `uint64` hash of tags+params used for deduplication. This allows the system to identify when two species occupy the same ecological niche and can be merged or reused.

```ts
function calculateNicheSignature(
  tags: TagInstance[],
  params: SpeciesParams
): uint64 {
  const data = JSON.stringify({ tags, params });
  return hash64(data);
}
```

---

## 5️⃣ Trophic Role Assignment (Deterministic)

### TrophicRoleId Enum

```ts
enum TrophicRoleId {
  PrimaryProducer,
  Decomposer,
  Herbivore,
  Omnivore,
  Carnivore,
  ApexPredator,
  Parasite,
  FilterFeeder
}
```

### Derivation Rules

Role is derived from modules/tags:

- Photosynthetic ⇒ PrimaryProducer
- Decomposer module ⇒ Decomposer
- Venom + PredatorEfficiency high ⇒ Carnivore/Apex
- ToolUse + Omnivore ⇒ Omnivore bias

No randomness. If ambiguous, tie-break by tag priority + hash.

```ts
function deriveTrophicRole(
  trunkId: uint32,
  modules: ModuleId[],
  tags: TagInstance[]
): TrophicRoleId {
  // Producer detection
  if (modules.includes(MODULE_PHOTOSYNTHESIS) || modules.includes(MODULE_CHEMOSYNTHESIS)) {
    return TrophicRoleId.PrimaryProducer;
  }

  // Decomposer detection
  const saprotrophTag = tags.find(t => t.tagId === TAG_SAPROTROPH);
  const detritivoreTag = tags.find(t => t.tagId === TAG_DETRITIVORE);
  if (saprotrophTag || detritivoreTag) {
    return TrophicRoleId.Decomposer;
  }

  // Parasite detection
  const parasiticTag = tags.find(t => t.tagId === TAG_PARASITIC);
  if (parasiticTag) {
    return TrophicRoleId.Parasite;
  }

  // Herbivore detection
  const herbivoreTag = tags.find(t => t.tagId === TAG_HERBIVORE);
  const grazingTag = tags.find(t => t.tagId === TAG_GRAZING);
  if (herbivoreTag || grazingTag) {
    return TrophicRoleId.Herbivore;
  }

  // Carnivore detection
  const carnivoreTag = tags.find(t => t.tagId === TAG_CARNIVORE);
  const predatoryTag = tags.find(t => t.tagId === TAG_PREDATORY);
  if (carnivoreTag || predatoryTag) {
    const apexTag = tags.find(t => t.tagId === TAG_APEX);
    if (apexTag) {
      return TrophicRoleId.ApexPredator;
    }
    return TrophicRoleId.Carnivore;
  }

  // Omnivore detection
  const omnivoreTag = tags.find(t => t.tagId === TAG_OMNIVORE);
  if (omnivoreTag) {
    return TrophicRoleId.Omnivore;
  }

  // Fallback
  return TrophicRoleId.Omnivore;
}
```

---

## 6️⃣ Viability Rules (Hard Fail vs Soft Fail)

### ViabilityFlags Check

```ts
function checkViability(
  template: SpeciesTemplate,
  worldState: WorldState
): ViabilityFlags {
  const flags: ViabilityFlags = {
    noEnergyStrategy: false,
    habitatMismatch: false,
    oxygenToleranceFail: false,
    energyDeficit: false,
    lowReproduction: false
  };

  // Check energy strategy
  const hasProducer = template.modules.includes(MODULE_PHOTOSYNTHESIS) ||
                      template.modules.includes(MODULE_CHEMOSYNTHESIS);
  const hasConsumer = template.tags.some(t => t.tagId === TAG_HERBIVORE ||
                                                t.tagId === TAG_CARNIVORE ||
                                                t.tagId === TAG_OMNIVORE);
  
  if (!hasProducer && !hasConsumer) {
    flags.noEnergyStrategy = true;
  }

  // Check habitat compatibility
  const hasCompatibleHabitat = worldState.biomes.some(biome =>
    template.habitatPrefs.preferred.some(pref =>
      matchesBiome(pref.biomeQuery, biome.id)
    ) ||
    template.habitatPrefs.tolerated.some(tol =>
      matchesBiome(tol.biomeQuery, biome.id)
    )
  );

  if (!hasCompatibleHabitat) {
    flags.habitatMismatch = true;
  }

  // Check oxygen tolerance
  const anaerobicTag = template.tags.find(t => t.tagId === TAG_ANAEROBIC);
  const obligateAerobeTag = template.tags.find(t => t.tagId === TAG_OBLIGATE_AEROBE);
  
  if (anaerobicTag && worldState.oxygenLevel > 10000) { // >1% oxygen
    flags.oxygenToleranceFail = true;
  }
  if (obligateAerobeTag && worldState.oxygenLevel < 50000) { // <5% oxygen
    flags.oxygenToleranceFail = true;
  }

  // Check energy budget
  const energyDemand = calculateEnergyDemandPPM(
    template.params,
    template.params.mobilityPPM
  );
  const energySupply = calculateEnergySupplyPPM(
    template.trophicRole,
    worldState.habitatQualityPPM,
    template.params
  );

  if (energyDemand > energySupply) {
    flags.energyDeficit = true;
  }

  // Check reproduction rate
  const mortalityRate = calculateMortalityRate(template.trophicRole);
  if (template.params.reproductionRatePPM < mortalityRate) {
    flags.lowReproduction = true;
  }

  return flags;
}

function isViable(flags: ViabilityFlags): boolean {
  // Hard fails prevent existence
  if (flags.noEnergyStrategy || flags.habitatMismatch || flags.oxygenToleranceFail) {
    return false;
  }
  // Soft fails allow existence but with instability
  return true;
}
```

### Viability Rules

#### Hard Fail (cannot exist)
- No energy strategy (neither producer nor consumer)
- Habitat tolerance mismatch (e.g., no water tolerance in marine-only world)
- Oxygen tolerance failure if atmosphere requires it

#### Soft Fail (exists but unstable)
- Too high metabolism for available energy
- Too low reproduction for high mortality niche

Soft fail sets flags and makes extinction likely.

---

## 7️⃣ Energy Budget Constraint (Cheap but Strong)

### Energy Budget Formulas

Each species has an energy budget calculated using quantized PPM values:

```ts
// Energy demand based on species characteristics
EnergyDemandPPM = metabolismPPM * bodySizePPM * activityFactor

// Energy supply based on trophic availability
EnergySupplyPPM = trophicAvailabilityPPM * efficiencyPPM
```

### Implementation

```ts
function calculateEnergyDemandPPM(
  params: SpeciesParams,
  mobilityPPM: uint32
): uint32 {
  // Activity factor derived from mobility
  const activityFactor = (mobilityPPM + 100000) / 100000; // 1.0 to 2.0 range
  
  return (params.metabolismPPM * params.bodySizePPM * activityFactor) >>> 0;
}

function calculateEnergySupplyPPM(
  trophicRole: TrophicRoleId,
  habitatQualityPPM: uint32,
  params: SpeciesParams
): uint32 {
  // Trophic availability based on role
  let trophicAvailabilityPPM: uint32;
  switch (trophicRole) {
    case TrophicRoleId.PrimaryProducer:
      trophicAvailabilityPPM = 1000000; // Solar/chemical energy
      break;
    case TrophicRoleId.Decomposer:
      trophicAvailabilityPPM = 500000; // Dead biomass
      break;
    case TrophicRoleId.Herbivore:
      trophicAvailabilityPPM = 300000; // Plant biomass
      break;
    case TrophicRoleId.Carnivore:
      trophicAvailabilityPPM = 150000; // Animal biomass
      break;
    case TrophicRoleId.ApexPredator:
      trophicAvailabilityPPM = 50000; // Limited prey
      break;
    default:
      trophicAvailabilityPPM = 100000;
  }

  // Efficiency based on habitat quality and species traits
  const efficiencyPPM = (habitatQualityPPM + params.resiliencePPM) / 2;
  
  return (trophicAvailabilityPPM * efficiencyPPM) >>> 0;
}
```

### Energy Deficit Check

If `EnergyDemandPPM > EnergySupplyPPM`:
- Viability flag: `energyDeficit` is set
- Population dynamics are penalized
- Extinction becomes more likely

This enforces trophic web math without simulating molecules.

---

## 8️⃣ Habitat Preference Model

### HabitatPrefs Interface

Species declare preference as weighted tag queries:

```ts
interface HabitatPrefs {
  preferred: Array<{ biomeQuery: TagQuery, weightPPM: uint32 }>
  tolerated: Array<{ biomeQuery: TagQuery, weightPPM: uint32 }>
  forbidden: TagQuery[]
}
```

Example:
- preferred: Tropical+Wet (weightPPM: 1000000)
- tolerated: Temperate (weightPPM: 500000)
- forbidden: Glacial

This integrates directly with colonization/refugia systems.

### Habitat Tag System

```ts
enum HabitatTag {
  // Climate
  TROPICAL = "tropical",
  TEMPERATE = "temperate",
  BOREAL = "boreal",
  ARCTIC = "arctic",
  DESERT = "desert",

  // Moisture
  RAINFOREST = "rainforest",
  FOREST = "forest",
  WOODLAND = "woodland",
  GRASSLAND = "grassland",
  SHRUBLAND = "shrubland",
  TUNDRA = "tundra",
  DESERT_ARID = "desert_arid",

  // Water
  AQUATIC_FRESHWATER = "aquatic_freshwater",
  AQUATIC_MARINE = "aquatic_marine",
  WETLAND = "wetland",
  RIPARIAN = "riparian",

  // Elevation
  LOWLAND = "lowland",
  MONTANE = "montane",
  ALPINE = "alpine",

  // Special
  CAVE = "cave",
  DEEP_SEA = "deep_sea",
  VOLCANIC = "volcanic",
  CRYSTALLINE = "crystalline"
}
```

### Habitat Derivation Rules

```ts
function deriveHabitatPrefs(
  trunkId: uint32,
  modules: ModuleId[],
  tags: TagInstance[]
): HabitatPrefs {
  const preferred: Array<{ biomeQuery: TagQuery, weightPPM: uint32 }> = [];
  const tolerated: Array<{ biomeQuery: TagQuery, weightPPM: uint32 }> = [];
  const forbidden: TagQuery[] = [];

  // Trunk-based habitats
  const trunk = TRUNKS.find(t => t.trunkId === trunkId);
  if (trunk?.requiredTags.some(t => t.tagId === TAG_AQUATIC)) {
    preferred.push({
      biomeQuery: { require: [{ tagId: TAG_FRESHWATER }, { tagId: TAG_MARINE }], exclude: [] },
      weightPPM: 1000000
    });
    forbidden.push({ require: [{ tagId: TAG_DESERT }, { tagId: TAG_ALPINE }], exclude: [] });
  }

  // Module-based habitats
  const photosynthesisModule = MODULES.find(m => m.moduleId === MODULE_PHOTOSYNTHESIS);
  if (modules.includes(MODULE_PHOTOSYNTHESIS)) {
    preferred.push({
      biomeQuery: { require: [{ tagId: TAG_RAINFOREST }, { tagId: TAG_FOREST }, { tagId: TAG_GRASSLAND }], exclude: [] },
      weightPPM: 800000
    });
    forbidden.push({ require: [{ tagId: TAG_CAVE }, { tagId: TAG_DEEP_SEA }], exclude: [] });
  }

  // Tag-based habitats
  const thermophileTag = tags.find(t => t.tagId === TAG_THERMOPHILE);
  if (thermophileTag) {
    preferred.push({
      biomeQuery: { require: [{ tagId: TAG_VOLCANIC }, { tagId: TAG_DEEP_SEA }], exclude: [] },
      weightPPM: 900000
    });
  }
  const xerophyteTag = tags.find(t => t.tagId === TAG_XEROPHYTE);
  if (xerophyteTag) {
    preferred.push({
      biomeQuery: { require: [{ tagId: TAG_DESERT }, { tagId: TAG_DESERT_ARID }], exclude: [] },
      weightPPM: 950000
    });
  }
  const hydrophileTag = tags.find(t => t.tagId === TAG_HYDROPHILE);
  if (hydrophileTag) {
    preferred.push({
      biomeQuery: { require: [{ tagId: TAG_WETLAND }, { tagId: TAG_RIPARIAN }], exclude: [] },
      weightPPM: 850000
    });
  }

  return { preferred, tolerated, forbidden };
}
```

---

## 9️⃣ Species Generation Pipeline (Deterministic)

### 7-Step Pipeline

Given a target biome context + niche gap:

1. Pick trunk via niche constraints (deterministic selection)
2. Build module set:
   - must include energy strategy module
   - must satisfy habitat constraints
   - must satisfy trophic slot needs
3. Compute params from trunk baseline + module deltas
4. Generate tags from trunk + modules + derived traits
5. Compute nicheSignature
6. Deduplicate: if nicheSignature already exists, reuse species (or merge)
7. Emit `SPECIES_CREATED` event

All selection uses stateless hash RNG keyed on:
- worldSeed
- parentSpeciesId
- branching tick
- niche gap id

But outputs are fully reproducible.

```ts
interface GenerationContext {
  worldSeed: uint64
  parentSpeciesId: SpeciesId | null
  birthTick: uint64
  branchIndex: uint32
  nicheGap: NicheGap
}

function generateSpeciesTemplate(
  context: GenerationContext
): SpeciesTemplate {
  // Step 1: Pick trunk via niche constraints
  const trunkId = selectTrunkForNiche(context.nicheGap);
  
  // Step 2: Build module set
  const modules = buildModuleSet(
    trunkId,
    context.nicheGap,
    context.worldSeed
  );
  
  // Step 3: Compute params from trunk baseline + module deltas
  const params = computeParams(trunkId, modules);
  
  // Step 4: Generate tags from trunk + modules + derived traits
  const tags = generateTags(trunkId, modules, params);
  
  // Step 5: Compute nicheSignature
  const nicheSignature = calculateNicheSignature(tags, params);
  
  // Step 6: Deduplicate
  const existingSpecies = findSpeciesByNicheSignature(nicheSignature);
  if (existingSpecies) {
    return existingSpecies; // Reuse existing species
  }
  
  // Step 7: Emit event
  const speciesId = deriveSpeciesId({
    worldSeed: context.worldSeed,
    trunkId,
    birthTick: context.birthTick,
    parentSpeciesId: context.parentSpeciesId,
    branchIndex: context.branchIndex
  });
  
  emitEvent({
    type: "SPECIES_CREATED",
    speciesId,
    nicheSignature,
    timestamp: context.birthTick
  });
  
  return {
    speciesId,
    trunkId,
    tags: sortTags(tags),
    modules: sortModules(modules),
    trophicRole: deriveTrophicRole(trunkId, modules, tags),
    dietProfile: deriveDietProfile(modules, tags),
    habitatPrefs: deriveHabitatPrefs(trunkId, modules, tags),
    params,
    viability: checkViability(/* ... */),
    nicheSignature
  };
}
```

### Stateless Hash RNG

```ts
function hash64(...values: (number | string)[]): uint64 {
  // Simple hash combining multiple values
  let hash = 0xCBF29CE484222325n; // FNV-1a 64-bit offset basis
  
  for (const value of values) {
    const str = String(value);
    for (let i = 0; i < str.length; i++) {
      hash ^= BigInt(str.charCodeAt(i));
      hash *= 0x100000001B3n; // FNV-1a 64-bit prime
    }
  }
  
  return Number(hash & 0xFFFFFFFFFFFFFFFFn);
}

function deterministicRNG(seed: uint64): () => uint64 {
  let state = seed;
  return () => {
    state = (state * 1103515245n + 12345n) & 0xFFFFFFFFFFFFFFFFn;
    return Number(state);
  };
}
```

---

## 🔟 Evolution Branching Compatibility

Branching is module mutation:
- add module
- drop module
- tweak param delta
- shift habitat preference

Rules:
- each branch changes limited complexityPPM
- branchIndex stable determines which mutation occurs

No heavy genetics. Still feels evolutionary.

```ts
interface BranchMutation {
  type: 'add' | 'remove' | 'tweak' | 'shift'
  moduleId?: ModuleId
  paramDelta?: ParamDelta
  habitatShift?: HabitatPrefs
  complexityCostPPM: uint32
}

function generateBranchMutations(
  parentTemplate: SpeciesTemplate,
  branchIndex: uint32,
  worldSeed: uint64
): BranchMutation[] {
  const rng = deterministicRNG(hash64(
    worldSeed,
    parentTemplate.speciesId,
    branchIndex
  ));
  
  const mutations: BranchMutation[] = [];
  const availableComplexity = 1000000; // Max complexity budget
  
  // Generate possible mutations based on branchIndex
  const mutationCount = (rng() % 3) + 1; // 1-3 mutations per branch
  
  for (let i = 0; i < mutationCount; i++) {
    const mutationType = rng() % 4;
    
    switch (mutationType) {
      case 0: // Add module
        const newModule = selectCompatibleModule(
          parentTemplate,
          availableComplexity
        );
        if (newModule) {
          mutations.push({
            type: 'add',
            moduleId: newModule.moduleId,
            complexityCostPPM: newModule.complexityPPM
          });
        }
        break;
        
      case 1: // Remove module
        if (parentTemplate.modules.length > 1) {
          const moduleToRemove = parentTemplate.modules[rng() % parentTemplate.modules.length];
          mutations.push({
            type: 'remove',
            moduleId: moduleToRemove,
            complexityCostPPM: 0
          });
        }
        break;
        
      case 2: // Tweak param
        const paramToTweak = ['bodySizePPM', 'metabolismPPM', 'mobilityPPM'][rng() % 3];
        const delta = (rng() % 20000) - 10000; // -10000 to +10000 PPM
        mutations.push({
          type: 'tweak',
          paramDelta: {
            param: paramToTweak as keyof SpeciesParams,
            deltaPPM: delta
          },
          complexityCostPPM: 0
        });
        break;
        
      case 3: // Shift habitat
        mutations.push({
          type: 'shift',
          habitatShift: shiftHabitatPrefs(parentTemplate.habitatPrefs),
          complexityCostPPM: 50000
        });
        break;
    }
  }
  
  return mutations;
}

function applyBranchMutations(
  parentTemplate: SpeciesTemplate,
  mutations: BranchMutation[]
): SpeciesTemplate {
  let newModules = [...parentTemplate.modules];
  let newParams = { ...parentTemplate.params };
  let newHabitatPrefs = { ...parentTemplate.habitatPrefs };
  
  for (const mutation of mutations) {
    switch (mutation.type) {
      case 'add':
        if (mutation.moduleId) {
          newModules.push(mutation.moduleId);
          const module = MODULES.find(m => m.moduleId === mutation.moduleId);
          if (module) {
            // Apply param deltas
            for (const delta of module.paramDeltas) {
              newParams[delta.param] = Math.max(0,
                (newParams[delta.param] || 0) + delta.deltaPPM
              );
            }
          }
        }
        break;
        
      case 'remove':
        if (mutation.moduleId) {
          newModules = newModules.filter(m => m !== mutation.moduleId);
        }
        break;
        
      case 'tweak':
        if (mutation.paramDelta) {
          newParams[mutation.paramDelta.param] = Math.max(0,
            newParams[mutation.paramDelta.param] + mutation.paramDelta.deltaPPM
          );
        }
        break;
        
      case 'shift':
        if (mutation.habitatShift) {
          newHabitatPrefs = mutation.habitatShift;
        }
        break;
    }
  }
  
  return {
    ...parentTemplate,
    modules: sortModules(newModules),
    params: newParams,
    habitatPrefs: newHabitatPrefs,
    tags: generateTags(parentTemplate.trunkId, newModules, newParams),
    nicheSignature: calculateNicheSignature(
      generateTags(parentTemplate.trunkId, newModules, newParams),
      newParams
    )
  };
}
```
    toModule: "Lung",
    probability: 0.5,
    requiredConditions: ["terrestrial_transition"]
  },
  {
    fromModule: "ColdBlooded",
    toModule: "Endothermy",
    probability: 0.2,
    requiredConditions: ["high_activity", "variable_climate"]
  }
];

function applyMutations(
  modules: string[],
  conditions: string[],
  rng: DeterministicRNG
): string[] {
  const newModules = [...modules];

  for (const rule of MUTATION_RULES) {
    if (newModules.includes(rule.fromModule)) {
      const conditionsMet = rule.requiredConditions?.every(c =>
        conditions.includes(c)
      ) ?? true;

      if (conditionsMet && rng.next() < rule.probability) {
        const index = newModules.indexOf(rule.fromModule);
        newModules[index] = rule.toModule;
      }
    }
  }

  return newModules;
}
```

---

## 1️⃣1️⃣ Civilization Emergence Hook

### Sapience Gates

```ts
interface SapienceGate {
  id: string;
  requiredModules: string[];
  requiredTags: string[];
  minSocialCognition: number;
  minToolUse: number;
  minPopulation: number;
}

const SAPIENCE_GATES: SapienceGate[] = [
  {
    id: "basic_sapience",
    requiredModules: ["SocialCognition"],
    requiredTags: ["cooperative"],
    minSocialCognition: 0.5,
    minToolUse: 0.3,
    minPopulation: 1000
  },
  {
    id: "advanced_sapience",
    requiredModules: ["SocialCognition", "ToolGrip"],
    requiredTags: ["cooperative", "language"],
    minSocialCognition: 0.8,
    minToolUse: 0.7,
    minPopulation: 10000
  },
  {
    id: "civilization",
    requiredModules: ["SocialCognition", "ToolGrip"],
    requiredTags: ["cooperative", "language", "agriculture"],
    minSocialCognition: 0.9,
    minToolUse: 0.9,
    minPopulation: 50000
  }
];
```

### SAPIENCE_EMERGENCE Event

```ts
interface SapienceEmergenceEvent {
  eventType: "SAPIENCE_EMERGENCE";
  speciesId: SpeciesId;
  gateId: string;
  timestamp: number;
  location: { x: number; y: number; z: number };
}

function checkSapienceEmergence(
  species: SpeciesTemplate,
  population: number,
  timestamp: number
): SapienceEmergenceEvent | null {
  for (const gate of SAPIENCE_GATES) {
    const modulesMet = gate.requiredModules.every(m => species.modules.includes(m));
    const tagsMet = gate.requiredTags.every(t => species.tags.includes(t));

    if (modulesMet && tagsMet && population >= gate.minPopulation) {
      return {
        eventType: "SAPIENCE_EMERGENCE",
        speciesId: species.speciesId,
        gateId: gate.id,
        timestamp,
        location: { x: 0, y: 0, z: 0 } // Derived from population center
      };
    }
  }

  return null;
}
```

---

## 1️⃣2️⃣ Bestiary Export Contract

### BestiaryEntry Interface

Canonical source: `docs/17-bestiary.md` (`BestiaryEntry`).

### Conversion Function

```ts
function templateToBestiaryEntry(
  template: SpeciesTemplate,
  lore: string[],
  variants: string[]
): BestiaryEntry {
  return {
    id: template.speciesId,
    name: template.name,
    scientificName: generateScientificName(template),
    commonName: generateCommonName(template),
    description: generateDescription(template),

    trunk: template.trunkId,
    modules: template.modules,
    tags: template.tags,

    size: template.params.size,
    speed: template.params.speed,
    energyDemand: template.params.energyDemandPPM,
    lifespan: template.params.lifespan,

    trophicRole: template.trophicRole,
    dietProfile: template.dietProfile,
    socialBehavior: deriveSocialBehavior(template),

    habitatPrefs: template.habitatPrefs,
    distribution: deriveDistribution(template),

    threatLevel: calculateThreatLevel(template),
    dangerNotes: generateDangerNotes(template),

    lore,
    variants
  };
}
```

---

## 1️⃣3️⃣ Modding Hooks

### New Trunks

```ts
interface ModTrunkDef extends TrunkDef {
  modId: string;
  version: string;
}

function registerModTrunk(modTrunk: ModTrunkDef): void {
  // Validate trunk definition
  validateTrunkDef(modTrunk);

  // Add to trunk registry
  TRUNKS.push(modTrunk);

  // Emit event
  emitEvent({
    type: "TRUNK_REGISTERED",
    trunkId: modTrunk.id,
    modId: modTrunk.modId
  });
}
```

### New Modules

```ts
interface ModModuleDef extends ModuleDef {
  modId: string;
  version: string;
}

function registerModModule(modModule: ModModuleDef): void {
  // Validate module definition
  validateModuleDef(modModule);

  // Add to module registry
  MODULES.push(modModule);

  // Emit event
  emitEvent({
    type: "MODULE_REGISTERED",
    moduleId: modModule.id,
    modId: modModule.modId
  });
}
```

### New Viability Rules

```ts
interface ViabilityRule {
  id: string;
  check: (template: SpeciesTemplate) => ViabilityResult;
  priority: number; // Higher = checked first
}

function registerViabilityRule(rule: ViabilityRule): void {
  VIABILITY_RULES.push(rule);
  VIABILITY_RULES.sort((a, b) => b.priority - a.priority);
}
```

### New Habitat Tags

```ts
function registerHabitatTag(tag: string, metadata: HabitatMetadata): void {
  HABITAT_TAGS[tag] = metadata;
}
```

### New Trophic Roles

```ts
function registerTrophicRole(role: TrophicRoleId, metadata: TrophicMetadata): void {
  TROPHIC_ROLES[role] = metadata;
}
```

---

## 1️⃣4️⃣ Minimal Must-Lock Tables (Implementation Checklist)

### Required Tables

To implement this spec you need these tables locked:

1. **TrunkDef[]** - Core genetic line definitions
   - `trunkId`, `requiredTags`, `allowedModules`, `baselineParams`

2. **ModuleDef[]** - Anatomy/physiology building blocks
   - `moduleId`, `requiresTags`, `forbidsTags`, `addsTags`, `paramDeltas`, `energyCostPPM`, `complexityPPM`

3. **DerivedTraitRules** - Rules for deriving tags from params
   - `paramThreshold`, `tagId`, `tagValue`

4. **TrophicRoleRules** - Trophic role assignment rules
   - `moduleRequirement`, `tagRequirement`, `role`, `priority`

5. **ViabilityRules** - Species viability check rules
   - `ruleId`, `checkFunction`, `isHardFail`

6. **NicheGapClassifier** - What niches exist in a biome
   - `biomeId`, `availableNiches`, `trophicSlots`, `energyAvailability`

### NicheGapClassifier Interface

The `NicheGapClassifier` identifies available ecological niches within a biome for species generation:

```ts
interface NicheGap {
  nicheId: uint64
  trophicRole: TrophicRoleId
  requiredTags: TagInstance[]
  forbiddenTags: TagInstance[]
  energyBudgetPPM: uint32
  sizeRangePPM: [uint32, uint32]  // [min, max]
  populationCapacity: uint32
}

interface NicheGapClassifier {
  biomeId: uint64
  availableNiches: NicheGap[]
  occupiedNiches: uint64[]  // speciesIds occupying niches
  energyAvailabilityPPM: uint32
}

function classifyNicheGaps(
  biomeId: uint64,
  existingSpecies: SpeciesTemplate[],
  worldState: WorldState
): NicheGapClassifier {
  // Analyze biome characteristics
  const biomeEnergy = calculateBiomeEnergy(biomeId, worldState);
  
  // Identify trophic slots
  const trophicSlots = calculateTrophicSlots(biomeId, biomeEnergy);
  
  // Determine available niches (unoccupied or underutilized)
  const occupiedNicheSignatures = new Set(
    existingSpecies.map(s => s.nicheSignature)
  );
  
  const availableNiches: NicheGap[] = [];
  for (const slot of trophicSlots) {
    const isOccupied = existingSpecies.some(s =>
      s.trophicRole === slot.trophicRole &&
      s.habitatPrefs.preferred.some(p =>
        matchesBiome(p.biomeQuery, biomeId)
      )
    );
    
    if (!isOccupied || slot.capacity > 1) {
      availableNiches.push({
        nicheId: hash64(biomeId, slot.trophicRole, slot.tier),
        trophicRole: slot.trophicRole,
        requiredTags: slot.requiredTags,
        forbiddenTags: slot.forbiddenTags,
        energyBudgetPPM: slot.energyBudget,
        sizeRangePPM: slot.sizeRange,
        populationCapacity: isOccupied ? slot.capacity - 1 : slot.capacity
      });
    }
  }
  
  return {
    biomeId,
    availableNiches,
    occupiedNiches: existingSpecies.map(s => s.speciesId),
    energyAvailabilityPPM: biomeEnergy
  };
}
```

The `NicheGapClassifier` is used in the species generation pipeline to select appropriate niches for new species.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
