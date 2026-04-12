/**
 * Progress Node
 * Configures a progress bar element.
 */

import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from './DataInputNode';
import { ProgressNodeData } from '@mi/types/nodeEditor.types';

export const ProgressNode: React.FC<NodeComponentProps> = (props) => {
    const { node, onUpdate } = props;
    const data = node.data as ProgressNodeData;

    const updateData = (updates: Partial<ProgressNodeData>) => {
        onUpdate?.(node.id, {
            data: { ...data, ...updates }
        });
    };

    return (
        <BaseNode {...props}>
            <div className="flex flex-col gap-3">

                {/* Value / Max Inputs */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 block mb-1">Value</label>
                        <input
                            type="number"
                            className="w-full text-sm border rounded px-1 py-1"
                            value={data.value}
                            onChange={(e) => updateData({ value: Number(e.target.value) })}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 block mb-1">Max</label>
                        <input
                            type="number"
                            className="w-full text-sm border rounded px-1 py-1"
                            value={data.max}
                            onChange={(e) => updateData({ max: Number(e.target.value) })}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                {/* Color Picker */}
                <div>
                    <label className="text-xs text-slate-500 block mb-1">Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                            value={data.color || '#10B981'}
                            onChange={(e) => updateData({ color: e.target.value })}
                        />
                        <span className="text-xs text-slate-400 font-mono">
                            {data.color || '#10B981'}
                        </span>
                    </div>
                </div>

                {/* Tiny Preview */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                        className="h-full transition-all duration-300"
                        style={{
                            width: `${Math.min(100, Math.max(0, (Number(data.value) / Number(data.max)) * 100))}%`,
                            backgroundColor: data.color || '#10B981'
                        }}
                    />
                </div>

            </div>
        </BaseNode>
    );
};
