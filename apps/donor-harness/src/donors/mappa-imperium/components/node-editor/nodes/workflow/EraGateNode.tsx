
import React, { memo } from 'react';
import { BaseNode } from '../BaseNode';
import { NodeDefinition, EraGateNodeData } from '@mi/types/nodeEditor.types';
import { DoorOpen, Lock } from 'lucide-react';

interface EraGateNodeProps {
    node: NodeDefinition;
    selected?: boolean;
    onPortDragStart: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    [key: string]: any;
}

export const EraGateNode: React.FC<EraGateNodeProps> = memo((props) => {
    const data = props.node.data as EraGateNodeData;
    const targetEra = data.targetEra || 1;

    // Era colors (matching the main app theme roughly)
    const eraColors: Record<number, string> = {
        1: 'bg-amber-100 text-amber-800 border-amber-200',
        2: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        3: 'bg-sky-100 text-sky-800 border-sky-200',
        4: 'bg-purple-100 text-purple-800 border-purple-200',
        5: 'bg-rose-100 text-rose-800 border-rose-200',
        6: 'bg-slate-100 text-slate-800 border-slate-200',
        7: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };

    const colorClass = eraColors[targetEra] || 'bg-slate-100 text-slate-800 border-slate-200';

    return (
        <BaseNode {...props}>
            <div className="p-2">
                <div className={`flex items-center gap-2 p-2 rounded-md border ${colorClass} mb-2`}>
                    <DoorOpen size={16} />
                    <div className="font-bold text-xs uppercase tracking-wider">
                        To Era {targetEra}
                    </div>
                </div>

                <div className="text-center px-1">
                    {data.criteriaDescription ? (
                        <div className="text-[10px] text-slate-500 italic">
                            "{data.criteriaDescription}"
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                            <Lock size={10} />
                            <span>Requirements locked</span>
                        </div>
                    )}
                </div>
            </div>
        </BaseNode>
    );
});

EraGateNode.displayName = 'EraGateNode';
