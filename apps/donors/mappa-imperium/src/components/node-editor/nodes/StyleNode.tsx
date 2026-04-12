/**
 * Style Node
 * Configures visual styles for elements.
 */

import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from './DataInputNode';
import { StyleNodeData } from '@/types/nodeEditor.types';

export const StyleNode: React.FC<NodeComponentProps> = (props) => {
    const { node, onUpdate } = props;
    const data = node.data as StyleNodeData;

    const updateData = (updates: Partial<StyleNodeData>) => {
        onUpdate?.(node.id, {
            data: { ...data, ...updates }
        });
    };

    return (
        <BaseNode {...props}>
            <div className="flex flex-col gap-3">

                {/* Dimensions Sliders */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Height</span>
                        <span>{data.height ?? 24}px</span>
                    </div>
                    <input
                        type="range" min="12" max="64" step="4"
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        value={data.height ?? 24}
                        onChange={(e) => updateData({ height: Number(e.target.value) })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Radius</span>
                        <span>{data.radius ?? 4}px</span>
                    </div>
                    <input
                        type="range" min="0" max="32" step="2"
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        value={data.radius ?? 4}
                        onChange={(e) => updateData({ radius: Number(e.target.value) })}
                    />
                </div>

                {/* Colors */}
                <div className="flex justify-between gap-2">
                    <div className="flex flex-col gap-1 items-center flex-1">
                        <span className="text-xs text-slate-500">Background</span>
                        <input
                            type="color"
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            value={data.backgroundColor || '#ffffff'}
                            onChange={(e) => updateData({ backgroundColor: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1 items-center flex-1">
                        <span className="text-xs text-slate-500">Text</span>
                        <input
                            type="color"
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            value={data.textColor || '#000000'}
                            onChange={(e) => updateData({ textColor: e.target.value })}
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="pt-2 border-t border-slate-100 mt-1">
                    <label className="text-xs text-slate-400 block mb-2">Preview</label>
                    <div className="flex justify-center items-center bg-slate-50 rounded p-4 border border-slate-100 border-dashed">
                        <div
                            className="px-4 flex items-center justify-center font-medium shadow-sm transition-all duration-300"
                            style={{
                                height: `${Math.max(12, data.height ?? 24)}px`,
                                borderRadius: `${data.radius ?? 4}px`,
                                backgroundColor: data.backgroundColor || '#ffffff',
                                color: data.textColor || '#000000',
                                minWidth: '80px',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                        >
                            <span style={{ fontSize: '12px' }}>Sample</span>
                        </div>
                    </div>
                </div>

            </div>
        </BaseNode>
    );
};
