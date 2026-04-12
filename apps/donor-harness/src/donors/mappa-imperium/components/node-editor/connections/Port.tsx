/**
 * Port Component
 * Interaction point for creating and receiving connections.
 */

import React from 'react';
import { PortDefinition, PortDataType, NodeId } from '@mi/types/nodeEditor.types';
import { LucideIcon, Circle, Square, Triangle } from 'lucide-react';

interface PortProps {
    nodeId: NodeId;
    definition: PortDefinition;
    type: 'input' | 'output';
    onDragStart: (e: React.MouseEvent, portId: string) => void;
    onMouseUp: (e: React.MouseEvent, portId: string) => void;
    connected?: boolean;
}

const getPortColor = (dataType: PortDataType): string => {
    switch (dataType) {
        case 'elementData': return '#3b82f6'; // Blue
        case 'progressData': return '#10b981'; // Green
        case 'number': return '#f59e0b'; // Amber
        case 'string': return '#ec4899'; // Pink
        case 'boolean': return '#8b5cf6'; // Violet
        case 'array': return '#6366f1'; // Indigo
        case 'object': return '#94a3b8'; // Slate
        default: return '#cbd5e1'; // Light Slate
    }
};

export const Port: React.FC<PortProps> = ({
    nodeId,
    definition,
    type,
    onDragStart,
    onMouseUp,
    connected
}) => {
    const color = getPortColor(definition.dataType);

    // TODO: Different shapes for different types?
    // For now, simple circle.

    return (
        <div
            className={`flex items-center gap-2 ${type === 'output' ? 'flex-row-reverse' : 'flex-row'}`}
            title={`${definition.label} (${definition.dataType})`}
        >
            {/* The Clickable Port Circle */}
            <div
                className={`
                    w-4 h-4 rounded-full border-2 cursor-crosshair transition-colors
                    hover:scale-110
                `}
                style={{
                    borderColor: color,
                    backgroundColor: connected ? color : 'white'
                }}
                onMouseDown={(e) => onDragStart(e, definition.id)}
                onMouseUp={(e) => onMouseUp(e, definition.id)}
            />

            {/* Label */}
            <span className="text-xs text-gray-500 font-medium">
                {definition.label}
                {definition.required && <span className="text-red-500 ml-0.5">*</span>}
            </span>
        </div>
    );
};
