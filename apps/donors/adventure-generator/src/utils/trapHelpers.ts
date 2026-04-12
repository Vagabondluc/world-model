
import { TrapTier, GeneratedTrap, TrapRule } from '../types/trap';
import { TIER_STATS, TRIGGERS, EFFECTS, COUNTERMEASURES, CLUES, MODIFIERS, TrapComponent } from '../data/trapRules';
import { SeededRNG } from './seededRng';

// Helper: Select random item from array using RNG
function pick<T>(arr: T[], rng: SeededRNG): T {
    return arr[Math.floor(rng.nextFloat() * arr.length)];
}

// Helper: Filter components based on required tags
function filterComponents(components: TrapComponent[], activeTags: string[]): TrapComponent[] {
    return components.filter(c => {
        // Must match ALL requireTags if present
        if (c.requireTags && c.requireTags.length > 0) {
            const hasAll = c.requireTags.every(t => activeTags.includes(t));
            if (!hasAll) return false;
        }
        // Must NOT match any incompatibleTags
        if (c.incompatibleTags && c.incompatibleTags.length > 0) {
            const hasBad = c.incompatibleTags.some(t => activeTags.includes(t));
            if (hasBad) return false;
        }
        return true;
    });
}

export function generateTrapRules(tier: TrapTier, userTags: string[] = [], seed?: string): GeneratedTrap {
    const rng = new SeededRNG(seed || crypto.randomUUID());
    const stats = TIER_STATS[tier];

    // 1. Determine Base Type (Mechanical, Magical, Natural)
    // If user didn't select one, pick one.
    let type = userTags.find(t => ['mechanical', 'magical', 'natural', 'divine', 'psionic'].includes(t)) as GeneratedTrap['type'] | undefined;
    if (!type) {
        type = pick(['mechanical', 'magical', 'mechanical', 'natural'], rng); // slightly favor mechanical
    }

    // 2. Build Active Tag Set
    // Start with type + user tags. 
    let activeTags = Array.from(new Set([type, ...userTags]));

    // 3. Select Effect
    // Filter effects compatible with our tags.
    let compatibleEffects = filterComponents(EFFECTS, activeTags);

    // Fallback: If no effects match specific tags (e.g. user chose 'Psychic' but type 'Mechanical'),
    // Try relaxing restrictions or picking a generic effect for the Type.
    if (compatibleEffects.length === 0) {
        compatibleEffects = filterComponents(EFFECTS, [type]);
    }

    const selectedEffect = pick(compatibleEffects, rng);
    if (selectedEffect) {
        activeTags = [...activeTags, ...selectedEffect.tags];
    }

    // 4. Select Trigger
    // Filter triggers compatible with current tags (Type + Effect tags)
    let compatibleTriggers = filterComponents(TRIGGERS, activeTags);
    if (compatibleTriggers.length === 0) {
        compatibleTriggers = filterComponents(TRIGGERS, [type]);
    }
    const selectedTrigger = pick(compatibleTriggers, rng);

    // 5. Assemble Mechanics
    const rules: TrapRule[] = [];
    const rule: TrapRule = {
        type: selectedEffect.type === 'attack' ? 'Attack Roll' : 'Saving Throw',
        damage: '',
    };

    let effectDescription = '';
    const damageString = selectedEffect.damageType
        ? `${stats.damageDice} ${selectedEffect.damageType}`
        : '';

    if (selectedEffect.type === 'attack') {
        rule.attackBonus = stats.attack;
        rule.damage = damageString;
        effectDescription = `Makes an attack roll with a +${stats.attack} bonus. On a hit, takes ${damageString} damage.`;
    } else if (selectedEffect.type === 'auto') {
        rule.type = 'Automatic';
        effectDescription = `Effect occurs automatically.`;
    } else {
        rule.dc = stats.dc;
        rule.stat = selectedEffect.saveStat || 'Dexterity';
        rule.damage = damageString;
        effectDescription = `Targets must succeed on a DC ${stats.dc} ${rule.stat} save`;

        if (damageString) {
            effectDescription += `, taking ${damageString} damage on a failure (half on success).`;
        }
    }

    if (selectedEffect.condition) {
        rule.condition = selectedEffect.condition;
        effectDescription += ` Targets also suffer the ${selectedEffect.condition} condition.`;
    }
    if (selectedEffect.area) {
        rule.area = selectedEffect.area;
        effectDescription = `${selectedEffect.area}: ` + effectDescription;
    }

    rules.push(rule);

    // 6. Countermeasures
    const cmBase = COUNTERMEASURES[type as keyof typeof COUNTERMEASURES] || COUNTERMEASURES.mechanical;

    return {
        name: `${activeTags.filter(t => t !== type).join(' ')} ${type} trap`.replace(/\b\w/g, l => l.toUpperCase()).replace(/  /g, ' '),
        description: `A ${selectedTrigger.text} that ${selectedEffect.text}.`,
        tier,
        type,
        tags: activeTags,
        trigger: selectedTrigger.text,
        effect: effectDescription,
        rules,
        countermeasures: {
            detection: {
                skill: cmBase.detection.skill,
                dc: stats.dc, // Detection roughly equals save DC
                details: cmBase.detection.desc
            },
            disarm: {
                skill: cmBase.disarm.skill,
                dc: stats.dc,
                details: cmBase.disarm.desc
            }
        }
    };
}

export function rollComponent(category: string, tags: string[] = []): string {
    const rng = new SeededRNG(crypto.randomUUID());
    let pool: TrapComponent[] = [];

    switch (category.toLowerCase()) {
        case 'clue': pool = CLUES; break;
        case 'trigger': pool = TRIGGERS; break;
        case 'danger': pool = EFFECTS; break;
        case 'modifier': pool = MODIFIERS; break;
        default: return "Unknown Component";
    }

    const filtered = filterComponents(pool, tags);
    const selected = pick(filtered.length > 0 ? filtered : pool, rng);
    return selected ? selected.text : "No matching component";
}
