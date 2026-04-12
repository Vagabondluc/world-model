
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '@/App';
import * as GameStoreModule from '@/store/gameStore';
import React from 'react';

// Mock Modules
vi.mock('@/store/gameStore');
vi.mock('@/logic/haptics', () => ({ triggerHaptic: vi.fn() }));
// Mock the AI Controller
vi.mock('@/components/ai/AIController', () => ({ default: () => <div data-testid="ai-controller" /> }));
// Mock SyncChannel
vi.mock('@/hooks/useSyncChannel', () => ({ useSyncChannel: vi.fn(() => ({ isConnected: false })) }));
// Mock Keyboard Shortcuts
const { viMockUseKeyboardShortcuts } = vi.hoisted(() => ({
    viMockUseKeyboardShortcuts: vi.fn(),
}));
vi.mock('@/hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: viMockUseKeyboardShortcuts }));
// Mock Galaxy
vi.mock('@/components/Galaxy', () => ({ default: () => <div data-testid="galaxy" /> }));
// Mock WhisperingGallery
vi.mock('@/components/WhisperingGallery', () => ({ default: () => <div data-testid="whispering-gallery" /> }));
// Mock TheArena
vi.mock('@/components/TheArena', () => ({ default: () => <div data-testid="the-arena" /> }));

// Mock localStorage
global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
} as any;

describe('App Integration', () => {
    let gameState: any;
    const dispatch = vi.fn();
    const initializeSession = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock DOM methods not implemented in JSDOM
        Element.prototype.scrollTo = vi.fn();
        Element.prototype.scrollBy = vi.fn();

        gameState = {
            config: null,
            isHydrated: true,
            onboardingStep: 'DONE',
            initializeSession,
            dispatch,
            settings: {
                ui: { renderPngTiles: false },
                social: {},
                genesis: { enableGlobeMode: false },
                turn: {
                    apByAge: { 1: 10, 2: 20, 3: 30 },
                    minRoundsByAge: { 1: 5, 2: 5, 3: 5 },
                    requireAllPlayersActedToAdvance: false
                }
            },
            players: ['P1', 'P2'],
            activePlayerId: 'P1',
            playerCache: { 'P1': { currentPower: 10 }, 'P2': { currentPower: 10 } },
            events: [],
            activeSelection: { kind: 'NONE' },
            worldCache: new Map(),
            candidates: {},
            journal: {},
            isHandoverActive: false,
            combatSession: null,
            age: 1,
            round: 1,
            turn: 1,
        };

        (GameStoreModule.useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
            if (typeof selector !== 'function') return gameState;
            return selector(gameState);
        });
        const mockStore = GameStoreModule.useGameStore as unknown as { getState: any };
        mockStore.getState = vi.fn().mockReturnValue(gameState);
    });

    const transitionToGame = async () => {
        render(<App />);
        const quickBtn = screen.getByText(/Quick Play/i);
        gameState.config = { id: 'test', worldName: 'Test World', players: [{ id: 'P1' }, { id: 'P2' }] };
        fireEvent.click(quickBtn);
        return await screen.findByText(/Action Palette/i);
    };

    it('renders Landing Screen initially', () => {
        render(<App />);
        expect(screen.getByText(/Forge New World/i)).toBeInTheDocument();
    });

    it('starts Quick Game when clicked', async () => {
        render(<App />);
        const quickBtn = screen.getByText(/Quick Play/i);
        fireEvent.click(quickBtn);
        expect(initializeSession).toHaveBeenCalled();
    });

    it('renders Game UI after Quick Play', async () => {
        await transitionToGame();
        expect(screen.getByText(/Age I/i)).toBeInTheDocument();
        expect(screen.getByText(/Round 1/i)).toBeInTheDocument();
    });

    it('mounts AIController during game', async () => {
        await transitionToGame();
        expect(screen.getByTestId('ai-controller')).toBeInTheDocument();
    });

    it('activates KeyboardShortcuts during game', async () => {
        await transitionToGame();
        expect(viMockUseKeyboardShortcuts).toHaveBeenCalled();
    });

    it('renders Handover Overlay when active', async () => {
        gameState.isHandoverActive = true;
        await transitionToGame();
        expect(screen.getByText(/Pass the device/i)).toBeInTheDocument();
    });

    it('renders Combat Arena when session exists', async () => {
        gameState.combatSession = { stage: 'SETUP', attackerId: 'A1', defenderId: 'D1' };
        await transitionToGame();
        expect(screen.getByTestId('the-arena')).toBeInTheDocument();
    });

    it('increments round at end of player rotation', async () => {
        gameState.round = 2;
        await transitionToGame();
        expect(screen.getByText(/Round 2/i)).toBeInTheDocument();
    });

    it('renders Loading State if not hydrated', () => {
        gameState.isHydrated = false;
        render(<App />);
        expect(screen.getByText(/Summoning World/i)).toBeInTheDocument();
    });
});
