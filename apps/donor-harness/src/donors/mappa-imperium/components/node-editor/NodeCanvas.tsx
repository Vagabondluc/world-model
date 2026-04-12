/**
 * Node Canvas
 * The infinite workspace where nodes and connections live.
 */

import React, { useRef, useCallback } from 'react';
import { useGameStore } from '@mi/stores/gameStore';
import { useDragManager } from './hooks/useDragManager';
import { ConnectionManager } from './connections/ConnectionManager';
import { NodeDispatcher } from './nodes/NodeDispatcher';
import { NodeId, PortId, NodeType, NodeDefinition } from '@mi/types/nodeEditor.types';
import { NODE_REGISTRY } from './nodes/NodeRegistry';

interface NodeCanvasProps {
    onNodeEdit?: (nodeId: NodeId) => void;
}

export const NodeCanvas: React.FC<NodeCanvasProps> = ({ onNodeEdit }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        nodes,
        connections,
        addNode,
        addConnection,
        updateNode,
        selectNode,
        selectConnection,
        deleteNode,
        deleteConnection, // For delete button
        selectedNodeId,
        selectedConnectionId
    } = useGameStore();

    // Drag Manager
    const {
        handlers: dragHandlers,
        phantomConnection
    } = useDragManager({
        nodes,
        connections,
        onUpdateNode: (id, pos) => updateNode(id, { position: pos }),
        onCreateConnection: addConnection
    });

    // Helper: Calculate Port Position
    const getPortPosition = useCallback((nodeId: NodeId, portId: PortId) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return null;

        // Use node instance definition for ports
        const inputIndex = node.inputs?.findIndex(p => p.id === portId) ?? -1;
        const outputIndex = node.outputs?.findIndex(p => p.id === portId) ?? -1;

        const HEADER_HEIGHT = 48;
        const PADDING_TOP = 12; // pt-3
        const PORT_HEIGHT = 12; // h-3
        const GAP = 12; // gap-3
        const PORT_SPACING = PORT_HEIGHT + GAP; // 24px

        // BaseNode layout
        const x = node.position.x;
        const y = node.position.y;
        // Use node width if available, else static default from registry or constant
        const width = node.config?.width || 280;

        if (inputIndex !== -1) {
            return {
                x: x, // Left edge
                y: y + HEADER_HEIGHT + PADDING_TOP + (inputIndex * PORT_SPACING) + (PORT_HEIGHT / 2)
            };
        }

        if (outputIndex !== -1) {
            return {
                x: x + width, // Right edge
                y: y + HEADER_HEIGHT + PADDING_TOP + (outputIndex * PORT_SPACING) + (PORT_HEIGHT / 2)
            };
        }

        return null;
    }, [nodes]);

    // Handlers
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('application/reactflow') as NodeType;

        if (type && NODE_REGISTRY[type]) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const position = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            const newNode: NodeDefinition = {
                id: crypto.randomUUID(),
                type,
                position,
                data: { label: `New ${NODE_REGISTRY[type].label}` },
                inputs: [], // TODO: Initialize from registry or template
                outputs: [],
                config: NODE_REGISTRY[type]
            };

            addNode(newNode);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Clear selection if clicking background
        if (e.target === canvasRef.current) {
            selectNode(null);
            selectConnection(null);
        }
    };

    // Keyboard Shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input is focused
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodeId) {
                    deleteNode(selectedNodeId);
                } else if (selectedConnectionId) {
                    deleteConnection(selectedConnectionId);
                }
            }

            if (selectedNodeId) {
                const node = nodes.find(n => n.id === selectedNodeId);
                if (node) {
                    let dx = 0;
                    let dy = 0;
                    const STEP = 10;

                    switch (e.key) {
                        case 'ArrowUp': dy = -STEP; break;
                        case 'ArrowDown': dy = STEP; break;
                        case 'ArrowLeft': dx = -STEP; break;
                        case 'ArrowRight': dx = STEP; break;
                    }

                    if (dx !== 0 || dy !== 0) {
                        e.preventDefault();
                        updateNode(selectedNodeId, {
                            position: {
                                x: node.position.x + dx,
                                y: node.position.y + dy
                            }
                        });
                    }
                }
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                if (nodes.length === 0) return;

                const currentIndex = nodes.findIndex(n => n.id === selectedNodeId);
                const nextIndex = (currentIndex + 1) % nodes.length;
                selectNode(nodes[nextIndex].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nodes, selectedNodeId, selectedConnectionId, deleteNode, deleteConnection, updateNode, selectNode]);

    return (
        <div
            ref={canvasRef}
            data-testid="node-canvas"
            className="flex-1 h-full w-full relative bg-slate-100 overflow-hidden cursor-crosshair"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseDown={handleCanvasClick}
            onClick={handleCanvasClick}
            onMouseMove={dragHandlers.onMouseMove}
            onMouseUp={dragHandlers.onMouseUp}
        >
            {/* Grid Pattern (Optional BG) */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Connections Layer */}
            <ConnectionManager
                connections={connections.map(c => ({
                    ...c,
                    selected: c.id === selectedConnectionId
                }))}
                phantomConnection={phantomConnection}
                getPortPosition={getPortPosition}
                onConnectionSelect={selectConnection}
                onConnectionDelete={deleteConnection}
            />

            {/* Nodes Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {nodes.map(node => (
                    <NodeDispatcher
                        key={node.id}
                        node={{
                            ...node,
                            selected: node.id === selectedNodeId
                        }}
                        onUpdate={(id, updates) => updateNode(id, updates)}
                        onInitDrag={(e) => dragHandlers.onNodeDragStart(node.id, node.position, e)}
                        onPortDragStart={(e, _, portId) => dragHandlers.onPortDragStart(node.id, portId, e)}
                        onPortMouseUp={(_e, _, portId) => dragHandlers.onPortMouseUp(node.id, portId)}
                        // Helper to forward selection from Node component
                        onSelect={() => selectNode(node.id)}
                        onDelete={() => {/* Handled by store action usually, or passed here */ }}
                        onDuplicate={() => {/* Handled by store */ }}
                        onEdit={onNodeEdit}
                    />
                ))}
            </div>
        </div>
    );
};
