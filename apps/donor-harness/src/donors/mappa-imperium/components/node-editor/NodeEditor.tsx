/**
 * Node Editor
 * Main entry point for the visual node editor.
 */

import React, { useEffect } from 'react';
import { NodePalette } from './NodePalette';
import { NodeCanvas } from './NodeCanvas';
import { useGameStore } from '@mi/stores/gameStore';
import { EraMenuBar } from './EraMenuBar';
import { PreviewPane } from './preview/PreviewPane';
import { ErrorOverlay } from './error/ErrorOverlay';
import { GraphValidator } from './validator/GraphValidator';
import { Toolbar } from './Toolbar';
import { NodeDefinition } from '@mi/types/nodeEditor.types';
import EditElementModal from '../shared/EditElementModal';
import { ElementCard } from '@mi/types/element.types';

export const NodeEditor: React.FC = () => {
    const {
        nodes,
        connections,
        selectedNodeId,
        selectedConnectionId,
        deleteNode,
        deleteConnection,
        selectNode,
        setValidationErrors,
        updateNode
    } = useGameStore();

    // Modal State
    const [editingNodeId, setEditingNodeId] = React.useState<string | null>(null);

    const handleEditNode = (nodeId: string) => {
        setEditingNodeId(nodeId);
    };

    const handleSaveElement = (updatedElement: ElementCard) => {
        if (editingNodeId) {
            const node = nodes.find(n => n.id === editingNodeId);
            if (node) {
                updateNode(editingNodeId, {
                    data: {
                        ...node.data,
                        element: updatedElement.data, // Store specific data
                        label: updatedElement.name // Sync label
                    }
                });
            }
            setEditingNodeId(null);
        }
    };

    // Prepare Element for Modal
    const editingNode = nodes.find(n => n.id === editingNodeId);
    const elementForModal: ElementCard | undefined = editingNode ? {
        id: editingNode.id,
        type: (editingNode.type.charAt(0).toUpperCase() + editingNode.type.slice(1)).replace('Input', '') as any,
        name: (editingNode.data as any).label || 'New Element',
        owner: 0,
        era: 1,
        data: (editingNode.data as any).element || {},
        // Defaults for required fields
    } as ElementCard : undefined;
    const validatorRef = React.useRef(new GraphValidator());

    // Validation Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const errors = validatorRef.current.validateGraph(nodes, connections);
            setValidationErrors(errors);
        }, 500); // Debounce validation

        return () => clearTimeout(timer);
    }, [nodes, connections, setValidationErrors]);

    // Helper: Find nearest node in direction
    const navigateSelection = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
        if (!selectedNodeId) {
            // Select first node if nothing selected
            if (nodes.length > 0) selectNode(nodes[0].id);
            return;
        }

        const current = nodes.find(n => n.id === selectedNodeId);
        if (!current) return;

        let bestCandidate: NodeDefinition | null = null;
        let minDistance = Infinity;

        nodes.forEach(candidate => {
            if (candidate.id === current.id) return;

            const dx = candidate.position.x - current.position.x;
            const dy = candidate.position.y - current.position.y;

            // Check direction
            let isValid = false;
            switch (direction) {
                case 'UP': isValid = dy < 0 && Math.abs(dx) < Math.abs(dy) * 2; break;
                case 'DOWN': isValid = dy > 0 && Math.abs(dx) < Math.abs(dy) * 2; break;
                case 'LEFT': isValid = dx < 0 && Math.abs(dy) < Math.abs(dx) * 2; break;
                case 'RIGHT': isValid = dx > 0 && Math.abs(dy) < Math.abs(dx) * 2; break;
            }

            if (isValid) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestCandidate = candidate;
                }
            }
        });

        if (bestCandidate) {
            selectNode((bestCandidate as typeof nodes[0]).id);
        }
    };

    // Global Hotkeys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            switch (e.key) {
                case 'Delete':
                case 'Backspace':
                    if (selectedNodeId) {
                        deleteNode(selectedNodeId);
                    } else if (selectedConnectionId) {
                        deleteConnection(selectedConnectionId);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateSelection('UP');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    navigateSelection('DOWN');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateSelection('LEFT');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateSelection('RIGHT');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, selectedConnectionId, nodes, deleteNode, deleteConnection, selectNode]);

    return (
        <div className="flex flex-col w-full h-full bg-slate-50 overflow-hidden">
            <EraMenuBar />
            <Toolbar />

            <div className="flex flex-1 w-full h-full overflow-hidden">
                {/* Sidebar */}
                <div className="shrink-0 h-full">
                    <NodePalette />
                </div>

                {/* Canvas */}
                <div className="flex-1 h-full shadow-inner relative z-10">
                    <NodeCanvas onNodeEdit={handleEditNode} />

                    {/* Floating Error Overlay */}
                    <ErrorOverlay />
                </div>

                {/* Preview Pane (Right Sidebar) */}
                <div className="shrink-0 h-full w-[350px] border-l border-slate-200 z-20 shadow-xl">
                    <PreviewPane />
                </div>
            </div>

            {/* Edit Modal */}
            {editingNode && elementForModal && (
                <EditElementModal
                    isOpen={!!editingNodeId}
                    element={elementForModal}
                    onSave={handleSaveElement}
                    onClose={() => setEditingNodeId(null)}
                />
            )}
        </div>
    );
};
