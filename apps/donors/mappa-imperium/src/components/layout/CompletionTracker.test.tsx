import { render, screen, fireEvent } from '@testing-library/react';
import CompletionTracker from './CompletionTracker';

// Mock store
const mockUseGameStore = vi.fn();
vi.mock('../../stores/gameStore', () => ({
    useGameStore: () => mockUseGameStore()
}));

// Mock Eras data
vi.mock('../../data/eras', () => ({
    eras: [
        { id: 1, name: "Age of Creation", icon: "🌍" },
        { id: 2, name: "Age of Myth", icon: "⚡" }
    ],
    TURNS_PER_ERA: {
        Standard: { 3: 3, 4: 6, 5: 6, 6: 5 }
    }
}));

describe('CompletionTracker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseGameStore.mockReturnValue({
            elements: [],
            players: [{ playerNumber: 1, name: 'Player 1', isOnline: true }],
            currentEraId: 1,
            gameSettings: { length: 'Standard' },
            currentPlayer: { playerNumber: 1, name: 'Player 1' }
        });
    });

    it('renders the total game progress bar', () => {
        render(<CompletionTracker />);
        expect(screen.getByText('Total Game Progress')).toBeInTheDocument();
    });

    it('renders player progress bar', () => {
        render(<CompletionTracker />);
        expect(screen.getByText('Your Progress')).toBeInTheDocument();
    });

    it('expands to show details', () => {
        render(<CompletionTracker />);
        const button = screen.getByLabelText('Expand progress details');
        fireEvent.click(button);

        // This is where "pill boxes" might be appearing instead of expected text
        expect(screen.getByText('Player 1')).toBeInTheDocument();
        // Check for Era names availability
        expect(screen.getByTitle(/Era 1: Age of Creation/)).toBeInTheDocument();
    });
});
