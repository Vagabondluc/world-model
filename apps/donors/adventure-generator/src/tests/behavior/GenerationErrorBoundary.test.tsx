import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationErrorBoundary } from '../../components/common/GenerationErrorBoundary';

const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) throw new Error('Boom');
    return <div>Safe Render</div>;
};

describe('GenerationErrorBoundary', () => {
    it('renders fallback UI when a child throws', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <GenerationErrorBoundary>
                <Bomb shouldThrow />
            </GenerationErrorBoundary>
        );

        expect(screen.getByText('Something Went Wrong')).toBeTruthy();
        expect(screen.getByText('Try to Recover')).toBeTruthy();
    });

    it('recovers and renders children after reset', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        const { rerender } = render(
            <GenerationErrorBoundary>
                <Bomb shouldThrow />
            </GenerationErrorBoundary>
        );

        rerender(
            <GenerationErrorBoundary>
                <Bomb shouldThrow={false} />
            </GenerationErrorBoundary>
        );

        fireEvent.click(screen.getByText('Try to Recover'));
        expect(screen.getByText('Safe Render')).toBeTruthy();
    });
});
