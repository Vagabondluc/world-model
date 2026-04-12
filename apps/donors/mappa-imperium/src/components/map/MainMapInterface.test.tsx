import { render, screen, fireEvent } from '@testing-library/react';
import MainMapInterface from './MainMapInterface';

// Mock child components to isolate MainMapInterface
vi.mock('./UnifiedMapRenderer', () => ({
    UnifiedMapRenderer: ({ zoom, pan }: any) => (
        <div data-testid="unified-map-renderer">
            Map Renderer (Zoom: {zoom.toFixed(1)}, X: {pan.x}, Y: {pan.y})
        </div>
    )
}));

vi.mock('./MapControls', () => ({
    default: ({ onZoomIn, onZoomOut, onResetView }: any) => (
        <div data-testid="map-controls">
            <button onClick={onZoomIn}>Zoom In</button>
            <button onClick={onZoomOut}>Zoom Out</button>
            <button onClick={onResetView}>Reset View</button>
        </div>
    )
}));

vi.mock('../navigation/NavigationHeader', () => ({
    default: () => <div data-testid="navigation-header">Navigation Header</div>
}));

vi.mock('../chat/ChatPanel', () => ({
    default: () => <div data-testid="chat-panel">Chat Panel</div>
}));

vi.mock('./MapStyleToggle', () => ({
    MapStyleToggle: () => <div data-testid="map-style-toggle">Map Style Toggle</div>
}));

vi.mock('../layout/CompletionTracker', () => ({
    default: () => <div data-testid="completion-tracker">Completion Tracker</div>
}));

vi.mock('../layout/CollaborationStatus', () => ({
    default: () => <div data-testid="collaboration-status">Collaboration Status</div>
}));

vi.mock('../shared/SettingsModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="settings-modal">Settings Modal</div> : null
}));

// Mock the store
const mockUseGameStore = vi.fn();
vi.mock('../../stores/gameStore', () => ({
    useGameStore: () => mockUseGameStore()
}));

// Mock the hook
vi.mock('../../hooks/useZoomPan', () => ({
    useZoomPan: ({ initialZoom }: any) => {
        const [zoom, setZoom] = React.useState(initialZoom);
        const [pan, setPan] = React.useState({ x: 0, y: 0 });
        return {
            zoom,
            pan,
            setZoom,
            setPan,
            bindGestures: () => ({})
        };
    }
}));

import React from 'react';

describe('MainMapInterface', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default store state
        mockUseGameStore.mockReturnValue({
            mapData: { hexBiomes: [] },
            appSettings: {
                mapRenderMode: 'svg',
                tileTheme: 'classic',
                outlineStyle: 'hex'
            },
            isSettingsModalOpen: false,
            toggleSettingsModal: vi.fn(),
            saveSettings: vi.fn(),
            gameSettings: {}
        });
    });

    it('renders loading state when no map data is available', () => {
        mockUseGameStore.mockReturnValue({
            mapData: null
        });

        render(<MainMapInterface />);
        expect(screen.getByText(/No map data available/i)).toBeInTheDocument();
    });

    it('renders main components when map data is available', () => {
        render(<MainMapInterface />);

        expect(screen.getByTestId('navigation-header')).toBeInTheDocument();
        expect(screen.getByTestId('unified-map-renderer')).toBeInTheDocument();
        expect(screen.getByTestId('map-controls')).toBeInTheDocument();
        expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
    });

    it('displays zoom and pan coordinates', () => {
        render(<MainMapInterface />);
        // Initial values from useZoomPan mock
        expect(screen.getByText(/0, 0 \| Z: 1.0/)).toBeInTheDocument();
    });

    it('handles map control interactions', () => {
        render(<MainMapInterface />);

        // This relies on the useZoomPan mock state implementation inside the test file
        // which mimics the real hook's behavior for testing the integration

        const zoomInBtn = screen.getByText('Zoom In');
        fireEvent.click(zoomInBtn);
        // We mocked the hook to actually update state, so we can check if the UI updated
        expect(screen.getByText(/Z: 1.5/)).toBeInTheDocument();

        const zoomOutBtn = screen.getByText('Zoom Out');
        fireEvent.click(zoomOutBtn);
        expect(screen.getByText(/Z: 1.0/)).toBeInTheDocument();
    });

    it('shows settings modal when open', () => {
        mockUseGameStore.mockReturnValue({
            mapData: { hexBiomes: [] },
            appSettings: {},
            isSettingsModalOpen: true
        });

        render(<MainMapInterface />);
        expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    });
});
