# 146 Hardened Species Evolution Kernel

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/124-evolution-to-civilization-bridge.md`, `docs/brainstorm/135-typescript-simulation-architecture.md`]
- `Owns`: [`genetic bitstring schema`, `deterministic inheritance logic`]
- `Writes`: [`species trait updates`, `mutation events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/146-hardened-species-evolution-kernel.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a "cheap" bitwise genetic simulation for modeling 12 fantasy races and their evolution without per-individual CPU overhead.

## 1. Genetic Bitstring (The "Genome")
Each species uses a 64-bit `Bitset` component in the Sim-Worker ECS.

| Bits | Scope | Description |
|---|---|---|
| 0-7 | **Cognition** | Intelligence, focus, magic affinity |
| 8-15 | **Physiology** | Strength, size, metabolic rate |
| 16-23 | **Social** | Cohesion, aggression, hierarchy |
| 24-31 | **Environmental** | Heat/Cold resistance, aquatic affinity |
| 32-63 | **Special** | Wings, Night-vision, Immortality flags |

## 2. Deterministic Inheritance (Cross-Scale)
- **Macro-Scale**: A population's genome is the "Mean Genome" (mode bitset).
- **Micro-Scale**: When spawning a discrete actor (`144` Bloom), the individual bitset is:
  `Individual_Genome = (Mean_Genome & mask) | (Random_Mutation_Seed & ~mask)`
- **Reproduction**: Uses a bitwise XOR/AND "Crossover" between parent traits.

## 3. Speciation & Drift
- **Drift Vector**: Every 100 ticks, environmental forcing (`121`) applies a bit-shift or flip to specific bands.
- **Example**: Cold climates flip the "Cold Resistance" bit (Bits 24-25) over time.
- **Speciation**: If `Distance(Genome_A, Genome_B) > 12 bits`, they are marked as distinct species/sub-races.

## 4. Performance (Cheap Accuracy)
- **Integer Only**: All genetic logic uses bitwise operators (`&`, `|`, `^`, `<<`).
- **Batching**: Genetic drift is calculated per hex population, not per individual.

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
