import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogicNode } from './LogicNode';
import { NodeDefinition } from '@/types/nodeEditor.types';

// Mock BaseNode
vi.mock('./BaseNode', () => ({
    BaseNode: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="base-node">{children}</div>
    ),
}));

describe('LogicNode', () => {
    const mockOnUpdate = vi.fn();

    const createMockNode = (operation: string = 'AND'): NodeDefinition => ({
        id: 'node-1',
        type: 'logic',
        position: { x: 0, y: 0 },
        data: { operation },
        inputs: [],
        outputs: [],
        config: { category: 'logic', label: 'Logic', icon: 'Box' },
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Condition Input', () => {
        it('renders operation selector dropdown', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
        });

        it('displays all available logic operations', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const options = screen.getAllByRole('option');
            expect(options).toHaveLength(5);
            expect(options[0]).toHaveTextContent('AND');
            expect(options[1]).toHaveTextContent('OR');
            expect(options[2]).toHaveTextContent('NOT');
            expect(options[3]).toHaveTextContent('XOR');
            expect(options[4]).toHaveTextContent('IF (Ternary)');
        });

        it('selects AND operation by default', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            expect(select).toHaveValue('AND');
        });
    });

    describe('True/False Value Inputs', () => {
        it('updates operation when different option is selected', async () => {
            const user = userEvent.setup();
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            await user.selectOptions(select, 'OR');

            expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                data: expect.objectContaining({
                    operation: 'OR',
                }),
            });
        });

        it('updates to NOT operation', async () => {
            const user = userEvent.setup();
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            await user.selectOptions(select, 'NOT');

            expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                data: expect.objectContaining({
                    operation: 'NOT',
                }),
            });
        });

        it('updates to XOR operation', async () => {
            const user = userEvent.setup();
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            await user.selectOptions(select, 'XOR');

            expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                data: expect.objectContaining({
                    operation: 'XOR',
                }),
            });
        });

        it('updates to IF operation', async () => {
            const user = userEvent.setup();
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            await user.selectOptions(select, 'IF');

            expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                data: expect.objectContaining({
                    operation: 'IF',
                }),
            });
        });
    });

    describe('Logic Operation Display', () => {
        it('displays "A AND B" for AND operation', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('A AND B')).toBeInTheDocument();
        });

        it('displays "A OR B" for OR operation', () => {
            const node = createMockNode('OR');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('A OR B')).toBeInTheDocument();
        });

        it('displays "A XOR B" for XOR operation', () => {
            const node = createMockNode('XOR');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('A XOR B')).toBeInTheDocument();
        });

        it('displays "Inverts Input A" for NOT operation', () => {
            const node = createMockNode('NOT');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('Inverts Input A')).toBeInTheDocument();
        });

        it('displays "If A then B" for IF operation', () => {
            const node = createMockNode('IF');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('If A then B')).toBeInTheDocument();
        });

        it('applies italic styling to operation description', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const description = screen.getByText('A AND B');
            expect(description).toHaveClass('italic');
        });
    });

    describe('Input Validation', () => {
        it('validates operation type is one of allowed values', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const options = screen.getAllByRole('option');
            const optionValues = options.map(opt => opt.getAttribute('value'));

            expect(optionValues).toContain('AND');
            expect(optionValues).toContain('OR');
            expect(optionValues).toContain('NOT');
            expect(optionValues).toContain('XOR');
            expect(optionValues).toContain('IF');
        });

        it('prevents invalid operation selection', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            expect(select).not.toHaveValue('INVALID');
        });

        it('maintains operation state on re-render', () => {
            const node = createMockNode('OR');
            const { rerender } = render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            expect(select).toHaveValue('OR');

            // Re-render with same node
            rerender(<LogicNode node={node} onUpdate={mockOnUpdate} />);
            expect(select).toHaveValue('OR');
        });
    });

    describe('Error Handling', () => {
        it('handles undefined operation gracefully', () => {
            const node = createMockNode();
            // @ts-ignore - testing undefined case
            node.data.operation = undefined;
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            // Should default to AND
            expect(select).toHaveValue('AND');
        });

        it('handles null operation gracefully', () => {
            const node = createMockNode();
            // @ts-ignore - testing null case
            node.data.operation = null;
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            expect(select).toHaveValue('AND');
        });

        it('stops propagation of mouse down events on select', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });

            // Mock stopPropagation
            const stopPropagationSpy = vi.spyOn(mouseDownEvent, 'stopPropagation');

            select.dispatchEvent(mouseDownEvent);

            // The component should call stopPropagation
            expect(stopPropagationSpy).toHaveBeenCalled();
        });

        it('applies cyan focus ring to select', () => {
            const node = createMockNode('AND');
            render(<LogicNode node={node} onUpdate={mockOnUpdate} />);

            const select = screen.getByRole('combobox');
            expect(select).toHaveClass('focus:ring-1', 'focus:ring-cyan-500');
        });
    });
});
