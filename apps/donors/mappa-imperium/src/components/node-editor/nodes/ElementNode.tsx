import React from 'react';
import { BaseNode } from './BaseNode';


import {
    ResourceNodeData,
    DeityNodeData,
    LocationNodeData,
    FactionNodeData
} from '@/types/nodeEditor.types';
import { Edit } from 'lucide-react';
import { NodeComponentProps } from './nodeDispatcher.types';



export const ElementNode: React.FC<NodeComponentProps> = (props) => {
    const { node } = props;
    const data = node.data as any; // Cast to access fields

    const renderContent = () => {
        switch (node.type) {
            case 'resource':
            case 'resourceInput': {
                const resData = data as ResourceNodeData;
                return (
                    <div className="text-xs text-slate-600">
                        <div className="font-medium">Type: {(resData.element as any)?.type || 'Generic'}</div>
                        <div>Rarity: {(resData.element as any)?.rarity || 'Common'}</div>
                    </div>
                );
            }
            case 'deity':
            case 'deityInput': {
                const deityData = data as DeityNodeData;
                return (
                    <div className="text-xs text-slate-600">
                        <div className="font-medium">Domain: {(deityData.element as any)?.domain || 'Unknown'}</div>
                        <div>Alignment: {(deityData.element as any)?.alignment || 'Neutral'}</div>
                    </div>
                );
            }
            case 'location':
            case 'locationInput': {
                const locData = data as LocationNodeData;
                return (
                    <div className="text-xs text-slate-600">
                        {/* Placeholder fields based on common location props */}
                        <div className="font-medium">Region: {(locData.element as any)?.region || 'Global'}</div>
                    </div>
                );
            }
            case 'faction':
            case 'factionInput': {
                const facData = data as FactionNodeData;
                return (
                    <div className="text-xs text-slate-600">
                        <div className="font-medium">Type: {(facData.element as any)?.factionType || 'Group'}</div>
                    </div>
                );
            }
            case 'settlement':
            case 'settlementInput': {
                return (
                    <div className="text-xs text-slate-600">
                        <div className="italic">Population: {(data.element?.population || 0).toLocaleString()}</div>
                    </div>
                );
            }
            case 'event':
            case 'eventInput': {
                return (
                    <div className="text-xs text-slate-600">
                        <div>Date: {data.element?.date || 'TBD'}</div>
                    </div>
                );
            }
            case 'character':
            case 'characterInput': {
                return (
                    <div className="text-xs text-slate-600">
                        <div>Role: {data.element?.role || 'NPC'}</div>
                    </div>
                );
            }
            case 'war':
            case 'warInput': {
                return (
                    <div className="text-xs text-slate-600">
                        <div>Status: {data.element?.status || 'Active'}</div>
                    </div>
                );
            }
            case 'monument':
            case 'monumentInput': {
                return (
                    <div className="text-xs text-slate-600">
                        <div>Condition: {data.element?.condition || 'Intact'}</div>
                    </div>
                );
            }
            default:
                return <div className="text-xs text-slate-400 italic">No details available</div>;
        }
    };

    return (
        <BaseNode
            node={props.node}
            selected={props.node.selected}
            onSelect={props.onSelect}
            onDelete={props.onDelete}
            onDuplicate={props.onDuplicate}
            onInitDrag={props.onInitDrag}
            onPortDragStart={props.onPortDragStart}
            onPortMouseUp={props.onPortMouseUp}
            width={240} // Element nodes are a bit narrower than big logic tables
        >
            <div className="flex flex-col gap-2">
                {/* Image/Icon Placeholder if we had one, or just text properties */}
                {renderContent()}

                {/* Control Footer */}
                <div className="flex justify-end gap-1 mt-2 pt-2 border-t border-slate-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onEdit?.(node.id);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600"
                        title="Edit Element"
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    {/* Delete is handled by header usually, but maybe specific actions here */}
                </div>
            </div>
        </BaseNode>
    );
};
