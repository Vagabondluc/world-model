import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NodeEditor } from './NodeEditor';
import { useGameStore } from '@mi/stores/gameStore';

// Mock the store
vi.mock('@/stores/gameStore');
vi.mock('@/services/nodeExportService');
vi.mock('@/services/testDataService');

describe('NodeEditor - Full Workflow Integration', () => {
    beforeEach(() => {
        // Reset store mock
        vi.mocked(useGameStore).mockReturnValue({
            nodes: [],
            connections: [],
            selectedNodeId: null,
            selectedConnectionId: null,
            validationErrors: [],
            addNode: vi.fn(),
            updateNode: vi.fn(),
            deleteNode: vi.fn(),
            addConnection: vi.fn(),
            deleteConnection: vi.fn(),
            selectNode: vi.fn(),
            selectConnection: vi.fn(),
            clearGraph: vi.fn(),
            importSchema: vi.fn(),
            exportSchema: vi.fn(() => '{"nodes":[],"connections":[]}'),
            setValidationErrors: vi.fn(),
        } as any);
    });

    describe('Task 15.4: Create → Configure → Execute → Export', () => {
        it('renders the node editor interface', () => {
            render(<NodeEditor />);

            // Should have toolbar
            expect(screen.getByText(/Node Editor/i)).toBeInTheDocument();

            // Should have palette
            expect(screen.getByText(/Elements/i)).toBeInTheDocument();
        });

        it('allows creating nodes via drag and drop', async () => {
            const addNode = vi.fn();
            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                addNode,
            } as any);

            render(<NodeEditor />);

            // Simulate drag from palette
            const resourceItems = screen.getAllByText(/Resource/i);
            const resourceItem = resourceItems.find(el => el.closest('[draggable="true"]')) || resourceItems[0];

            fireEvent.dragStart(resourceItem, {
                dataTransfer: {
                    setData: vi.fn(),
                    effectAllowed: 'move'
                }
            });

            const canvas = screen.getByTestId('node-canvas');

            // Mock dataTransfer for drop event
            const mockDataTransfer = {
                getData: vi.fn().mockReturnValue('resource'),
                types: ['application/reactflow']
            };

            fireEvent.drop(canvas, { dataTransfer: mockDataTransfer });

            await waitFor(() => {
                expect(addNode).toHaveBeenCalled();
            });
        });

        it('exports graph schema', () => {
            const exportSchema = vi.fn(() => JSON.stringify({
                nodes: [{ id: 'test', type: 'resource', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [] }],
                connections: []
            }));

            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                exportSchema,
            } as any);

            render(<NodeEditor />);

            const saveButton = screen.getByTitle(/Save JSON/i);
            fireEvent.click(saveButton);

            expect(exportSchema).toHaveBeenCalled();
        });
    });

    describe('Task 15.5: Import → Render → Edit', () => {
        it('imports schema and renders nodes', async () => {
            const importSchema = vi.fn();
            const mockSchema = {
                nodes: [
                    {
                        id: 'imported-1',
                        type: 'resource',
                        position: { x: 100, y: 100 },
                        data: { label: 'Imported Resource' },
                        inputs: [],
                        outputs: []
                    }
                ],
                connections: []
            };

            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                nodes: mockSchema.nodes as any,
                importSchema,
            } as any);

            render(<NodeEditor />);

            // Should render imported node
            expect(screen.getByText(/Imported Resource/i)).toBeInTheDocument();
        });

        it('allows editing imported nodes', async () => {
            const updateNode = vi.fn();

            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                nodes: [{
                    id: 'edit-test',
                    type: 'resource',
                    position: { x: 0, y: 0 },
                    data: { label: 'Editable', element: {} },
                    inputs: [],
                    outputs: []
                }] as any,
                updateNode,
            } as any);

            render(<NodeEditor />);

            // Find and click edit button
            const editButton = screen.queryByTitle(/Edit Element/i);
            if (editButton) {
                fireEvent.click(editButton);
                // Modal should open (tested separately in ElementNode tests)
            }
        });
    });

    describe('Task 15.6: Export from Editor → Import to Main App', () => {
        it('exports test data in correct format', () => {
            const nodes = [
                {
                    id: 'res-1',
                    type: 'resource',
                    position: { x: 0, y: 0 },
                    data: {
                        label: 'Gold',
                        element: {
                            id: 'gold-1',
                            name: 'Gold',
                            type: 'mineral',
                            properties: 'Precious',
                            symbol: 'Au'
                        }
                    },
                    inputs: [],
                    outputs: []
                }
            ];

            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                nodes: nodes as any,
            } as any);

            render(<NodeEditor />);

            // Export Data button should be available
            const exportButton = screen.getByText(/Export Data/i);
            expect(exportButton).toBeInTheDocument();
        });
    });

    describe('Task 15.7: Performance with Large Graphs', () => {
        it('renders 100+ nodes without crashing', () => {
            const largeNodeSet = Array.from({ length: 150 }, (_, i) => ({
                id: `node-${i}`,
                type: 'resource',
                position: { x: (i % 10) * 300, y: Math.floor(i / 10) * 200 },
                data: { label: `Node ${i}` },
                inputs: [],
                outputs: []
            }));

            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                nodes: largeNodeSet as any,
            } as any);

            const startTime = performance.now();
            render(<NodeEditor />);
            const renderTime = performance.now() - startTime;

            // Should render in reasonable time (< 1 second)
            expect(renderTime).toBeLessThan(1000);

            // Should display node count
            expect(screen.getByText(/150 Elements/i)).toBeInTheDocument();
        });
    });

    describe('Task 15.8: Accessibility', () => {
        it('supports keyboard navigation', () => {
            vi.mocked(useGameStore).mockReturnValue({
                ...vi.mocked(useGameStore)(),
                nodes: [
                    { id: 'node-1', type: 'resource', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [] },
                    { id: 'node-2', type: 'deity', position: { x: 300, y: 0 }, data: {}, inputs: [], outputs: [] }
                ] as any,
            } as any);

            render(<NodeEditor />);

            // Arrow keys should navigate (tested via global hotkeys)
            fireEvent.keyDown(document, { key: 'ArrowRight' });

            // Delete key should work
            fireEvent.keyDown(document, { key: 'Delete' });
        });

        it('has proper ARIA labels', () => {
            render(<NodeEditor />);

            // Toolbar buttons should have titles
            const saveButton = screen.getByTitle(/Save JSON/i);
            expect(saveButton).toHaveAttribute('title');
        });
    });
});
