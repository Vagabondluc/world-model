/**
 * Connection Manager
 * Orchestrates the rendering of all connection lines on the canvas.
 */

import React from 'react';
import { ConnectionDefinition, NodeId, PortId } from '@/types/nodeEditor.types';
import { ConnectionLine } from './ConnectionLine';

interface ConnectionManagerProps {
    connections: ConnectionDefinition[];
    phantomConnection?: {
        startPos: { x: number; y: number };
        currentPos: { x: number; y: number };
        isValid?: boolean;
    } | null;
    getPortPosition: (nodeId: NodeId, portId: PortId) => { x: number; y: number } | null;
    onConnectionSelect?: (connectionId: string) => void;
    onConnectionDelete?: (connectionId: string) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
    connections,
    phantomConnection,
    getPortPosition,
    onConnectionSelect,
    onConnectionDelete
}) => {
    return (
        <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
        >
            {/* Render Existing Connections */}
            {connections.map(conn => {
                const start = getPortPosition(conn.sourceNodeId, conn.sourcePortId);
                const end = getPortPosition(conn.targetNodeId, conn.targetPortId);

                if (!start || !end) return null;

                return (
                    <ConnectionLine
                        key={conn.id}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        status={conn.selected ? 'selected' : 'default'}
                        animated={conn.animated}
                        strokeWidth={2}
                        onClick={(e) => {
                            e.stopPropagation();
                            onConnectionSelect?.(conn.id);
                        }}
                    />
                );
            })}

            {/* Render Delete Button for Selected Connection */}
            {connections.map(conn => {
                if (!conn.selected) return null;
                const start = getPortPosition(conn.sourceNodeId, conn.sourcePortId);
                const end = getPortPosition(conn.targetNodeId, conn.targetPortId);
                if (!start || !end) return null;

                // Midpoint calculation (approximate for bezier)
                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;

                return (
                    <foreignObject
                        key={`del-${conn.id}`}
                        x={midX - 10}
                        y={midY - 10}
                        width={20}
                        height={20}
                        style={{ overflow: 'visible' }}
                    >
                        <button
                            className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm hover:bg-red-600 hover:scale-110 transition-transform"
                            onClick={(e) => {
                                e.stopPropagation();
                                onConnectionDelete?.(conn.id);
                            }}
                            title="Delete Connection"
                        >
                            ×
                        </button>
                    </foreignObject>
                );
            })}

            {/* Render Phantom Connection (Drag) */}
            {phantomConnection && (
                <ConnectionLine
                    x1={phantomConnection.startPos.x}
                    y1={phantomConnection.startPos.y}
                    x2={phantomConnection.currentPos.x}
                    y2={phantomConnection.currentPos.y}
                    status={phantomConnection.isValid === false ? 'invalid' : 'default'}
                    animated={true}
                    strokeWidth={2}
                />
            )}
        </svg>
    );
};
