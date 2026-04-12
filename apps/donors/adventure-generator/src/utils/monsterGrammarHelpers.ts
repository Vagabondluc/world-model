
import { PowerAtom } from '../types/monsterGrammar';

/**
 * Centralized helper to create a PowerAtom with default values.
 * Eliminates duplication of this logic across all rule files.
 * Formerly known as 'A' in local rule files.
 */
export const createAtom = (p: Partial<PowerAtom> & { id: string; text: string; axis: PowerAtom['axis']; }): PowerAtom => ({
    label: p.id.replace(/:/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    cost: 0.1,
    tags: [],
    actionType: 'Action',
    ...p
});
