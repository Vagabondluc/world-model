
import React from 'react';
import { NodeDefinition, NodeId, SuspensionData } from '@mi/types/nodeEditor.types';
import { RuntimeEngine } from './RuntimeEngine';
import { Play, CheckCircle2, AlertCircle } from 'lucide-react';

interface InteractiveNodeRendererProps {
    suspension: SuspensionData;
    node: NodeDefinition;
    runtime: RuntimeEngine;
}

export const InteractiveNodeRenderer: React.FC<InteractiveNodeRendererProps> = ({ suspension, node, runtime }) => {

    // Handler for Dice Roll
    const handleDiceRoll = () => {
        // In a real game, we'd roll and maybe show an animation first
        // Here we just resume with a simulated result or a real random number
        const result = Math.floor(Math.random() * 6) + 1; // Simple 1d6 for MVP
        runtime.resume(node.id, { roll: result, total: result });
    };

    // Handler for Choice
    const handleChoicePromise = (optionValue: any) => {
        runtime.resume(node.id, optionValue);
    };

    // Handler for Form (Simplified)
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real impl, we'd gather form data from inputs
        // For MVP, just sending an empty object or mock
        runtime.resume(node.id, { submitted: true, timestamp: Date.now() });
    };

    const renderContent = () => {
        const data = node.data as any;

        switch (node.type) {
            case 'diceRoll':
                return (
                    <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-4xl mb-4">🎲</div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{data.diceNotation || "1d6"}</h3>
                        <p className="text-sm text-slate-500 mb-6">{data.buttonText || "Roll the Dice"}</p>
                        <button
                            onClick={handleDiceRoll}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md flex items-center gap-2 mx-auto"
                        >
                            <Play size={16} /> Roll!
                        </button>
                    </div>
                );

            case 'choice':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-violet-50 text-violet-900 rounded-lg border border-violet-100 text-center italic">
                            "{data.message || "Make a decision..."}"
                        </div>
                        <div className="grid gap-2">
                            {(data.options || []).map((opt: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleChoicePromise(opt.value)}
                                    className={`
                                        w-full p-3 text-left rounded border transition-colors flex justify-between items-center group
                                        ${opt.variant === 'danger' ? 'border-red-200 hover:bg-red-50 text-red-700' :
                                            opt.variant === 'secondary' ? 'border-slate-200 hover:bg-slate-50 text-slate-700' :
                                                'border-blue-200 hover:bg-blue-50 text-blue-700'}
                                    `}
                                >
                                    <span className="font-medium">{opt.label}</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'form':
                return (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                {data.title || "Form"}
                            </h3>
                            {data.description && (
                                <p className="text-sm text-slate-500 mb-4">{data.description}</p>
                            )}

                            <div className="space-y-3">
                                {(data.fields || []).map((field: any) => (
                                    <div key={field.id}>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder={field.placeholder || "..."}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-800 text-white font-bold py-2 rounded hover:bg-slate-900 transition-colors flex justify-center items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> {data.submitLabel || "Submit"}
                        </button>
                    </form>
                );

            default:
                return (
                    <div className="p-4 bg-orange-50 text-orange-800 rounded border border-orange-200 flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>Unsupported Interactive Node: {node.type}</span>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 animate-in fade-in zoom-in duration-300">
            {renderContent()}
        </div>
    );
};
