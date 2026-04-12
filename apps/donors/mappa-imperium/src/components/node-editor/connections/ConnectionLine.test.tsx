import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionLine } from './ConnectionLine';

describe('ConnectionLine', () => {
    const defaultProps = {
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('SVG Bezier Curve Rendering', () => {
        it('renders bezier curve path by default', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} />
                </svg>
            );

            const path = document.querySelector('path[d^="M"]');
            expect(path).toBeInTheDocument();
            expect(path?.getAttribute('d')).toContain('C'); // Bezier curve command
        });

        it('calculates correct control points for bezier curve', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} />
                </svg>
            );

            const path = document.querySelector('path[d^="M"]');
            const d = path?.getAttribute('d');

            // Should contain move command and bezier curve command
            expect(d).toMatch(/^M \d+ \d+ C \d+ \d+ \d+ \d+ \d+ \d+$/);
        });

        it('renders two path elements (background for hit area, visible line)', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} />
                </svg>
            );

            const paths = document.querySelectorAll('path');
            expect(paths.length).toBe(2);
        });
    });

    describe('Straight Line Rendering', () => {
        it('renders straight line when type is "straight"', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} type="straight" />
                </svg>
            );

            const path = document.querySelector('path[d^="M"]');
            const d = path?.getAttribute('d');

            // Should contain move and line commands only
            expect(d).toMatch(/^M \d+ \d+ L \d+ \d+$/);
            expect(d).not.toContain('C'); // No bezier curve
        });

        it('renders straight line connecting two points', () => {
            render(
                <svg>
                    <ConnectionLine x1={10} y1={20} x2={30} y2={40} type="straight" />
                </svg>
            );

            const path = document.querySelector('path[d^="M"]');
            const d = path?.getAttribute('d');

            expect(d).toBe('M 10 20 L 30 40');
        });
    });

    describe('Connection States', () => {
        it('renders default state with slate color', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} status="default" />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1]; // Second path is visible
            expect(visiblePath).toHaveAttribute('stroke', '#94a3b8');
        });

        it('renders valid state with green color', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} status="valid" />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveAttribute('stroke', '#22c55e');
        });

        it('renders invalid state with red color', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} status="invalid" />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveAttribute('stroke', '#ef4444');
        });

        it('renders selected state with blue color and increased stroke width', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} status="selected" />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveAttribute('stroke', '#3b82f6');
            expect(visiblePath).toHaveAttribute('stroke-width', '3');
        });

        it('applies full opacity to selected state', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} status="selected" />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveAttribute('stroke-opacity', '1');
        });
    });

    describe('Animated Connections', () => {
        it('renders dashed stroke when animated is true', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} animated={true} />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveAttribute('stroke-dasharray', '5,5');
        });

        it('applies animate-flow class when animated', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} animated={true} />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveClass('animate-flow');
        });

        it('renders solid stroke when animated is false', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} animated={false} />
                </svg>
            );

            const visiblePath = document.querySelectorAll('path')[1];
            expect(visiblePath).toHaveAttribute('stroke-dasharray', 'none');
        });
    });

    describe('Port Connection Points', () => {
        it('connects from (x1, y1) to (x2, y2)', () => {
            render(
                <svg>
                    <ConnectionLine x1={50} y1={100} x2={200} y2={150} />
                </svg>
            );

            const path = document.querySelector('path[d^="M"]');
            const d = path?.getAttribute('d');

            expect(d).toContain('M 50 100');
            expect(d).toContain('200 150');
        });

        it('renders background path with wider stroke for easier clicking', () => {
            const mockOnClick = vi.fn();
            render(
                <svg>
                    <ConnectionLine {...defaultProps} onClick={mockOnClick} strokeWidth={2} />
                </svg>
            );

            const backgroundPath = document.querySelectorAll('path')[0];
            expect(backgroundPath).toHaveAttribute('stroke', 'transparent');
            expect(backgroundPath).toHaveAttribute('stroke-width', '12'); // 2 * 6
        });

        it('calls onClick handler when background path is clicked', () => {
            const mockOnClick = vi.fn();
            render(
                <svg>
                    <ConnectionLine {...defaultProps} onClick={mockOnClick} />
                </svg>
            );

            const backgroundPath = document.querySelectorAll('path')[0];
            fireEvent.click(backgroundPath);

            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });

        it('sets cursor to pointer on hover', () => {
            render(
                <svg>
                    <ConnectionLine {...defaultProps} />
                </svg>
            );

            const backgroundPath = document.querySelectorAll('path')[0];
            expect(backgroundPath).toHaveStyle({ cursor: 'pointer' });
        });
    });
});
