/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles onClick event', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders loading state', () => {
        render(<Button loading>Submit</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        // Assuming loading spinner is rendered, or just check disabled attribute
    });

    it('applies simple variant classes', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        // Check for a class we know implies destructive, e.g., bg-red-600
        // We rely on the implementation specifics here, which is fine for unit tests
        expect(container.firstChild).toHaveClass('bg-red-600');
    });
});
