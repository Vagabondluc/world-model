import { render, screen, fireEvent } from '@testing-library/react';
import { ElementNode } from './ElementNode';
import { NodeDefinition } from '@/types/nodeEditor.types';

// Mock BaseNode component
vi.mock('./BaseNode', () => ({
    BaseNode: ({ children, node, selected, onSelect, onDelete, onDuplicate, onInitDrag, onPortDragStart, onPortMouseUp, width }: any) => (
        <div
            data-testid="base-node"
            data-node-id={node.id}
            data-node-type={node.type}
            data-node-selected={selected}
            style={{ width: width || 280 }}
        >
            {children}
        </div>
    )
}));

// Mock Edit icon
vi.mock('lucide-react', () => ({
    Edit: () => <div data-testid="icon-edit">Edit</div>
}));

describe('ElementNode', () => {
    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnDuplicate = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnInitDrag = vi.fn();
    const mockOnPortDragStart = vi.fn();
    const mockOnPortMouseUp = vi.fn();

    const createMockNode = (type: string, overrides: Partial<NodeDefinition> = {}): NodeDefinition => ({
        id: `element-${type}`,
        type: type as any,
        position: { x: 100, y: 100 },
        data: {
            element: {},
            label: 'Test Element'
        },
        inputs: [],
        outputs: [],
        config: {
            category: 'element',
            label: type,
            icon: 'Box',
            color: '#3B82F6'
        },
        ...overrides
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Resource Node Type', () => {
        it('renders resource node with type display', () => {
            const node = createMockNode('resource', {
                data: { element: { type: 'Mineral', rarity: 'Rare' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Type: Mineral')).toBeInTheDocument();
            expect(screen.getByText('Rarity: Rare')).toBeInTheDocument();
        });

        it('renders default values when element data is missing', () => {
            const node = createMockNode('resource', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Type: Generic')).toBeInTheDocument();
            expect(screen.getByText('Rarity: Common')).toBeInTheDocument();
        });
    });

    describe('Deity Node Type', () => {
        it('renders deity node with domain and alignment', () => {
            const node = createMockNode('deity', {
                data: { element: { domain: 'War', alignment: 'Chaotic' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Domain: War')).toBeInTheDocument();
            expect(screen.getByText('Alignment: Chaotic')).toBeInTheDocument();
        });

        it('renders default values for deity when element data is missing', () => {
            const node = createMockNode('deity', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Domain: Unknown')).toBeInTheDocument();
            expect(screen.getByText('Alignment: Neutral')).toBeInTheDocument();
        });
    });

    describe('Location Node Type', () => {
        it('renders location node with region', () => {
            const node = createMockNode('location', {
                data: { element: { region: 'Northern Wastes' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Region: Northern Wastes')).toBeInTheDocument();
        });

        it('renders default region for location when element data is missing', () => {
            const node = createMockNode('location', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Region: Global')).toBeInTheDocument();
        });
    });

    describe('Faction Node Type', () => {
        it('renders faction node with faction type', () => {
            const node = createMockNode('faction', {
                data: { element: { factionType: 'Empire' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Type: Empire')).toBeInTheDocument();
        });

        it('renders default faction type when element data is missing', () => {
            const node = createMockNode('faction', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Type: Group')).toBeInTheDocument();
        });
    });

    describe('Settlement Node Type', () => {
        // Fixed: Use queryByText with flexible matcher because toLocaleString() creates non-breaking spaces
        // that break up the text into multiple DOM nodes
        it('renders settlement node with population', () => {
            const node = createMockNode('settlement', {
                data: { element: { population: 50000 } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            // Find the population container div and check its text content
            const populationDiv = document.querySelector('.italic');
            expect(populationDiv).toBeInTheDocument();
            expect(populationDiv?.textContent).toContain('Population');
            // Use regex to match either comma or space as thousands separator
            expect(populationDiv?.textContent).toMatch(/Population:\s*50[,\s]000/);
        });

        it('renders default population when element data is missing', () => {
            const node = createMockNode('settlement', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Population: 0')).toBeInTheDocument();
        });
    });

    describe('Event Node Type', () => {
        it('renders event node with date', () => {
            const node = createMockNode('event', {
                data: { element: { date: 'Era 4, Year 12' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Date: Era 4, Year 12')).toBeInTheDocument();
        });

        it('renders default date when element data is missing', () => {
            const node = createMockNode('event', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Date: TBD')).toBeInTheDocument();
        });
    });

    describe('Character Node Type', () => {
        it('renders character node with role', () => {
            const node = createMockNode('character', {
                data: { element: { role: 'Hero' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Role: Hero')).toBeInTheDocument();
        });

        it('renders default role when element data is missing', () => {
            const node = createMockNode('character', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Role: NPC')).toBeInTheDocument();
        });
    });

    describe('War Node Type', () => {
        it('renders war node with status', () => {
            const node = createMockNode('war', {
                data: { element: { status: 'Ongoing' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Status: Ongoing')).toBeInTheDocument();
        });

        it('renders default status when element data is missing', () => {
            const node = createMockNode('war', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Status: Active')).toBeInTheDocument();
        });
    });

    describe('Monument Node Type', () => {
        it('renders monument node with condition', () => {
            const node = createMockNode('monument', {
                data: { element: { condition: 'Ruined' } }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Condition: Ruined')).toBeInTheDocument();
        });

        it('renders default condition when element data is missing', () => {
            const node = createMockNode('monument', {
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('Condition: Intact')).toBeInTheDocument();
        });
    });

    describe('Edit Modal Integration', () => {
        it('renders edit button', () => {
            const node = createMockNode('resource');

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByTestId('icon-edit')).toBeInTheDocument();
        });

        it('calls onEdit when edit button is clicked', () => {
            const node = createMockNode('resource', { id: 'resource-1' });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            const editButton = screen.getByTestId('icon-edit').closest('button');
            fireEvent.click(editButton!);

            expect(mockOnEdit).toHaveBeenCalledWith('resource-1');
        });

        it('prevents event propagation when edit button is clicked', () => {
            const node = createMockNode('resource');
            const stopPropagationSpy = vi.fn();
            MouseEvent.prototype.stopPropagation = stopPropagationSpy;

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            const editButton = screen.getByTestId('icon-edit').closest('button');
            fireEvent.click(editButton!);

            expect(stopPropagationSpy).toHaveBeenCalled();
        });
    });

    describe('Element Data Display', () => {
        it('renders element data for all supported types', () => {
            const types = ['resource', 'deity', 'location', 'faction', 'settlement', 'event', 'character', 'war', 'monument'] as const;

            types.forEach(type => {
                const node = createMockNode(type, {
                    data: { element: {} }
                });

                const { unmount } = render(
                    <ElementNode
                        node={node}
                        selected={false}
                        onSelect={mockOnSelect}
                        onDelete={mockOnDelete}
                        onDuplicate={mockOnDuplicate}
                        onEdit={mockOnEdit}
                        onInitDrag={mockOnInitDrag}
                        onPortDragStart={mockOnPortDragStart}
                        onPortMouseUp={mockOnPortMouseUp}
                    />
                );

                // Verify that some content is rendered for each type
                const baseNode = screen.getByTestId('base-node');
                expect(baseNode).toHaveAttribute('data-node-type', type);

                unmount();
            });
        });

        it('handles missing element data gracefully', () => {
            const node = createMockNode('resource', {
                data: {}
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            // Should render without crashing
            expect(screen.getByTestId('base-node')).toBeInTheDocument();
        });
    });

    describe('Node Width', () => {
        it('uses narrower width for element nodes', () => {
            const node = createMockNode('resource');

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            const baseNode = screen.getByTestId('base-node');
            expect(baseNode).toHaveStyle({ width: '240px' });
        });
    });

    describe('Unknown Node Type', () => {
        it('renders fallback message for unknown node types', () => {
            const node = createMockNode('unknown' as any, {
                type: 'unknown' as any,
                data: { element: {} }
            });

            render(
                <ElementNode
                    node={node}
                    selected={false}
                    onSelect={mockOnSelect}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                    onEdit={mockOnEdit}
                    onInitDrag={mockOnInitDrag}
                    onPortDragStart={mockOnPortDragStart}
                    onPortMouseUp={mockOnPortMouseUp}
                />
            );

            expect(screen.getByText('No details available')).toBeInTheDocument();
        });
    });
});
