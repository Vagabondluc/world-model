import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DiceRoller from './DiceRoller';

// Mock DicePip to simplify testing (optional, but good for isolation)
vi.mock('../../shared/DicePip', () => ({
    default: ({ value }: { value: number }) => <div data-testid="dice-pip">{value}</div>
}));

describe('DiceRoller Component', () => {
    const mockOnRoll = vi.fn();
    const resultTable: Record<number, string> = {
        1: 'Result One',
        2: 'Result Two',
        3: 'Result Three',
        4: 'Result Four',
        5: 'Result Five',
        6: 'Result Six',
        7: 'Result Seven'
    };

    it('renders with correct title and button text', () => {
        render(
            <DiceRoller
                title="Test Roller"
                diceNotation="1d6"
                resultTable={resultTable}
                onRoll={mockOnRoll}
                buttonText="Spin"
            />
        );
        expect(screen.getByText('Test Roller')).toBeInTheDocument();
        expect(screen.getByText('Spin')).toBeInTheDocument();
    });

    it('renders correct number of dice based on notation', () => {
        const { rerender } = render(
            <DiceRoller
                title="1d6 Roller"
                diceNotation="1d6"
                resultTable={resultTable}
                onRoll={mockOnRoll}
            />
        );
        expect(screen.getAllByTestId('dice-pip')).toHaveLength(1);

        rerender(
            <DiceRoller
                title="2d6 Roller"
                diceNotation="2d6"
                resultTable={resultTable}
                onRoll={mockOnRoll}
            />
        );
        expect(screen.getAllByTestId('dice-pip')).toHaveLength(2);
    });

    it('rolls dice and calls onRoll with result', () => {
        render(
            <DiceRoller
                title="Rolling Test"
                diceNotation="1d6"
                resultTable={resultTable}
                onRoll={mockOnRoll}
            />
        );

        const button = screen.getByRole('button', { name: /Roll/i });
        fireEvent.click(button);

        expect(mockOnRoll).toHaveBeenCalled();
        const callArgs = mockOnRoll.mock.calls[0];
        const resultString = callArgs[0];
        const resultValue = callArgs[1];

        expect(typeof resultString).toBe('string');
        expect(typeof resultValue).toBe('number');
        expect(resultValue).toBeGreaterThanOrEqual(1);
        expect(resultValue).toBeLessThanOrEqual(6);
        expect(Object.values(resultTable)).toContain(resultString);
    });

    it('handles manual override correctly', () => {
        render(
            <DiceRoller
                title="Manual Override Test"
                diceNotation="1d6"
                resultTable={resultTable}
                onRoll={mockOnRoll}
            />
        );

        const input = screen.getByLabelText(/Override:/i);
        fireEvent.change(input, { target: { value: '5' } });

        // onRoll should be called immediately on manual change
        expect(mockOnRoll).toHaveBeenCalledWith('Result Five', 5);

        // Verify displayed result updates
        // Verify displayed result updates
        expect(screen.getByText(/Result Five/)).toBeInTheDocument();
        expect(screen.getByText(/Result:/)).toBeInTheDocument();
        // Note: component displays "Result: <text>" only if !hideResult and total > 0
    });
});
