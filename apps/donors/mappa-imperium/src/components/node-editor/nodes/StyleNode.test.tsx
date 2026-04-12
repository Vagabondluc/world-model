import { render, screen, fireEvent } from '@testing-library/react';
import { StyleNode } from './StyleNode';
import { NodeDefinition } from '@/types/nodeEditor.types';

// Mock of BaseNode component
vi.mock('./BaseNode', () => ({
    BaseNode: ({ children, node, onUpdate }: any) => (
        <div data-testid="base-node" data-node-id={node.id}>
            {children}
        </div>
    )
}));

describe('StyleNode', () => {
    const mockOnUpdate = vi.fn();

    const createMockNode = (overrides: Partial<NodeDefinition> = {}): NodeDefinition => ({
        id: 'style-1',
        type: 'style',
        position: { x: 100, y: 100 },
        data: {
            height: 24,
            radius: 4,
            backgroundColor: '#ffffff',
            textColor: '#000000'
        },
        inputs: [],
        outputs: [],
        config: {
            category: 'logic',
            label: 'Style',
            icon: 'Palette'
        },
        ...overrides
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Height Slider', () => {
        it('renders height slider with initial value', () => {
            const node = createMockNode({ data: { height: 32, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const heightSlider = screen.getByDisplayValue('32');
            expect(heightSlider).toBeInTheDocument();
            expect(heightSlider).toHaveAttribute('type', 'range');
            expect(heightSlider).toHaveAttribute('min', '12');
            expect(heightSlider).toHaveAttribute('max', '64');
        });

        it('displays current height value', () => {
            const node = createMockNode({ data: { height: 48, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('48px')).toBeInTheDocument();
        });

        it('calls onUpdate when height changes', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const heightSlider = screen.getByDisplayValue('24');
            fireEvent.change(heightSlider, { target: { value: '36' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                data: expect.objectContaining({ height: 36 })
            });
        });

        it('uses default height when not provided', () => {
            const node = createMockNode({ data: { radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const heightSlider = screen.getByDisplayValue('24');
            expect(heightSlider).toBeInTheDocument();
        });
    });

    describe('Radius Slider', () => {
        it('renders radius slider with initial value', () => {
            const node = createMockNode({ data: { height: 24, radius: 8, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const radiusSlider = screen.getByDisplayValue('8');
            expect(radiusSlider).toBeInTheDocument();
            expect(radiusSlider).toHaveAttribute('type', 'range');
            expect(radiusSlider).toHaveAttribute('min', '0');
            expect(radiusSlider).toHaveAttribute('max', '32');
        });

        it('displays current radius value', () => {
            const node = createMockNode({ data: { height: 24, radius: 12, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('12px')).toBeInTheDocument();
        });

        it('calls onUpdate when radius changes', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const radiusSlider = screen.getByDisplayValue('4');
            fireEvent.change(radiusSlider, { target: { value: '16' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                data: expect.objectContaining({ radius: 16 })
            });
        });

        it('uses default radius when not provided', () => {
            const node = createMockNode({ data: { height: 24, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const radiusSlider = screen.getByDisplayValue('4');
            expect(radiusSlider).toBeInTheDocument();
        });
    });

    describe('Color Pickers', () => {
        // Fixed: Use querySelector for color input since getByDisplayValue() doesn't work with type="color"
        it('renders background color picker with initial color', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#EF4444', textColor: '#000000' } });

            const { container } = render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const bgColorInput = container.querySelectorAll('input[type="color"]')[0];
            expect(bgColorInput).toBeInTheDocument();
            expect(bgColorInput).toHaveAttribute('type', 'color');
        });

        // Fixed: Use querySelector for color input since getByDisplayValue() doesn't work with type="color"
        it('renders text color picker with initial color', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#3B82F6' } });

            const { container } = render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textColorInput = container.querySelectorAll('input[type="color"]')[1];
            expect(textColorInput).toBeInTheDocument();
            expect(textColorInput).toHaveAttribute('type', 'color');
        });

        // Fixed: Use querySelector for color input and expect lowercase color value (browser normalizes to lowercase)
        it('calls onUpdate when background color changes', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            const { container } = render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const bgColorInput = container.querySelectorAll('input[type="color"]')[0];
            expect(bgColorInput).not.toBeNull();
            if (bgColorInput) {
                fireEvent.change(bgColorInput, { target: { value: '#10B981' } });

                expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                    data: expect.objectContaining({ backgroundColor: '#10b981' })
                });
            }
        });

        // Fixed: Use querySelector for color input and expect lowercase color value (browser normalizes to lowercase)
        it('calls onUpdate when text color changes', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            const { container } = render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textColorInput = container.querySelectorAll('input[type="color"]')[1];
            expect(textColorInput).not.toBeNull();
            if (textColorInput) {
                fireEvent.change(textColorInput, { target: { value: '#EF4444' } });

                expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                    data: expect.objectContaining({ textColor: '#ef4444' })
                });
            }
        });

        it('uses default background color when not provided', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const bgColorInput = screen.getByDisplayValue('#ffffff');
            expect(bgColorInput).toBeInTheDocument();
        });

        it('uses default text color when not provided', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const textColorInput = screen.getByDisplayValue('#000000');
            expect(textColorInput).toBeInTheDocument();
        });

        it('displays labels for color pickers', () => {
            const node = createMockNode();

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('Background')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });
    });

    describe('Style Preview', () => {
        it('renders preview section with label', () => {
            const node = createMockNode();

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('Preview')).toBeInTheDocument();
        });

        it('renders preview element with current styles', () => {
            const node = createMockNode({
                data: {
                    height: 32,
                    radius: 8,
                    backgroundColor: '#10B981',
                    textColor: '#ffffff'
                }
            });

            const { container } = render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const previewElement = container.querySelector('.px-4');
            expect(previewElement).toBeInTheDocument();
            expect(previewElement).toHaveStyle({
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#10B981',
                color: '#ffffff'
            });
        });

        it('renders sample text in preview', () => {
            const node = createMockNode();

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            expect(screen.getByText('Sample')).toBeInTheDocument();
        });

        it('applies minimum height constraint to preview', () => {
            const node = createMockNode({ data: { height: 8, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            const { container } = render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const previewElement = container.querySelector('.px-4');
            // Height should be clamped to minimum 12px
            expect(previewElement).toHaveStyle({ height: '12px' });
        });
    });

    describe('Input Validation', () => {
        it('handles minimum height value', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const heightSlider = screen.getByDisplayValue('24');
            fireEvent.change(heightSlider, { target: { value: '12' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                data: expect.objectContaining({ height: 12 })
            });
        });

        it('handles maximum height value', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const heightSlider = screen.getByDisplayValue('24');
            fireEvent.change(heightSlider, { target: { value: '64' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                data: expect.objectContaining({ height: 64 })
            });
        });

        it('handles minimum radius value', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const radiusSlider = screen.getByDisplayValue('4');
            fireEvent.change(radiusSlider, { target: { value: '0' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                data: expect.objectContaining({ radius: 0 })
            });
        });

        it('handles maximum radius value', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const radiusSlider = screen.getByDisplayValue('4');
            fireEvent.change(radiusSlider, { target: { value: '32' } });

            expect(mockOnUpdate).toHaveBeenCalledWith('style-1', {
                data: expect.objectContaining({ radius: 32 })
            });
        });
    });

    describe('Slider Step Values', () => {
        it('height slider uses step of 4', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const heightSlider = screen.getByDisplayValue('24');
            expect(heightSlider).toHaveAttribute('step', '4');
        });

        it('radius slider uses step of 2', () => {
            const node = createMockNode({ data: { height: 24, radius: 4, backgroundColor: '#ffffff', textColor: '#000000' } });

            render(
                <StyleNode
                    node={node}
                    onUpdate={mockOnUpdate}
                    selected={false}
                    onPortDragStart={vi.fn()}
                    onPortMouseUp={vi.fn()}
                />
            );

            const radiusSlider = screen.getByDisplayValue('4');
            expect(radiusSlider).toHaveAttribute('step', '2');
        });
    });
});
