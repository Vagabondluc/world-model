import type { GeneratedTrap } from '../types/trap';

export type CheckKey = 'detection' | 'disarm';

export interface TrapCheckResult {
    label: string;
    roll: number;
    target: number;
    success: boolean;
    summary: string;
}

type CheckDefinition = {
    key: CheckKey;
    label: string;
    fallbackSkill: string;
    fallbackDetails: string;
};

const CHECK_DEFINITIONS: ReadonlyArray<CheckDefinition> = [
    {
        key: 'detection',
        label: 'Detection Check',
        fallbackSkill: 'Perception',
        fallbackDetails: 'Notice subtle disruptions in the environment.'
    },
    {
        key: 'disarm',
        label: 'Disarm Check',
        fallbackSkill: 'Thieves\' Tools / Dexterity',
        fallbackDetails: 'Disable the trigger with care.'
    }
];

export type RollProvider = () => number;

const defaultRollProvider: RollProvider = () => Math.floor(Math.random() * 20) + 1;

export function buildTrapCheckResults(
    trap: Partial<GeneratedTrap>,
    rollProvider: RollProvider = defaultRollProvider
): TrapCheckResult[] {
    return CHECK_DEFINITIONS.map((definition) => {
        const countermeasure = trap.countermeasures?.[definition.key];
        const dc = countermeasure?.dc ?? 15;
        const skill = countermeasure?.skill ?? definition.fallbackSkill;
        const details = countermeasure?.details ?? definition.fallbackDetails;
        const roll = rollProvider();
        const success = roll >= dc;
        const status =
            roll === 20 ? 'Critical Success' :
            roll === 1 ? 'Critical Failure' :
            success ? 'Success' :
            'Failure';
        const summaryParts = [`Roll ${roll} vs DC ${dc}`, status];

        if (details) {
            summaryParts.push(details);
        }

        return {
            label: `${definition.label} (${skill})`,
            roll,
            target: dc,
            success,
            summary: summaryParts.join(' · ')
        };
    });
}
