import { NodeDefinition, NodeId } from '@mi/types/nodeEditor.types';
import React from 'react';

// Common Props for all specific nodes
export interface NodeComponentProps {
    node: NodeDefinition;
    selected?: boolean;
    onSelect?: (nodeId: NodeId) => void;
    onDelete?: (nodeId: NodeId) => void;
    onDuplicate?: (nodeId: NodeId) => void;
    onEdit?: (nodeId: NodeId) => void;
    onUpdate?: (nodeId: NodeId, data: any) => void; // Using any for data to be flexible
    onInitDrag?: (e: React.MouseEvent, nodeId: NodeId) => void;
    onPortDragStart: (e: React.MouseEvent, nodeId: NodeId, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: NodeId, portId: string) => void;
}
