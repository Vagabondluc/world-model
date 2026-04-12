/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
    it('renders content', () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies interactive variant classes', () => {
        const { container } = render(<Card variant="interactive">Clickable</Card>);
        expect(container.firstChild).toHaveClass('cursor-pointer');
    });

    it('passes through extra props', () => {
        render(<Card data-testid="my-card">Test</Card>);
        expect(screen.getByTestId('my-card')).toBeInTheDocument();
    });
});
