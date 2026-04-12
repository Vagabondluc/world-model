/**
 * Table Preview
 * Renders tabular data from graph execution results.
 */

import React from 'react';
import { NodeDefinition, NodeId, TableNodeData } from '@mi/types/nodeEditor.types';

interface TablePreviewProps {
    nodes: NodeDefinition[];
    executionResults: Map<NodeId, any>;
}

export const TablePreview: React.FC<TablePreviewProps> = ({ nodes, executionResults }) => {
    const tableNodes = nodes.filter(n => n.type === 'table');

    if (tableNodes.length === 0) {
        return <div className="text-xs text-slate-400 italic p-4 text-center">No table nodes found.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {tableNodes.map(node => {
                // TableNodeData usually has { columns: string[] }
                const data = node.data as TableNodeData;
                const result = executionResults.get(node.id); // Expecting array of objects

                // Ensure result is an array
                const rows = Array.isArray(result) ? result : [];
                const columns = data.columns || (rows.length > 0 ? Object.keys(rows[0]) : ['Value']);

                return (
                    <div key={node.id} className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700">
                            {data.label || 'Table Result'}
                            <span className="ml-2 text-[10px] bg-slate-200 rounded-full px-1.5 py-0.5 font-normal text-slate-500">
                                {rows.length} rows
                            </span>
                        </div>

                        <div className="overflow-x-auto max-w-full">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col} className="px-3 py-2 font-medium border-b border-slate-100 whitespace-nowrap">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600">
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-3 py-4 text-center italic text-slate-400">
                                                No data
                                            </td>
                                        </tr>
                                    ) : rows.map((row, i) => (
                                        <tr key={i} className="border-b last:border-0 border-slate-50 hover:bg-slate-50 transition-colors">
                                            {columns.map(col => (
                                                <td key={col} className="px-3 py-1.5 whitespace-nowrap">
                                                    {String(row[col] ?? '-')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
