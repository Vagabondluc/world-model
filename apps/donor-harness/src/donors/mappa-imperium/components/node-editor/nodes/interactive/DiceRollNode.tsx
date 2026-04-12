import React, { memo } from 'react';
import { BaseNode } from '../BaseNode';
import { DiceRollNodeData, NodeDefinition } from '@mi/types/nodeEditor.types';
// import DicePip from '@mi/components/shared/DicePip'; // Unused for now

interface DiceRollNodeProps {
    node: NodeDefinition;
    selected?: boolean;
    // ... pass-through props from NodeDispatcher
    onPortDragStart: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portId: string) => void;
    [key: string]: any;
}

export const DiceRollNode: React.FC<DiceRollNodeProps> = memo((props) => {
    const data = props.node.data as DiceRollNodeData;

    return (
        <BaseNode {...props}>
            <div className="p-2 flex flex-col items-center gap-2">
                <div className="text-center w-full py-2 bg-slate-50 rounded border border-slate-100 border-dashed">
                    <span className="text-xl font-bold text-slate-700 block text-center w-full">
                        {data.diceNotation || "1d6"}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {data.buttonText || "Roll Action"}
                    </span>
                </div>

                {data.resultTable && (
                    <div className="w-full mt-1 px-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Outcomes</div>
                        <div className="text-[10px] space-y-0.5 text-slate-600 max-h-20 overflow-y-auto custom-scrollbar">
                            {Object.entries(data.resultTable).map(([roll, result]) => (
                                <div key={roll} className="flex justify-between gap-2 border-b border-slate-50 last:border-0 py-0.5">
                                    <span className="font-mono text-slate-400">{roll}</span>
                                    <span className="truncate">{result}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </BaseNode>
    );
});

DiceRollNode.displayName = 'DiceRollNode';
