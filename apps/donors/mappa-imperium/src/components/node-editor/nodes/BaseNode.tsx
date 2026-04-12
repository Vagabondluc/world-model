/**
 * Base Node Component
 * The common frame/shell for all node variants.
 */

import React from 'react';
import { NodeDefinition, NodeId } from '@/types/nodeEditor.types';
import { NODE_REGISTRY } from './NodeRegistry';
import { Port } from '../connections/Port';
import { icons, AlertCircle } from 'lucide-react';
import { X, Copy } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

interface BaseNodeProps {
    node: NodeDefinition;
    selected?: boolean;
    onSelect?: (nodeId: NodeId) => void;
    onDelete?: (nodeId: NodeId) => void;
    onDuplicate?: (nodeId: NodeId) => void;
    onInitDrag?: (e: React.MouseEvent, nodeId: NodeId) => void;
    onPortDragStart: (e: React.MouseEvent, nodeId: NodeId, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: NodeId, portId: string) => void;
    children?: React.ReactNode;
    width?: number;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
    node,
    selected,
    onSelect,
    onDelete,
    onDuplicate,
    onInitDrag,
    onPortDragStart,
    onPortMouseUp,
    children,
    width = 280
}) => {
    const { validationErrors } = useGameStore();
    // Use config from node definition instead of looking up in NODE_REGISTRY
    const config = node.config || NODE_REGISTRY[node.type];
    const Icon = config ? (icons as any)[config.icon] : null;

    // Check for errors
    const error = validationErrors.find(e => e.id === node.id && (e.type === 'node' || e.type === 'graph'));

    // Default to strict 'data' object for label/ports?
    // NodeDefinition has `inputs` array and `outputs` array.
    // NodeRegistry has `label` (default). Node instance data might have `label` override.
    const label = (node.data as any)?.label || config?.label || node.type;

    return (
        <div
            className={`
                absolute flex flex-col bg-white rounded-lg shadow-md border-2
                transition-shadow duration-200 pointer-events-auto
                ${selected ? 'border-blue-500 ring-2 ring-blue-200 z-10' : error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 hover:border-slate-300'}
            `}
            style={{
                width: width,
                transform: `translate(${node.position.x}px, ${node.position.y}px)`
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect?.(node.id);
            }}
            tabIndex={0}
            onFocus={() => {
                if (!selected) onSelect?.(node.id);
            }}
        >
            {/* --- Header --- */}
            <div
                className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100 rounded-t-lg cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => onInitDrag?.(e, node.id)}
                style={{ borderLeft: `4px solid ${config?.color || '#ccc'}` }}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {error ? <AlertCircle className="w-4 h-4 text-red-500" /> : (Icon && <Icon className="w-4 h-4 text-slate-500" />)}
                    <span className={`text-sm font-semibold truncate select-none ${error ? 'text-red-700' : 'text-slate-700'}`}>
                        {label}
                    </span>
                </div>

                {selected && (
                    <div className="flex items-center gap-1">
                        {onDuplicate && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDuplicate(node.id); }}
                                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600"
                                title="Duplicate"
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"
                                title="Delete"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* --- Body --- */}
            <div className="flex flex-col gap-2 p-3 relative">

                {/* Ports Row (Inputs vs Outputs split) */}
                <div className="flex justify-between items-start gap-4">

                    {/* Inputs Column */}
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        {node.inputs.map(port => (
                            <Port
                                key={port.id}
                                nodeId={node.id}
                                definition={port}
                                type="input"
                                onDragStart={(e) => onPortDragStart(e, node.id, port.id)}
                                onMouseUp={(e) => onPortMouseUp(e, node.id, port.id)}
                            // Connected state would need to be calculated by parent or check passed here
                            />
                        ))}
                    </div>

                    {/* Outputs Column */}
                    <div className="flex flex-col gap-2 min-w-0 flex-1 items-end">
                        {node.outputs.map(port => (
                            <Port
                                key={port.id}
                                nodeId={node.id}
                                definition={port}
                                type="output"
                                onDragStart={(e) => onPortDragStart(e, node.id, port.id)}
                                onMouseUp={(e) => onPortMouseUp(e, node.id, port.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {children && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};
