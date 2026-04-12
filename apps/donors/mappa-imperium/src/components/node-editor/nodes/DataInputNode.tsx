/**
 * Data Input Node
 * Allows user to enter static values (String, Number, JSON).
 */

import React, { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from './nodeDispatcher.types';

export const DataInputNode: React.FC<NodeComponentProps> = (props) => {
    const { node, onUpdate } = props;
    const data = node.data as any;
    const [value, setValue] = useState(data.value ?? '');
    const [dataType, setDataType] = useState<string>(data.dataType || 'string');

    // Sync local state if external data changes
    useEffect(() => {
        setValue(data.value ?? '');
        setDataType(data.dataType || 'string');
    }, [data.value, data.dataType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValue(e.target.value);
    };

    const handleElementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onUpdate?.(node.id, {
            data: { ...data, value: newValue, dataType }
        });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setDataType(newType);
        // Reset value for certain types if needed, or keep as string
        onUpdate?.(node.id, {
            data: { ...data, dataType: newType }
        });
    };

    const handleBlur = () => {
        // Parse JSON if needed
        let finalValue = value;
        if (dataType === 'number') finalValue = Number(value);
        if (dataType === 'json') {
            try {
                if (typeof value === 'string') finalValue = JSON.parse(value);
            } catch (e) {
                // Keep as string if invalid
            }
        }

        onUpdate?.(node.id, {
            data: { ...data, value: finalValue, dataType }
        });
    };

    // Mock Elements for Task 7.10
    const mockElements = ['Element A', 'Element B', 'Kingdom of Zeal', 'Ancient Ruins'];

    return (
        <BaseNode {...props}>
            <div className="flex flex-col gap-2">
                {/* Type Selector */}
                <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-slate-500">Type</label>
                    <select
                        className="text-xs border rounded px-1 py-0.5 bg-slate-50 outline-none"
                        value={dataType}
                        onChange={handleTypeChange}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="json">JSON</option>
                        <option value="elementRef">Element</option>
                    </select>
                </div>

                {/* Value Input */}
                <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Value</label>

                    {dataType === 'elementRef' ? (
                        <select
                            className="w-full text-sm border rounded px-2 py-1 bg-slate-50 outline-none"
                            value={value}
                            onChange={handleElementChange}
                            onBlur={handleBlur}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <option value="">Select Element...</option>
                            {mockElements.map(el => (
                                <option key={el} value={el}>{el}</option>
                            ))}
                        </select>
                    ) : dataType === 'json' || (dataType === 'string' && (data.multiline || value.length > 20)) ? (
                        <textarea
                            className="w-full text-sm border rounded px-2 py-1 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none resize-y min-h-[60px] font-mono"
                            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <input
                            type={dataType === 'number' ? 'number' : 'text'}
                            className="w-full text-sm border rounded px-2 py-1 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    )}
                </div>

                {/* Data Preview (Task 7.11) */}
                <div className="mt-1 pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-400 mb-0.5">Output Preview</div>
                    <div className="bg-slate-50 rounded p-1.5 border border-slate-100 text-[10px] font-mono text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                </div>
            </div>
        </BaseNode>
    );
};
