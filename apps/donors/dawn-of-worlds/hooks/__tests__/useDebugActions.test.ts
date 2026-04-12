import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebugActions } from '../useDebugActions';
import { useGameStore } from '../../store/gameStore';

// Mock dependencies
vi.mock('../../store/gameStore');

describe('useDebugActions', () => {
    let mockDispatch: ReturnType<typeof vi.fn>;
    let mockActivePlayerId: string;

    beforeEach(() => {
        mockDispatch = vi.fn();
        mockActivePlayerId = 'P1';

        vi.mocked(useGameStore).mockReturnValue({
            dispatch: mockDispatch,
            activePlayerId: mockActivePlayerId,
            age: 1
        } as any);
    });

    describe('debug action hooks', () => {
        it('should return debug actions object', () => {
            const { result } = renderHook(() => useDebugActions());
            expect(result.current).toBeDefined();
            expect(result.current.addPower).toBeDefined();
            expect(result.current.advanceEra).toBeDefined();
            expect(result.current.unlockAllTech).toBeDefined();
        });
    });

    describe('debug action execution', () => {
        it('should dispatch POWER_ROLL event when addPower is called', () => {
            const { result } = renderHook(() => useDebugActions());

            act(() => {
                result.current.addPower(10);
            });

            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'POWER_ROLL',
                    payload: expect.objectContaining({
                        result: 10,
                        source: 'DEBUG'
                    })
                })
            );
        });

        it('should dispatch POWER_ROLL with correct player ID', () => {
            const { result } = renderHook(() => useDebugActions());

            act(() => {
                result.current.addPower(10);
            });

            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    playerId: mockActivePlayerId
                })
            );
        });

        it('should dispatch AGE_ADVANCE event when advanceEra is called', () => {
            const { result } = renderHook(() => useDebugActions());

            act(() => {
                result.current.advanceEra();
            });

            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'AGE_ADVANCE',
                    playerId: 'SYSTEM',
                    payload: expect.objectContaining({
                        to: 2
                    })
                })
            );
        });

        it('should advance to correct age', () => {
            const { result } = renderHook(() => useDebugActions());

            act(() => {
                result.current.advanceEra();
            });

            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: expect.objectContaining({
                        to: 2
                    })
                })
            );
        });

        it('should not advance beyond age 3', () => {
            vi.mocked(useGameStore).mockReturnValue({
                dispatch: mockDispatch,
                activePlayerId: mockActivePlayerId,
                age: 3
            } as any);

            const { result } = renderHook(() => useDebugActions());

            act(() => {
                result.current.advanceEra();
            });

            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });

    describe('debug action state', () => {
        it('should use active player ID from store', () => {
            const { result } = renderHook(() => useDebugActions());

            act(() => {
                result.current.addPower(10);
            });

            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    playerId: mockActivePlayerId
                })
            );
        });

        it('should update when active player changes', () => {
            const { result, rerender } = renderHook(() => useDebugActions());

            vi.mocked(useGameStore).mockReturnValue({
                dispatch: mockDispatch,
                activePlayerId: 'P2',
                age: 1
            } as any);

            rerender();

            act(() => {
                result.current.addPower(10);
            });

            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    playerId: 'P2'
                })
            );
        });
    });

    describe('debug action cleanup', () => {
        it('should clean up on unmount', () => {
            const { unmount } = renderHook(() => useDebugActions());
            expect(() => unmount()).not.toThrow();
        });
    });
});
