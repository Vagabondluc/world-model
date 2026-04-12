
export type JobDifficulty = "trivial" | "easy" | "standard" | "hard" | "deadly";
export type JobUrgency = "low" | "normal" | "high" | "critical";

export interface JobPost {
  id: string;
  title: string;
  summary: string;
  details: string;
  complications: string[];
  rewards: string[];
  postedBy?: string;
  locationId?: string;
  origin?: string;
  destination?: string;
  worldContext?: string;
  tags: string[];
  difficulty: JobDifficulty;
  urgency?: JobUrgency;
  timeLimit?: string;
  recommendedLevel?: number;
  factionImpact?: string[];
  failureConsequences?: string[];
  postedAt: number;
}

export interface JobContext {
  regionName?: string;
  settlementType?: "village" | "town" | "city" | "frontier" | "stronghold";
  biome?: "plains" | "forest" | "swamp" | "mountain" | "desert" | "coast" | "underdark" | "urban";
  regionTags?: string[];
  weather?: string;
  season?: "spring" | "summer" | "autumn" | "winter";
  activeHex?: string;
  dangerRating?: 1 | 2 | 3 | 4 | 5;
  partyLevel?: number;
  partySize?: number;
  factions?: { id: string; name: string; tags: string[]; reputation?: number }[];
  npcs?: { id: string; name: string; role?: string; factionId?: string; tags?: string[], personality?: string }[];
  recentEvents?: string[];
  seed?: string;
}

export type JobArchetypeId =
  | "escort"
  | "hunt"
  | "retrieve"
  | "investigate"
  | "defend"
  | "social"
  | "sabotage"
  | "rescue"
  | "explore"
  | "cleanse";

export interface JobArchetype {
  id: JobArchetypeId;
  weight: number;
  tags: string[];
  minDanger?: number;
  maxDanger?: number;
  factionBias?: string[];
  biomeAffinity?: string[];
  urgencyRange?: [number, number];
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

export interface ComplicationPack {
  id: string;
  weight: number;
  templates: string[];
  biomeAffinity?: string[];
  factionTags?: string[];
  seasonal?: Partial<{
    spring: string[];
    summer: string[];
    autumn: string[];
    winter: string[];
  }>;
  dangerBoost?: number;
  tags?: string[];
}

export interface RewardPack {
  id: string;
  weight: number;
  templates: string[];
  baseGold?: number;
  magicChance?: number;
  factionFavor?: boolean;
  scalingFactor?: number;
  tags?: string[];
}

export interface JobSlots {
    [key: string]: string | undefined;
    clientId?: string;
    clientName: string;
    clientType: string;
    clientFactionName: string;
    origin: string;
    destination: string;
    locationId?: string;
    locationName: string;
    enemyType: string;
    enemyTypePlural: string;
    enemyFaction?: string;
    biomeSummary: string;
    weather?: string;
    season?: string;
    regionName?: string;
    weirdEvent: string;
    item: string;
    target: string;
    threatSummary: string;
    threatDetail: string;
    departureTime: string;
    importantNPC: string;
    clientBusinessName: string;
    goldAmount?: string;
    timeLimit?: string;
    consequences?: string;
}
