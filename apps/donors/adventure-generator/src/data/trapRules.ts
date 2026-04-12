
import { TrapTier } from '../types/trap';

export interface ScalingStats {
    dc: number;
    attack: number;
    damageDice: string; // e.g., "2d10"
    saveDamage: string; // usually half on save
}

export const TIER_STATS: Record<TrapTier, ScalingStats> = {
    '1-4': { dc: 11, attack: 5, damageDice: '2d10', saveDamage: 'half' },
    '5-10': { dc: 14, attack: 8, damageDice: '4d10', saveDamage: 'half' },
    '11-16': { dc: 17, attack: 11, damageDice: '10d10', saveDamage: 'half' },
    '17-20': { dc: 20, attack: 14, damageDice: '18d10', saveDamage: 'half' },
};

export interface TrapComponent {
    id: string;
    text: string;
    tags: string[]; // Tags provided by this component
    requireTags?: string[]; // Tags required to select this component
    incompatibleTags?: string[]; // Tags that prevent this component
    type?: 'attack' | 'save' | 'auto';
    saveStat?: 'Strength' | 'Dexterity' | 'Constitution' | 'Wisdom' | 'Intelligence';
    damageType?: string;
    condition?: string;
    area?: string;
}

export const TRAP_TAGS = [
    { id: 'mechanical', label: 'Mechanical', category: 'Type' },
    { id: 'magical', label: 'Magical', category: 'Type' },
    { id: 'natural', label: 'Natural', category: 'Type' },
    { id: 'divine', label: 'Divine', category: 'Type' },
    { id: 'psionic', label: 'Psionic', category: 'Type' },

    { id: 'fire', label: 'Fire', category: 'Damage' },
    { id: 'cold', label: 'Cold', category: 'Damage' },
    { id: 'poison', label: 'Poison', category: 'Damage' },
    { id: 'acid', label: 'Acid', category: 'Damage' },
    { id: 'lightning', label: 'Lightning', category: 'Damage' },
    { id: 'necrotic', label: 'Necrotic', category: 'Damage' },
    { id: 'psychic', label: 'Psychic', category: 'Damage' },
    { id: 'thunder', label: 'Thunder', category: 'Damage' },
    { id: 'radiant', label: 'Radiant', category: 'Damage' },
    { id: 'force', label: 'Force', category: 'Damage' },

    { id: 'pit', label: 'Pit/Fall', category: 'Mechanism' },
    { id: 'projectile', label: 'Projectile', category: 'Mechanism' },
    { id: 'alarm', label: 'Alarm', category: 'Mechanism' },
    { id: 'restraint', label: 'Restraining', category: 'Mechanism' },
    { id: 'area', label: 'Area Effect', category: 'Mechanism' },
    { id: 'gas', label: 'Gas/Cloud', category: 'Mechanism' },
    { id: 'flooding', label: 'Flooding', category: 'Mechanism' },
    { id: 'summoning', label: 'Summoning', category: 'Mechanism' },
];

export const TRIGGERS: TrapComponent[] = [
    // Mechanical
    { id: 'tripwire', text: 'a nearly invisible tripwire strung across the path', tags: ['mechanical'], requireTags: ['mechanical'] },
    { id: 'pressure-plate', text: 'a sensitive pressure plate hidden beneath the floor', tags: ['mechanical', 'floor'], requireTags: ['mechanical'] },
    { id: 'door-latch', text: 'a mechanism connected to the door handle', tags: ['mechanical', 'door'], requireTags: ['mechanical'] },
    { id: 'false-floor', text: 'a weak section of floor covering a drop', tags: ['mechanical', 'pit', 'floor'], requireTags: ['mechanical', 'pit'] },
    { id: 'pressure-valve', text: 'a rusted valve leaking gas', tags: ['mechanical', 'gas'], requireTags: ['gas'] },
    { id: 'water-line', text: 'a crack in the underwater retaining wall', tags: ['mechanical', 'flooding'], requireTags: ['flooding'] },

    // Magical
    { id: 'glyph', text: 'a faint arcane glyph inscribed on the surface', tags: ['magical', 'rune'], requireTags: ['magical'] },
    { id: 'sensor', text: 'an invisible magical sensor detecting movement', tags: ['magical', 'sensor'], requireTags: ['magical'] },
    { id: 'proximity', text: 'a magical ward that reacts to living presence', tags: ['magical', 'aura'], requireTags: ['magical'] },

    // Divine
    { id: 'desecrated-altar', text: 'an idol that watches those who approach', tags: ['divine', 'sensor'], requireTags: ['divine'] },
    { id: 'holy-ward', text: 'a beam of light blocking the way', tags: ['divine', 'magical'], requireTags: ['divine'] },

    // Psionic
    { id: 'mental-trigger', text: 'a telepathic tripwire detecting thought', tags: ['psionic', 'magical'], requireTags: ['psionic'] },
    { id: 'crystal-hum', text: 'a resonating crystal responding to presence', tags: ['psionic', 'mechanical'], requireTags: ['psionic'] },

    // Natural
    { id: 'root-snare', text: 'a hidden loop of strong vines', tags: ['natural', 'floor'], requireTags: ['natural'] },
    { id: 'unstable-ceiling', text: 'loose rocks ready to fall at the slightest vibration', tags: ['natural', 'falling'], requireTags: ['natural'] },
    { id: 'spore-pod', text: 'swollen fungal pods triggered by touch', tags: ['natural', 'poison', 'floor'], requireTags: ['natural', 'poison'] },
];

export const EFFECTS: TrapComponent[] = [
    // Physical / Mechanical
    {
        id: 'darts', text: 'fires a volley of poisoned darts',
        type: 'attack', damageType: 'piercing', condition: 'Poisoned',
        tags: ['mechanical', 'projectile', 'poison'], requireTags: ['mechanical', 'projectile']
    },
    {
        id: 'spikes', text: 'impales the target with iron spikes',
        type: 'save', saveStat: 'Dexterity', damageType: 'piercing',
        tags: ['mechanical', 'pit'], requireTags: ['mechanical', 'pit']
    },
    {
        id: 'crushing-walls', text: 'causes the walls to slam together',
        type: 'save', saveStat: 'Dexterity', damageType: 'bludgeoning',
        tags: ['mechanical', 'area'], requireTags: ['mechanical']
    },
    {
        id: 'scythe', text: 'swings a massive blade across the area',
        type: 'save', saveStat: 'Dexterity', damageType: 'slashing',
        tags: ['mechanical'], requireTags: ['mechanical']
    },
    {
        id: 'falling-rocks', text: 'drops a load of heavy rocks',
        type: 'save', saveStat: 'Dexterity', damageType: 'bludgeoning',
        tags: ['mechanical', 'natural'], requireTags: []
    },
    {
        id: 'net', text: 'drops a heavy weighted net',
        type: 'save', saveStat: 'Dexterity', condition: 'Restrained',
        tags: ['mechanical', 'restraint'], requireTags: ['mechanical', 'restraint']
    },
    {
        id: 'poison-gas', text: 'fills the room with choking fumes',
        type: 'save', saveStat: 'Constitution', damageType: 'poison', area: 'Room', condition: 'Poisoned',
        tags: ['mechanical', 'gas', 'poison'], requireTags: ['gas']
    },
    {
        id: 'flood', text: 'rapidly fills the room with water',
        type: 'save', saveStat: 'Strength', condition: 'Drowning risk', area: 'Room',
        tags: ['mechanical', 'flooding', 'natural'], requireTags: ['flooding']
    },

    // Magical Elements
    {
        id: 'fireball', text: 'erupts in a sphere of magical fire',
        type: 'save', saveStat: 'Dexterity', damageType: 'fire', area: '20ft radius',
        tags: ['magical', 'fire', 'area'], requireTags: ['magical', 'fire']
    },
    {
        id: 'lightning-bolt', text: 'shoots a fork of lightning',
        type: 'save', saveStat: 'Dexterity', damageType: 'lightning', area: '5ft wide line',
        tags: ['magical', 'lightning'], requireTags: ['magical', 'lightning']
    },
    {
        id: 'acid-spray', text: 'sprays corrosive acid',
        type: 'save', saveStat: 'Dexterity', damageType: 'acid',
        tags: ['magical', 'mechanical', 'acid'], requireTags: ['acid']
    },
    {
        id: 'thunder-wave', text: 'unleashes a thunderous boom',
        type: 'save', saveStat: 'Constitution', damageType: 'thunder', condition: 'Pushed 10ft',
        tags: ['magical', 'thunder'], requireTags: ['magical']
    },
    {
        id: 'psychic-scream', text: 'blasts the mind with psychic dissonance',
        type: 'save', saveStat: 'Intelligence', damageType: 'psychic', condition: 'Stunned',
        tags: ['magical', 'psychic'], requireTags: ['magical', 'psychic']
    },
    {
        id: 'sleep-glyph', text: 'releases magical sleep powder',
        type: 'save', saveStat: 'Constitution', condition: 'Unconscious',
        tags: ['magical', 'enchantment'], requireTags: ['magical']
    },
    {
        id: 'radiant-blast', text: 'sears the area with holy light',
        type: 'save', saveStat: 'Constitution', damageType: 'radiant', area: '30ft radius',
        tags: ['divine', 'radiant', 'area'], requireTags: ['radiant']
    },
    {
        id: 'force-cage', text: 'traps targets in a box of force',
        type: 'save', saveStat: 'Dexterity', condition: 'Trapped',
        tags: ['magical', 'force', 'restraint'], requireTags: ['force']
    },
    {
        id: 'thunder-glyph', text: 'detonates with a deafening boom',
        type: 'save', saveStat: 'Constitution', damageType: 'thunder', condition: 'Deafened',
        tags: ['magical', 'thunder', 'alarm'], requireTags: ['thunder']
    },
    {
        id: 'summon-monster', text: 'summons a guardian beast',
        type: 'auto', condition: 'Initiative Roll',
        tags: ['magical', 'summoning'], requireTags: ['summoning']
    },
    {
        id: 'mind-whip', text: 'lashes out with psychic energy',
        type: 'save', saveStat: 'Intelligence', damageType: 'psychic', condition: 'Confused',
        tags: ['psionic', 'psychic'], requireTags: ['psionic']
    },
];

export const CLUES: TrapComponent[] = [
    { id: 'dust', text: 'faint dust falling from ceiling', tags: ['mechanical'] },
    { id: 'click', text: 'a soft metallic click', tags: ['mechanical'] },
    { id: 'draft', text: 'a sudden cold draft', tags: ['magical', 'natural'] },
    { id: 'residue', text: 'glowing arcane residue', tags: ['magical'] },
    { id: 'blood-stain', text: 'old blood stains on the floor', tags: ['mechanical', 'natural'] },
    { id: 'scuff-marks', text: 'scuff marks indicating hidden doors', tags: ['mechanical'] },
];

export const MODIFIERS: TrapComponent[] = [
    { id: 'obscured', text: 'Hidden in shadows', tags: [] },
    { id: 'secondary-trigger', text: 'Requires two plates', tags: ['mechanical'] },
    { id: 'delayed', text: 'Triggers after 1 round', tags: [] },
    { id: 'noisy', text: 'Alerts nearby guards', tags: ['alarm'] },
    { id: 'poisonous', text: 'Adds poison damage', tags: ['poison'] },
];

export const COUNTERMEASURES = {
    mechanical: {
        detection: { skill: 'Wisdom (Perception)', desc: 'Spot tripwires, pressure plates, or offset stonework.' },
        disarm: { skill: 'Thieves\' Tools', desc: 'Jam mechanisms, cut wires, or wedge plates.' }
    },
    magical: {
        detection: { skill: 'Intelligence (Arcana) or Detect Magic', desc: 'Notice faint runes or magical auras.' },
        disarm: { skill: 'Intelligence (Arcana) or Dispel Magic', desc: 'Scratch out runes or disrupt the magical flow.' }
    },
    natural: {
        detection: { skill: 'Wisdom (Survival)', desc: 'Notice disturbed earth, unnatural foliage, or loose rocks.' },
        disarm: { skill: 'Dexterity (Sleight of Hand)', desc: 'Carefully remove the hazard or trigger it safely.' }
    },
    divine: {
        detection: { skill: 'Intelligence (Religion)', desc: 'Recognize sacred wards or icons of warding.' },
        disarm: { skill: 'Intelligence (Religion) or Defilement', desc: 'Perform a counter-ritual or deface the idol.' }
    },
    psionic: {
        detection: { skill: 'Wisdom (Insight)', desc: 'Feel the mental pressure or hear the psychic hum.' },
        disarm: { skill: 'Intelligence (Arcana) or Telepathy', desc: 'Mentally overwhelm the trigger or disrupt the crystal.' }
    }
};
