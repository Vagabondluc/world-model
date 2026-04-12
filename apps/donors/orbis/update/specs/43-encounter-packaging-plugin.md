# 🔒 Encounter Packaging Plugin Contract v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

The Encounter Packaging Plugin Contract defines a **plugin system** that transforms simulation data into gameplay-ready encounter cards. Plugins bridge the gap between the core scientific simulation and game-specific rulesets (OSR, 5E, custom) by packaging [`SpeciesGameplayProfile`](docs/42-species-gameplay-ratings.md:27) data, local context, and optional party information into structured encounter cards.

This architecture ensures:
- **Core engine remains agnostic** to game rules
- **Gameplay packaging is modular** and replaceable
- **Ruleset-specific logic** is isolated in adapter modules
- **Deterministic outputs** given the same inputs

---

## 1. EncounterPackagingInput Interface

The input contract defines all data available to a plugin. All inputs are **read-only** and **quantized**.

```ts
interface EncounterPackagingInput {
  time: AbsTime
  biomeId: uint64
  regionId?: uint64
  seasonId?: uint32

  species: SpeciesGameplayProfile[]     // already computed by core
  world: WorldSnapshot                 // quantized, read-only
  local: LocalContext                  // quantized, read-only

  // Optional (game client provides)
  party?: PartyProfile                 // HP, level, gear tags, etc.
  ruleset: RulesetId                   // "OSR", "5E", "Custom"
}
```

### Input Components

| Component | Type | Description |
|-----------|------|-------------|
| `time` | `AbsTime` | Absolute simulation time when the encounter is requested |
| `biomeId` | `uint64` | Identifier for the biome where the encounter occurs |
| `regionId` | `uint64?` | Optional region identifier for finer-grained context |
| `seasonId` | `uint32?` | Optional season identifier affecting encounter content |
| `species` | `SpeciesGameplayProfile[]` | Array of species profiles computed by the core ratings system |
| `world` | `WorldSnapshot` | Read-only snapshot of world state at the given time |
| `local` | `LocalContext` | Quantized local environmental and situational context |
| `party` | `PartyProfile?` | Optional party information for difficulty calibration |
| `ruleset` | `RulesetId` | Target ruleset identifier ("OSR", "5E", "Custom") |

### Hard Rules

Plugins **must not**:
- Call core mutation APIs
- Change simulation state
- Modify any input data

---

## 2. EncounterCard Interface Output

The output contract defines the structure of encounter cards produced by plugins.

```ts
interface EncounterCard {
  encounterId: uint64                 // deterministic hash
  title: string
  tags: TagInstance[]                 // plugin gameplay tags, not core biology tags

  difficultyPPM?: uint32              // ruleset-specific mapping
  urgencyPPM: uint32                  // "how immediate"
  weirdnessPPM: uint32                // "how uncanny"
  rewardPPM: uint32                   // expected payoff

  // Card body (structured, not a blob)
  composition: Array<{ speciesId: SpeciesId, count: uint16, role: string }>
  behavior: { aggressionPPM: uint32, pursuitPPM: uint32, groupTendencyPPM: uint32 }

  tactics: TacticBlock[]              // structured
  hooks: HookBlock[]                  // structured
  complications: ComplicationBlock[]  // structured
  resolutions: ResolutionBlock[]      // structured

  // Debug / audit
  provenance: {
    pluginId: PluginId
    pluginVersion: uint16
    seed: uint64
    inputsHash64: uint64
  }
}
```

### Output Components

| Component | Type | Description |
|-----------|------|-------------|
| `encounterId` | `uint64` | Deterministic hash uniquely identifying this encounter |
| `title` | `string` | Human-readable encounter title |
| `tags` | `TagInstance[]` | Plugin-specific gameplay tags (not core biology tags) |
| `difficultyPPM` | `uint32?` | Optional difficulty rating in parts-per-million |
| `urgencyPPM` | `uint32` | "How immediate" the encounter is (0-1,000,000) |
| `weirdnessPPM` | `uint32` | "How uncanny" or unusual the encounter is (0-1,000,000) |
| `rewardPPM` | `uint32` | Expected payoff value (0-1,000,000) |
| `composition` | `Array<...>` | Species composition with counts and roles |
| `behavior` | `object` | Behavioral attributes (aggression, pursuit, group tendency) |
| `tactics` | `TacticBlock[]` | Structured combat or interaction tactics |
| `hooks` | `HookBlock[]` | Narrative hooks for player engagement |
| `complications` | `ComplicationBlock[]` | Potential complications or twists |
| `resolutions` | `ResolutionBlock[]` | Possible resolution paths |
| `provenance` | `object` | Audit trail for debugging and reproducibility |

### Structured Block Types

```ts
interface TacticBlock {
  id: string
  description: string
  triggerTags: TagId[]
  priority: uint32
}

interface HookBlock {
  id: string
  description: string
  triggerTags: TagId[]
  category: string
}

interface ComplicationBlock {
  id: string
  description: string
  triggerTags: TagId[]
  severityPPM: uint32
}

interface ResolutionBlock {
  id: string
  description: string
  triggerTags: TagId[]
  outcomeCategory: string
}
```

---

## 3. Determinism Rule (Hard Requirement)

Encounter cards **must be deterministic** given identical inputs.

### Deterministic Seed Calculation

If a plugin uses randomness, it must derive the seed from:

```
seed = hash(worldSeed, timeTick, biomeId, encounterIndex, pluginId)
```

### Requirements

- **No internal RNG state** - Each random value must be derived from the seed
- **Reproducible outputs** - Same inputs must produce identical cards
- **No external sources** - No time-based or system-based randomness

### Example Implementation

```ts
function deriveSeed(input: EncounterPackagingInput, encounterIndex: uint32, pluginId: PluginId): uint64 {
  const worldSeed = input.world.seed;
  const timeTick = input.time.tick;
  const biomeId = input.biomeId;
  
  return hash64(worldSeed, timeTick, biomeId, encounterIndex, pluginId);
}

function createDeterministicRNG(seed: uint64): DeterministicRNG {
  // Use seed to initialize a deterministic RNG
  // Each call advances the seed deterministically
}
```

---

## 4. Plugin Isolation & Safety

Plugins operate in a **sandboxed environment** with strict permissions.

### Plugin Capabilities (Allowed)

| Capability | Description |
|------------|-------------|
| Read snapshots | Access `WorldSnapshot` and `LocalContext` |
| Compute text/structures | Generate encounter descriptions and structured data |
| Add plugin tags | Create plugin-specific gameplay tags |
| Map to ruleset difficulty | Convert simulation values to ruleset-specific difficulty |

### Plugin Restrictions (Prohibited)

| Restriction | Reason |
|-------------|--------|
| Mutate world | Core simulation must remain pure and scientific |
| Add/remove species | Species management is core engine responsibility |
| Alter tags in core registry | Core tag system must remain stable |
| Change scores/ratings | Ratings are computed by core systems |
| Schedule simulation time | Time management is core engine responsibility |

### Safety Enforcement

```ts
interface PluginSandbox {
  // Read-only access
  readonly world: WorldSnapshot;
  readonly local: LocalContext;
  readonly species: ReadonlyArray<SpeciesGameplayProfile>;
  
  // Write-only output
  output: EncounterCardBuilder;
  
  // Deterministic RNG
  rng(seed: uint64): DeterministicRNG;
  
  // Tag creation (plugin namespace only)
  createTag(namespace: uint8, id: uint16): TagId;
}
```

---

## 5. Ruleset Adapters

Each ruleset is implemented as an **adapter module** within the plugin.

### Supported Rulesets

| Ruleset | Description | Implementation Notes |
|---------|-------------|---------------------|
| **OSR** | Old School Revival | Uses danger, morale, reaction tables (plugin-defined) |
| **5E** | D&D 5th Edition | Uses CR-ish mapping (plugin-defined) |
| **Custom** | Custom ruleset | Uses tags and PPM values only |

### Adapter Architecture

```ts
interface RulesetAdapter {
  rulesetId: RulesetId;
  
  // Convert core ratings to ruleset-specific difficulty
  computeDifficulty(
    profiles: SpeciesGameplayProfile[],
    party?: PartyProfile
  ): uint32;
  
  // Map behavior to ruleset mechanics
  mapBehavior(behavior: EncounterBehavior): RulesetBehavior;
  
  // Validate encounter against ruleset constraints
  validate(card: EncounterCard): ValidationResult;
}

class OSRAdapter implements RulesetAdapter {
  rulesetId = "OSR";
  
  computeDifficulty(profiles: SpeciesGameplayProfile[], party?: PartyProfile): uint32 {
    // Use danger rating, HD equivalents, party level
    // Return encounter level or HD total
  }
}

class FiveEAdapter implements RulesetAdapter {
  rulesetId = "5E";
  
  computeDifficulty(profiles: SpeciesGameplayProfile[], party?: PartyProfile): uint32 {
    // Use CR mapping, XP budgeting
    // Return CR value or XP total
  }
}

class CustomAdapter implements RulesetAdapter {
  rulesetId = "Custom";
  
  computeDifficulty(profiles: SpeciesGameplayProfile[], party?: PartyProfile): uint32 {
    // Use PPM values directly
    // Return composite PPM score
  }
}
```

### Core Engine Interaction

The core engine only sees the `RulesetId` string/enum. All ruleset-specific logic is encapsulated within the plugin's adapter modules.

---

## 6. Content Budget (Performance)

Cards must be generated with **predictable computational cost** to ensure responsive performance.

### Default Budget Limits

| Budget Type | Default Limit | Rationale |
|-------------|---------------|-----------|
| Max cards per request | 20 | Prevents overwhelming generation |
| Max hooks per card | 3 | Limits narrative complexity |
| Max complications per card | 3 | Limits encounter complexity |
| Max tactics per card | 5 | Limits combat depth |

### Budget Enforcement

```ts
interface ContentBudget {
  maxCards: uint32;
  maxHooksPerCard: uint32;
  maxComplicationsPerCard: uint32;
  maxTacticsPerCard: uint32;
}

const DEFAULT_BUDGET: ContentBudget = {
  maxCards: 20,
  maxHooksPerCard: 3,
  maxComplicationsPerCard: 3,
  maxTacticsPerCard: 5
};

function validateBudget(card: EncounterCard, budget: ContentBudget): boolean {
  return card.hooks.length <= budget.maxHooksPerCard &&
         card.complications.length <= budget.maxComplicationsPerCard &&
         card.tactics.length <= budget.maxTacticsPerCard;
}
```

### LLM Usage Policy

- **No LLM loops at runtime** unless explicitly enabled by the client
- All text generation should use templated phrase banks (see Localization)
- LLM calls, if used, must be pre-cached or batched

---

## 7. Explainability Hooks

Plugins must provide **explainability data** to make encounters debuggable and trustworthy.

### Required Explainability Data

| Data Type | Description | Format |
|-----------|-------------|--------|
| Species contribution | Which species contributed to the encounter | Array of `{ speciesId, contributionPPM, reason }` |
| Difficulty rating | Why difficulty was rated that way | Top 3 factors with PPM weights |
| Hook selection | Why specific hooks were selected | Tag triggers with PPM thresholds |
| Complication selection | Why specific complications were selected | Tag triggers with PPM thresholds |

### Explainability Interface

```ts
interface EncounterExplainability {
  speciesContributions: Array<{
    speciesId: SpeciesId;
    contributionPPM: uint32;
    reason: string;
  }>;
  
  difficultyFactors: Array<{
    factor: string;
    weightPPM: uint32;
    description: string;
  }>;
  
  hookTriggers: Map<HookBlockId, Array<{
    tagId: TagId;
    thresholdPPM: uint32;
    actualPPM: uint32;
  }>>;
  
  complicationTriggers: Map<ComplicationBlockId, Array<{
    tagId: TagId;
    thresholdPPM: uint32;
    actualPPM: uint32;
  }>>;
}
```

### Integration with EncounterCard

```ts
interface EncounterCardDebugExtension {
  explainability?: EncounterExplainability  // Optional for production, required for debug
}
```

---

## 8. Localization Support

Localization is **optional but structured** to support future multi-language support.

### Templated Phrase Bank System

Strings must be produced via **templated phrase banks** keyed by tags, not hardcoded English paragraphs.

### Phrase Bank Structure

```ts
interface PhraseBank {
  locale: string;  // "en", "fr", "de", etc.
  
  phrases: Map<string, PhraseTemplate>;
}

interface PhraseTemplate {
  key: string;
  template: string;  // "The {species} {action} with {intensity}"
  
  tagRequirements: TagId[];  // Tags that make this template applicable
  
  // Localized variants
  variants: {
    [locale: string]: string;
  };
}
```

### Example Usage

```ts
const HOOK_PHRASES: PhraseBank = {
  locale: "en",
  phrases: new Map([
    ["predator_ambush", {
      key: "predator_ambush",
      template: "A {predatorSpecies} lies in wait, {ambushTactic}",
      tagRequirements: [Tags.Predator, Tags.Ambush],
      variants: {
        en: "A {predatorSpecies} lies in wait, {ambushTactic}",
        fr: "Un {predatorSpecies} se tient en embuscade, {ambushTactic}"
      }
    }]
  ])
};

function generateHookText(hook: HookBlock, context: EncounterContext): string {
  const template = HOOK_PHRASES.phrases.get(hook.templateKey);
  if (!template) return hook.description;  // Fallback
  
  // Fill template with context data
  return template.template
    .replace("{predatorSpecies}", context.predatorSpecies.name)
    .replace("{ambushTactic}", context.ambushTactic);
}
```

### Localization Best Practices

1. **Use phrase keys** instead of hardcoded strings
2. **Support parameter substitution** for dynamic content
3. **Provide fallbacks** for missing translations
4. **Keep templates simple** to minimize translation complexity
5. **Test with RTL languages** if supporting Arabic, Hebrew, etc.

---

## 9. Plugin Registration Contract

Plugins must declare their capabilities through a **manifest** during registration.

### EncounterPluginManifest Interface

```ts
interface EncounterPluginManifest {
  pluginId: uint32
  name: string
  version: uint16
  supportedRulesets: RulesetId[]
  requiredTagNamespaces: uint8[]   // for plugin tag ids
}
```

### Manifest Fields

| Field | Type | Description |
|-------|------|-------------|
| `pluginId` | `uint32` | Unique identifier for the plugin |
| `name` | `string` | Human-readable plugin name |
| `version` | `uint16` | Plugin version (increment on breaking changes) |
| `supportedRulesets` | `RulesetId[]` | Array of ruleset identifiers this plugin supports |
| `requiredTagNamespaces` | `uint8[]` | Tag namespaces required by this plugin |

### Registration Process

```ts
interface PluginRegistry {
  register(manifest: EncounterPluginManifest, plugin: EncounterPlugin): void;
  
  getPlugin(pluginId: uint32): EncounterPlugin | null;
  
  getPluginsForRuleset(rulesetId: RulesetId): EncounterPlugin[];
}

// Example registration
const manifest: EncounterPluginManifest = {
  pluginId: 1,
  name: "Standard Encounter Packager",
  version: 1,
  supportedRulesets: ["OSR", "5E", "Custom"],
  requiredTagNamespaces: [0x01, 0x02]  // Plugin-specific tag namespaces
};

const plugin = new StandardEncounterPlugin();
registry.register(manifest, plugin);
```

---

## 10. Plugin Interface Definition

The complete interface that all encounter packaging plugins must implement.

```ts
interface EncounterPlugin {
  // Plugin metadata
  readonly manifest: EncounterPluginManifest;
  
  // Core generation method
  generateCards(
    input: EncounterPackagingInput,
    budget?: ContentBudget
  ): EncounterCard[];
  
  // Optional: Generate a single card by index
  generateCard(
    input: EncounterPackagingInput,
    index: uint32
  ): EncounterCard;
  
  // Optional: Validate card against ruleset
  validateCard(
    card: EncounterCard,
    ruleset: RulesetId
  ): ValidationResult;
}
```

---

## 11. Example Plugin Implementation

A complete example of a basic encounter packaging plugin.

```ts
class StandardEncounterPlugin implements EncounterPlugin {
  readonly manifest: EncounterPluginManifest = {
    pluginId: 1,
    name: "Standard Encounter Packager",
    version: 1,
    supportedRulesets: ["OSR", "5E", "Custom"],
    requiredTagNamespaces: [0x01]
  };
  
  private adapters: Map<RulesetId, RulesetAdapter> = new Map([
    ["OSR", new OSRAdapter()],
    ["5E", new FiveEAdapter()],
    ["Custom", new CustomAdapter()]
  ]);
  
  generateCards(
    input: EncounterPackagingInput,
    budget: ContentBudget = DEFAULT_BUDGET
  ): EncounterCard[] {
    const cards: EncounterCard[] = [];
    const adapter = this.adapters.get(input.ruleset);
    
    if (!adapter) {
      throw new Error(`Unsupported ruleset: ${input.ruleset}`);
    }
    
    for (let i = 0; i < budget.maxCards; i++) {
      const card = this.generateCard(input, i, adapter);
      if (validateBudget(card, budget)) {
        cards.push(card);
      }
    }
    
    return cards;
  }
  
  private generateCard(
    input: EncounterPackagingInput,
    index: uint32,
    adapter: RulesetAdapter
  ): EncounterCard {
    const seed = deriveSeed(input, index, this.manifest.pluginId);
    const rng = createDeterministicRNG(seed);
    
    // Select species for encounter
    const composition = this.selectComposition(input.species, rng);
    
    // Compute difficulty
    const difficultyPPM = adapter.computeDifficulty(
      composition.map(c => input.species.find(s => s.speciesId === c.speciesId)!),
      input.party
    );
    
    // Generate behavioral profile
    const behavior = this.generateBehavior(composition, input.local, rng);
    
    // Select tactics, hooks, complications
    const tactics = this.selectTactics(composition, behavior, rng);
    const hooks = this.selectHooks(composition, input.local, rng);
    const complications = this.selectComplications(composition, behavior, rng);
    const resolutions = this.selectResolutions(composition, rng);
    
    // Generate explainability data
    const explainability = this.generateExplainability(
      composition,
      difficultyPPM,
      hooks,
      complications
    );
    
    return {
      encounterId: seed,
      title: this.generateTitle(composition, input.local),
      tags: this.generatePluginTags(composition, behavior),
      difficultyPPM,
      urgencyPPM: this.computeUrgency(input.local, composition),
      weirdnessPPM: this.computeWeirdness(composition, input.local),
      rewardPPM: this.computeReward(composition),
      composition,
      behavior,
      tactics,
      hooks,
      complications,
      resolutions,
      provenance: {
        pluginId: this.manifest.pluginId,
        pluginVersion: this.manifest.version,
        seed,
        inputsHash64: hashInputs(input)
      },
      explainability
    };
  }
  
  // ... helper methods
}
```

---

## 12. Related Documentation

This plugin contract integrates with several other systems:

- [`SpeciesGameplayProfile`](docs/42-species-gameplay-ratings.md:27) - Source of species gameplay ratings
- [`TagInteractionMath`](docs/41-tag-interaction-math.md:1) - Tag-based calculations and thresholds
- [`UnifiedTagSystem`](docs/38-unified-tag-system.md:1) - Core tag infrastructure
- [`DeterministicRNG`](docs/35-deterministic-rng.md:1) - Hash-based random number generation

---

## 13. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1 | 2025-02-11 | Initial frozen specification |

---

## 14. Summary

The Encounter Packaging Plugin Contract provides:

- **Clean separation** between core simulation and gameplay logic
- **Deterministic outputs** through hash-based seeding
- **Ruleset flexibility** through adapter modules
- **Plugin safety** through strict isolation rules
- **Performance guarantees** through content budgets
- **Explainability** through structured audit trails
- **Localization support** through templated phrase banks
- **Extensibility** through a clear registration contract

This architecture ensures the core engine remains a **pure, scientific, deterministic simulation** while gameplay packaging remains **modular, replaceable, and ruleset-specific**.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
