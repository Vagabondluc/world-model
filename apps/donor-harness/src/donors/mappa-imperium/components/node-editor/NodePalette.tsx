/**
 * Node Palette
 * Sidebar component to drag and drop new nodes onto the canvas.
 */

import React, { useMemo, useState } from 'react';
import { NODE_REGISTRY } from './nodes/NodeRegistry';
import { NodeType, NodeCategory } from '@mi/types/nodeEditor.types';
import * as Icons from 'lucide-react';

export const NodePalette: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const nodesByCategory = useMemo(() => {
        const groups: Partial<Record<NodeCategory, NodeType[]>> = {};

        Object.entries(NODE_REGISTRY).forEach(([type, config]) => {
            if (searchTerm && !config.label.toLowerCase().includes(searchTerm.toLowerCase())) {
                return;
            }

            if (!groups[config.category]) {
                groups[config.category] = [];
            }
            groups[config.category]?.push(type as NodeType);
        });

        return groups;
    }, [searchTerm]);

    const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 h-full flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-700 mb-2">Components</h2>
                <input
                    type="text"
                    placeholder="Search nodes..."
                    className="w-full text-xs px-2 py-1.5 border rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Node List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {Object.entries(nodesByCategory).map(([category, types]) => (
                    <div key={category}>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            {category}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {types.map(type => {
                                const config = NODE_REGISTRY[type];
                                const Icon = (Icons as any)[config.icon] || Icons.Box;

                                return (
                                    <div
                                        key={type}
                                        className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm cursor-grab hover:border-blue-400 hover:shadow-md transition-all active:cursor-grabbing"
                                        draggable
                                        onDragStart={(e) => onDragStart(e, type)}
                                    >
                                        <div
                                            className="w-8 h-8 rounded flex items-center justify-center text-white shrink-0"
                                            style={{ backgroundColor: config.color }}
                                        >
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs font-medium text-slate-700 truncate">
                                                {config.label}
                                            </span>
                                            <span className="text-[10px] text-slate-400 truncate">
                                                {config.description}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                Drag items to the canvas
            </div>
        </div>
    );
};
