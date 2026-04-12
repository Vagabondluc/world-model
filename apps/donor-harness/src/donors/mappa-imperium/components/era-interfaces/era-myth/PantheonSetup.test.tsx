import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PantheonSetup from './PantheonSetup';

// Mock DiceRoller to avoid randomness and simplify testing
vi.mock('../era-foundation/DiceRoller', () => ({
    default: ({ onRollComplete, buttonLabel }: any) => (
        <button
            data-testid="mock-dice-roller"
            onClick={() => onRollComplete(5)} // Simulate rolling a 5
        >
            {buttonLabel || 'Roll'}
        </button>
    )
}));

describe('PantheonSetup', () => {
    it('renders initial state correctly', () => {
        render(<PantheonSetup onCountSelect={vi.fn()} />);

        expect(screen.getByText(/Pantheon Setup/i)).toBeInTheDocument();
        expect(screen.getByText(/Roll a d6/i)).toBeInTheDocument();
        expect(screen.getByTestId('mock-dice-roller')).toBeInTheDocument();
    });

    it('handles roll completion and updates display', async () => {
        const onCountSelect = vi.fn();
        render(<PantheonSetup onCountSelect={onCountSelect} />);

        // Click the mock dice roller
        fireEvent.click(screen.getByTestId('mock-dice-roller'));

        // Should verify state update (result display)
        expect(await screen.findByText('5')).toBeInTheDocument();
        expect(screen.getByText(/Your pantheon will have 5 deities/i)).toBeInTheDocument();

        // Confirm button should appear
        expect(screen.getByText(/Accept & Begin Creation/i)).toBeInTheDocument();

        // DiceRoller should be hidden
        expect(screen.queryByTestId('mock-dice-roller')).not.toBeInTheDocument();
    });

    it('calls onCountSelect when confirmed', async () => {
        const onCountSelect = vi.fn();
        render(<PantheonSetup onCountSelect={onCountSelect} />);

        // Roll
        fireEvent.click(screen.getByTestId('mock-dice-roller'));

        // Confirm
        const confirmBtn = await screen.findByText(/Accept & Begin Creation/i);
        fireEvent.click(confirmBtn);

        expect(onCountSelect).toHaveBeenCalledWith(5);
    });
});
