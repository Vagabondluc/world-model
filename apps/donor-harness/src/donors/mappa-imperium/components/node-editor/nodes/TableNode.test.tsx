import { render, screen, fireEvent } from '@testing-library/react';
import { TableNode } from './TableNode';
import { NodeDefinition } from '@mi/types/nodeEditor.types';

// Mock of BaseNode component
vi.mock('./BaseNode', () => ({
    BaseNode: ({ children, node, width }: any) => (
        <div data-testid="base-node" data-node-id={node.id} style={{ width: width || 280 }}>
            {children}
        </div>
    )
}));

describe('TableNode', () => {
    const mockOnUpdate = vi.fn();

    const createMockNode = (overrides: Partial<NodeDefinition> = {}): NodeDefinition => ({
        id: 'table-1',
        type: 'table',
        position: { x: 100, y: 100 },
        data: {
            columns: ['Name', 'Age', 'Role'],
            headers: [
                { id: 'name', label: 'Name', width: 100 },
                { id: 'age', label: 'Age', width: 50 },
                { id: 'role', label: 'Role', width: 100 }
            ],
            rowsPerPage: 10
        },
        inputs: [],
        outputs: [],
        config: {
            category: 'output',
            label: 'Table',
            icon: 'Table'
        },
        ...overrides
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Header Configuration UI', () => {
        it('renders columns label', () => {
            const node = createMockNode();

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('Columns (comma separated)')).toBeInTheDocument();
        });

        it('renders textarea for column input', () => {
            const node = createMockNode();

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            expect(textarea).toBeInTheDocument();
            expect(textarea).toHaveAttribute('placeholder', 'Name, Age, Role...');
        });

        it('populates textarea with existing columns', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name', 'Age', 'Role'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('Name, Age, Role');
        });
    });

    describe('Column Configuration', () => {
        it('renders column tags for each column', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name', 'Age', 'Role'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Age')).toBeInTheDocument();
            expect(screen.getByText('Role')).toBeInTheDocument();
        });

        it('handles empty columns array', () => {
            const node = createMockNode({
                data: {
                    columns: [],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('');
        });

        // Fixed: Use getAllByText when multiple elements match the text
        it('handles single column', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            // Use getAllByText when multiple elements match the text (textarea + column tag)
            expect(screen.getAllByText('Name')).toHaveLength(2);
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('Name');
        });

        it('handles many columns', () => {
            const columns = ['Name', 'Age', 'Role', 'Location', 'Status', 'Created', 'Updated'];
            const node = createMockNode({
                data: {
                    columns,
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            columns.forEach(col => {
                expect(screen.getByText(col)).toBeInTheDocument();
            });
        });
    });

    describe('Column Input Handling', () => {
        it('calls onUpdate when columns textarea loses focus', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name', 'Age'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            fireEvent.change(textarea, { target: { value: 'Name, Age, Role, Status' } });
            fireEvent.blur(textarea);

            expect(mockOnUpdate).toHaveBeenCalledWith('table-1', {
                data: expect.objectContaining({
                    columns: ['Name', 'Age', 'Role', 'Status']
                })
            });
        });

        it('trims whitespace from column names', () => {
            const node = createMockNode({
                data: {
                    columns: [],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            fireEvent.change(textarea, { target: { value: '  Name  ,  Age  ,  Role  ' } });
            fireEvent.blur(textarea);

            expect(mockOnUpdate).toHaveBeenCalledWith('table-1', {
                data: expect.objectContaining({
                    columns: ['Name', 'Age', 'Role']
                })
            });
        });

        it('filters empty column names', () => {
            const node = createMockNode({
                data: {
                    columns: [],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            fireEvent.change(textarea, { target: { value: 'Name, , Age, , Role' } });
            fireEvent.blur(textarea);

            expect(mockOnUpdate).toHaveBeenCalledWith('table-1', {
                data: expect.objectContaining({
                    columns: ['Name', 'Age', 'Role']
                })
            });
        });

        it('handles columns with special characters', () => {
            const node = createMockNode({
                data: {
                    columns: [],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            fireEvent.change(textarea, { target: { value: 'First Name, Last-Name, Role_Type' } });
            fireEvent.blur(textarea);

            expect(mockOnUpdate).toHaveBeenCalledWith('table-1', {
                data: expect.objectContaining({
                    columns: ['First Name', 'Last-Name', 'Role_Type']
                })
            });
        });
    });

    describe('Row Data Display', () => {
        it('renders column tags in a flex container', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name', 'Age', 'Role'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            const { container } = render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const flexContainer = container.querySelector('.flex.gap-1.flex-wrap');
            expect(flexContainer).toBeInTheDocument();
        });

        it('applies correct styling to column tags', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            const { container } = render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const tag = container.querySelector('.text-\\[10px\\]');
            expect(tag).toBeInTheDocument();
            expect(tag).toHaveClass('bg-indigo-50', 'text-indigo-600', 'px-1.5', 'py-0.5', 'rounded', 'border', 'border-indigo-100');
        });
    });

    describe('Table Preview', () => {
        it('shows column tags as preview of table structure', () => {
            const node = createMockNode({
                data: {
                    columns: ['ID', 'Name', 'Value'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('ID')).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Value')).toBeInTheDocument();
        });
    });

    describe('Edit Functionality', () => {
        it('allows editing columns via textarea', () => {
            const node = createMockNode({
                data: {
                    columns: ['Name', 'Age'],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            expect(textarea).not.toBeDisabled();
        });

        it('prevents drag propagation on textarea mouse down', () => {
            const node = createMockNode();
            const stopPropagationSpy = vi.fn();
            MouseEvent.prototype.stopPropagation = stopPropagationSpy;

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            fireEvent.mouseDown(textarea);

            expect(stopPropagationSpy).toHaveBeenCalled();
        });
    });

    describe('Node Width', () => {
        it('uses wider width for table nodes', () => {
            const node = createMockNode();

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const baseNode = screen.getByTestId('base-node');
            expect(baseNode).toHaveStyle({ width: '320px' });
        });
    });

    describe('Empty State', () => {
        it('handles node with no columns', () => {
            const node = createMockNode({
                data: {
                    columns: [],
                    headers: [],
                    rowsPerPage: 10
                }
            });

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('');

            // No column tags should be rendered
            const flexContainer = document.querySelector('.flex.gap-1.flex-wrap');
            expect(flexContainer?.children.length).toBe(0);
        });
    });

    describe('Textarea Attributes', () => {
        // Fixed: Corrected class name to match actual component implementation
        it('has correct styling classes', () => {
            const node = createMockNode();

            render(
                <TableNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveClass(
                'w-full',
                'text-sm',
                'border',
                'rounded',
                'px-2',
                'py-1',
                'bg-slate-50',
                'focus:ring-1',
                'focus:ring-indigo-500',
                'outline-none',
                'resize-y',
                'min-h-[60px]'
            );
        });
    });
});
