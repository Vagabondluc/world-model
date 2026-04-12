
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActionSidebar from '@/components/ActionSidebar';
import { useGameStore } from '@/store/gameStore';
import React from 'react';

// Mock store
vi.mock('@/store/gameStore');

describe('ActionSidebar', () => {
    let state: any;
    const toggleErrorState = vi.fn();
    const onActionSelect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        state = {
            activePlayerId: 'P1',
            playerCache: { 'P1': { currentPower: 10 } },
            age: 1,
            round: 1,
            turn: 1,
            settings: {
                turn: {
                    apByAge: { 1: 5 },
                    minRoundsByAge: { 1: 1 },
                    requireAllPlayersActedToAdvance: false
                },
                ui: { contextFilterActions: true }
            },
            activeSelection: { kind: 'NONE' },
            dispatch: vi.fn(),
            setPreview: vi.fn(),
            setOnboardingStep: vi.fn(),
            isHandoverActive: false,
        };

        (useGameStore as unknown as any).mockImplementation((selector: any) => {
            if (typeof selector !== 'function') return state;
            return selector(state);
        });

        // Mock crypto for randomUUID if used (ActionSidebar uses it)
        if (!global.crypto) {
            (global as any).crypto = { randomUUID: () => 'test-uuid' };
        }
    });

    it('renders Action Palette header', () => {
        render(<ActionSidebar isErrorState={false} toggleErrorState={toggleErrorState} activeAction={null} onActionSelect={onActionSelect} />);
        expect(screen.getByText(/Action Palette/i)).toBeInTheDocument();
    });

    it('displays remaining AP', () => {
        render(<ActionSidebar isErrorState={false} toggleErrorState={toggleErrorState} activeAction={null} onActionSelect={onActionSelect} />);
        expect(screen.getByText(/10 Remaining/i)).toBeInTheDocument();
    });

    it('highlights active action', () => {
        render(<ActionSidebar isErrorState={false} toggleErrorState={toggleErrorState} activeAction="A1_ADD_TERRAIN" onActionSelect={onActionSelect} />);
        // If active, it has a specific aria-pressed state
        const btn = screen.getByLabelText(/Add Terrain/i);
        expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    it('selects an action when clicked', () => {
        state.activeSelection = { kind: 'HEX', q: 0, r: 0 };
        render(<ActionSidebar isErrorState={false} toggleErrorState={toggleErrorState} activeAction={null} onActionSelect={onActionSelect} />);
        const terrainBtn = screen.getByText(/Add Terrain/i);
        fireEvent.click(terrainBtn);
        expect(onActionSelect).toHaveBeenCalledWith('A1_ADD_TERRAIN');
    });

    it('renders Advance Age button', () => {
        render(<ActionSidebar isErrorState={false} toggleErrorState={toggleErrorState} activeAction={null} onActionSelect={onActionSelect} />);
        expect(screen.getByText(/Advance Age/i)).toBeInTheDocument();
    });

    it('renders undo button correctly', () => {
        render(<ActionSidebar isErrorState={false} toggleErrorState={toggleErrorState} activeAction={null} onActionSelect={onActionSelect} />);
        // Use a more specific selector to avoid icon/label overlap
        expect(screen.getByText(/Undo Action/i)).toBeInTheDocument();
    });
});
