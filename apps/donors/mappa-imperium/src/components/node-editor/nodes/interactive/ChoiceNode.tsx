
import React, { memo } from 'react';
import { BaseNode } from '../BaseNode';
import { ChoiceNodeData, NodeDefinition } from '@/types/nodeEditor.types';
// import { Split } from 'lucide-react';

interface ChoiceNodeProps {
    node: NodeDefinition;
    selected?: boolean;
    onPortDragStart: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    [key: string]: any;
}

export const ChoiceNode: React.FC<ChoiceNodeProps> = memo((props) => {
    const data = props.node.data as ChoiceNodeData;
    const options = data.options || [];

    return (
        <BaseNode {...props}>
            <div className="p-2 space-y-2">
                <div className="text-xs text-slate-700 italic border-l-2 border-violet-300 pl-2 bg-violet-50 py-1 rounded-r">
                    "{data.message || "Make a choice..."}"
                </div>

                <div className="space-y-1 pt-1">
                    {options.map(opt => (
                        <div key={opt.id} className={`
                            flex items-center justify-between text-[10px] px-2 py-1.5 rounded border
                            ${opt.variant === 'danger' ? 'bg-red-50 border-red-100 text-red-700' :
                                opt.variant === 'secondary' ? 'bg-slate-50 border-slate-200 text-slate-600' :
                                    'bg-violet-50 border-violet-100 text-violet-700 font-medium'}
                        `}>
                            <span>{opt.label}</span>
                            <span className="text-[9px] opacity-60">→</span>
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div className="text-[10px] text-slate-400 italic text-center">
                            No options configured
                        </div>
                    )}
                </div>
            </div>
        </BaseNode>
    );
});

ChoiceNode.displayName = 'ChoiceNode';
