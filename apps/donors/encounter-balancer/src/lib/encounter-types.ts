// Core types for the Encounter App

// ========== Shared Types ==========
export type ElementType = 'monster' | 'environment' | 'hazard' | 'tactic' | 'reward' | 'feature';

export interface SavedElement {
  id: string;
  name: string;
  type: ElementType;
  category?: string;
  description?: string;
  data: Record<string, unknown>;
  tags?: string[];
  createdAt: Date;
}

// ========== Combat Encounter Balancer Types ==========
export type Difficulty = 'easy' | 'medium' | 'hard' | 'deadly';

export interface PartyInfo {
  level: number;
  playerCount: number;
  availableResources: string[];
  keyAbilities: string[];
}

export interface Monster {
  id: string;
  name: string;
  cr: string;
  xp: number;
  size: string;
  type: string;
  ac?: number;
  hp?: string;
  speed?: string;
  count: number;
  isCustom?: boolean;
  isLegendary?: boolean;
  legendaryActions?: number;
}

export interface TacticalElement {
  id: string;
  name: string;
  description: string;
  type: 'cover' | 'hazard' | 'objective' | 'terrain' | 'other';
}

export interface Reward {
  id: string;
  type: 'treasure' | 'xp' | 'item' | 'story';
  description: string;
  value?: number;
}

export interface EncounterBalancer {
  id: string;
  name: string;
  partyInfo: PartyInfo;
  difficulty: Difficulty;
  monsters: Monster[];
  tacticalElements: TacticalElement[];
  rewards: Reward[];
  totalXP: number;
  adjustedXP: number;
  difficultyThreshold: { min: number; max: number };
  description: string;
  notes: string;
}

// ========== Environmental Combat Scenario Types ==========
export interface PhysicalFeature {
  id: string;
  name: string;
  description: string;
  mechanicalEffect: string;
  impactOnGameplay: string[];
}

export interface EnvironmentalMechanic {
  id: string;
  name: string;
  trigger: string;
  effect: string;
  damageType?: string;
  damageDice?: string;
  saveType?: string;
  saveDC?: number;
  areaOfEffect?: string;
}

export interface EnemyForce {
  id: string;
  name: string;
  type: string;
  count: number;
  specialAbilities: string[];
  tactics: string[];
  startingLocation?: string;
}

export interface DynamicChange {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  effect: string;
  tacticalImplication: string;
}

export interface EncounterOutcome {
  id: string;
  condition: string;
  result: string;
  consequences: string[];
}

export interface TransitionHook {
  id: string;
  name: string;
  description: string;
  prerequisites?: string[];
}

export interface EnvironmentalScenario {
  id: string;
  name: string;
  location: string;
  description: string;
  physicalFeatures: PhysicalFeature[];
  environmentalMechanics: EnvironmentalMechanic[];
  enemyForces: EnemyForce[];
  startingConditions: string;
  interactionMechanics: string[];
  dynamicChanges: DynamicChange[];
  outcomes: EncounterOutcome[];
  transitionHooks: TransitionHook[];
  notes: string;
}

// ========== XP Thresholds by Level ==========
export const XP_THRESHOLDS: Record<number, Record<Difficulty, number>> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
};

// Monster count multiplier
export const MONSTER_MULTIPLIER: Record<number, number> = {
  1: 1,
  2: 1.5,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2.5,
  8: 2.5,
  9: 2.5,
  10: 2.5,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 4,
};

export function getMonsterMultiplier(count: number): number {
  if (count <= 0) return 1;
  if (count >= 15) return 4;
  return MONSTER_MULTIPLIER[count] || 3;
}

// CR to XP mapping
export const CR_TO_XP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

// Common monster types
export const MONSTER_TYPES = [
  'Aberration',
  'Beast',
  'Celestial',
  'Construct',
  'Dragon',
  'Elemental',
  'Fey',
  'Fiend',
  'Giant',
  'Humanoid',
  'Monstrosity',
  'Ooze',
  'Plant',
  'Undead',
];

// Common terrain types
export const TERRAIN_TYPES = [
  'Mountain Pass',
  'Volcanic Field',
  'Icy Fjord',
  'Dense Forest',
  'Underground Cave',
  'Desert Ruins',
  'Swamp Marsh',
  'Coastal Cliff',
  'Urban Alley',
  'Temple Chamber',
  'River Crossing',
  'Frozen Tundra',
  'Jungle Temple',
  'Abandoned Mine',
  'Haunted Manor',
];

// Hazard categories
export const HAZARD_CATEGORIES = [
  'Natural Hazard',
  'Magical Effect',
  'Trap',
  'Weather',
  'Structural',
  'Environmental',
];

// Legendary monster CRs (typically CR 5+ with legendary actions)
export const LEGENDARY_MONSTER_CRS = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

// Helper to check if a monster is considered legendary
export function isLegendaryMonster(monster: Monster): boolean {
  if (monster.isLegendary !== undefined) return monster.isLegendary;
  // Monsters with CR 5+ are often legendary/complex encounters
  const crNum = monster.cr.includes('/') ? parseFloat(monster.cr) : parseInt(monster.cr);
  return crNum >= 5;
}

// Helper to get XP budget for an encounter based on difficulty
export function getEncounterXPBudget(partyLevel: number, playerCount: number, difficulty: Difficulty): number {
  const threshold = XP_THRESHOLDS[partyLevel]?.[difficulty] || 0;
  return threshold * playerCount;
}

// Helper to calculate adjusted XP for monsters
export function calculateAdjustedXP(monsters: Monster[]): number {
  const totalXP = monsters.reduce((sum, m) => sum + (m.xp * m.count), 0);
  const totalMonsterCount = monsters.reduce((sum, m) => sum + m.count, 0);
  const multiplier = getMonsterMultiplier(totalMonsterCount);
  return Math.floor(totalXP * multiplier);
}

// Helper to determine actual difficulty based on adjusted XP
export function determineDifficulty(adjustedXP: number, partyLevel: number, playerCount: number): Difficulty {
  const easyThreshold = (XP_THRESHOLDS[partyLevel]?.easy || 0) * playerCount;
  const mediumThreshold = (XP_THRESHOLDS[partyLevel]?.medium || 0) * playerCount;
  const hardThreshold = (XP_THRESHOLDS[partyLevel]?.hard || 0) * playerCount;
  const deadlyThreshold = (XP_THRESHOLDS[partyLevel]?.deadly || 0) * playerCount;
  
  if (adjustedXP >= deadlyThreshold) return 'deadly';
  if (adjustedXP >= hardThreshold) return 'hard';
  if (adjustedXP >= mediumThreshold) return 'medium';
  return 'easy';
}
