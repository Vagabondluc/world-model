
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiceRollNode } from './DiceRollNode';
import { FormNode } from './FormNode';
import { ChoiceNode } from './ChoiceNode';
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

describe('Interactive Nodes', () => {

    describe('DiceRollNode', () => {
        it('renders dice notation and button text', () => {
            const props: NodeComponentProps = {
                node: {
                    id: '1',
                    type: 'diceRoll',
                    position: { x: 0, y: 0 },
                    inputs: [],
                    outputs: [],
                    data: {
                        diceNotation: '2d6',
                        buttonText: 'Roll for Glory'
                    },
                    config: { category: 'interactive', label: 'Dice', icon: 'Dice' }
                },
                ...mockHandlers
            };

            render(<DiceRollNode {...props} />);
            expect(screen.getByText('2d6')).toBeDefined();
            expect(screen.getByText('Roll for Glory')).toBeDefined();
        });
    });

    describe('FormNode', () => {
        it('renders form title and fields', () => {
            const props: NodeComponentProps = {
                node: {
                    id: '2',
                    type: 'form',
                    position: { x: 0, y: 0 },
                    inputs: [],
                    outputs: [],
                    data: {
                        title: 'Test Form',
                        submitLabel: 'Go',
                        fields: [
                            { id: 'f1', label: 'Field 1', type: 'text' },
                            { id: 'f2', label: 'Field 2', type: 'number' }
                        ]
                    },
                    config: { category: 'interactive', label: 'Form', icon: 'FormInput' }
                },
                ...mockHandlers
            };

            render(<FormNode {...props} />);
            expect(screen.getByText('Test Form')).toBeDefined();
            expect(screen.getByText('Field 1')).toBeDefined();
            expect(screen.getByText('Field 2')).toBeDefined();
            expect(screen.getByText('Go')).toBeDefined();
        });
    });

    describe('ChoiceNode', () => {
        it('renders message and options', () => {
            const props: NodeComponentProps = {
                node: {
                    id: '3',
                    type: 'choice',
                    position: { x: 0, y: 0 },
                    inputs: [],
                    outputs: [],
                    data: {
                        message: 'Choose wisely',
                        options: [
                            { id: 'opt1', label: 'Option A', value: 'a' },
                            { id: 'opt2', label: 'Option B', value: 'b' }
                        ]
                    },
                    config: { category: 'interactive', label: 'Choice', icon: 'Split' }
                },
                ...mockHandlers
            };

            render(<ChoiceNode {...props} />);
            expect(screen.getByText(/Choose wisely/)).toBeDefined();
            expect(screen.getByText('Option A')).toBeDefined();
            expect(screen.getByText('Option B')).toBeDefined();
        });
    });

});
