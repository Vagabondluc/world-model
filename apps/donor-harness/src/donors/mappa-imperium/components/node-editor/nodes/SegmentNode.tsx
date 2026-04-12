/**
 * Segment Node
 * Configures a single segment of a multi-segment progress bar.
 */

import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from './DataInputNode';
import { SegmentNodeData } from '@mi/types/nodeEditor.types';

export const SegmentNode: React.FC<NodeComponentProps> = (props) => {
    const { node, onUpdate } = props;
    const data = node.data as SegmentNodeData;

    const updateData = (updates: Partial<SegmentNodeData>) => {
        onUpdate?.(node.id, {
            data: { ...data, ...updates }
        });
    };

    return (
        <BaseNode {...props}>
            <div className="flex flex-col gap-3">

                {/* Data Inputs */}
                <div className="flex gap-2">
                    <div className="flex-[2]">
                        <label className="text-xs text-slate-500 block mb-1">Label</label>
                        <input
                            type="text"
                            className="w-full text-sm border rounded px-1 py-1"
                            value={data.label || ''}
                            onChange={(e) => updateData({ label: e.target.value })}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    </div>
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
                </div>

                {/* Color Picker */}
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                        value={data.color || '#F59E0B'}
                        onChange={(e) => updateData({ color: e.target.value })}
                    />
                    <span className="text-xs text-slate-500 flex-1">
                        Segment Color
                    </span>
                </div>

            </div>
        </BaseNode>
    );
};
