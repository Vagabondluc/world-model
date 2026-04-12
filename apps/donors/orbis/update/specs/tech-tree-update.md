# Tech Tree Update (Normalization Brainstorm)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`tech-tree update notes`, `delta change set`]
- `Writes`: [`tech-tree revision summary`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/tech-tree-update.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Goal
Turn the current tech tree text into a deterministic, implementable progression contract.

## Current Gaps
- No explicit prerequisites graph.
- Mixed formats (table for levels 1-8, freeform after).
- Ambiguous `*` marker with no legend.
- Weak unlock/effect definitions after level 8.
- Inconsistent era realism/pacing.

## Recommended Canonical Schema
```ts
interface TechNodeV1 {
  id: string
  name: string
  eraLevel: number
  eraName: string
  category: "civil" | "military" | "industry" | "science" | "governance" | "space" | "meta"
  complexity_ppm: number
  prerequisites: string[]
  unlocks: {
    units?: string[]
    buildings?: string[]
    resources?: string[]
    modifiers?: Array<{ key: string; valuePPM: number; unit: string }>
  }
  cost: { science: number; production?: number }
  tags: string[]
  specialFlag?: "faction_lock" | "mutually_exclusive" | "victory_path" | "deprecated"
  notes?: string
}
```

## Priority Actions
- Assign stable IDs to every tech (`tech_001...`).
- Convert all eras to one machine-readable format (JSON/TS).
- Define `*` semantics and replace with explicit `specialFlag`.
- Add at least one clear gameplay unlock/effect to every node.
- Build prerequisite DAG and detect cycles.

## Coherence Pass Rules
- Keep one naming style (no near-duplicates without tier suffix).
- Normalize repeated concepts (factory, shield, armor, scanner lines).
- Make governance branch explicit (`confederation`/`imperium`/`federation`) as mutual-exclusion.
- Mark lore-only vs simulation-impact techs.

## Balance Heuristics
- Science cost growth per level should be monotonic.
- Military spikes must be mirrored by defensive counters within 1-2 levels.
- Economy multipliers must have caps to avoid runaway snowball.
- Late-game reality-warping techs should require chain prerequisites and high opportunity cost.

## Deliverables
- `docs/specs/40-actions-gameplay/77-tech-tree-contract.md` (new canonical spec).
- `docs/specs/40-actions-gameplay/78-tech-tree-dataset-v1.md` (normalized list).
- `docs/report/tech-tree-audit.md` (duplicates, missing unlocks, cycle checks).

## Definition of Done
- Every tech has ID, prerequisites, and unlock effects.
- Tree is acyclic and topologically sortable.
- Era transitions are coherent and documented.
- UI can render both graph view and era table from the same dataset.

## Draft Tech Tree (v0.1)
This is a concrete starting tree extracted from your source list, with explicit prerequisite chains.

### Core Trunk
- `L1 Pottery` -> `L2 Currency` -> `L4 Banking` -> `L5 Economics` -> `L21 Galactic Currency Exchange`
- `L1 Writing` -> `L2 Mathematics` -> `L5 Scientific Theory` -> `L7 Computers` -> `L19 Cybertronic Computer` -> `L22 Moleculartronic Computer`
- `L1 Mining` -> `L1 Bronze Working` -> `L2 Iron Working` -> `L6 Steel` -> `L8 Composites` -> `L18 Microlite Construction` -> `L24 Adamantium Armor`
- `L1 Sailing` -> `L2 Shipbuilding` -> `L4 Square Rigging` -> `L9 Star Base` -> `L10 Colony Ship` -> `L17 Jump Gate` -> `L25 Star Gate`
- `L1 Astrology` -> `L4 Astronomy` -> `L8 Satellites` -> `L12 Tachyon Scanner` -> `L15 Battle Scanner` -> `L23 Artemis System Net`

### Warfare Branch
- `L1 Archery` -> `L4 Gunpowder` -> `L5 Ballistics` -> `L7 Advanced Ballistics` -> `L8 Guidance Systems` -> `L18 Anti-Matter Torpedo` -> `L24 Plasma Torpedo`
- `L3 Military Tactics` -> `L5 Military Science` -> `L7 Combined Arms` -> `L12 Mass Driver` -> `L15 Neutron Blaster` -> `L21 Disruptor Cannon` -> `L22 Mauler Device`
- `L3 Military Engineering` -> `L4 Siege Tactics` -> `L11 Missile Base` -> `L16 Ground Batteries` -> `L20 Plasma Cannon`

### Defense Branch
- `L3 Castles` -> `L9 Marine Barracks` -> `L13 Armor Barracks` -> `L20 Hard Shields` -> `L21 Planetary Flux Shield` -> `L25 Planetary Barrier Shield`
- `L6 Electricity` -> `L8 Lasers` -> `L11 Fusion Beam` -> `L16 Graviton Beam` -> `L18 Lightning Field`
- `L8 Stealth Technology` -> `L17 Stealth Field` -> `L17 Stealth Suit` -> `L20 Cloaking Device` -> `L25 Phasing Cloak`

### Space Propulsion Branch
- `L7 Rocketry` -> `L9 Nuclear Drive` -> `L12 Fusion Drive` -> `L15 Ion Drive` -> `L18 Anti-Matter Drive` -> `L21 Hyper Drive` -> `L24 Interphased Drive`
- `L9 Standard Fuel Cells` -> `L12 Deuterium Fuel Cells` -> `L16 Iridium Fuel Cells` -> `L21 Uridium Fuel Cells` -> `L24 Thorium Fuel Cells`

### Biology / Ecology Branch
- `L1 Irrigation` -> `L3 Education` -> `L10 Hydroponic Farm` -> `L13 Cloning Center` -> `L15 Microbiotics` -> `L23 Evolutionary Mutation`
- `L5 Sanitation` -> `L14 Pollution Processor` -> `L16 Atmospheric Renewer` -> `L17 Weather Controller` -> `L23 Gaia Transformation`
- `L13 Soil Enrichment` -> `L17 Subterranean Farms` -> `L19 Food Replicators`

### Governance / Society Branch
- `L2 Construction` -> `L3 Apprenticeship` -> `L5 Industrialization` -> `L11 Automated Factories` -> `L18 Robotic Factory` -> `L20 Android Workers`
- `L5 Economics` + `L7 Computers` -> `L21 Confederation` OR `L21 Imperium` OR `L21 Federation` (mutually exclusive)
- Any governance choice + `L21 Galactic Cybernet` -> `L21 Galactic Unification`

### Late-Game Meta Branch
- `L19 Psionics` -> `L20 Stasis Field` -> `L23 Displacement Device` -> `L25 Time Warp Facilitator`
- `L18 Anti-Matter Bomb` -> `L21 Proton Torpedo` -> `L23 Doom Star Construction` -> `L25 Stellar Converter`
- `L19 Transporters` -> `L23 Subspace Teleporter` -> `L24 Interphased Drive` -> `L25 Phasing Cloak`

## Node Example (Concrete)
```json
{
  "id": "tech_l12_fusion_drive",
  "name": "Fusion Drive",
  "eraLevel": 12,
  "eraName": "Sub-Light Speed Era",
  "category": "space",
  "prerequisites": ["tech_l09_nuclear_drive", "tech_l11_fusion_beam"],
  "unlocks": {
    "units": ["destroyer_mk2", "deep_range_colony_ship"],
    "modifiers": [{ "key": "fleet_speed", "valuePPM": 180000, "unit": "ppm" }]
  },
  "cost": { "science": 4200 },
  "tags": ["propulsion", "fleet", "midgame"]
}
```

## Immediate Cleanup Mapping (from source)
- Replace all `*` markers with `specialFlag`.
- Split merged tokens:
  - `Phasor Pulsar` -> `Phasor`, `Pulsar`
  - `Multi-Wave ECM Jammer` -> single normalized name.
- Remove trailing artifacts like `))`.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

