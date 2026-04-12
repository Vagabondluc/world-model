import { useCallback } from 'react';

/**
 * Hook to wrap a callback in the View Transition API if supported.
 * Falls back to normal execution otherwise.
 */
export const useViewTransition = () => {
    return useCallback((callback: () => void | Promise<void>) => {
        if (!(document as any).startViewTransition) {
            return callback();
        }

        return (document as any).startViewTransition(async () => {
            await callback();
        });
    }, []);
};
