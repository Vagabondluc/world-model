/**
 * Logic Node
 * Performs boolean/conditional operations.
 */

import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from './DataInputNode';
import { LogicNodeData } from '@mi/types/nodeEditor.types';

export const LogicNode: React.FC<NodeComponentProps> = (props) => {
    const { node, onUpdate } = props;
    const data = node.data as LogicNodeData;

    const updateData = (updates: Partial<LogicNodeData>) => {
        onUpdate?.(node.id, {
            data: { ...data, ...updates }
        });
    };

    return (
        <BaseNode {...props}>
            <div className="flex flex-col gap-2">

                <label className="text-xs text-slate-500 font-medium">Operation</label>
                <select
                    className="w-full text-sm border rounded px-2 py-1 bg-white focus:ring-1 focus:ring-cyan-500 outline-none"
                    value={data.operation || 'AND'}
                    onChange={(e) => updateData({ operation: e.target.value as any })}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="NOT">NOT</option>
                    <option value="XOR">XOR</option>
                    <option value="IF">IF (Ternary)</option>
                </select>

                <div className="text-[10px] text-slate-400 mt-1 italic">
                    {data.operation === 'NOT' ? 'Inverts Input A' :
                        data.operation === 'IF' ? 'If A then B' :
                            `A ${data.operation} B`}
                </div>

            </div>
        </BaseNode>
    );
};
