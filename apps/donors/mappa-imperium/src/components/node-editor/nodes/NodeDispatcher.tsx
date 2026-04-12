/**
 * Node Dispatcher
 * Renders the correct node component based on the node type.
 */

import React from 'react';
import { NodeComponentProps } from './nodeDispatcher.types';
import { DataInputNode } from './DataInputNode';
import { ProgressNode } from './ProgressNode';
import { SegmentNode } from './SegmentNode';
import { StyleNode } from './StyleNode';
import { LogicNode } from './LogicNode';
import { TableNode } from './TableNode';
import { BaseNode } from './BaseNode';
import { ElementNode } from './ElementNode';

import { DiceRollNode } from './interactive/DiceRollNode';
import { FormNode } from './interactive/FormNode';
import { ChoiceNode } from './interactive/ChoiceNode';
import { StepNode } from './workflow/StepNode';
import { EraGateNode } from './workflow/EraGateNode';

export const NodeDispatcher: React.FC<NodeComponentProps> = (props) => {
    switch (props.node.type) {

        // --- Interactive Nodes ---
        case 'diceRoll':
            return <DiceRollNode {...props} />;
        case 'form':
            return <FormNode {...props} />;
        case 'choice':
            return <ChoiceNode {...props} />;

        // --- Workflow Nodes ---
        case 'step':
            return <StepNode {...props} />;
        case 'eraGate':
            return <EraGateNode {...props} />;

        // --- Element Nodes ---
        case 'resource':
        case 'resourceInput':
        case 'deity':
        case 'deityInput':
        case 'location':
        case 'locationInput':
        case 'faction':
        case 'factionInput':
        case 'settlement':
        case 'settlementInput':
        case 'event':
        case 'eventInput':
        case 'character':
        case 'characterInput':
        case 'war':
        case 'warInput':
        case 'monument':
        case 'monumentInput':
            return <ElementNode {...props} />;

        // Data & Values
        case 'dataInput':
            return <DataInputNode {...props} />;

        // Progress System
        case 'progress':
            return <ProgressNode {...props} />;
        case 'segment':
            return <SegmentNode {...props} />;

        // Logic & Styling
        case 'style':
            return <StyleNode {...props} />;
        case 'logic':
            return <LogicNode {...props} />;

        // Data Structures
        case 'table':
            return <TableNode {...props} />;

        // Generic / Fallback (Element nodes use generic frame for now)
        default:
            return <BaseNode {...props} />;
    }
};
