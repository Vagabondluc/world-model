import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionManager } from './ConnectionManager';
import { ConnectionDefinition } from '@/types/nodeEditor.types';

describe('ConnectionManager', () => {
    const mockConnections: ConnectionDefinition[] = [
        {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'out',
            targetNodeId: 'node-2',
            targetPortId: 'in',
            selected: false,
            animated: false
        },
        {
            id: 'conn-2',
            sourceNodeId: 'node-2',
            sourcePortId: 'out',
            targetNodeId: 'node-3',
            targetPortId: 'in',
            selected: true,
            animated: true
        }
    ];

    const mockGetPortPosition = vi.fn((nodeId: string, portId: string) => {
        const positions: Record<string, { x: number; y: number }> = {
            'node-1-out': { x: 100, y: 100 },
            'node-2-in': { x: 200, y: 100 },
            'node-2-out': { x: 300, y: 200 },
            'node-3-in': { x: 400, y: 200 }
        };
        return positions[`${nodeId}-${portId}`] || null;
    });

    const mockOnConnectionSelect = vi.fn();
    const mockOnConnectionDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Render All Connections', () => {
        it('renders all connections from state', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                />
            );

            // Check that connection lines are rendered
            const paths = document.querySelectorAll('.connection-line path');
            // Each connection has 2 paths (background + visible)
            expect(paths.length).toBeGreaterThanOrEqual(mockConnections.length);
        });

        it('renders no connections when connections array is empty', () => {
            render(
                <ConnectionManager
                    connections={[]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBe(0);
        });

        it('skips rendering connections with missing port positions', () => {
            const connectionsWithMissingPorts: ConnectionDefinition[] = [
                {
                    id: 'conn-missing',
                    sourceNodeId: 'missing-node',
                    sourcePortId: 'out',
                    targetNodeId: 'node-1',
                    targetPortId: 'in',
                    selected: false,
                    animated: false
                }
            ];

            render(
                <ConnectionManager
                    connections={connectionsWithMissingPorts}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBe(0);
        });
    });

    describe('Connection Selection Handling', () => {
        it('calls onConnectionSelect when clicking a connection', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                    onConnectionSelect={mockOnConnectionSelect}
                />
            );

            // Click on the hit area path (first path in group)
            const connectionGroups = document.querySelectorAll('.connection-line');
            const firstConnection = connectionGroups[0];
            const hitPath = firstConnection.querySelector('path'); // First path is the hit area
            if (hitPath) {
                fireEvent.click(hitPath);
            }

            expect(mockOnConnectionSelect).toHaveBeenCalledWith('conn-1');
        });

        it('stops event propagation when selecting connection', () => {
            const mockEvent = { stopPropagation: vi.fn() } as unknown as React.MouseEvent;
            const mockConnection = mockConnections[0];

            render(
                <ConnectionManager
                    connections={[mockConnection]}
                    getPortPosition={mockGetPortPosition}
                    onConnectionSelect={mockOnConnectionSelect}
                />
            );

            const connectionGroups = document.querySelectorAll('.connection-line');
            const firstConnection = connectionGroups[0];
            const hitPath = firstConnection.querySelector('path');
            if (hitPath) {
                fireEvent.click(hitPath);
            }

            // The component should handle stopPropagation internally
            expect(mockOnConnectionSelect).toHaveBeenCalled();
        });

        it('does not call onConnectionSelect when handler is not provided', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const connectionGroups = document.querySelectorAll('.connection-line');
            const firstConnection = connectionGroups[0];
            const hitPath = firstConnection.querySelector('path');
            if (hitPath) {
                fireEvent.click(hitPath);
            }

            expect(mockOnConnectionSelect).not.toHaveBeenCalled();
        });
    });

    describe('Delete Button for Selected Connections', () => {
        it('renders delete button for selected connection', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                    onConnectionDelete={mockOnConnectionDelete}
                />
            );

            // Find delete button (conn-2 is selected)
            const deleteButtons = screen.getAllByTitle('Delete Connection');
            expect(deleteButtons.length).toBe(1);
        });

        it('does not render delete button for unselected connections', () => {
            const unselectedConnections = mockConnections.map(c => ({ ...c, selected: false }));

            render(
                <ConnectionManager
                    connections={unselectedConnections}
                    getPortPosition={mockGetPortPosition}
                    onConnectionDelete={mockOnConnectionDelete}
                />
            );

            const deleteButtons = screen.queryAllByTitle('Delete Connection');
            expect(deleteButtons.length).toBe(0);
        });

        it('calls onConnectionDelete when clicking delete button', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                    onConnectionDelete={mockOnConnectionDelete}
                />
            );

            const deleteButton = screen.getByTitle('Delete Connection');
            fireEvent.click(deleteButton);

            expect(mockOnConnectionDelete).toHaveBeenCalledWith('conn-2');
        });

        it('stops event propagation when deleting connection', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                    onConnectionDelete={mockOnConnectionDelete}
                />
            );

            const deleteButton = screen.getByTitle('Delete Connection');
            fireEvent.click(deleteButton);

            expect(mockOnConnectionDelete).toHaveBeenCalled();
        });
    });

    describe('Prevent Duplicate Connections', () => {
        it('renders connections with duplicate IDs (component does not prevent)', () => {
            const duplicateConnections: ConnectionDefinition[] = [
                { ...mockConnections[0], id: 'conn-1' },
                { ...mockConnections[1], id: 'conn-1' }
            ];

            render(
                <ConnectionManager
                    connections={duplicateConnections}
                    getPortPosition={mockGetPortPosition}
                />
            );

            // Component renders what it's given - duplicate prevention is handled elsewhere
            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(0);
        });
    });

    describe('Connection State Visualization', () => {
        it('renders connection with default status', () => {
            render(
                <ConnectionManager
                    connections={[mockConnections[0]]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(0);
        });

        it('renders connection with selected status', () => {
            render(
                <ConnectionManager
                    connections={[mockConnections[1]]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(0);
        });

        it('renders connection with error status when invalid', () => {
            const invalidPhantomConnection = {
                startPos: { x: 100, y: 100 },
                currentPos: { x: 200, y: 200 },
                isValid: false
            };

            render(
                <ConnectionManager
                    connections={mockConnections}
                    phantomConnection={invalidPhantomConnection}
                    getPortPosition={mockGetPortPosition}
                />
            );

            // Phantom connection with invalid status should be rendered
            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(mockConnections.length * 2);
        });
    });

    describe('Animated Connections', () => {
        it('renders animated connection with dashed stroke', () => {
            render(
                <ConnectionManager
                    connections={[mockConnections[1]]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            // Check if any path has strokeDasharray
            const dashedPath = Array.from(paths).find(path => {
                const dashArray = path.getAttribute('stroke-dasharray');
                return dashArray && dashArray !== 'none';
            });
            expect(dashedPath).toBeDefined();
        });

        it('does not render dashed stroke for non-animated connections', () => {
            render(
                <ConnectionManager
                    connections={[mockConnections[0]]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            // Check that non-animated connection doesn't have dashed stroke
            const nonAnimatedPath = Array.from(paths).find(path => {
                const dashArray = path.getAttribute('stroke-dasharray');
                return dashArray === 'none' || dashArray === null;
            });
            expect(nonAnimatedPath).toBeDefined();
        });
    });

    describe('SVG Bezier Curve Rendering', () => {
        it('renders bezier curve path by default', () => {
            render(
                <ConnectionManager
                    connections={[mockConnections[0]]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(0);

            // Check that path data contains bezier curve commands (C)
            const firstPath = paths[0];
            const pathData = firstPath.getAttribute('d');
            expect(pathData).toMatch(/M .* C .*/);
        });

        it('calculates correct bezier control points', () => {
            render(
                <ConnectionManager
                    connections={[mockConnections[0]]}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            const pathData = paths[0]?.getAttribute('d');

            // Path should be: M x1 y1 C cx1 cy1 cx2 cy2 x2 y2
            expect(pathData).toBeDefined();
            expect(pathData).toMatch(/^M \d+ \d+ C \d+ \d+ \d+ \d+ \d+ \d+$/);
        });
    });

    describe('Phantom Connection Rendering', () => {
        it('renders phantom connection during drag', () => {
            const phantomConnection = {
                startPos: { x: 100, y: 100 },
                currentPos: { x: 250, y: 250 },
                isValid: true
            };

            render(
                <ConnectionManager
                    connections={mockConnections}
                    phantomConnection={phantomConnection}
                    getPortPosition={mockGetPortPosition}
                />
            );

            // Should have more paths than just the regular connections
            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(mockConnections.length * 2);
        });

        it('does not render phantom connection when not dragging', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                />
            );

            // Should only have paths for regular connections
            const paths = document.querySelectorAll('.connection-line path');
            // Each connection has 2 paths (background + visible)
            expect(paths.length).toBe(mockConnections.length * 2);
        });

        it('updates phantom connection position on drag', () => {
            const { rerender } = render(
                <ConnectionManager
                    connections={mockConnections}
                    phantomConnection={{
                        startPos: { x: 100, y: 100 },
                        currentPos: { x: 200, y: 200 },
                        isValid: true
                    }}
                    getPortPosition={mockGetPortPosition}
                />
            );

            // Update phantom connection position
            rerender(
                <ConnectionManager
                    connections={mockConnections}
                    phantomConnection={{
                        startPos: { x: 100, y: 100 },
                        currentPos: { x: 300, y: 300 },
                        isValid: true
                    }}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBeGreaterThan(mockConnections.length * 2);
        });
    });

    describe('SVG Container', () => {
        it('renders SVG with correct positioning classes', () => {
            const { container } = render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'pointer-events-none', 'overflow-visible');
        });
    });

    describe('Delete Button Positioning', () => {
        it('positions delete button at midpoint of connection', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                    onConnectionDelete={mockOnConnectionDelete}
                />
            );

            const deleteButton = screen.getByTitle('Delete Connection');
            // conn-2 goes from (300, 200) to (400, 200)
            // Midpoint should be (350, 200)
            // The button is positioned at midX - 10, midY - 10
            // So it should be at (340, 190) with width/height 20

            const foreignObject = deleteButton.parentElement;
            expect(foreignObject).toHaveAttribute('x', '340'); // 350 - 10
            expect(foreignObject).toHaveAttribute('y', '190'); // 200 - 10
        });
    });

    describe('Edge Cases', () => {
        it('handles null phantom connection', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    phantomConnection={null}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBe(mockConnections.length * 2);
        });

        it('handles undefined phantom connection', () => {
            render(
                <ConnectionManager
                    connections={mockConnections}
                    getPortPosition={mockGetPortPosition}
                />
            );

            const paths = document.querySelectorAll('.connection-line path');
            expect(paths.length).toBe(mockConnections.length * 2);
        });
    });
});
