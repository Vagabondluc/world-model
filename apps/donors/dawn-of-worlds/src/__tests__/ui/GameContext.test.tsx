
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { GameContext, GameProvider, createInitialState } from '@/contexts/GameContext';
import { GameSessionConfig } from '@/types';

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
});

describe('GameContext Integration', () => {
    const mockConfig: GameSessionConfig = {
        id: 'test-session',
        worldName: 'Test World',
        mapSize: 'STANDARD',
        initialAge: 1,
        players: [
            { id: 'P1', name: 'Player 1', color: '#ffffff', isHuman: true, avatar: 'eye', domain: 'FORGE' },
            { id: 'P2', name: 'Player 2', color: '#ff0000', isHuman: false, avatar: 'flare', domain: 'LIFE' }
        ],
        rules: { strictAP: true, draftMode: false },
        createdAt: Date.now(),
        lastPlayed: Date.now()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.clear();
    });

    it('provides initial game state', () => {
        const TestComponent = () => {
            const { state } = React.useContext(GameContext)!;
            return <div data-testid="world-name">{state.config?.worldName}</div>;
        };

        render(
            <GameProvider initialConfig={mockConfig}>
                <TestComponent />
            </GameProvider>
        );

        expect(screen.getByTestId('world-name')).toHaveTextContent('Test World');
    });

    it('updates activeSelection when SET_SELECTION dispatched', () => {
        const TestComponent = () => {
            const { state, dispatch } = React.useContext(GameContext)!;
            return (
                <div>
                    <div data-testid="selection">{state.activeSelection.kind}</div>
                    <button
                        data-testid="select-btn"
                        onClick={() => dispatch({ type: 'SET_SELECTION', selection: { kind: 'HEX', q: 1, r: 2 } })}
                    >
                        Select
                    </button>
                </div>
            );
        };

        render(
            <GameProvider initialConfig={mockConfig}>
                <TestComponent />
            </GameProvider>
        );

        expect(screen.getByTestId('selection')).toHaveTextContent('NONE');

        act(() => {
            screen.getByTestId('select-btn').click();
        });

        expect(screen.getByTestId('selection')).toHaveTextContent('HEX');
    });

    it('reflects age and round from state', () => {
        const TestComponent = () => {
            const { state } = React.useContext(GameContext)!;
            return (
                <div>
                    <div data-testid="age">{state.age}</div>
                    <div data-testid="round">{state.round}</div>
                </div>
            );
        };

        render(
            <GameProvider initialConfig={mockConfig}>
                <TestComponent />
            </GameProvider>
        );

        expect(screen.getByTestId('age')).toHaveTextContent('1');
        expect(screen.getByTestId('round')).toHaveTextContent('1');
    });

    it('calculates isHandoverActive correctly (via TURN_END)', () => {
        const TestComponent = () => {
            const { state, dispatch } = React.useContext(GameContext)!;
            return (
                <div>
                    <div data-testid="handover">{state.isHandoverActive.toString()}</div>
                    <button
                        data-testid="end-turn-btn"
                        onClick={() => dispatch({
                            type: 'DISPATCH_EVENT',
                            event: {
                                type: 'TURN_END',
                                payload: { playerId: 'P1' },
                                id: 'e1',
                                ts: Date.now(),
                                playerId: 'P1',
                                age: 1
                            } as any
                        })}
                    >
                        End Turn
                    </button>
                </div>
            );
        };

        render(
            <GameProvider initialConfig={mockConfig}>
                <TestComponent />
            </GameProvider>
        );

        expect(screen.getByTestId('handover')).toHaveTextContent('false');

        act(() => {
            screen.getByTestId('end-turn-btn').click();
        });

        expect(screen.getByTestId('handover')).toHaveTextContent('true');
    });

    it('passes dispatch function to consumers', () => {
        const TestComponent = () => {
            const ctx = React.useContext(GameContext);
            return <div data-testid="dispatch-exists">{(typeof ctx?.dispatch === 'function').toString()}</div>;
        };

        render(
            <GameProvider initialConfig={mockConfig}>
                <TestComponent />
            </GameProvider>
        );

        expect(screen.getByTestId('dispatch-exists')).toHaveTextContent('true');
    });

    it('persists state updates to localStorage', () => {
        const { unmount } = render(
            <GameProvider initialConfig={mockConfig}>
                <div>Persist Test</div>
            </GameProvider>
        );

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'dawn_of_worlds_save_v1',
            expect.stringContaining('Test World')
        );

        unmount();
    });
});
