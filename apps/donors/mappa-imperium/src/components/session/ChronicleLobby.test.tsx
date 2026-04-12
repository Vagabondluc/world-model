import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ChronicleLobby from './ChronicleLobby';

// Mock store
const mockImportFromFeed = vi.fn();
const mockBackToSetup = vi.fn();
vi.mock('../../stores/gameStore', () => ({
    useGameStore: () => ({
        importFromFeed: mockImportFromFeed,
        backToSetup: mockBackToSetup
    })
}));

describe('ChronicleLobby', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset fetch mock
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows loading state initially', () => {
        (global.fetch as any).mockReturnValue(new Promise(() => { })); // Never resolves
        render(<ChronicleLobby />);
        expect(screen.getByText(/Loading available chronicles/i)).toBeInTheDocument();
    });

    it('displays error when fetch fails', async () => {
        (global.fetch as any).mockRejectedValue(new Error('Network error'));
        render(<ChronicleLobby />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to Load Chronicle Lobby/i)).toBeInTheDocument();
            expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        });
    });

    it('displays empty state when no games found', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ games: [] })
        });

        render(<ChronicleLobby />);

        await waitFor(() => {
            expect(screen.getByText(/No public chronicles found/i)).toBeInTheDocument();
        });
    });

    it('renders list of games when manifest loads', async () => {
        const mockGames = [
            {
                gameId: '1',
                gameName: 'Epic Campaign',
                lastUpdate: '2023-01-01',
                nextPlayerUp: 'Alice',
                playerList: ['Alice', 'Bob'],
                currentEraStep: 'Exploration',
                feedUrl: '/feed/1'
            }
        ];

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ games: mockGames })
        });

        render(<ChronicleLobby />);

        await waitFor(() => {
            expect(screen.getByText('Epic Campaign')).toBeInTheDocument();
            expect(screen.getByText('Alice')).toBeInTheDocument(); // Next player
            expect(screen.getByText(/Bob/)).toBeInTheDocument(); // Player list included "Bob"
        });
    });

    it('calls importFromFeed when loading as observer', async () => {
        const mockGames = [
            {
                gameId: '1',
                gameName: 'Test Game',
                lastUpdate: '2023-01-01',
                nextPlayerUp: 'Alice',
                playerList: ['Alice'],
                currentEraStep: 'Start',
                feedUrl: '/feed/test'
            }
        ];

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ games: mockGames })
        });

        render(<ChronicleLobby />);

        await waitFor(() => {
            expect(screen.getByText('Test Game')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Load as Observer'));
        expect(mockImportFromFeed).toHaveBeenCalledWith('/feed/test');
    });

    it('calls backToSetup when back button is clicked', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ games: [] })
        });

        render(<ChronicleLobby />);

        await waitFor(() => {
            expect(screen.getByText(/Back to Setup/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Back to Setup/i));
        expect(mockBackToSetup).toHaveBeenCalled();
    });
});
