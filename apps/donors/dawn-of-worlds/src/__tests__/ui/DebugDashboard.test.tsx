
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import DebugDashboard from '@/components/debug/DebugDashboard';
import { useGameStore } from '@/store/gameStore';
import { useDebugActions } from '@/hooks/useDebugActions';

// Mock Modules
vi.mock('@/store/gameStore');
vi.mock('@/hooks/useDebugActions');

describe('DebugDashboard', () => {
    const mockActions = {
        addPower: vi.fn(),
        advanceEra: vi.fn(),
        unlockAllTech: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useDebugActions as any).mockReturnValue(mockActions);

        // Mock store state
        (useGameStore as any).mockImplementation((selector: any) => {
            const state = {
                age: 1,
                activePlayerId: 'P1',
                playerCache: { 'P1': { currentPower: 50 } },
                worldCache: new Map([['u1', { kind: 'UNIT' }], ['u2', { kind: 'ARMY' }], ['b1', { kind: 'BUILDING' }]]),
            };
            return selector(state);
        });
    });

    it('is hidden by default', () => {
        render(<DebugDashboard />);
        expect(screen.queryByText(/AG BROWSER CONTROL/i)).not.toBeInTheDocument();
    });

    it('toggles visibility on Ctrl+`', () => {
        render(<DebugDashboard />);

        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });
        expect(screen.getByText(/AG BROWSER CONTROL/i)).toBeInTheDocument();

        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });
        expect(screen.queryByText(/AG BROWSER CONTROL/i)).not.toBeInTheDocument();
    });

    it('toggles visibility on Ctrl+Shift+D', () => {
        render(<DebugDashboard />);

        act(() => {
            fireEvent.keyDown(window, { key: 'd', ctrlKey: true, shiftKey: true });
        });
        expect(screen.getByText(/AG BROWSER CONTROL/i)).toBeInTheDocument();
    });

    it('displays correct state overview', () => {
        render(<DebugDashboard />);
        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });

        expect(screen.getByText(/Age: Age 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Power: 50/i)).toBeInTheDocument();
        expect(screen.getByText(/Units: 2/i)).toBeInTheDocument(); // UNIT + ARMY
        expect(screen.getByText(/Objects: 3/i)).toBeInTheDocument();
    });

    it('contains a hidden JSON dump for AI analysis', () => {
        render(<DebugDashboard />);
        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });

        const dump = screen.getByTestId('game-state-json');
        expect(dump).toBeInTheDocument();
        const state = JSON.parse(dump.textContent!);
        expect(state.era.index).toBe(1);
        expect(state.resources.power).toBe(50);
    });

    it('calls addPower when button clicked', () => {
        render(<DebugDashboard />);
        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });

        const addBtn = screen.getByTestId('debug-action-res-add-power');
        fireEvent.click(addBtn);
        expect(mockActions.addPower).toHaveBeenCalledWith(10);
    });

    it('calls advanceEra when button clicked', () => {
        render(<DebugDashboard />);
        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });

        const advanceBtn = screen.getByTestId('debug-action-era-next');
        fireEvent.click(advanceBtn);
        expect(mockActions.advanceEra).toHaveBeenCalled();
    });

    it('closes when [X] is clicked', () => {
        render(<DebugDashboard />);
        act(() => {
            fireEvent.keyDown(window, { key: '`', ctrlKey: true });
        });

        const closeBtn = screen.getByText('[X]');
        fireEvent.click(closeBtn);
        expect(screen.queryByText(/AG BROWSER CONTROL/i)).not.toBeInTheDocument();
    });
});
