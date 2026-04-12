/**
 * Table Node
 * Configures table structure (columns).
 */

import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from './DataInputNode';
import { TableNodeData } from '@/types/nodeEditor.types';

export const TableNode: React.FC<NodeComponentProps> = (props) => {
    const { node, onUpdate } = props;
    const data = node.data as TableNodeData;
    const columns = data.columns || [];
    const columnsString = columns.join(', ');

    const handleColumnsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCols = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        onUpdate?.(node.id, {
            data: { ...data, columns: newCols }
        });
    };

    return (
        <BaseNode {...props} width={320}>
            <div className="flex flex-col gap-2">

                <label className="text-xs text-slate-500 font-medium">Columns (comma separated)</label>
                <textarea
                    className="w-full text-sm border rounded px-2 py-1 bg-slate-50 focus:ring-1 focus:ring-indigo-500 outline-none resize-y min-h-[60px]"
                    defaultValue={columnsString}
                    onBlur={handleColumnsChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="Name, Age, Role..."
                />

                <div className="flex gap-1 flex-wrap">
                    {columns.map((col, i) => (
                        <span key={i} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                            {col}
                        </span>
                    ))}
                </div>

            </div>
        </BaseNode>
    );
};
