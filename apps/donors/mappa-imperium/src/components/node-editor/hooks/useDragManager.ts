import { useState, useCallback, useRef } from 'react';
import { NodeId, PortId, ConnectionDefinition, NodeDefinition } from '@/types/nodeEditor.types';
import { ConnectionValidator } from '@/components/node-editor/validator/ConnectionValidator';

interface DragState {
    type: 'node' | 'port' | null;
    itemId: string | null;  // NodeId or PortId
    // For Node Drag
    initialNodePos?: { x: number; y: number };
    // For Port Drag
    sourceNodeId?: NodeId;
    sourcePortId?: PortId;

    startPos: { x: number; y: number }; // Cursor start
    currentPos: { x: number; y: number }; // Cursor current
}

interface UseDragManagerProps {
    nodes: NodeDefinition[];
    connections: ConnectionDefinition[]; // Added to satisfy types, used for validation
    onUpdateNode: (nodeId: NodeId, newPos: { x: number; y: number }) => void;
    onCreateConnection: (connection: ConnectionDefinition) => void;
}

export const useDragManager = ({ nodes, onUpdateNode, onCreateConnection }: UseDragManagerProps) => {
    const [dragState, setDragState] = useState<DragState>({
        type: null,
        itemId: null,
        startPos: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 }
    });

    const validator = useRef(new ConnectionValidator());

    // --- Actions ---

    const startNodeDrag = useCallback((nodeId: NodeId, initialPos: { x: number, y: number }, e: React.MouseEvent) => {
        e.stopPropagation();
        setDragState({
            type: 'node',
            itemId: nodeId,
            initialNodePos: initialPos,
            startPos: { x: e.clientX, y: e.clientY },
            currentPos: { x: e.clientX, y: e.clientY }
        });
    }, []);

    const startPortDrag = useCallback((nodeId: NodeId, portId: PortId, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDragState({
            type: 'port',
            itemId: portId,
            sourceNodeId: nodeId,
            sourcePortId: portId,
            startPos: { x: e.clientX, y: e.clientY },
            currentPos: { x: e.clientX, y: e.clientY }
        });
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!dragState.type) return;

        // Update current cursor position
        const currentPos = { x: e.clientX, y: e.clientY };

        // Handle Node Move
        if (dragState.type === 'node' && dragState.itemId && dragState.initialNodePos) {
            const dx = currentPos.x - dragState.startPos.x;
            const dy = currentPos.y - dragState.startPos.y;

            onUpdateNode(dragState.itemId, {
                x: dragState.initialNodePos.x + dx,
                y: dragState.initialNodePos.y + dy
            });
        }

        setDragState(prev => ({ ...prev, currentPos }));
    }, [dragState, onUpdateNode]);

    const onMouseUp = useCallback(() => {
        if (!dragState.type) return;

        // Handle Connection Drop (Port Drag)
        // Note: The actual drop logic often happens on the *target* port's mouseUp.
        // If we drop on canvas, we just cancel.
        // But if we dropped on a port, that port's handler should have fired?
        // Actually, if we release over a port, the port's onMouseUp should handle it.
        // Here we just cleanup.

        setDragState({
            type: null,
            itemId: null,
            startPos: { x: 0, y: 0 },
            currentPos: { x: 0, y: 0 }
        });
    }, [dragState]);

    // Called by the target port when mouse is released over it
    const handlePortDrop = useCallback((targetNodeId: NodeId, targetPortId: PortId) => {
        if (dragState.type === 'port' && dragState.sourceNodeId && dragState.sourcePortId) {
            const connection: ConnectionDefinition = {
                id: crypto.randomUUID(),
                sourceNodeId: dragState.sourceNodeId,
                sourcePortId: dragState.sourcePortId,
                targetNodeId: targetNodeId,
                targetPortId: targetPortId
            };

            const validation = validator.current.validateConnection(connection, nodes);
            if (validation.isValid) {
                onCreateConnection(connection);
            } else {
                console.warn("Invalid connection:", validation.error);
            }
        }
    }, [dragState, nodes, onCreateConnection]);


    // Computed Phantom Connection
    // Matches { startPos: {x,y}, currentPos: {x,y}, isValid?: boolean } expected by ConnectionManager
    let phantomConnection: { startPos: { x: number; y: number }; currentPos: { x: number; y: number }; isValid?: boolean } | undefined;

    if (dragState.type === 'port' && dragState.sourceNodeId && dragState.sourcePortId) {
        phantomConnection = {
            startPos: dragState.startPos,
            currentPos: dragState.currentPos,
            isValid: true
        };
    }

    return {
        dragState,
        handlers: {
            onNodeDragStart: startNodeDrag,
            onPortDragStart: startPortDrag,
            onMouseMove,
            onMouseUp,
            onPortMouseUp: handlePortDrop // Expose this for the ports
        },
        phantomConnection
    };
};
