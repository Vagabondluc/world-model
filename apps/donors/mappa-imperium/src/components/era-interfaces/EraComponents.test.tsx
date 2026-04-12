import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DiscoveryEventSelector from './era-discovery/DiscoveryEventSelector';
import EmpiresEventSelector from './era-empires/EmpiresEventSelector';
import CollapseEventSelector from './era-collapse/CollapseEventSelector';
import { discoveryEvents } from '../../data/discoveryEvents';
import { empiresEvents } from '../../data/empiresEvents';
import { collapseEvents } from '../../data/collapseEvents';

// Mock HelpTooltip since it uses portals which might be tricky in simple render
vi.mock('../../shared/HelpTooltip', () => ({
    default: ({ text }: { text: string }) => <span data-testid="help-tooltip" title={text}>?</span>
}));

describe('Era Workflow Components Integration', () => {

    describe('Data Integrity', () => {
        it('discoveryEvents has entries', () => {
            const keys = Object.keys(discoveryEvents);
            expect(keys.length).toBeGreaterThan(0);
            expect(discoveryEvents[parseInt(keys[0])]).toHaveProperty('name');
            expect(discoveryEvents[parseInt(keys[0])]).toHaveProperty('description');
        });

        it('empiresEvents has entries', () => {
            const keys = Object.keys(empiresEvents);
            expect(keys.length).toBeGreaterThan(0);
        });

        it('collapseEvents has entries', () => {
            const keys = Object.keys(collapseEvents);
            expect(keys.length).toBeGreaterThan(0);
        });
    });

    describe('DiscoveryEventSelector', () => {
        it('renders all options from data', () => {
            const onRollSelect = vi.fn();
            render(<DiscoveryEventSelector selectedRoll="" onRollSelect={onRollSelect} disabled={false} />);

            const options = screen.getAllByRole('option');
            // +1 for the disabled "Select your roll" option
            expect(options.length).toBe(Object.keys(discoveryEvents).length + 1);

            // Check content of first real option
            const firstKey = Object.keys(discoveryEvents)[0];
            const firstEvent = discoveryEvents[parseInt(firstKey)];
            expect(screen.getByText(`${firstKey}: ${firstEvent.name}`)).toBeInTheDocument();
        });

        it('calls onRollSelect when changed', () => {
            const onRollSelect = vi.fn();
            render(<DiscoveryEventSelector selectedRoll="" onRollSelect={onRollSelect} disabled={false} />);

            const select = screen.getByLabelText(/Select your Discovery Event/i);
            const firstKey = Object.keys(discoveryEvents)[0];

            fireEvent.change(select, { target: { value: firstKey } });
            expect(onRollSelect).toHaveBeenCalledWith(parseInt(firstKey));
        });
    });

    describe('EmpiresEventSelector', () => {
        it('renders all options from data', () => {
            const onRollSelect = vi.fn();
            render(<EmpiresEventSelector selectedRoll="" onRollSelect={onRollSelect} />);

            const options = screen.getAllByRole('option');
            expect(options.length).toBe(Object.keys(empiresEvents).length + 1);
        });
    });

    describe('CollapseEventSelector', () => {
        it('renders all options from data', () => {
            const onRollSelect = vi.fn();
            render(<CollapseEventSelector selectedRoll="" onRollSelect={onRollSelect} />);

            const options = screen.getAllByRole('option');
            expect(options.length).toBe(Object.keys(collapseEvents).length + 1);
        });
    });
});
