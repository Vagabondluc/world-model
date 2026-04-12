import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameContext, GameProvider, createInitialState } from '../GameContext';
import { GameSessionConfig, GameState } from '../../types';
import React from 'react';

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
});

describe('GameContext', () => {
    afterEach(() => {
        mockLocalStorage.clear();
    });

    describe('createInitialState function', () => {
        it('should create initial state from config', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [
                    { id: 'P1', name: 'Player 1', color: '#ff0000' },
                    { id: 'P2', name: 'Player 2', color: '#00ff00' }
                ],
                initialAge: 2,
                rules: {}
            };
            const state = createInitialState(config);
            expect(state.config).toEqual(config);
            expect(state.players).toEqual(['P1', 'P2']);
            expect(state.activePlayerId).toBe('P1');
            expect(state.age).toBe(2);
        });

        it('should initialize with default values when no config', () => {
            const state = createInitialState();
            expect(state.settings).toBeDefined();
            expect(state.age).toBe(1);
            expect(state.round).toBe(1);
            expect(state.turn).toBe(1);
            expect(state.activePlayerId).toBe('P1');
            expect(state.players).toEqual(['P1', 'P2']);
        });

        it('should initialize empty events', () => {
            const state = createInitialState();
            expect(state.events).toEqual([]);
        });

        it('should initialize empty revokedEventIds', () => {
            const state = createInitialState();
            expect(state.revokedEventIds.size).toBe(0);
        });

        it('should initialize empty worldCache', () => {
            const state = createInitialState();
            expect(state.worldCache.size).toBe(0);
        });

        it('should initialize playerCache', () => {
            const state = createInitialState();
            expect(state.playerCache).toBeDefined();
            expect(state.playerCache['P1']).toBeDefined();
        });
    });

    describe('storage persistence', () => {
        it('should save state to localStorage', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };
            const state = createInitialState(config);

            render(
                <GameProvider config={config}>
                    <div>Test</div>
                </GameProvider>
            );

            // State should be saved to localStorage
            const saved = mockLocalStorage.getItem('dawn_of_worlds_save_v1');
            expect(saved).not.toBeNull();
        });

        it('should load state from localStorage', () => {
            const savedState: GameState = {
                settings: { ui: {}, turn: {} },
                config: undefined,
                age: 2,
                round: 3,
                turn: 2,
                activePlayerId: 'P2',
                players: ['P1', 'P2'],
                events: [],
                revokedEventIds: new Set(),
                draftRollbackUsedByAge: {},
                activeSelection: { kind: 'NONE' },
                previewEvent: null,
                chronicle: {},
                worldCache: new Map(),
                playerCache: { P1: {}, P2: {} },
                onboardingStep: 'MAP_TAP',
                isHandoverActive: false,
                combatSession: null
            };

            mockLocalStorage.setItem('dawn_of_worlds_save_v1', JSON.stringify(savedState));

            const { result } = renderHook(() => createInitialState());
            expect(result.current.age).toBe(2);
            expect(result.current.round).toBe(3);
            expect(result.current.turn).toBe(2);
        });

        it('should handle corrupted localStorage data', () => {
            mockLocalStorage.setItem('dawn_of_worlds_save_v1', 'invalid json');

            const { result } = renderHook(() => createInitialState());
            // Should fall back to default state
            expect(result.current.age).toBe(1);
        });
    });

    describe('context provider', () => {
        it('should provide context to children', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };

            const TestChild = () => {
                const context = React.useContext(GameContext);
                expect(context.state).toBeDefined();
                expect(context.dispatch).toBeDefined();
                return <div>Test</div>;
            };

            render(
                <GameProvider config={config}>
                    <TestChild />
                </GameProvider>
            );
        });

        it('should update context when state changes', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };

            const TestChild = () => {
                const context = React.useContext(GameContext);
                const [age, setAge] = React.useState(context.state.age);

                React.useEffect(() => {
                    if (context.state.age !== age) {
                        setAge(context.state.age);
                    }
                }, [context.state.age]);

                return <div>Age: {age}</div>;
            };

            const { rerender } = render(
                <GameProvider config={config}>
                    <TestChild />
                </GameProvider>
            );

            // Initial render
            expect(screen.getByText('Age: 1')).toBeInTheDocument();
        });
    });

    describe('context consumer', () => {
        it('should access context values', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };

            const TestChild = () => {
                const context = React.useContext(GameContext);
                return (
                    <div>
                        <div data-testid="age">{context.state.age}</div>
                        <div data-testid="player">{context.state.activePlayerId}</div>
                    </div>
                );
            };

            render(
                <GameProvider config={config}>
                    <TestChild />
                </GameProvider>
            );

            expect(screen.getByTestId('age')).toHaveTextContent('1');
            expect(screen.getByTestId('player')).toHaveTextContent('P1');
        });
    });

    describe('context updates', () => {
        it('should update state when dispatch is called', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };

            const TestChild = () => {
                const context = React.useContext(GameContext);
                const [eventCount, setEventCount] = React.useState(0);

                React.useEffect(() => {
                    setEventCount(context.state.events.length);
                }, [context.state.events]);

                return <div data-testid="event-count">Events: {eventCount}</div>;
            };

            const { rerender } = render(
                <GameProvider config={config}>
                    <TestChild />
                </GameProvider>
            );

            expect(screen.getByTestId('event-count')).toHaveTextContent('Events: 0');
        });
    });
});
