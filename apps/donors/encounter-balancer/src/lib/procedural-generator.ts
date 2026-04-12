// Procedural Generation Functions using the random tables
import {
  pick, pickN, randBetween, bellCurve, rollDice,
  TERRAIN_TYPES, TERRAIN_DESCRIPTIONS, PHYSICAL_FEATURES, ENVIRONMENTAL_MECHANICS,
  ENEMY_TYPES, TACTICAL_ELEMENTS, REWARD_TYPES, DYNAMIC_CHANGES,
  OUTCOME_CONDITIONS, TRANSITION_HOOKS, XP_THRESHOLDS, CR_TO_XP,
  MONSTER_SIZES, MONSTER_TYPES
} from './procedural-tables';
import type {
  PhysicalFeature, EnvironmentalMechanic, EnemyForce,
  DynamicChange, EncounterOutcome, TransitionHook,
  Monster, TacticalElement, Reward, Difficulty
} from './encounter-types';

// ============== ENVIRONMENTAL GENERATORS ==============

export function generateTerrain(): string {
  return pick(TERRAIN_TYPES);
}

export function generateDescription(location: string): string {
  const descriptions = TERRAIN_DESCRIPTIONS[location] || TERRAIN_DESCRIPTIONS['Dense Forest'];
  return pick(descriptions);
}

export function generatePhysicalFeature(location: string): PhysicalFeature {
  const features = PHYSICAL_FEATURES[location] || PHYSICAL_FEATURES['Dense Forest'];
  const feature = pick(features);
  
  return {
    id: `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: feature.name,
    description: feature.description,
    mechanicalEffect: feature.mechanicalEffect,
    impactOnGameplay: feature.impacts,
  };
}

export function generateEnvironmentalMechanic(location: string): EnvironmentalMechanic {
  const mechanics = ENVIRONMENTAL_MECHANICS[location] || ENVIRONMENTAL_MECHANICS['Dense Forest'];
  const mechanic = pick(mechanics);
  
  return {
    id: `mechanic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: mechanic.name,
    trigger: mechanic.trigger,
    effect: mechanic.effect,
    damageType: mechanic.damageType,
    damageDice: mechanic.damageDice,
    saveType: mechanic.saveType,
    saveDC: mechanic.saveDC,
    areaOfEffect: mechanic.areaOfEffect,
  };
}

export function generateEnemyForce(location: string, challengeLevel: string = 'medium'): EnemyForce {
  const enemies = ENEMY_TYPES[location] || ENEMY_TYPES['Dense Forest'];
  
  // Filter by challenge level if specified
  let filteredEnemies = enemies;
  if (challengeLevel === 'easy') {
    filteredEnemies = enemies.filter(e => e.cr === '1/4' || e.cr === '1/2' || e.cr === '1');
  } else if (challengeLevel === 'deadly') {
    filteredEnemies = enemies.filter(e => parseInt(e.cr) >= 3 || e.cr === '3' || e.cr === '4' || e.cr === '5');
  }
  if (filteredEnemies.length === 0) filteredEnemies = enemies;
  
  const enemy = pick(filteredEnemies);
  
  // Generate count based on CR and challenge level
  let count = 1;
  const crNum = enemy.cr.includes('/') ? parseFloat(enemy.cr) : parseInt(enemy.cr);
  if (crNum < 1) count = randBetween(2, 6);
  else if (crNum < 3) count = randBetween(1, 4);
  else if (crNum < 5) count = randBetween(1, 3);
  else count = randBetween(1, 2);
  
  if (challengeLevel === 'easy') count = Math.max(1, count - 1);
  if (challengeLevel === 'deadly') count = count + 1;
  
  return {
    id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: enemy.name,
    type: enemy.type,
    count,
    specialAbilities: enemy.abilities,
    tactics: enemy.tactics,
    startingLocation: generateStartingLocation(location),
  };
}

export function generateStartingLocation(location: string): string {
  const locations: Record<string, string[]> = {
    'Mountain Pass': ['On the high ledges', 'Behind boulders', 'At the narrow bridge', 'Climbing the cliffs'],
    'Volcanic Field': ['Emerging from lava pools', 'Behind rock formations', 'In the steam vents', 'On higher ground'],
    'Icy Fjord': ['On ice floes', 'In the water', 'On the glacier wall', 'Behind ice ridges'],
    'Dense Forest': ['Hidden in undergrowth', 'Up in the trees', 'Behind fallen logs', 'In the shadows'],
    'Underground Cave': ['On stalagmites', 'In dark corners', 'Dropped from ceiling', 'Emerged from water'],
    'Desert Ruins': ['In the shadows of pillars', 'Under the sand', 'In collapsed chambers', 'On the walls'],
    'Swamp Marsh': ['Half-submerged', 'On hummocks', 'Hidden in moss', 'In deep water'],
    'Coastal Cliff': ['On ledges', 'In sea caves', 'On rocky outcrops', 'Emerging from waves'],
    'Urban Alley': ['In the shadows', 'On rooftops', 'Behind stalls', 'In doorways'],
    'Temple Chamber': ['Behind pillars', 'On the dais', 'In alcoves', 'Disguised as statues'],
  };
  return pick(locations[location] || locations['Dense Forest']);
}

export function generateDynamicChange(): DynamicChange {
  const change = pick(DYNAMIC_CHANGES);
  
  return {
    id: `dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: change.name,
    trigger: change.trigger,
    timing: change.timing,
    effect: change.effect,
    tacticalImplication: change.tacticalImplication,
  };
}

export function generateOutcome(): EncounterOutcome {
  const outcome = pick(OUTCOME_CONDITIONS);
  
  return {
    id: `outcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    condition: outcome.condition,
    result: outcome.result,
    consequences: outcome.consequences,
  };
}

export function generateTransitionHook(location: string): TransitionHook {
  const hooks = TRANSITION_HOOKS[location] || TRANSITION_HOOKS['Dense Forest'];
  const hook = pick(hooks);
  
  return {
    id: `transition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: hook.name,
    description: hook.description,
    prerequisites: hook.prerequisites,
  };
}

// ============== ENCOUNTER BALANCER GENERATORS ==============

export function generateMonster(partyLevel: number, difficulty: Difficulty, location?: string): Monster {
  // Get appropriate CR range for difficulty
  const threshold = XP_THRESHOLDS[partyLevel]?.[difficulty] || 100;
  
  // Find enemies from location or generic
  let candidates = location ? (ENEMY_TYPES[location] || []) : [];
  if (candidates.length === 0) {
    // Flatten all enemies
    candidates = Object.values(ENEMY_TYPES).flat();
  }
  
  // Filter by XP appropriate for difficulty
  const minXP = Math.floor(threshold * 0.5);
  const maxXP = threshold * 2;
  
  const filtered = candidates.filter(e => {
    const xp = CR_TO_XP[e.cr] || 100;
    return xp >= minXP && xp <= maxXP;
  });
  
  const enemy = filtered.length > 0 ? pick(filtered) : pick(candidates);
  const xp = CR_TO_XP[enemy.cr] || 100;
  
  // Calculate count based on XP threshold
  let count = 1;
  if (xp < threshold * 0.3) count = Math.floor(threshold / xp);
  else if (xp < threshold * 0.6) count = randBetween(2, 3);
  
  count = Math.max(1, Math.min(count, difficulty === 'deadly' ? 8 : 6));
  
  return {
    id: `monster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: enemy.name,
    cr: enemy.cr,
    xp,
    size: pick(MONSTER_SIZES.slice(2, 5)), // Usually Medium to Large
    type: enemy.type,
    count,
    isCustom: true,
  };
}

export function generateTacticalElement(location?: string): TacticalElement {
  let element = pick(TACTICAL_ELEMENTS);
  
  // If location is specified, customize the description
  if (location) {
    element = {
      ...element,
      description: `${element.description} (natural to ${location})`,
    };
  }
  
  return {
    id: `tactical-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: element.name,
    description: element.description,
    type: element.type as TacticalElement['type'],
  };
}

export function generateReward(difficulty: string, partyLevel: number): Reward {
  const rewardType = pick(['treasure', 'item', 'story'] as const);
  const rewards = REWARD_TYPES[rewardType];
  const reward = pick(rewards);
  
  const value = 'minValue' in reward
    ? randBetween(reward.minValue, reward.maxValue) * partyLevel
    : undefined;
  
  return {
    id: `reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: rewardType,
    description: reward.description,
    value,
  };
}

export function generateEncounterNotes(monsters: string[], location?: string, difficulty?: string): string {
  const setups = [
    'The enemies are positioned strategically throughout the area, using the terrain to their advantage.',
    'Ambush predators wait for the perfect moment to strike.',
    'The encounter begins with enemies unaware of the party\'s presence.',
    'Enemies patrol in a pattern that can be exploited.',
    'The area shows signs of recent activity - campfire, tracks, etc.',
  ];
  
  const tactics = [
    'Focus fire on isolated party members.',
    'Use hit-and-run tactics when possible.',
    'Retreat to more defensible positions if pressed.',
    'Protect their leader at all costs.',
    'Call for reinforcements if the fight turns against them.',
  ];
  
  let notes = pick(setups) + '\n\n';
  notes += `Tactics: ${pick(tactics)}`;
  
  if (monsters.length > 0) {
    notes += `\n\nKey enemies: ${monsters.join(', ')}.`;
  }
  
  if (location) {
    notes += `\n\nEnvironment: ${location}.`;
  }
  
  return notes;
}

// ============== FULL ENCOUNTER GENERATORS ==============

export function generateFullEnvironmentalScenario(seed?: { location?: string; theme?: string; challengeLevel?: string }) {
  const location = seed?.location || generateTerrain();
  const challengeLevel = seed?.challengeLevel || 'medium';
  
  return {
    name: `The ${location} Encounter`,
    location,
    description: generateDescription(location),
    physicalFeatures: [
      generatePhysicalFeature(location),
      generatePhysicalFeature(location),
    ],
    environmentalMechanics: [generateEnvironmentalMechanic(location)],
    enemyForces: [generateEnemyForce(location, challengeLevel)],
    startingConditions: `Enemies begin ${generateStartingLocation(location)}. The environment is ${pick(['calm', 'unsettling', 'dangerous', 'ominous'])}.`,
    interactionMechanics: [
      'Characters can use the terrain for cover.',
      'Environmental hazards can be triggered intentionally.',
      'Some features can be climbed or used tactically.',
    ],
    dynamicChanges: [generateDynamicChange()],
    outcomes: [
      generateOutcome(),
      generateOutcome(),
    ],
    transitionHooks: [generateTransitionHook(location)],
    notes: 'Be ready to adapt based on player choices.',
  };
}

export function generateFullBalancedEncounter(seed: {
  partyLevel: number;
  playerCount: number;
  difficulty: Difficulty;
  location?: string;
}) {
  const { partyLevel, playerCount, difficulty, location } = seed;
  
  // Generate appropriate number of monsters
  const monsterCount = randBetween(2, 4);
  const monsters: Monster[] = [];
  
  for (let i = 0; i < monsterCount; i++) {
    monsters.push(generateMonster(partyLevel, difficulty, location));
  }
  
  // Generate tactical elements
  const tacticalCount = randBetween(1, 3);
  const tacticalElements: TacticalElement[] = [];
  
  for (let i = 0; i < tacticalCount; i++) {
    tacticalElements.push(generateTacticalElement(location));
  }
  
  // Generate rewards
  const rewardCount = randBetween(1, 2);
  const rewards: Reward[] = [];
  
  for (let i = 0; i < rewardCount; i++) {
    rewards.push(generateReward(difficulty, partyLevel));
  }
  
  // Calculate XP
  const totalXP = monsters.reduce((sum, m) => sum + (m.xp * m.count), 0);
  const totalMonsterCount = monsters.reduce((sum, m) => sum + m.count, 0);
  const multiplier = totalMonsterCount === 1 ? 1 : totalMonsterCount === 2 ? 1.5 : totalMonsterCount <= 6 ? 2 : totalMonsterCount <= 14 ? 2.5 : 3;
  const adjustedXP = Math.floor(totalXP * multiplier);
  
  const threshold = XP_THRESHOLDS[partyLevel];
  
  return {
    name: `${location || 'Ambush'} Encounter (Level ${partyLevel})`,
    partyInfo: {
      level: partyLevel,
      playerCount,
      keyAbilities: [],
      availableResources: [],
    },
    difficulty,
    monsters,
    tacticalElements,
    rewards,
    totalXP,
    adjustedXP,
    difficultyThreshold: {
      min: threshold?.easy || 0,
      max: threshold?.deadly || 0,
    },
    description: '',
    notes: generateEncounterNotes(
      monsters.map(m => m.name),
      location,
      difficulty
    ),
  };
}
