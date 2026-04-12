
import React, { memo } from 'react';
import { BaseNode } from '../BaseNode';
import { NodeDefinition, StepNodeData } from '@mi/types/nodeEditor.types';
import { Circle } from 'lucide-react';

interface StepNodeProps {
    node: NodeDefinition;
    selected?: boolean;
    onPortDragStart: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    [key: string]: any;
}

export const StepNode: React.FC<StepNodeProps> = memo((props) => {
    const data = props.node.data as StepNodeData;

    return (
        <BaseNode {...props}>
            <div className="p-3">
                <div className="flex items-start gap-2 mb-2">
                    <div className="mt-0.5 text-blue-500">
                        <Circle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            ID: {data.stepId || "step_id"}
                        </div>
                    </div>
                </div>

                {data.description && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        {data.description}
                    </div>
                )}

                {data.skippable && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        Optional Step
                    </div>
                )}
            </div>
        </BaseNode>
    );
});

StepNode.displayName = 'StepNode';
