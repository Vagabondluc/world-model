

import { Rule } from '../../types/monsterGrammar';
import { FIRE_RULES } from './fireRules';
import { COLD_RULES } from './coldRules';
import { LIGHTNING_RULES } from './lightningRules';
import { PHYSICAL_RULES } from './physicalRules';
import { UTILITY_RULES } from './utilityRules';

export const ALL_RULES: Rule[] = [
    ...FIRE_RULES,
    ...COLD_RULES,
    ...LIGHTNING_RULES,
    ...PHYSICAL_RULES,
    ...UTILITY_RULES,
];