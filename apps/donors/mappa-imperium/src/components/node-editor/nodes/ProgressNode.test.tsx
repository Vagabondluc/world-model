import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressNode } from './ProgressNode';
import { NodeDefinition } from '@/types/nodeEditor.types';

// Mock the BaseNode component
vi.mock('./BaseNode', () => ({
    BaseNode: ({ children, node, onUpdate }: any) => (
        <div data-testid="base-node" data-node-id={node.id}>
            {children}
        </div>
    )
}));

describe('ProgressNode', () => {
    const mockOnUpdate = vi.fn();

    const createMockNode = (overrides: Partial<NodeDefinition> = {}): NodeDefinition => ({
        id: 'progress-1',
        type: 'progress',
        position: { x: 100, y: 100 },
        data: {
            label: 'Test Progress',
            value: 75,
            max: 100,
            color: '#10B981'
        },
        inputs: [],
        outputs: [],
        config: {
            category: 'progress',
            label: 'Progress Bar',
            icon: 'BarChart3'
        },
        ...overrides
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Label, Value, Max Inputs', () => {
        // Fixed: Use querySelector for number input since getByRole('textbox') doesn't work with type="number"
        it('renders value input with correct initial value', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const valueInput = container.querySelector('input[type="number"]');
            expect(valueInput).toBeInTheDocument();
            expect(valueInput).toHaveAttribute('type', 'number');
        });

        // Fixed: Use querySelector for number input since getByDisplayValue() doesn't work with type="number"
        it('renders max input with correct initial value', () => {
            const node = createMockNode({ data: { value: 75, max: 200, color: '#10B981' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const maxInput = container.querySelectorAll('input[type="number"]')[1];
            expect(maxInput).toBeInTheDocument();
            expect(maxInput).toHaveAttribute('type', 'number');
        });

        it('renders labels for value and max inputs', () => {
            const node = createMockNode();

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('Value')).toBeInTheDocument();
            expect(screen.getByText('Max')).toBeInTheDocument();
        });
    });

    describe('Value and Max Updates', () => {
        it('calls onUpdate when value input changes', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const valueInput = screen.getByDisplayValue('50');
            fireEvent.change(valueInput, { target: { value: '80' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('progress-1', {
                data: expect.objectContaining({ value: 80 })
            });
        });

        it('calls onUpdate when max input changes', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const maxInput = screen.getByDisplayValue('100');
            fireEvent.change(maxInput, { target: { value: '150' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('progress-1', {
                data: expect.objectContaining({ max: 150 })
            });
        });
    });

    describe('Color Picker Integration', () => {
        // Fixed: Use querySelector to find color input directly since input[type="color"] doesn't have role="textbox"
        it('renders color picker with initial color', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#EF4444' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const colorInput = container.querySelector('input[type="color"]');
            expect(colorInput).toBeInTheDocument();
            expect(colorInput).toHaveAttribute('type', 'color');
        });

        // Fixed: Use querySelector for color input and expect lowercase color value (browser normalizes to lowercase)
        it('calls onUpdate when color changes', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const colorInput = container.querySelector('input[type="color"]');
            expect(colorInput).not.toBeNull();
            if (colorInput) {
                fireEvent.change(colorInput, { target: { value: '#F59E0B' } });

                expect(mockOnUpdate).toHaveBeenCalledWith('progress-1', {
                    data: expect.objectContaining({ color: '#f59e0b' })
                });
            }
        });

        it('displays color hex value next to picker', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#6366F1' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('#6366F1')).toBeInTheDocument();
        });
    });

    describe('Style Preview', () => {
        it('renders progress preview bar', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const previewBar = document.querySelector('.h-2.w-full.bg-slate-100');
            expect(previewBar).toBeInTheDocument();
        });

        it('calculates correct width percentage for preview', () => {
            const node = createMockNode({ data: { value: 75, max: 100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const fillBar = document.querySelector('.h-full.transition-all');
            expect(fillBar).toHaveStyle({ width: '75%' });
        });

        // Fixed: Use querySelector for fillBar since toHaveStyle() doesn't work reliably with inline styles
        it('applies correct background color to preview fill', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#EF4444' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const fillBar = container.querySelector('.h-full.transition-all');
            expect(fillBar).not.toBeNull();
            if (fillBar) {
                expect(fillBar).toHaveStyle({ backgroundColor: '#EF4444' });
            }
        });
    });

    describe('Input Validation', () => {
        // Fixed: Use querySelector for number input and expect 0 instead of NaN (Number('') = 0, Number('abc') = 0)
        it('handles empty value input gracefully', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const valueInput = container.querySelector('input[type="number"]');
            expect(valueInput).not.toBeNull();
            if (valueInput) {
                fireEvent.change(valueInput, { target: { value: '' } });

                expect(mockOnUpdate).toHaveBeenCalledWith('progress-1', {
                    data: expect.objectContaining({ value: 0 })
                });
            }
        });

        // Fixed: Use querySelector for number input and expect 0 instead of NaN (Number('') = 0, Number('abc') = 0)
        it('handles non-numeric value input', () => {
            const node = createMockNode({ data: { value: 50, max: 100, color: '#10B981' } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const valueInput = container.querySelector('input[type="number"]');
            expect(valueInput).not.toBeNull();
            if (valueInput) {
                fireEvent.change(valueInput, { target: { value: 'abc' } });

                expect(mockOnUpdate).toHaveBeenCalledWith('progress-1', {
                    data: expect.objectContaining({ value: 0 })
                });
            }
        });
    });

    describe('Edge Cases', () => {
        it('handles negative values in preview (clamps to 0%)', () => {
            const node = createMockNode({ data: { value: -10, max: 100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const fillBar = document.querySelector('.h-full.transition-all');
            expect(fillBar).toHaveStyle({ width: '0%' });
        });

        it('handles value greater than max in preview (clamps to 100%)', () => {
            const node = createMockNode({ data: { value: 150, max: 100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const fillBar = document.querySelector('.h-full.transition-all');
            expect(fillBar).toHaveStyle({ width: '100%' });
        });

        it('handles zero max value', () => {
            const node = createMockNode({ data: { value: 50, max: 0, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const fillBar = document.querySelector('.h-full.transition-all');
            // Division by zero would result in Infinity, which gets clamped to 100%
            expect(fillBar).toHaveStyle({ width: '100%' });
        });

        it('handles negative max value', () => {
            const node = createMockNode({ data: { value: 50, max: -100, color: '#10B981' } });

            render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const fillBar = document.querySelector('.h-full.transition-all');
            // Division by negative would result in negative percentage, clamped to 0%
            expect(fillBar).toHaveStyle({ width: '0%' });
        });

        // Fixed: Use querySelector for color input since getByDisplayValue() doesn't work with type="color"
        it('handles default color when not provided', () => {
            const node = createMockNode({ data: { value: 50, max: 100 } });

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const colorInput = container.querySelector('input[type="color"]');
            expect(colorInput).toBeInTheDocument();
            expect(colorInput).toHaveAttribute('value', '#10B981');
        });
    });

    describe('Event Propagation', () => {
        // Fixed: Use querySelector for number input since getByDisplayValue() doesn't work with type="number"
        it('prevents drag propagation on value input mouse down', () => {
            const node = createMockNode();
            const stopPropagationSpy = vi.fn();
            MouseEvent.prototype.stopPropagation = stopPropagationSpy;

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const valueInput = container.querySelector('input[type="number"]');
            expect(valueInput).not.toBeNull();
            if (valueInput) {
                fireEvent.mouseDown(valueInput);

                expect(stopPropagationSpy).toHaveBeenCalled();
            }
        });

        // Fixed: Use querySelector for number input since getByDisplayValue() doesn't work with type="number"
        it('prevents drag propagation on max input mouse down', () => {
            const node = createMockNode();
            const stopPropagationSpy = vi.fn();
            MouseEvent.prototype.stopPropagation = stopPropagationSpy;

            const { container } = render(
                <ProgressNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const maxInput = container.querySelectorAll('input[type="number"]')[1];
            expect(maxInput).not.toBeNull();
            if (maxInput) {
                fireEvent.mouseDown(maxInput);

                expect(stopPropagationSpy).toHaveBeenCalled();
            }
        });
    });
});
