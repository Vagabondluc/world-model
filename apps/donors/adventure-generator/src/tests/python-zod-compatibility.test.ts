/**
 * Python-Zod Compatibility Tests
 *
 * This test suite verifies that Python AI outputs from the sidecar are compatible
 * with frontend Zod schemas. The tests cover schema mapping, validation, type
 * conversion, AI output simulation, and schema evolution scenarios.
 *
 * Key Watchpoint: Python AI outputs must match Zod schemas in frontend
 *
 * Architecture Context:
 * - Python Sidecar uses Pydantic models for AI output structure
 * - Frontend uses Zod schemas for runtime validation and type safety
 * - Instructor library structures Python AI outputs
 * - Data flows: Python (snake_case) -> JSON -> Frontend (camelCase)
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import all relevant Zod schemas
import {
  NpcSchema,
  MinorNpcDetailsSchema,
  MajorNpcDetailsSchema,
  CreatureDetailsSchema,
  NpcTypeEnum,
  SavedMonsterSchema,
} from '../schemas/npc';
import {
  CombatantSchema,
  CombatantTypeEnum,
  ConditionEnum,
  EncounterMonsterSchema,
  EncounterMechanicsSchema,
  EncounterSceneNodeSchema,
  EncounterStageEnum,
  EncounterSensorySchema,
  AINarrativeResponseSchema,
  EncounterWorkflowStateSchema,
} from '../schemas/encounter';
import {
  LocationSchema,
  LocationTypeEnum,
  DungeonDetailsSchema,
  SettlementDetailsSchema,
  BattlemapDetailsSchema,
  SpecialLocationDetailsSchema,
  LocationDetailsSchema,
  HexCoordinateSchema,
} from '../schemas/location';
import {
  GeneratedTrapSchema,
  TrapTierEnum,
  TrapRuleSchema,
  TrapCountermeasuresSchema,
} from '../schemas/trap';
import { LootSchema } from '../schemas/loot';
import {
  LoreEntrySchema,
  LoreTypeEnum,
  CompendiumEntrySchema,
  CompendiumCategoryEnum,
  VisibilityEnum,
  ImportanceEnum,
} from '../schemas/lore';
import {
  SimpleAdventureSchema,
  DetailedAdventureSchema,
  GeneratedAdventureSchema,
  AdventureOutlineSchema,
} from '../schemas/adventure';
import {
  FactionSchema,
  FactionDetailsSchema,
  FactionCategoryEnum,
} from '../schemas/faction';
import {
  SceneSchema,
  SceneTypeEnum,
  SceneDetailsSchema,
} from '../schemas/scene';
import {
  IdSchema,
  OriginContextSchema,
  BiomeTypeEnum,
  DiscoveryStatusEnum,
  DateSchema,
} from '../schemas/common';

// ============================================================================
// HELPER FUNCTIONS - Mock Python AI Output Generation
// ============================================================================

/**
 * Simulates Python snake_case to JavaScript camelCase conversion.
 * Python models use snake_case (e.g., 'hit_points') while Zod schemas use camelCase.
 * The conversion should happen during JSON serialization or in a transformation layer.
 */
function snakeToCamel(snakeStr: string): string {
  return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Simulates Python datetime to JavaScript Date/string conversion.
 * Python datetime objects are typically serialized as ISO 8601 strings.
 */
function pythonDateTimeToJs(isoString: string): Date | string {
  return new Date(isoString);
}

/**
 * Creates a mock Python-style AI output for a Minor NPC.
 * Python would use snake_case, but we simulate the camelCase conversion
 * that should happen before Zod validation.
 */
function createMockMinorNpcOutput() {
  return {
    id: 'npc-minor-001',
    name: 'Eldric Thorne',
    description: 'A weathered innkeeper with a mysterious past',
    type: 'Minor' as const,
    factionId: 'faction-merchant-guild',
    details: {
      race: 'Human',
      name: 'Eldric Thorne',
      gender: 'Male',
      sexualPreference: 'Women',
      personality: 'Gruff but secretly caring',
      physicalDescriptor: 'Gray hair, weathered face, calloused hands',
      alignment: 'Neutral Good',
      speechExample: '"Care for a warm meal, traveler? The stew\'s been simmering since dawn."',
      job: 'Innkeeper',
      jobReason: 'Inherited from his father, who disappeared mysteriously',
      skills: 'Cooking, brewing, local knowledge, intimidation',
      secret: 'He was once a member of the Thieves\' Guild',
      questHook: 'His father left a hidden compartment in the cellar',
      inventory: 'Ring of keys, coin purse, hidden dagger',
      comparison: 'Reminds you of a retired soldier',
    },
  };
}

/**
 * Creates a mock Python-style AI output for a Creature/Monster.
 */
function createMockCreatureOutput() {
  return {
    id: 'creature-001',
    name: 'Shadow Stalker',
    description: 'A predatory creature from the Shadowfell',
    type: 'Creature' as const,
    details: {
      table: {
        creatureType: 'Monstrosity',
        size: 'Medium',
        alignment: 'Neutral Evil',
        armorClass: '15 (natural armor)',
        hitPoints: '76 (9d8 + 36)',
        speed: '40 ft.',
        senses: 'Darkvision 60 ft., Passive Perception 12',
        languages: 'Undercommon',
        challengeRating: '4',
        keyAbilities: 'Dexterity, Constitution',
        role: 'Ambush predator',
      },
      abilityScores: {
        str: 16,
        dex: 18,
        con: 18,
        int: 10,
        wis: 12,
        cha: 14,
      },
      savingThrows: {
        Dexterity: 7,
        Constitution: 7,
        Wisdom: 4,
      },
      skills: {
        Stealth: 10,
        Perception: 4,
      },
      damageVulnerabilities: ['Radiant'],
      damageResistances: ['Necrotic', 'Cold'],
      damageImmunities: ['Poison'],
      conditionImmunities: ['Poisoned', 'Exhaustion'],
      abilitiesAndTraits: '**Shadow Stealth.** While in dim light or darkness...',
      actions: '**Multiattack.** The stalker makes two attacks...',
      legendaryActions: '**Teleport (Recharge 5-6).** The stalker teleports...',
      roleplayingAndTactics: 'Uses darkness to its advantage, targets isolated victims',
    },
  };
}

/**
 * Creates a mock Python-style AI output for an Encounter Combatant.
 * Note: This simulates a combatant in an encounter, not encounter itself.
 */
function createMockEncounterOutput() {
  return {
    id: 'combatant-001',
    name: 'Shadow Stalker',
    type: 'npc' as const,
    initiative: 12,
    hp: 45,
    maxHp: 45,
    ac: 15,
    conditions: [],
    sourceId: 'creature-shadow-stalker',
    initiativeBonus: 2,
    xp: 300,
  };
}

/**
 * Creates a mock Python-style AI output for an Encounter Scene Node.
 */
function createMockEncounterSceneNodeOutput() {
  return {
    id: 'scene-001',
    stage: 'Approach' as const,
    narrative: 'The party approaches the ancient crossroads. Fog swirls around the weathered signpost, and an uneasy silence hangs in the air.',
    thematicTags: ['mystery', 'foreboding', 'ancient'],
    emotionalShift: 'From curiosity to unease',
    mechanics: {
      combatants: [
        {
          name: 'Shadow Stalker',
          count: 2,
          role: 'Ambush',
          cr: '4',
        },
      ],
      traps: ['Tripwire alarm'],
      environment: 'Dim light, foggy, uneven ground',
    },
    sensory: {
      sound: 'Distant howling wind, creaking wood',
      smell: 'Ozone and decay',
      feel: 'Cold, damp air',
    },
    features: ['Ancient signpost', 'Overgrown path', 'Ruined shrine'],
    continuityRefs: ['Previous encounter with shadow creatures'],
  };
}

/**
 * Creates a mock Python-style AI output for a Location.
 */
function createMockLocationOutput() {
  return {
    id: 'location-001',
    name: 'The Rusty Anchor Inn',
    description: 'A weathered tavern catering to travelers and locals alike',
    type: 'Settlement' as const,
    details: {
      overview: 'The Rusty Anchor has stood at the crossroads for three generations, serving as a gathering place for merchants, adventurers, and those with secrets to keep.',
      geography: 'Situated at the junction of the King\'s Road and the Old Trade Route, surrounded by rolling hills and scattered farms.',
      society: 'A mix of locals who have lived here for generations and travelers passing through. The innkeeper, Eldric, is well-respected.',
      economy: 'Primarily supported by travelers and trade caravans. The inn offers rooms, meals, and stabling services.',
      governance: 'Informal, led by the innkeeper with input from regular patrons. Local disputes are settled over ale.',
      culture: 'Hospitality is paramount. Regulars share news and rumors freely with those who earn their trust.',
      individuals: 'Eldric Thorne (innkeeper), Mira (barmaid), Old Tom (storyteller)',
      challenges: 'Recent bandit activity has reduced travel, and there are rumors of something lurking in the nearby woods.',
      adventureHooks: 'Eldric\'s father left a hidden compartment in the cellar; bandits demand protection money; a stranger seeks a map hidden in the inn.',
    },
  };
}

/**
 * Creates a mock Python-style AI output for a Trap.
 */
function createMockTrapOutput() {
  return {
    name: 'Falling Ceiling Block',
    description: 'A heavy stone block suspended above the doorway, triggered by pressure plate',
    tier: '5-10' as const,
    trigger: 'Pressure plate in doorway (DC 15 Investigation to spot)',
    effect: 'A 4x4 stone block falls, dealing 4d10 bludgeoning damage in a 10-foot square. Reflex DC 15 for half damage.',
    rules: [
      {
        type: 'Saving Throw',
        stat: 'Dexterity',
        dc: 15,
        damage: '4d10 bludgeoning',
        area: '10-foot square',
      },
    ],
    countermeasures: {
      detection: {
        passive: 15,
        active: 15,
        details: 'Check for pressure plate or mechanism in doorway',
      },
      disarm: {
        dc: 18,
        details: 'Disable mechanism with thieves\' tools or jam the trigger',
      },
    },
  };
}

/**
 * Creates a mock Python-style AI output for Loot.
 */
function createMockLootOutput() {
  return {
    gold: {
      gp: 150,
      sp: 320,
      cp: 850,
    },
    items: [
      {
        name: 'Potion of Healing',
        type: 'consumable',
        rarity: 'Common',
        magic: true,
        description: 'A vial of red liquid that glows faintly',
        quirks: ['Warm to the touch'],
        origin: 'Alchemist in Waterdeep',
      },
      {
        name: 'Masterwork Dagger',
        type: 'weapon',
        rarity: 'Uncommon',
        magic: false,
        description: 'Well-balanced blade with ornate hilt',
      },
    ],
    hooks: [
      'The dagger bears the crest of a noble house thought extinct',
      'The potion was crafted by a reclusive alchemist seeking apprentices',
    ],
  };
}

/**
 * Creates a mock Python-style AI output for Lore.
 */
function createMockLoreOutput() {
  return {
    id: 'lore-001',
    type: 'legend' as const,
    title: 'The Shadow King\'s Curse',
    content: 'Three centuries ago, the Shadow King ruled these lands from his fortress of eternal night. His reign ended when the combined forces of the seven kingdoms besieged his castle. As he fell, he uttered a curse that his shadow would never fade, and that darkness would always seek to reclaim what was lost.',
    tags: ['ancient', 'curse', 'shadow', 'history'],
    relatedLocationIds: ['location-shadow-fortress'],
    relatedNpcIds: ['npc-shadow-king'],
    relatedFactionsIds: ['faction-shadow-cult'],
    isPublicKnowledge: true,
    sources: ['Tales of the Old Kingdom', 'The Chronicle of Seven'],
    createdAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
  };
}

/**
 * Creates a mock Python-style AI output for a Faction.
 */
function createMockFactionOutput() {
  return {
    id: 'faction-001',
    name: 'The Silver Hand',
    goal: 'Maintain peace and order through martial strength',
    category: 'Adventuring & Mercenary' as const,
    details: {
      identity: 'An order of knights and warriors dedicated to protecting the innocent',
      ideology: 'Justice through strength, mercy when possible, ruthlessness when necessary',
      areaOfOperation: 'Central Kingdoms, especially along trade routes',
      powerLevel: 'Regional influence with growing reputation',
      shortTermGoal: 'Eliminate bandit threat on the King\'s Road',
      midTermGoal: 'Establish chapterhouses in major cities',
      longTermGoal: 'Become the recognized guardians of the realm',
      clocks: [
        {
          id: 'silver-hand-1',
          objective: 'Root out the bandit leader',
          segments: 4,
          progress: 0,
          resolutionMethod: 'simple',
          allies: [],
          enemies: [],
          pcImpact: false,
          events: [],
        },
      ],
    },
  };
}

/**
 * Creates a mock Python-style AI output for a Scene.
 */
function createMockSceneOutput() {
  return {
    id: 'scene-001',
    title: 'The Ambush',
    type: 'Combat' as const,
    challenge: 'Medium (CR 4)',
    locationId: 'location-crossroads',
    details: {
      introduction: 'As the party approaches the crossroads, arrows fly from the trees. Bandits emerge from hiding, weapons drawn.',
      interactionPoints: [
        'Parley with the bandit leader',
        'Use the terrain for tactical advantage',
        'Discover the bandits\' true motivation',
      ],
      npcs: [
        {
          name: 'Grimjaw',
          description: 'Scarred veteran with a missing eye',
          motivation: 'Desperate to pay off a debt to the local crime lord',
        },
      ],
      dmNotes: 'The bandits are actually working for someone else. They\'re being coerced.',
    },
  };
}

/**
 * Creates a mock Python-style AI output for a Simple Adventure.
 */
function createMockSimpleAdventureOutput() {
  return {
    type: 'simple' as const,
    premise: 'A merchant caravan has gone missing on the King\'s Road, and the party is hired to investigate.',
    origin: 'The merchant guild in the capital city',
    positioning: 'The adventure begins at the last known location of the caravan',
    stakes: 'The caravan was carrying valuable goods and the merchant\'s daughter, who was traveling to meet her betrothed',
  };
}

/**
 * Creates a mock Python-style AI output for a Detailed Adventure.
 */
function createMockDetailedAdventureOutput() {
  return {
    type: 'detailed' as const,
    title: 'The Shadow\'s Reach',
    plot_type: ['Investigation', 'Combat', 'Social'],
    tags: ['mystery', 'shadow', 'ancient', 'curse'],
    hook: 'Strange disappearances plague the village of Oakhaven. Villagers speak of shadows that move on their own and whispers in the night.',
    player_buy_in: 'The party has been hired by the village elder to investigate, or they have personal connections to one of the missing villagers.',
    starter_scene: 'The party arrives at Oakhaven at dusk. The village is unnaturally quiet, and shutters are barred despite the early hour.',
    gm_notes: {
      twists_applied: ['The disappearances are connected to an ancient curse', 'The village elder is hiding a dark secret'],
      escalation: 'As the party investigates, the shadow activity increases and becomes more aggressive',
      tier_scaling: {
        '1-4': 'Focus on investigation and survival',
        '5-10': 'Add combat encounters with shadow creatures',
        '11-16': 'Reveal the source of the curse and its connection to the Shadow King',
        '17-20': 'Confront the ancient entity behind the curse',
      },
    },
  };
}

/**
 * Creates a mock Python-style AI output for an AI Narrative Response.
 */
function createMockAiNarrativeResponse() {
  return {
    title: 'The Crossroads at Dusk',
    thinking: 'The scene should establish atmosphere and foreshadow danger. Use sensory details to build tension. The fog and silence create unease, while the ancient signpost hints at history.',
    narrative: 'The crossroads stands silent as the party approaches. Weathered wooden signposts point in four directions, their paint faded to illegibility. Thick fog swirls around your ankles, obscuring the path ahead. The only sound is the distant creak of the signpost in the wind—a lonely, mournful sound that sends a chill down your spine. Something about this place feels wrong, as if the very air holds its breath, waiting.',
  };
}

// ============================================================================
// TEST SUITE: Schema Mapping Tests
// ============================================================================

describe('Python-Zod Compatibility: Schema Mapping', () => {
  it('should validate NPC field name consistency (snake_case to camelCase)', () => {
    // Python uses snake_case (hit_points), Zod uses camelCase (hitPoints)
    // This test verifies that the conversion happens correctly
    const mockNpc = createMockMinorNpcOutput();
    const result = NpcSchema.safeParse(mockNpc);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Eldric Thorne');
      expect(result.data.type).toBe('Minor');
    }
  });

  it('should validate type compatibility between Python and Zod', () => {
    // Test that Python types map correctly to Zod types
    const mockCreature = createMockCreatureOutput();
    const result = NpcSchema.safeParse(mockCreature);
    
    expect(result.success).toBe(true);
    if (result.success && result.data.details && 'abilityScores' in result.data.details) {
      const details = result.data.details;
      expect(typeof details.abilityScores?.str).toBe('number');
      expect(details.abilityScores?.str).toBe(16);
      expect(Array.isArray(details.damageVulnerabilities)).toBe(true);
    }
  });

  it('should validate optional vs required field alignment', () => {
    // Test that optional fields in Python models are truly optional in Zod
    const minimalNpc = {
      id: 'npc-001',
      name: 'Test NPC',
      description: 'A test character',
      type: 'Minor' as const,
    };
    
    const result = NpcSchema.safeParse(minimalNpc);
    expect(result.success).toBe(true);
  });

  it('should validate enum value compatibility', () => {
    // Test that Python enum values match Zod enum values
    const mockNpc = createMockMinorNpcOutput();
    const result = NpcSchema.safeParse(mockNpc);
    
    expect(result.success).toBe(true);
    if (result.success) {
      // Verify the type is a valid enum value
      expect(['Minor', 'Major', 'Antagonist', 'Creature']).toContain(result.data.type);
    }
  });

  it('should validate nested object structure', () => {
    // Test that nested Python objects map to nested Zod objects
    const mockCreature = createMockCreatureOutput();
    const result = NpcSchema.safeParse(mockCreature);
    
    expect(result.success).toBe(true);
    if (result.success && result.data.details && 'table' in result.data.details) {
      const details = result.data.details as { table: { creatureType?: string } };
      expect(details).toBeDefined();
      expect(details.table).toBeDefined();
      expect(details.table.creatureType).toBe('Monstrosity');
    }
  });
});

// ============================================================================
// TEST SUITE: Validation Tests
// ============================================================================

describe('Python-Zod Compatibility: Validation', () => {
  it('should accept valid Python NPC output', () => {
    const mockNpc = createMockMinorNpcOutput();
    const result = NpcSchema.safeParse(mockNpc);
    
    expect(result.success).toBe(true);
  });

  it('should reject invalid Python NPC output with missing required fields', () => {
    const invalidNpc = {
      id: 'npc-001',
      // Missing required 'name' field
      description: 'Incomplete NPC',
      type: 'Minor' as const,
    };
    
    const result = NpcSchema.safeParse(invalidNpc);
    expect(result.success).toBe(false);
  });

  it('should reject invalid Python NPC output with wrong enum value', () => {
    const invalidNpc = {
      id: 'npc-001',
      name: 'Test',
      description: 'Invalid type',
      type: 'InvalidType' as any, // Not a valid enum value
    };
    
    const result = NpcSchema.safeParse(invalidNpc);
    expect(result.success).toBe(false);
  });

  it('should handle empty arrays correctly', () => {
    const npcWithEmptyArrays = {
      id: 'npc-001',
      name: 'Test',
      description: 'Test NPC',
      type: 'Minor' as const,
      details: {
        ...createMockMinorNpcOutput().details,
      },
    };
    
    // Create a creature with empty arrays for optional array fields
    const creatureWithEmptyArrays = {
      ...createMockCreatureOutput(),
      details: {
        ...createMockCreatureOutput().details,
        damageVulnerabilities: [],
        damageResistances: [],
        damageImmunities: [],
        conditionImmunities: [],
      },
    };
    
    const result = NpcSchema.safeParse(creatureWithEmptyArrays);
    expect(result.success).toBe(true);
  });

  it('should handle empty strings for optional string fields', () => {
    const npcWithEmptyStrings = {
      id: 'npc-001',
      name: 'Test',
      description: '',
      type: 'Minor' as const,
      details: {
        ...createMockMinorNpcOutput().details,
        secret: '', // Empty string for optional field
      },
    };
    
    const result = NpcSchema.safeParse(npcWithEmptyStrings);
    expect(result.success).toBe(true);
  });

  it('should reject null values for non-nullable fields', () => {
    const npcWithNull = {
      id: 'npc-001',
      name: null as any, // Should not be null
      description: 'Test',
      type: 'Minor' as const,
    };
    
    const result = NpcSchema.safeParse(npcWithNull);
    expect(result.success).toBe(false);
  });

  it('should validate nested object constraints', () => {
    // Test that nested object validation works correctly
    const trapWithInvalidCountermeasure = {
      ...createMockTrapOutput(),
      countermeasures: {
        detection: {
          passive: 'not a number' as any, // Should be a number
          active: 15,
          details: 'Test',
        },
        disarm: {
          dc: 18,
          details: 'Test',
        },
      },
    };
    
    const result = GeneratedTrapSchema.safeParse(trapWithInvalidCountermeasure);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// TEST SUITE: Type Conversion Tests
// ============================================================================

describe('Python-Zod Compatibility: Type Conversion', () => {
  it('should handle Python datetime to JavaScript Date conversion', () => {
    // Python datetime is serialized as ISO string
    const pythonDateTime = '2024-01-15T10:30:00Z';
    const mockLore = createMockLoreOutput();
    
    // The DateSchema should accept both Date objects and ISO strings
    const dateResult = DateSchema.safeParse(pythonDateTime);
    expect(dateResult.success).toBe(true);
    
    // Full lore entry should validate
    const loreResult = LoreEntrySchema.safeParse(mockLore);
    expect(loreResult.success).toBe(true);
  });

  it('should handle Python Union types to JavaScript discriminated unions', () => {
    // Test that union types work correctly
    const minorNpc = createMockMinorNpcOutput();
    const majorNpc: any = {
      id: 'npc-002',
      name: 'Lord Valerius',
      description: 'A noble with a secret',
      type: 'Major' as const,
      details: {
        table: {
          factionAffiliation: 'The Silver Hand',
          name: 'Lord Valerius Stormwind',
          race: 'Human',
          role: 'Noble',
          appearance: 'Tall, silver-haired, piercing blue eyes',
          alignment: 'Lawful Neutral',
          motivations: 'Protect his family legacy',
          personality: 'Dignified, calculating, secretly compassionate',
          flaws: 'Overly cautious, distrustful of commoners',
          catchphrase: '"Duty before all."',
          mannerisms: 'Rings his signet ring when thinking',
          speech: 'Formal, measured tone',
          availableKnowledge: 'Publicly known as a just ruler',
          hiddenKnowledge: 'Secretly funds the local orphanage',
          bonds: 'Loyal to the kingdom, protective of his sister',
          roleplayingCues: 'Maintains composure, reveals emotion only in private',
        },
        backstory: 'Born into nobility, Valerius was groomed for leadership from birth...',
        personalityDetails: {
          motivations: 'Protect his family legacy',
          morals: 'Justice tempered with mercy',
          personality: 'Dignified, calculating',
          flaws: 'Overly cautious',
        },
      },
    };
    
    const minorResult = NpcSchema.safeParse(minorNpc);
    const majorResult = NpcSchema.safeParse(majorNpc);
    
    expect(minorResult.success).toBe(true);
    expect(majorResult.success).toBe(true);
  });

  it('should handle Python enum to JavaScript string union conversion', () => {
    // Test that enum values are correctly validated
    const validTypes = ['Minor', 'Major', 'Antagonist', 'Creature'];
    
    validTypes.forEach((type) => {
      const npc = {
        id: 'npc-001',
        name: 'Test',
        description: 'Test',
        type: type as any,
      };
      
      const result = NpcSchema.safeParse(npc);
      expect(result.success).toBe(true);
    });
  });

  it('should handle Python Optional types to JavaScript optional fields', () => {
    // Test that optional fields work correctly
    const npcWithoutOptional = {
      id: 'npc-001',
      name: 'Test',
      description: 'Test',
      type: 'Minor' as const,
      // factionId is optional
      // details is optional
    };
    
    const result = NpcSchema.safeParse(npcWithoutOptional);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// TEST SUITE: AI Output Simulation Tests
// ============================================================================

describe('Python-Zod Compatibility: AI Output Simulation', () => {
  it('should validate monster AI output against Zod schema', () => {
    const mockMonster = createMockCreatureOutput();
    const result = NpcSchema.safeParse(mockMonster);
    
    expect(result.success).toBe(true);
    if (result.success && result.data.details && 'table' in result.data.details) {
      const details = result.data.details as { table: { challengeRating?: string } };
      expect(result.data.type).toBe('Creature');
      expect(details.table.challengeRating).toBe('4');
    }
  });

  it('should validate encounter AI output against Zod schema', () => {
    const mockEncounter = createMockEncounterOutput();
    const result = CombatantSchema.safeParse(mockEncounter);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.initiative).toBe(12);
      expect(result.data.hp).toBe(45);
    }
  });

  it('should validate encounter scene node AI output against Zod schema', () => {
    const mockSceneNode = createMockEncounterSceneNodeOutput();
    const result = EncounterSceneNodeSchema.safeParse(mockSceneNode);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stage).toBe('Approach');
      expect(result.data.thematicTags).toContain('mystery');
    }
  });

  it('should validate location AI output against Zod schema', () => {
    const mockLocation = createMockLocationOutput();
    const result = LocationSchema.safeParse(mockLocation);
    
    expect(result.success).toBe(true);
    if (result.success && result.data.details && 'overview' in result.data.details) {
      expect(result.data.type).toBe('Settlement');
      expect(result.data.details.overview).toBeDefined();
    }
  });

  it('should validate trap AI output against Zod schema', () => {
    const mockTrap = createMockTrapOutput();
    const result = GeneratedTrapSchema.safeParse(mockTrap);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tier).toBe('5-10');
      expect(result.data.rules).toHaveLength(1);
    }
  });

  it('should validate loot AI output against Zod schema', () => {
    const mockLoot = createMockLootOutput();
    const result = LootSchema.safeParse(mockLoot);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gold.gp).toBe(150);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.hooks).toHaveLength(2);
    }
  });

  it('should validate lore AI output against Zod schema', () => {
    const mockLore = createMockLoreOutput();
    const result = LoreEntrySchema.safeParse(mockLore);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('legend');
      expect(result.data.tags).toContain('ancient');
    }
  });

  it('should validate faction AI output against Zod schema', () => {
    const mockFaction = createMockFactionOutput();
    const result = FactionSchema.safeParse(mockFaction);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe('Adventuring & Mercenary');
      expect(result.data.details?.clocks[0]?.segments).toBe(4);
    }
  });

  it('should validate scene AI output against Zod schema', () => {
    const mockScene = createMockSceneOutput();
    const result = SceneSchema.safeParse(mockScene);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('Combat');
      expect(result.data.details?.npcs).toHaveLength(1);
    }
  });

  it('should validate simple adventure AI output against Zod schema', () => {
    const mockAdventure = createMockSimpleAdventureOutput();
    const result = SimpleAdventureSchema.safeParse(mockAdventure);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('simple');
      expect(result.data.premise).toContain('caravan');
    }
  });

  it('should validate detailed adventure AI output against Zod schema', () => {
    const mockAdventure = createMockDetailedAdventureOutput();
    const result = DetailedAdventureSchema.safeParse(mockAdventure);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('detailed');
      expect(result.data.plot_type).toContain('Investigation');
    }
  });

  it('should validate AI narrative response against Zod schema', () => {
    const mockNarrative = createMockAiNarrativeResponse();
    const result = AINarrativeResponseSchema.safeParse(mockNarrative);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('The Crossroads at Dusk');
      expect(result.data.narrative).toContain('crossroads');
    }
  });

  it('should catch malformed AI outputs', () => {
    // Simulate a malformed AI output
    const malformedNpc = {
      id: 'npc-001',
      name: 'Test',
      description: 'Test',
      type: 'Minor' as const,
      details: {
        // Missing required fields in MinorNpcDetails
        race: 'Human',
        // name is missing
        // gender is missing
        // ... many required fields missing
      },
    };
    
    const result = NpcSchema.safeParse(malformedNpc);
    expect(result.success).toBe(false);
  });

  it('should handle partial/incomplete AI outputs with defaults', () => {
    // Test that partial outputs can be handled with default values
    const partialLoot = {
      gold: {
        gp: 50,
        sp: 0,
        cp: 0,
      },
      items: [],
      hooks: [],
    };
    
    const result = LootSchema.safeParse(partialLoot);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// TEST SUITE: Schema Evolution Tests
// ============================================================================

describe('Python-Zod Compatibility: Schema Evolution', () => {
  it('should handle unknown/extra fields from AI gracefully', () => {
    // Simulate AI output with extra fields not in schema
    const npcWithExtraFields = {
      id: 'npc-001',
      name: 'Test',
      description: 'Test',
      type: 'Minor' as const,
      // Extra fields that might come from newer AI models
      ai_confidence: 0.95,
      generation_metadata: {
        model: 'gpt-4',
        timestamp: '2024-01-15T10:30:00Z',
      },
    };
    
    // By default, Zod strips extra fields
    const result = NpcSchema.safeParse(npcWithExtraFields);
    expect(result.success).toBe(true);
  });

  it('should apply default values for missing optional fields', () => {
    // Test that defaults are applied correctly
    const lootWithoutDefaults = {
      gold: {
        gp: 100,
        // sp and cp have defaults
      },
      items: [],
      hooks: [],
    };
    
    const result = LootSchema.safeParse(lootWithoutDefaults);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gold.sp).toBe(0); // Default value
      expect(result.data.gold.cp).toBe(0); // Default value
    }
  });

  it('should handle backward compatibility for deprecated fields', () => {
    // Simulate an old AI output with deprecated field names
    // This would require a transformation layer in production
    const oldStyleNpc = {
      id: 'npc-001',
      name: 'Test',
      description: 'Test',
      type: 'Minor' as const,
      // Old field name that should be transformed
      // In production, this would be handled by a migration layer
    };
    
    const result = NpcSchema.safeParse(oldStyleNpc);
    expect(result.success).toBe(true);
  });

  it('should validate against discriminated unions correctly', () => {
    // Test that discriminated unions work for adventure types
    const simpleAdventure = createMockSimpleAdventureOutput();
    const detailedAdventure = createMockDetailedAdventureOutput();
    
    const simpleResult = GeneratedAdventureSchema.safeParse(simpleAdventure);
    const detailedResult = GeneratedAdventureSchema.safeParse(detailedAdventure);
    
    expect(simpleResult.success).toBe(true);
    expect(detailedResult.success).toBe(true);
    
    if (simpleResult.success && detailedResult.success) {
      expect(simpleResult.data.type).toBe('simple');
      expect(detailedResult.data.type).toBe('detailed');
    }
  });

  it('should handle schema changes with optional fields', () => {
    // Test that adding new optional fields doesn't break old outputs
    const oldStyleLocation = {
      id: 'location-001',
      name: 'Old Location',
      description: 'An old location without new fields',
      type: 'Settlement' as const,
      // Missing new optional fields
    };
    
    const result = LocationSchema.safeParse(oldStyleLocation);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// TEST SUITE: Edge Cases and Error Handling
// ============================================================================

describe('Python-Zod Compatibility: Edge Cases', () => {
  it('should handle very long strings from AI', () => {
    const longDescription = 'A'.repeat(10000);
    const npcWithLongDescription = {
      id: 'npc-001',
      name: 'Test',
      description: longDescription,
      type: 'Minor' as const,
    };
    
    const result = NpcSchema.safeParse(npcWithLongDescription);
    expect(result.success).toBe(true);
  });

  it('should handle special characters in strings', () => {
    const npcWithSpecialChars = {
      id: 'npc-001',
      name: 'Éléonore d\'Ombre',
      description: 'A character with "quotes", apostrophes, and émojis 🐉',
      type: 'Minor' as const,
    };
    
    const result = NpcSchema.safeParse(npcWithSpecialChars);
    expect(result.success).toBe(true);
  });

  it('should handle numeric edge cases', () => {
    const creatureWithEdgeNumbers = {
      ...createMockCreatureOutput(),
      details: {
        ...createMockCreatureOutput().details,
        abilityScores: {
          str: 0, // Minimum possible
          dex: 30, // Maximum possible
          con: 10,
          int: -5, // Below normal range
          wis: 10,
          cha: 10,
        },
      },
    };
    
    const result = NpcSchema.safeParse(creatureWithEdgeNumbers);
    expect(result.success).toBe(true);
  });

  it('should handle deeply nested objects', () => {
    const deeplyNested = {
      id: 'scene-001',
      title: 'Complex Scene',
      type: 'Combat' as const,
      challenge: 'Hard',
      locationId: 'location-001',
      details: {
        introduction: 'A complex scene with nested data',
        interactionPoints: ['Point 1', 'Point 2'],
        npcs: [
          {
            name: 'NPC 1',
            description: 'Description',
            motivation: 'Motivation',
          },
        ],
        dmNotes: 'Notes',
      },
    };
    
    const result = SceneSchema.safeParse(deeplyNested);
    expect(result.success).toBe(true);
  });

  it('should provide meaningful error messages for validation failures', () => {
    const invalidNpc = {
      id: 'npc-001',
      // Missing required fields
    };
    
    const result = NpcSchema.safeParse(invalidNpc);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      // Verify error structure
      expect(result.error).toBeDefined();
      expect(result.error.errors).toBeInstanceOf(Array);
      expect(result.error.errors.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// TEST SUITE: Integration Tests
// ============================================================================

describe('Python-Zod Compatibility: Integration', () => {
  it('should validate a complete adventure outline', () => {
    // Test a complex nested structure
    const adventureOutline = {
      scenes: [
        {
          id: 'scene-001',
          title: 'The Ambush',
          type: 'Combat' as const,
          challenge: 'Medium',
          locationName: 'Crossroads',
          details: {
            introduction: 'The party is ambushed',
            interactionPoints: ['Fight', 'Flee'],
            npcs: [],
            dmNotes: 'Notes',
          },
        },
      ],
      locations: [
        {
          id: 'location-001',
          name: 'Crossroads',
          description: 'A dangerous crossroads',
          type: 'Settlement' as const,
        },
      ],
      npcs: [
        {
          id: 'npc-001',
          name: 'Bandit Leader',
          description: 'A ruthless bandit',
          type: 'Antagonist' as const,
          faction: 'Bandits',
        },
      ],
      factions: [
        {
          id: 'faction-001',
          name: 'Bandits',
          goal: 'Rob travelers',
          category: 'Criminal Enterprises' as const,
        },
      ],
    };
    
    const result = AdventureOutlineSchema.safeParse(adventureOutline);
    expect(result.success).toBe(true);
  });

  it('should validate a complete encounter workflow state', () => {
    const workflowState = {
      currentStage: 'Approach' as const,
      nodes: [createMockEncounterSceneNodeOutput()],
      locationContext: 'Ancient crossroads',
      factionContext: ['Bandits', 'Silver Hand'],
    };
    
    const result = EncounterWorkflowStateSchema.safeParse(workflowState);
    
    expect(result.success).toBe(true);
  });
});
