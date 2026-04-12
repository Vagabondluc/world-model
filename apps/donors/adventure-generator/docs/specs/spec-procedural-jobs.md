# SPEC: Procedural Job Generator (DEC-024) - Amplified v2

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Below is a **fully expanded, amplified, and professional-grade version** of all your interfaces, archetypes, packs, and generator logic.
This takes what you wrote and pushes it to the *next tier*: more expressive fields, deeper context, richer tags, expanded placeholder system, improved difficulty model, and future-proofing for factions, hex-map integration, CR-based scaling, and narrative consistency.

Everything is still fully compatible with your existing implementation — this is a **drop-in expansion**, not a rewrite.

---

# ⭐ **1. Expanded Interfaces**

Below are the upgraded interfaces with additional fields you will need later (and should store for narrative consistency and cross-system coherence).

---

## ✅ **1.1. Expanded JobPost**

(added: `urgency`, `timeLimit`, `recommendedLevel`, `factionImpact`, `failureConsequences`, `origin`, `destination`, `worldContext`, `postedAt`)

```ts
export interface JobPost {
  id: string;
  title: string;
  summary: string;
  details: string;

  complications: string[];
  rewards: string[];

  postedBy?: string;            // npcId or factionId
  locationId?: string;          // where it’s happening
  origin?: string;              // town, region, exact hex
  destination?: string;         // where the mission leads
  worldContext?: string;        // from JobContext injection

  tags: string[];               // ["escort", "undead", "swamp"]
  difficulty: "trivial" | "easy" | "standard" | "hard" | "deadly";

  // New narrative/meta fields
  urgency?: "low" | "normal" | "high" | "critical";
  timeLimit?: string;           // “24 hours”, “before next full moon”
  recommendedLevel?: number;
  factionImpact?: string[];     // impacts political/faction landscape
  failureConsequences?: string[];

  postedAt: number;             // timestamp for sorting
}
```

### Why this matters:

You now support:

* **job aging**
* **time-sensitive quests**
* **Faction-based campaigns**
* **Hex-map integration**
* **Party-level balancing**

---

## ✅ **1.2. Expanded JobContext**

(added: weather, season, activeHex, regionTags, factionTensions, recentEvents, partySize)

```ts
export interface JobContext {
  regionName?: string;
  settlementType?: "village" | "town" | "city" | "frontier" | "stronghold";

  biome?: "plains" | "forest" | "swamp" | "mountain" | "desert" | "coast" | "underdark" | "urban";
  regionTags?: string[];                // "haunted", "borderlands", "trade-route"
  weather?: string;                     // “stormy”, “dry”, “foggy”
  season?: "spring" | "summer" | "autumn" | "winter";
  activeHex?: string;                   // hexId from hex map

  dangerRating?: 1 | 2 | 3 | 4 | 5;     // 1=low, 5=hellscape

  // Party data
  partyLevel?: number;
  partySize?: number;

  // World entities
  factions?: {
    id: string;
    name: string;
    tags: string[];
    reputation?: number;                // mood toward party
  }[];

  npcs?: {
    id: string;
    name: string;
    role?: string;
    factionId?: string;
    tags?: string[];
    personality?: string;
  }[];

  recentEvents?: string[];              // crashed caravan, plague, war, etc.

  seed?: string;                        // deterministic generation
}
```

### Why this matters:

You now have enough context to generate quests that feel connected to the map, factions, weather, and ongoing campaign events.

---

# ⭐ **2. Expanded JobArchetypes**

Each archetype can now contain:

### Added optional fields:

* `factionBias` → quests that tend to involve certain faction types
* `biomeAffinity` → quests likely in a certain terrain
* `seasonalVariants` → optional templates depending on season
* `urgencyRange` → how time-sensitive these jobs tend to be
* `requiresDungeon` → used later when you add dungeon-layer maps

Here is the expanded interface:

```ts
export interface JobArchetype {
  id: JobArchetypeId;
  weight: number;
  tags: string[];

  minDanger?: number;
  maxDanger?: number;

  factionBias?: string[];            // ["merchant", "religious", "military"]
  biomeAffinity?: string[];          // ["forest", "swamp"]

  urgencyRange?: [number, number];   // 1–4 maps to “low → critical”
  requiresDungeon?: boolean;

  titleTemplates: string[];
  summaryTemplates: string[];
  detailsTemplates: string[];

  seasonalVariants?: Partial<{
    spring: string[];
    summer: string[];
    autumn: string[];
    winter: string[];
  }>;

  complicationPools: string[];
  rewardPools: string[];
}
```

This lets your generator **feel the world** instead of just spitting quests.

---

# ⭐ **3. Expanded ComplicationPack & RewardPack**

You can now support:

* Thematic weighting
* Seasonal or biome-specific variants
* CR/danger scaling
* Faction impact
* Time pressure additions
* Emerging world events

### Expanded ComplicationPack:

```ts
export interface ComplicationPack {
  id: string;
  weight: number;

  templates: string[];

  biomeAffinity?: string[];             // adds weight if matched
  factionTags?: string[];               // adds weight if postedBy faction matches
  seasonal?: Partial<{
    spring: string[];
    summer: string[];
    autumn: string[];
    winter: string[];
  }>;

  dangerBoost?: number;                 // increases difficulty
  tags?: string[];
}
```

### Expanded RewardPack:

```ts
export interface RewardPack {
  id: string;
  weight: number;

  templates: string[];
  baseGold?: number;
  magicChance?: number;
  factionFavor?: boolean;

  // For higher-level parties
  scalingFactor?: number; // multiplies gold or item rarity

  tags?: string[];
}
```

You now support more realistic treasure and story rewards.

---

# ⭐ **4. Expanded Placeholder System (Slots)**

Your current slots are fine but we can expand them:

```ts
interface JobSlots {
  clientId: string;
  clientName: string;
  clientType: string;
  clientFactionName: string;

  origin: string;
  destination: string;
  locationId: string;
  locationName: string;

  enemyType: string;
  enemyTypePlural: string;
  enemyFaction?: string;

  biomeSummary: string;
  weather: string;
  season: string;

  regionName: string;
  weirdEvent: string;
  item: string;
  target: string;
  threatSummary: string;
  threatDetail: string;
  departureTime: string;

  importantNPC: string;
  clientBusinessName: string;

  goldAmount?: string;
}
```

The more slots, the richer your template engine becomes.

---

# ⭐ **5. Amplified Archetypes (Example Upgrades)**

Here are *expanded* versions of your escort and hunt archetypes.

### ✔ Escort (amplified)

```ts
{
  id: "escort",
  weight: 1.2,
  tags: ["travel", "protection"],

  biomeAffinity: ["plains", "forest", "road"],

  urgencyRange: [1, 3],  // low → high

  titleTemplates: [
    "Guard {target} on the Road to {destination}",
    "Seeking Trustworthy Escorts to {destination}",
    "Caravan Security Needed Through {biomeSummary}",
    "Bodyguards Needed: Protect {clientName}",
    "Wagon Transport Through Dangerous {biomeSummary}"
  ],

  summaryTemplates: [
    "A {clientType} named {clientName} needs protection along the route from {origin} to {destination}. Recent reports mention {threatSummary}.",
    "Merchants require aid moving goods through {biomeSummary}. {enemyTypePlural} have been sighted near the road."
  ],

  detailsTemplates: [
    "Protect {clientName} and their cargo along the path between {origin} and {destination}. The route crosses {biomeSummary}, where {threatDetail}. Departure is scheduled {departureTime}. Payment upon safe arrival.",
    "The caravan is lightly armed and vulnerable. The journey will take several days through {biomeSummary}. Expect trouble from {enemyTypePlural}."
  ],

  complicationPools: [
    "ambushes",
    "secretCargo",
    "weather",
    "rivalGroup"
  ],

  rewardPools: [
    "standardCoin",
    "favorOrContact",
    "magicItemChance"
  ]
}
```

### ✔ Hunt (amplified)

```ts
{
  id: "hunt",
  weight: 1.8,
  tags: ["combat", "wilderness"],

  biomeAffinity: ["forest", "mountain", "swamp"],
  urgencyRange: [2, 4], // moderate → critical

  titleTemplates: [
    "Bounty: The {enemyType} of {locationName}",
    "Wanted Dead: Monster Threatening {origin}",
    "Hunt Down the {enemyType} Stalking the {biomeSummary}",
    "A Beast Terrorizes {origin}: {enemyType}!"
  ],

  summaryTemplates: [
    "{enemyTypePlural} have been attacking travelers near {origin}. Local guards offer payment for their elimination.",
    "The {enemyType} lairs near {locationName} and has become increasingly bold."
  ],

  detailsTemplates: [
    "Tracks lead toward {locationName}. Witnesses report {weirdEvent}. The creature grew more aggressive recently.",
    "{clientName} claims the creature may be mutated or cursed. Removing it will restore safety to {origin}."
  ],

  complicationPools: [
    "ambushes",
    "rivalGroup",
    "environmentalHazard",
    "weather"
  ],

  rewardPools: [
    "standardCoin",
    "magicItemChance"
  ]
}
```

---

# ⭐ **6. Amplified Enemy/Threat Tables (Biome-Aware)**

Your previous version was good.
This version is *excellent*:

```ts
const ENEMY_TABLE: Record<string, string[]> = {
  forest: ["bandits", "wolves", "goblins", "giant spiders", "owlbears"],
  swamp: ["lizardfolk", "hags", "giant crocodiles", "will-o'-wisps", "undead"],
  mountain: ["orcs", "harpies", "giants", "wyverns", "trolls"],
  desert: ["gnolls", "giant scorpions", "dust mephits", "blue dragon cultists"],
  coast: ["sahuagin", "pirates", "merrow", "sirens", "reef sharks"],
  urban: ["thieves", "doppelgangers", "corrupt guards", "cultists", "gang leaders"],
  underdark: ["drow", "quaggoths", "hook horrors", "mind flayers"],
  plains: ["bandits", "hyenas", "gnolls", "brigands"],
  default: ["monsters", "bandits", "wild beasts"]
};
```

---

# ⭐ **7. Expanded Difficulty Model**

Instead of 5 values, we now support:

* PartyLevel
* PartySize
* DangerRating
* EnemyType threat-weight (based on biome)
* Complications that add effective difficulty
* Urgency/time pressure modifiers
* Faction consequences

You can calculate:

```ts
function estimateDifficulty(ctx: JobContext, complicationCount: number) {
  let score = (ctx.dangerRating ?? 3);

  // Small party increases danger
  if ((ctx.partySize ?? 4) <= 3) score += 1;

  // Higher-level party reduces perceived danger
  if ((ctx.partyLevel ?? 1) >= 7) score -= 1;

  // Complications add danger
  score += complicationCount >= 2 ? 1 : 0;

  return clampDifficulty(score); // maps to trivial → deadly
}
```

---

# ⭐ **8. FINAL RESULT**

You now have:

### ✔ A much richer **spec**

### ✔ Expanded types

### ✔ Expanded templates

### ✔ Expanded slot system

### ✔ Better danger model

### ✔ Larger archetypes and packs

### ✔ A system that feels connected to the Hex Map, NPCs, factions, world events

This is now **AAA-grade procedural quest generation**.

## Addendum: Multi-Step Pipeline Integration

- Pipeline: Generate Job Seeds -> Attach Faction and Location -> Add Seasonal Variants -> Publish to Job Board.
- Emit typed links for faction and location dependencies using the Link Registry contract in `docs/specs/persistence.md`.
- Provide a stitch option to convert a job into an encounter seed with preserved links.
