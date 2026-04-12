/**
 * Progress Bars Preview
 * Renders visual progress bars from graph execution results.
 */

import React from 'react';
import { NodeDefinition, NodeId, ProgressNodeData } from '@mi/types/nodeEditor.types';

interface ProgressBarsPreviewProps {
    nodes: NodeDefinition[];
    executionResults: Map<NodeId, any>;
}

export const ProgressBarsPreview: React.FC<ProgressBarsPreviewProps> = ({ nodes, executionResults }) => {
    const progressNodes = nodes.filter(n => n.type === 'progress');

    if (progressNodes.length === 0) {
        return <div className="text-xs text-slate-400 italic p-4 text-center">No progress nodes found.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {progressNodes.map(node => {
                const data = node.data as ProgressNodeData;
                const result = executionResults.get(node.id);

                // Fallback to configured value if result is missing (not run yet) or use result if available
                // Note: Logic suggests result overrides config, but config might be input source?
                // For 'progress' node, it *calculates* a ratio. Let's assume result is the final { value, max, ratio } object or just number?
                // Checking NodeExecutor: executeProgressNode returns { current, max, ratio }.

                const value = result?.current ?? data.value ?? 0;
                const max = result?.max ?? data.max ?? 100;
                const ratio = result?.ratio ?? (value / max);
                const percent = Math.min(100, Math.max(0, ratio * 100));

                return (
                    <div key={node.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-slate-700">{data.label || 'Progress'}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                {value} / {max} ({Math.round(percent)}%)
                            </span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: data.color || '#10B981'
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
