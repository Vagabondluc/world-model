import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { buildTrapCheckResults } from '../../utils/trapChecks';
import { ActiveTrapPanel } from '../../components/trap/architect/ActiveTrapPanel';

vi.mock('../../utils/trapChecks', () => ({
    buildTrapCheckResults: vi.fn()
}));

describe('ActiveTrapPanel dice rolling', () => {
    const trap = {
        name: 'Spike Hallway',
        countermeasures: {
            detection: {
                skill: 'Perception',
                dc: 14,
                details: 'Dust swirls around a hidden seam.'
            },
            disarm: {
                skill: 'Thieves\' Tools / Dexterity',
                dc: 12,
                details: 'A pressure plate can be jammed.'
            }
        }
    };

    beforeEach(() => {
        vi.mocked(buildTrapCheckResults).mockReset();
    });

    it('renders last check summaries after rolling', () => {
        vi.mocked(buildTrapCheckResults).mockReturnValue([
            {
                label: 'Detection Check (Perception)',
                roll: 18,
                target: 14,
                success: true,
                summary: 'Roll 18 vs DC 14 · Success · Dust swirls around a hidden seam.'
            },
            {
                label: 'Disarm Check (Thieves\' Tools / Dexterity)',
                roll: 7,
                target: 12,
                success: false,
                summary: 'Roll 7 vs DC 12 · Failure · A pressure plate can be jammed.'
            }
        ]);

        render(
            <ActiveTrapPanel
                trap={trap}
                onUpdate={() => {}}
            />
        );

        fireEvent.click(screen.getByText('Roll Check'));

        expect(buildTrapCheckResults).toHaveBeenCalledTimes(1);
        expect(buildTrapCheckResults).toHaveBeenCalledWith(trap);
        expect(screen.getByText('Last Checks')).toBeTruthy();
        expect(screen.getByText('Detection Check (Perception)')).toBeTruthy();
        expect(screen.getByText('Disarm Check (Thieves\' Tools / Dexterity)')).toBeTruthy();
        expect(screen.getByText(/Roll 18 vs DC 14/i)).toBeTruthy();
        expect(screen.getByText(/Roll 7 vs DC 12/i)).toBeTruthy();
    });
});
