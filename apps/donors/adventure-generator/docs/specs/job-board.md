# ⭐ **SPEC: Procedural Job Board Generator v2 (Amplified)**

**File:** `/docs/specs/job-board.md`
**Version:** 2.0
**Status:** Implemented
**Subsystem:** Tavern → Job Board
**Author:** AI Supervisor
**Environment:** React 19 (AI Studio), Zustand, No Bundler

---

# 0. Purpose & Scope

This document details the **amplified v2 specification** for the procedural job generator. It expands on the initial implementation by introducing richer interfaces, deeper context-awareness, and a more robust generation model. This system enables the creation of dynamic, narratively consistent quest hooks that feel connected to the campaign world.

---

# ⭐ **1. Expanded Interfaces**

Below are the upgraded interfaces with additional fields for narrative consistency and cross-system coherence.

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

This supports:

*   **Job aging** and time-sensitive quests.
*   **Faction-based campaigns** with tangible outcomes.
*   **Hex-map integration** via origin/destination coordinates.
*   **Party-level balancing** recommendations.

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

The generator can now produce quests connected to the map, factions, weather, and ongoing campaign events, making the world feel more alive.

---

# ⭐ **2. Expanded JobArchetypes**

Each archetype is enhanced with optional fields for deeper context-awareness:

*   `factionBias`: Quests that tend to involve certain faction types.
*   `biomeAffinity`: Quests likely in a certain terrain.
*   `seasonalVariants`: Optional templates depending on season.
*   `urgencyRange`: How time-sensitive these jobs tend to be.
*   `requiresDungeon`: Used for integration with dungeon maps.

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

This allows the generator to **feel the world** instead of just spitting out disconnected quests.

---

# ⭐ **3. Expanded ComplicationPack & RewardPack**

These now support thematic weighting, seasonal/biome variants, CR/danger scaling, and faction impact.

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

The template slot system is expanded for richer, more detailed quest text.

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

Here are *expanded* versions of the escort and hunt archetypes.

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

This biome-aware table provides context-sensitive threats.

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

The difficulty model now considers more factors for a nuanced rating.

*   Party Level
*   Party Size
*   Danger Rating of the region
*   Number of complications

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

The system now supports:

*   A much richer **spec** and expanded types.
*   Expanded, context-aware templates and placeholder slots.
*   A more nuanced danger model.
*   A system that feels connected to the Hex Map, NPCs, factions, and world events.

This is **AAA-grade procedural quest generation**.