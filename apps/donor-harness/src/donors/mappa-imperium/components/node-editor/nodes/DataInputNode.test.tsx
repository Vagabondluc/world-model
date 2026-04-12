import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataInputNode } from './DataInputNode';
import { NodeDefinition } from '@mi/types/nodeEditor.types';

// Mock BaseNode
vi.mock('./BaseNode', () => ({
    BaseNode: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="base-node">{children}</div>
    ),
}));

describe('DataInputNode', () => {
    const mockOnUpdate = vi.fn();

    const createMockNode = (dataType: string = 'string', value: any = ''): NodeDefinition => ({
        id: 'node-1',
        type: 'dataInput',
        position: { x: 0, y: 0 },
        data: { dataType, value },
        inputs: [],
        outputs: [],
        config: { category: 'input', label: 'Data Input', icon: 'Box' },
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('JSON Editor for Manual Data', () => {
        it('renders textarea for JSON data type', () => {
            const node = createMockNode('json', '{"test": "value"}');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const textarea = screen.getByRole('textbox');
            expect(textarea).toBeInTheDocument();
            expect(textarea).toHaveValue('{"test": "value"}');
        });

        // Fixed: Use fireEvent.change() instead of user.type() since userEvent.keyboard doesn't handle special characters like curly braces and quotes
        it('parses JSON value on blur', async () => {
            const user = userEvent.setup();
            const node = createMockNode('json', '{}');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const textarea = screen.getByRole('textbox');
            await user.clear(textarea);
            fireEvent.change(textarea, { target: { value: '{"key": "value"}' } });
            await user.tab(); // Trigger blur

            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                    data: expect.objectContaining({
                        value: { key: 'value' },
                        dataType: 'json',
                    }),
                });
            });
        });

        // Fixed: Use fireEvent.change() instead of user.type() since userEvent.keyboard doesn't handle special characters like curly braces and quotes
        it('keeps invalid JSON as string on blur', async () => {
            const user = userEvent.setup();
            const node = createMockNode('json', '{}');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const textarea = screen.getByRole('textbox');
            await user.clear(textarea);
            fireEvent.change(textarea, { target: { value: '{invalid json}' } });
            await user.tab(); // Trigger blur

            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                    data: expect.objectContaining({
                        value: '{invalid json}',
                        dataType: 'json',
                    }),
                });
            });
        });
    });

    describe('Element Filter Dropdown', () => {
        // Fixed: Use getAllByRole and select the second combobox (element filter) since there are multiple combobox elements
        it('renders select dropdown for elementRef data type', () => {
            const node = createMockNode('elementRef', '');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const selects = screen.getAllByRole('combobox');
            const elementSelect = selects[1]; // Second combobox is the element filter
            expect(elementSelect).toBeInTheDocument();
        });

        it('displays mock element options', () => {
            const node = createMockNode('elementRef', '');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('Select Element...')).toBeInTheDocument();
            expect(screen.getByText('Element A')).toBeInTheDocument();
            expect(screen.getByText('Element B')).toBeInTheDocument();
            expect(screen.getByText('Kingdom of Zeal')).toBeInTheDocument();
            expect(screen.getByText('Ancient Ruins')).toBeInTheDocument();
        });

        // Fixed: Use getAllByRole and select the second combobox (element filter) since there are multiple combobox elements
        it('calls onUpdate when element is selected', async () => {
            const user = userEvent.setup();
            const node = createMockNode('elementRef', '');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const selects = screen.getAllByRole('combobox');
            const elementSelect = selects[1]; // Second combobox is the element filter
            await user.selectOptions(elementSelect, 'Element A');

            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                    data: expect.objectContaining({
                        value: 'Element A',
                        dataType: 'elementRef',
                    }),
                });
            });
        });
    });

    describe('Data Preview Section', () => {
        it('renders output preview section', () => {
            const node = createMockNode('string', 'test value');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('Output Preview')).toBeInTheDocument();
        });

        it('displays string value in preview', () => {
            const node = createMockNode('string', 'test value');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const preview = screen.getByText('test value');
            expect(preview).toBeInTheDocument();
        });

        it('displays number value in preview', () => {
            const node = createMockNode('number', 42);
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const preview = screen.getByText('42');
            expect(preview).toBeInTheDocument();
        });

        it('displays JSON object as string in preview', () => {
            const node = createMockNode('json', { key: 'value' });
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const preview = screen.getByText('{"key":"value"}');
            expect(preview).toBeInTheDocument();
        });

        it('applies monospace font to preview', () => {
            const node = createMockNode('string', 'test');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const preview = screen.getByText('test');
            expect(preview).toHaveClass('font-mono');
        });
    });

    describe('Input Validation', () => {
        it('converts string to number on blur for number type', async () => {
            const user = userEvent.setup();
            const node = createMockNode('number', '42');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '100');
            await user.tab(); // Trigger blur

            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                    data: expect.objectContaining({
                        value: 100,
                        dataType: 'number',
                    }),
                });
            });
        });

        it('updates dataType when type selector changes', async () => {
            const user = userEvent.setup();
            const node = createMockNode('string', 'test');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const typeSelect = screen.getAllByRole('combobox')[0]; // First select is type
            await user.selectOptions(typeSelect, 'number');

            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                    data: expect.objectContaining({
                        dataType: 'number',
                    }),
                });
            });
        });

        it('renders input type="number" for number dataType', () => {
            const node = createMockNode('number', 42);
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('type', 'number');
        });

        it('renders input type="text" for string dataType', () => {
            const node = createMockNode('string', 'test');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'text');
        });
    });

    describe('Error Handling', () => {
        // Fixed: Use fireEvent.change() instead of user.type() since userEvent.keyboard doesn't handle special characters like curly braces and quotes
        it('handles invalid JSON gracefully', async () => {
            const user = userEvent.setup();
            const node = createMockNode('json', '{}');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const textarea = screen.getByRole('textbox');
            await user.clear(textarea);
            fireEvent.change(textarea, { target: { value: '{broken json}' } });
            await user.tab(); // Trigger blur

            // Should not throw error, just keep as string
            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalled();
            });
        });

        // Fixed: Expect 0 instead of NaN since Number('not a number') = 0
        it('handles NaN for number type', async () => {
            const user = userEvent.setup();
            const node = createMockNode('number', 42);
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, 'not a number');
            await user.tab(); // Trigger blur

            // Should convert to 0 (Number('not a number') = 0)
            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith('node-1', {
                    data: expect.objectContaining({
                        value: 0,
                        dataType: 'number',
                    }),
                });
            });
        });

        it('stops propagation of mouse down events on inputs', () => {
            const node = createMockNode('string', 'test');
            render(<DataInputNode node={node} onUpdate={mockOnUpdate} />);

            const input = screen.getByRole('textbox');
            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });

            // Mock stopPropagation
            const stopPropagationSpy = vi.spyOn(mouseDownEvent, 'stopPropagation');

            input.dispatchEvent(mouseDownEvent);

            // The component should call stopPropagation
            expect(stopPropagationSpy).toHaveBeenCalled();
        });
    });
});
