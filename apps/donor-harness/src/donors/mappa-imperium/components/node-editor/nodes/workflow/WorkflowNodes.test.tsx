
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepNode } from './StepNode';
import { EraGateNode } from './EraGateNode';
import { NodeComponentProps } from '../nodeDispatcher.types';

// Mock empty handler functions
const mockHandlers = {
    onPortDragStart: () => { },
    onPortMouseUp: () => { },
    onSelect: () => { },
    onDelete: () => { },
    onDuplicate: () => { },
    onInitDrag: () => { },
    onEdit: () => { }
};

describe('Workflow Nodes', () => {

    describe('StepNode', () => {
        it('renders step label and ID', () => {
            const props: NodeComponentProps = {
                node: {
                    id: 's1',
                    type: 'step',
                    position: { x: 0, y: 0 },
                    inputs: [],
                    outputs: [],
                    data: {
                        stepId: 'step_intro',
                        label: 'Introduction',
                        description: 'Begin the journey'
                    },
                    config: { category: 'workflow', label: 'Step', icon: 'Circle' }
                },
                ...mockHandlers
            };

            render(<StepNode {...props} />);
            expect(screen.getByText('Introduction')).toBeDefined();
            expect(screen.getByText(/step_intro/)).toBeDefined();
            expect(screen.getByText('Begin the journey')).toBeDefined();
        });

        it('renders skippable indicator', () => {
            const props: NodeComponentProps = {
                node: {
                    id: 's2',
                    type: 'step',
                    position: { x: 0, y: 0 },
                    inputs: [],
                    outputs: [],
                    data: {
                        stepId: 'step_opt',
                        label: 'Optional',
                        skippable: true
                    },
                    config: { category: 'workflow', label: 'Step', icon: 'Circle' }
                },
                ...mockHandlers
            };

            render(<StepNode {...props} />);
            expect(screen.getByText('Optional Step')).toBeDefined();
        });
    });

    describe('EraGateNode', () => {
        it('renders target era and criteria', () => {
            const props: NodeComponentProps = {
                node: {
                    id: 'g1',
                    type: 'eraGate',
                    position: { x: 0, y: 0 },
                    inputs: [],
                    outputs: [],
                    data: {
                        targetEra: 2,
                        label: 'Foundation Gate',
                        criteriaDescription: 'Complete 3 Settlements'
                    },
                    config: { category: 'workflow', label: 'Era Gate', icon: 'DoorOpen' }
                },
                ...mockHandlers
            };

            render(<EraGateNode {...props} />);
            expect(screen.getByText(/Era 2/)).toBeDefined();
            expect(screen.getByText('Foundation Gate')).toBeDefined();
            expect(screen.getByText(/"Complete 3 Settlements"/)).toBeDefined();
        });
    });

});
