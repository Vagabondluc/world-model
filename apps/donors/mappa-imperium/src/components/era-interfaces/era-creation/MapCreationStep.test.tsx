import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapCreationStep from './MapCreationStep';
import { useGameStore } from '../../../stores/gameStore';

// Mock the dependencies
vi.mock('../../../stores/gameStore');
vi.mock('../../map/UnifiedMapRenderer', () => ({
    UnifiedMapRenderer: () => <div data-testid="unified-map-renderer">Map Renderer</div>
}));

// Mock mapGenerator
const mockGenerateMap = vi.fn();
vi.mock('../../../services/generators/mapGenerator', () => ({
    generateMap: (...args) => mockGenerateMap(...args)
}));

describe('MapCreationStep', () => {
    const mockSetMapData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useGameStore as any).mockReturnValue({
            setMapData: mockSetMapData,
            mapData: null // Start with no map
        });
        mockGenerateMap.mockReturnValue({
            hexBiomes: { '0,0,0': 'ocean' },
            locations: [],
            regions: []
        });
    });

    it('should render mode selection buttons', () => {
        render(<MapCreationStep />);
        expect(screen.getByText(/Random/i)).toBeInTheDocument();
        expect(screen.getByText(/Manual/i)).toBeInTheDocument();
    });

    it('should generate map when Random is clicked', async () => {
        render(<MapCreationStep />);
        const randomBtn = screen.getByText(/Random/i);
        fireEvent.click(randomBtn);

        await waitFor(() => {
            expect(mockGenerateMap).toHaveBeenCalled();
        });
    });

    it('should toggle to manual mode tools when Manual is clicked', () => {
        render(<MapCreationStep />);
        const manualBtn = screen.getByText(/Manual/i);
        fireEvent.click(manualBtn);

        expect(screen.getByText(/Draw Continent/i)).toBeInTheDocument();
        expect(screen.getByText(/Place Island/i)).toBeInTheDocument();
    });

    it('should show helper text for Manual Mode', () => {
        render(<MapCreationStep />);
        const manualBtn = screen.getByText(/Manual/i);
        fireEvent.click(manualBtn);
        expect(screen.getByText(/World Shaper/i)).toBeInTheDocument();
    });

    // Note: Testing actual canvas/UnifiedMapRenderer interaction is hard in unit tests.
    // We mock UnifiedMapRenderer and trust it handles `hexBiomes` prop correctly.
    // Here we can check if the "Confirm" button calls the store.

    it('should save map data to store on confirmation', async () => {
        render(<MapCreationStep />);
        const randomBtn = screen.getByText(/Random/i);
        fireEvent.click(randomBtn);

        // Assume random generation fills local state
        const confirmBtn = screen.getByText(/Confirm Map/i);
        fireEvent.click(confirmBtn);

        expect(mockSetMapData).toHaveBeenCalled();
    });
});
