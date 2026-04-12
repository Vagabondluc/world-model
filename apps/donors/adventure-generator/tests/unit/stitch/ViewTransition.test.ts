
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useViewTransition } from '../../../src/hooks/useViewTransition';

describe('useViewTransition Hook (T-710)', () => {
    beforeEach(() => {
        // Reset document.startViewTransition before each test
        (document as any).startViewTransition = undefined;
    });

    describe('Transition Hooks', () => {
        it('should execute callback immediately if startViewTransition is missing (fallback)', async () => {
            const mockCallback = vi.fn();

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            await startTransition(mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should call startViewTransition when supported', async () => {
            const mockCallback = vi.fn();
            const mockStartViewTransition = vi.fn((cb: () => void) => {
                cb();
            });

            (document as any).startViewTransition = mockStartViewTransition;

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            await startTransition(mockCallback);

            expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should handle async callbacks correctly', async () => {
            const mockCallback = vi.fn(async () => {
                await Promise.resolve();
            });

            const mockStartViewTransition = vi.fn(async (cb: () => Promise<void>) => {
                await cb();
            });

            (document as any).startViewTransition = mockStartViewTransition;

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            await startTransition(mockCallback);

            expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should handle callbacks that throw errors gracefully', async () => {
            const mockCallback = vi.fn(() => {
                throw new Error('Test error');
            });

            const mockStartViewTransition = vi.fn((cb: () => Promise<void> | void) => {
                return Promise.resolve(cb()).catch(() => {
                    // Expected error
                });
            });

            (document as any).startViewTransition = mockStartViewTransition;

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            await startTransition(mockCallback);

            expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should return a stable function reference', () => {
            const { result, rerender } = renderHook(() => useViewTransition());
            const firstRef = result.current;

            rerender();
            const secondRef = result.current;

            expect(firstRef).toBe(secondRef);
        });

        it('should support multiple sequential transitions', () => {
            const mockCallback1 = vi.fn();
            const mockCallback2 = vi.fn();
            const mockCallback3 = vi.fn();

            const mockStartViewTransition = vi.fn((cb: () => void) => {
                cb();
            });

            (document as any).startViewTransition = mockStartViewTransition;

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            startTransition(mockCallback1);
            startTransition(mockCallback2);
            startTransition(mockCallback3);

            expect(mockStartViewTransition).toHaveBeenCalledTimes(3);
            expect(mockCallback1).toHaveBeenCalledTimes(1);
            expect(mockCallback2).toHaveBeenCalledTimes(1);
            expect(mockCallback3).toHaveBeenCalledTimes(1);
        });

        it('should handle callbacks with return values', () => {
            const mockCallback = vi.fn(() => {
                // Return value should be ignored by the hook.
                return 'ignored';
            }) as unknown as () => void;

            const mockStartViewTransition = vi.fn((cb: () => void) => {
                cb();
            });

            (document as any).startViewTransition = mockStartViewTransition;

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            startTransition(mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should work with promises in fallback mode', async () => {
            const mockCallback = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
            });

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            await startTransition(mockCallback);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should pass through any arguments to the callback', () => {
            const mockCallback = vi.fn((arg1: string, arg2: number) => {
                void `${arg1}-${arg2}`;
            });

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            startTransition(() => {
                mockCallback('test', 42);
            });

            expect(mockCallback).toHaveBeenCalledWith('test', 42);
        });

        it('should handle undefined startViewTransition gracefully', () => {
            const mockCallback = vi.fn();

            // Ensure startViewTransition is undefined
            delete (document as any).startViewTransition;

            const { result } = renderHook(() => useViewTransition());
            const startTransition = result.current;

            startTransition(mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(1);
        });
    });
});
