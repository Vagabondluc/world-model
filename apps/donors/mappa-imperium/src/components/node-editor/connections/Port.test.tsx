import { render, screen, fireEvent } from '@testing-library/react';
import { Port } from './Port';
import { PortDefinition, PortDataType } from '@/types/nodeEditor.types';

describe('Port', () => {
    const mockNodeId = 'node-1';
    const mockOnDragStart = vi.fn();
    const mockOnMouseUp = vi.fn();

    const createPortDefinition = (dataType: PortDataType = 'number', required: boolean = false): PortDefinition => ({
        id: 'port-1',
        label: 'Test Port',
        dataType,
        required
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Port Rendering', () => {
        // Fixed: Port circle is not a button element, so use querySelector directly
        it('renders port circle with 16px diameter (w-4 h-4)', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toBeInTheDocument();
            expect(portCircle).toHaveClass('w-4', 'h-4');
        });

        it('renders port as rounded circle', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toBeInTheDocument();
        });

        it('renders port label text', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            expect(screen.getByText('Test Port')).toBeInTheDocument();
        });
    });

    describe('Port Colors Based on Data Type', () => {
        it('renders blue color for elementData type', () => {
            const definition = createPortDefinition('elementData');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#3b82f6' });
        });

        it('renders green color for progressData type', () => {
            const definition = createPortDefinition('progressData');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#10b981' });
        });

        it('renders amber color for number type', () => {
            const definition = createPortDefinition('number');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#f59e0b' });
        });

        it('renders pink color for string type', () => {
            const definition = createPortDefinition('string');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#ec4899' });
        });

        it('renders violet color for boolean type', () => {
            const definition = createPortDefinition('boolean');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#8b5cf6' });
        });

        it('renders indigo color for array type', () => {
            const definition = createPortDefinition('array');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#6366f1' });
        });

        it('renders slate color for object type', () => {
            const definition = createPortDefinition('object');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ borderColor: '#94a3b8' });
        });
    });

    describe('Required Indicator', () => {
        it('displays red asterisk for required ports', () => {
            const definition = createPortDefinition('number', true);

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const asterisk = screen.getByText('*');
            expect(asterisk).toHaveClass('text-red-500');
        });

        it('does not display asterisk for optional ports', () => {
            const definition = createPortDefinition('number', false);

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const asterisk = screen.queryByText('*');
            expect(asterisk).not.toBeInTheDocument();
        });
    });

    describe('Hover Tooltip with Type Info', () => {
        it('displays tooltip with port label and data type on hover', () => {
            const definition = createPortDefinition('number');

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portContainer = document.querySelector('[title]');
            expect(portContainer).toHaveAttribute('title', 'Test Port (number)');
        });
    });

    describe('Connection Start/End Handlers', () => {
        it('calls onDragStart when mouse down on port', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            if (portCircle) {
                fireEvent.mouseDown(portCircle);
            }

            expect(mockOnDragStart).toHaveBeenCalledWith(
                expect.any(Object),
                'port-1'
            );
        });

        it('calls onMouseUp when mouse up on port', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            if (portCircle) {
                fireEvent.mouseUp(portCircle);
            }

            expect(mockOnMouseUp).toHaveBeenCalledWith(
                expect.any(Object),
                'port-1'
            );
        });
    });

    describe('Input vs Output Port Styling', () => {
        it('renders input port with label on the right', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const container = document.querySelector('.flex-row');
            expect(container).toBeInTheDocument();
        });

        it('renders output port with label on the left (reversed)', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="output"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const container = document.querySelector('.flex-row-reverse');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Connected State', () => {
        it('fills port with color when connected', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                    connected={true}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveStyle({ backgroundColor: '#f59e0b' });
        });

        // Fixed: Check inline style directly instead of using toHaveStyle() which may not work reliably
        it('shows white background when not connected', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                    connected={false}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toBeInTheDocument();
            // Check the inline style directly
            expect(portCircle?.style.backgroundColor).toBe('white');
        });
    });

    describe('Cursor Styling', () => {
        it('displays crosshair cursor on port hover', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveClass('cursor-crosshair');
        });
    });

    describe('Hover Effects', () => {
        it('scales port on hover', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const portCircle = document.querySelector('.rounded-full');
            expect(portCircle).toHaveClass('hover:scale-110');
        });
    });

    describe('Label Styling', () => {
        it('renders label with small text and medium font weight', () => {
            const definition = createPortDefinition();

            render(
                <Port
                    nodeId={mockNodeId}
                    definition={definition}
                    type="input"
                    onDragStart={mockOnDragStart}
                    onMouseUp={mockOnMouseUp}
                />
            );

            const label = screen.getByText('Test Port');
            expect(label).toHaveClass('text-xs', 'text-gray-500', 'font-medium');
        });
    });
});
