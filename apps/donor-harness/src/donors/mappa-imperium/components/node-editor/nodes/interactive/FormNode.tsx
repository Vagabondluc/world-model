
import React, { memo } from 'react';
import { BaseNode } from '../BaseNode';
import { FormNodeData, NodeDefinition } from '@mi/types/nodeEditor.types';
import { ClipboardList } from 'lucide-react';

interface FormNodeProps {
    node: NodeDefinition;
    selected?: boolean;
    onPortDragStart: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    [key: string]: any;
}

export const FormNode: React.FC<FormNodeProps> = memo((props) => {
    const data = props.node.data as FormNodeData;
    const fields = data.fields || [];

    return (
        <BaseNode {...props}>
            <div className="p-2 space-y-2">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-700 truncate">{data.title || "Untitled Form"}</div>
                        {data.description && <div className="text-[10px] text-slate-500 truncate">{data.description}</div>}
                    </div>
                </div>

                {fields.length > 0 ? (
                    <div className="space-y-1">
                        {fields.slice(0, 4).map(field => (
                            <div key={field.id} className="flex items-center justify-between text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                <span className="font-medium truncate max-w-[120px]">{field.label}</span>
                                <span className="text-slate-400 text-[9px] uppercase tracking-wider">{field.type}</span>
                            </div>
                        ))}
                        {fields.length > 4 && (
                            <div className="text-[10px] text-center text-slate-400 italic pt-1">
                                + {fields.length - 4} more fields
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-[10px] text-slate-400 italic text-center py-2 bg-slate-50 rounded">
                        No fields configured
                    </div>
                )}

                <div className="mt-2 pt-1 border-t border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {data.submitLabel || "Submit"}
                    </span>
                </div>
            </div>
        </BaseNode>
    );
});

FormNode.displayName = 'FormNode';
