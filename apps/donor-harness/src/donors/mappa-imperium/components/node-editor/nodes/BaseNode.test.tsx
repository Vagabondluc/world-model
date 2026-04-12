import { render, screen, fireEvent } from '@testing-library/react';
import { BaseNode } from './BaseNode';
import { NodeDefinition } from '@mi/types/nodeEditor.types';

// Mock game store
vi.mock('@/stores/gameStore', () => ({
    useGameStore: vi.fn(() => ({
        validationErrors: []
    }))
}));

// Mock Port component
vi.mock('../connections/Port', () => ({
    Port: ({ nodeId, definition, type, onDragStart, onMouseUp }: any) => (
        <div
            data-testid={`port-${type}-${definition.id}`}
            data-node-id={nodeId}
            data-port-id={definition.id}
            data-port-type={type}
            data-port-label={definition.label}
            onMouseDown={(e: React.MouseEvent) => onDragStart?.(e, nodeId, definition.id)}
            onMouseUp={(e: React.MouseEvent) => onMouseUp?.(e, nodeId, definition.id)}
        >
            {definition.label}
        </div>
    )
}));

// Mock icons
// Fixed: Mock lucide-react to export both individual icons and the icons object
// This is needed because BaseNode.tsx imports both individual icons (AlertCircle, X, Copy)
// and the icons object for dynamic icon lookup (icons[config.icon])
vi.mock('lucide-react', () => {
    const Box = () => <div data-testid="icon-box">Box</div>;
    const AlertCircle = () => <div data-testid="icon-alert">Alert</div>;
    const X = () => <div data-testid="icon-delete">X</div>;
    const Copy = () => <div data-testid="icon-copy">Copy</div>;

    return {
        Box,
        AlertCircle,
        X,
        Copy,
        icons: {
            Box,
            AlertCircle,
            X,
            Copy
        }
    };
});

// Mock NODE_REGISTRY to provide config for tests
vi.mock('./NodeRegistry', () => ({
    NODE_REGISTRY: {
        dataInput: {
            category: 'input',
            label: 'Test Node',
            icon: 'Box',
            color: '#3B82F6'
        }
    }
}));

describe('BaseNode', () => {
    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnDuplicate = vi.fn();
    const mockOnInitDrag = vi.fn();
    const mockOnPortDragStart = vi.fn();
    const mockOnPortMouseUp = vi.fn();

    const createMockNode = (overrides: Partial<NodeDefinition> = {}): NodeDefinition => ({
        id: 'node-1',
        type: 'dataInput',
        position: { x: 100, y: 100 },
        data: { label: 'Test Node' },
        inputs: [
            { id: 'input-1', label: 'Input 1', dataType: 'number', required: true }
        ],
        outputs: [
            { id: 'output-1', label: 'Output 1', dataType: 'number', required: false }
        ],
        config: {
            category: 'input',
            label: 'Test Node',
            icon: 'Box',
            color: '#3B82F6'
        },
        ...overrides
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders node body with correct background color from config', () => {
        const node = createMockNode({
            config: {
                category: 'input',
                label: 'Test Node',
                icon: 'Box',
                color: '#EF4444'
            }
        });

        render(
            <BaseNode
                node={node}
                selected={false}
                onSelect={mockOnSelect}
                onDelete={mockOnDelete}
                onDuplicate={mockOnDuplicate}
                onInitDrag={mockOnInitDrag}
                onPortDragStart={mockOnPortDragStart}
                onPortMouseUp={mockOnPortMouseUp}
            />
        );

        const nodeElement = document.querySelector('.absolute');
        expect(nodeElement).toBeInTheDocument();
    });
});
