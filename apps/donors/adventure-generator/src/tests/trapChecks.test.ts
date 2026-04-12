import { describe, it, expect } from 'vitest';
import { buildTrapCheckResults } from '../utils/trapChecks';

describe('buildTrapCheckResults', () => {
    it('respects countermeasure overrides and status labels', () => {
        const trap = {
            countermeasures: {
                detection: {
                    skill: 'Arcana',
                    dc: 18,
                    details: 'Magical sensors hum quietly.'
                },
                disarm: {
                    skill: 'Thieves\' Tools / Dexterity',
                    dc: 16,
                    details: 'Careful leverage required.'
                }
            }
        };
        const rolls = [20, 1];
        const provider = () => rolls.shift() ?? 1;

        const results = buildTrapCheckResults(trap, provider);

        expect(results).toHaveLength(2);
        const [detectionResult, disarmResult] = results;

        expect(detectionResult).toMatchObject({
            label: 'Detection Check (Arcana)',
            roll: 20,
            target: 18,
            success: true
        });
        expect(detectionResult.summary).toContain('Critical Success');
        expect(detectionResult.summary).toContain('Magical sensors hum quietly.');

        expect(disarmResult).toMatchObject({
            label: 'Disarm Check (Thieves\' Tools / Dexterity)',
            roll: 1,
            target: 16,
            success: false
        });
        expect(disarmResult.summary).toContain('Critical Failure');
        expect(disarmResult.summary).toContain('Careful leverage required.');
    });

    it('falls back to default values when countermeasures are missing', () => {
        const rolls = [15, 12];
        const provider = () => rolls.shift() ?? 1;

        const results = buildTrapCheckResults({}, provider);

        expect(results).toHaveLength(2);
        expect(results[0].label).toContain('Perception');
        expect(results[0].target).toBe(15);
        expect(results[0].summary).toContain('Notice subtle disruptions in the environment.');

        expect(results[1].label).toContain('Thieves\' Tools / Dexterity');
        expect(results[1].target).toBe(15);
        expect(results[1].summary).toContain('Disable the trigger with care.');
    });
});
