import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NodePalette } from './NodePalette';
import { NODE_REGISTRY } from './nodes/NodeRegistry';

// Mock NODE_REGISTRY
vi.mock('./nodes/NodeRegistry', () => ({
    NODE_REGISTRY: {
        'resource': {
            category: 'element',
            label: 'Resource',
            icon: 'Box',
            color: '#10b981',
            description: 'Game resource element',
        },
        'deity': {
            category: 'element',
            label: 'Deity',
            icon: 'Star',
            color: '#f59e0b',
            description: 'Divine entity',
        },
        'progress': {
            category: 'progress',
            label: 'Progress Bar',
            icon: 'Activity',
            color: '#3b82f6',
            description: 'Progress indicator',
        },
        'logic': {
            category: 'logic',
            label: 'Logic Gate',
            icon: 'Cpu',
            color: '#8b5cf6',
            description: 'Boolean logic operations',
        },
        'dataInput': {
            category: 'input',
            label: 'Data Input',
            icon: 'Database',
            color: '#6366f1',
            description: 'Manual data entry',
        },
    },
}));

describe('NodePalette', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Render All Available Node Types from Registry', () => {
        it('renders header with Components title', () => {
            render(<NodePalette />);
            expect(screen.getByText('Components')).toBeInTheDocument();
        });

        it('renders search input field', () => {
            render(<NodePalette />);
            const searchInput = screen.getByPlaceholderText('Search nodes...');
            expect(searchInput).toBeInTheDocument();
        });

        it('renders all node types from registry', () => {
            render(<NodePalette />);

            expect(screen.getByText('Resource')).toBeInTheDocument();
            expect(screen.getByText('Deity')).toBeInTheDocument();
            expect(screen.getByText('Progress Bar')).toBeInTheDocument();
            expect(screen.getByText('Logic Gate')).toBeInTheDocument();
            expect(screen.getByText('Data Input')).toBeInTheDocument();
        });

        it('renders node descriptions', () => {
            render(<NodePalette />);

            expect(screen.getByText('Game resource element')).toBeInTheDocument();
            expect(screen.getByText('Divine entity')).toBeInTheDocument();
            expect(screen.getByText('Progress indicator')).toBeInTheDocument();
            expect(screen.getByText('Boolean logic operations')).toBeInTheDocument();
            expect(screen.getByText('Manual data entry')).toBeInTheDocument();
        });

        it('renders footer with drag hint', () => {
            render(<NodePalette />);
            expect(screen.getByText('Drag items to the canvas')).toBeInTheDocument();
        });
    });

    describe('Drag-to-Canvas to Create New Nodes', () => {
        it('sets draggable attribute on node items', () => {
            render(<NodePalette />);

            const nodeItems = document.querySelectorAll('[draggable="true"]');
            expect(nodeItems.length).toBeGreaterThan(0);
        });

        it('sets correct dataTransfer data on drag start', () => {
            const node = render(<NodePalette />);
            const resourceNode = screen.getByText('Resource').closest('[draggable="true"]');

            if (resourceNode) {
                const mockDataTransfer = {
                    setData: vi.fn(),
                    effectAllowed: '',
                };

                fireEvent.dragStart(resourceNode, {
                    dataTransfer: mockDataTransfer
                });

                expect(mockDataTransfer.setData).toHaveBeenCalledWith('application/reactflow', 'resource');
                expect(mockDataTransfer.effectAllowed).toBe('move');
            }
        });

        it('applies cursor-grab class to node items', () => {
            render(<NodePalette />);

            const nodeItem = screen.getByText('Resource').closest('[draggable="true"]');
            expect(nodeItem).toHaveClass('cursor-grab');
        });

        it('applies cursor-grabbing class on active drag', () => {
            render(<NodePalette />);

            const nodeItem = screen.getByText('Resource').closest('[draggable="true"]');
            expect(nodeItem).toHaveClass('active:cursor-grabbing');
        });
    });

    describe('Apply Icons and Colors from Taxonomy', () => {
        it('renders icon background color from registry', () => {
            render(<NodePalette />);

            const resourceNode = screen.getByText('Resource').closest('[draggable="true"]');
            const iconContainer = resourceNode?.querySelector('.rounded');
            expect(iconContainer).toHaveStyle({ backgroundColor: '#10b981' });
        });

        it('renders deity node with amber color', () => {
            render(<NodePalette />);

            const deityNode = screen.getByText('Deity').closest('[draggable="true"]');
            const iconContainer = deityNode?.querySelector('.rounded');
            expect(iconContainer).toHaveStyle({ backgroundColor: '#f59e0b' });
        });

        it('renders progress node with blue color', () => {
            render(<NodePalette />);

            const progressNode = screen.getByText('Progress Bar').closest('[draggable="true"]');
            const iconContainer = progressNode?.querySelector('.rounded');
            expect(iconContainer).toHaveStyle({ backgroundColor: '#3b82f6' });
        });

        it('renders logic node with violet color', () => {
            render(<NodePalette />);

            const logicNode = screen.getByText('Logic Gate').closest('[draggable="true"]');
            const iconContainer = logicNode?.querySelector('.rounded');
            expect(iconContainer).toHaveStyle({ backgroundColor: '#8b5cf6' });
        });

        it('renders data input node with indigo color', () => {
            render(<NodePalette />);

            const dataInputNode = screen.getByText('Data Input').closest('[draggable="true"]');
            const iconContainer = dataInputNode?.querySelector('.rounded');
            expect(iconContainer).toHaveStyle({ backgroundColor: '#6366f1' });
        });
    });

    describe('Node Type Filtering', () => {
        it('filters nodes by search term', async () => {
            const user = userEvent.setup();
            render(<NodePalette />);

            const searchInput = screen.getByPlaceholderText('Search nodes...');
            await user.type(searchInput, 'resource');

            expect(screen.getByText('Resource')).toBeInTheDocument();
            expect(screen.queryByText('Deity')).not.toBeInTheDocument();
            expect(screen.queryByText('Progress Bar')).not.toBeInTheDocument();
        });

        it('filters nodes case-insensitively', async () => {
            const user = userEvent.setup();
            render(<NodePalette />);

            const searchInput = screen.getByPlaceholderText('Search nodes...');
            await user.type(searchInput, 'LOGIC');

            expect(screen.getByText('Logic Gate')).toBeInTheDocument();
            expect(screen.queryByText('Resource')).not.toBeInTheDocument();
        });

        it('shows all nodes when search is cleared', async () => {
            const user = userEvent.setup();
            render(<NodePalette />);

            const searchInput = screen.getByPlaceholderText('Search nodes...');
            await user.type(searchInput, 'test');
            await user.clear(searchInput);

            expect(screen.getByText('Resource')).toBeInTheDocument();
            expect(screen.getByText('Deity')).toBeInTheDocument();
            expect(screen.getByText('Progress Bar')).toBeInTheDocument();
        });

        it('shows empty state when no nodes match search', async () => {
            const user = userEvent.setup();
            render(<NodePalette />);

            const searchInput = screen.getByPlaceholderText('Search nodes...');
            await user.type(searchInput, 'nonexistent');

            expect(screen.queryByText('Resource')).not.toBeInTheDocument();
            expect(screen.queryByText('Deity')).not.toBeInTheDocument();
        });
    });

    describe('Empty State', () => {
        it('renders category headers', () => {
            render(<NodePalette />);

            expect(screen.getByText('element')).toBeInTheDocument();
            expect(screen.getByText('progress')).toBeInTheDocument();
            expect(screen.getByText('logic')).toBeInTheDocument();
            expect(screen.getByText('input')).toBeInTheDocument();
        });

        it('applies uppercase styling to category headers', () => {
            render(<NodePalette />);

            const elementHeader = screen.getByText('element');
            expect(elementHeader).toHaveClass('uppercase', 'tracking-wider');
        });

        it('applies small font size to category headers', () => {
            render(<NodePalette />);

            const elementHeader = screen.getByText('element');
            expect(elementHeader).toHaveClass('text-xs');
        });

        it('groups nodes by category', () => {
            render(<NodePalette />);

            // Element category should have Resource and Deity
            const elementHeader = screen.getByText('element');
            const elementSection = elementHeader.parentElement?.parentElement;

            expect(elementSection).toContainHTML('Resource');
            expect(elementSection).toContainHTML('Deity');
        });

        it('renders node items in grid layout', () => {
            render(<NodePalette />);

            const nodeItems = document.querySelectorAll('.grid-cols-1');
            expect(nodeItems.length).toBeGreaterThan(0);
        });
    });
});
