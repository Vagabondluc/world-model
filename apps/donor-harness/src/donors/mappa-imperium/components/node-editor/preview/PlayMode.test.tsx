
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PreviewPane } from './PreviewPane';
import { useGameStore } from '@mi/stores/gameStore';
import { NodeDefinition } from '@mi/types/nodeEditor.types';

// Mock the store
vi.mock('@/stores/gameStore', () => ({
    useGameStore: vi.fn()
}));

describe('Play Mode Integration', () => {

    const mockNodes: NodeDefinition[] = [
        {
            id: '1',
            type: 'diceRoll',
            position: { x: 0, y: 0 },
            data: {
                diceNotation: '1d6',
                buttonText: 'Roll Test'
            },
            inputs: [],
            outputs: [],
            config: { category: 'interactive', label: 'Dice Roll', icon: 'dice' } as any
        }
    ];

    beforeEach(() => {
        (useGameStore as any).mockReturnValue({
            nodes: mockNodes,
            connections: [], // No connections needed for single node test
            selectedNodeId: null
        });
    });

    it('toggles into play mode and renders interactive node', async () => {
        render(<PreviewPane />);

        // 1. Check initial state (Edit Mode)
        expect(screen.getByText('👁️ Preview')).toBeDefined();

        // 2. Click Play Button
        const playButton = screen.getByTitle('Start Playing');
        fireEvent.click(playButton);

        // 3. Verify Play Mode Header
        await waitFor(() => {
            expect(screen.getByText('🎮 Play Mode')).toBeDefined();
        });

        // 4. Verify Dice Roll Node is rendered (it suspends immediately)
        // The InteractiveNodeRenderer should show the button
        await waitFor(() => {
            expect(screen.getByText('Roll Required')).toBeDefined();
            expect(screen.getByText('Roll Test')).toBeDefined();
        });
    });

    it('handles interaction and resumes', async () => {
        render(<PreviewPane />);

        // Enter Play Mode
        fireEvent.click(screen.getByTitle('Start Playing'));

        // Wait for Dice Button
        const rollButton = await screen.findByText('Roll Test');

        // Click Roll
        fireEvent.click(rollButton);

        // After roll, the Runtime simulates a result and completes the node.
        // Since there are no other connected nodes, the graph completes.

        await waitFor(() => {
            // The interactive UI should disappear (or show "Run Complete")
            // checking for status text in header
            expect(screen.getByText('Run Complete')).toBeDefined();
        });
    });
});
