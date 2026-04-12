
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlayerDashboard from '@/components/PlayerDashboard';
import { useGameStore } from '@/store/gameStore';
import React from 'react';

// Mock the store
vi.mock('@/store/gameStore');

describe('PlayerDashboard', () => {
    let state: any;
    const onClose = vi.fn();
    const onExitGame = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        state = {
            config: {
                worldName: 'Test World',
                players: [
                    { id: 'P1', name: 'Architect Alpha', color: '#ff0000', isHuman: true },
                    { id: 'P2', name: 'AI Beta', color: '#00ff00', isHuman: false }
                ]
            },
            players: ['P1', 'P2'],
            activePlayerId: 'P1',
            age: 1,
            round: 3,
            events: [],
            revokedEventIds: new Set(),
            playerCache: {
                'P1': { currentPower: 15 },
                'P2': { currentPower: 5 }
            },
            settings: {
                ui: { contextFilterActions: true, renderPngTiles: false },
                social: { protectedUntilEndOfRound: false },
                genesis: { enableGlobeMode: false }
            }
        };

        (useGameStore as unknown as any).mockImplementation((selector: any) => selector(state));
        (useGameStore as unknown as any).setState = vi.fn();
    });

    it('renders current world name and headers', () => {
        render(<PlayerDashboard onClose={onClose} onExitGame={onExitGame} />);
        expect(screen.getByText(/The Council/i)).toBeInTheDocument();
        expect(screen.getByText(/Test World/i)).toBeInTheDocument();
    });

    it('displays correct Era (Roman numerals) and Global Round', () => {
        render(<PlayerDashboard onClose={onClose} onExitGame={onExitGame} />);
        expect(screen.getByText(/AGE I/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Global Round
    });

    it('lists all architects with correct status', () => {
        render(<PlayerDashboard onClose={onClose} onExitGame={onExitGame} />);
        expect(screen.getByText(/Architect Alpha/i)).toBeInTheDocument();
        expect(screen.getByText(/AI Beta/i)).toBeInTheDocument();
        expect(screen.getByText(/Active/i)).toBeInTheDocument();
        expect(screen.getByText(/Waiting/i)).toBeInTheDocument();
    });

    it('calculates influence (stats) correctly', () => {
        state.events = [
            { type: 'WORLD_CREATE', playerId: 'P1', id: 'e1' },
            { type: 'ACTION_EXECUTE', playerId: 'P1', cost: 10, id: 'e2' }
        ];
        render(<PlayerDashboard onClose={onClose} onExitGame={onExitGame} />);
        // P1: (1 created * 5) + (10 spent) = 15 Influence
        expect(screen.getByText('15')).toBeInTheDocument(); // Influence column
    });

    it('toggles settings when buttons clicked', () => {
        render(<PlayerDashboard onClose={onClose} onExitGame={onExitGame} />);
        const toggleBtn = screen.getByText(/Adaptive Action Palette/i);
        fireEvent.click(toggleBtn);
        // Should call setState (or whatever we mocked)
        expect(useGameStore.setState).toHaveBeenCalled();
    });

    it('calls onExitGame when Abandon is clicked', () => {
        render(<PlayerDashboard onClose={onClose} onExitGame={onExitGame} />);
        const abandonBtn = screen.getByText(/Abandon/i);
        fireEvent.click(abandonBtn);
        expect(onExitGame).toHaveBeenCalled();
    });
});
