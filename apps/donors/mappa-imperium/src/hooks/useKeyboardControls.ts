
import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useKeyboardControls = () => {
    const { toggleDebugger } = useGameStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

            // Debugger Toggle (Ctrl+Shift+D or F9)
            if ((e.ctrlKey && e.shiftKey && e.key === 'D') || e.key === 'F9') {
                e.preventDefault();
                toggleDebugger();
            }

            // Map Controls (delegated to simpler events or store actions eventually)
            // For now specific components handle their local shortcuts (like MainMapInterface)
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleDebugger]);
};
