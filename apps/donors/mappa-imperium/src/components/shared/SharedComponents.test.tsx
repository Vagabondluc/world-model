/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import ErrorAlert from './ErrorAlert';
import LoadingSpinner from './LoadingSpinner';

describe('ErrorAlert', () => {
    it('renders message', () => {
        render(<ErrorAlert message="Something went wrong" />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Error:')).toBeInTheDocument();
    });
});

describe('LoadingSpinner', () => {
    it('renders spinner', () => {
        const { container } = render(<LoadingSpinner />);
        // Checking for animate-spin class
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders optional message', () => {
        render(<LoadingSpinner message="Loading data..." />);
        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
});
