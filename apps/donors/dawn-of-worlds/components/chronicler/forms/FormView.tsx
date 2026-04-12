import React, { useState, useEffect } from 'react';
import { ChroniclerForm, FormValues } from '../../../logic/chronicler/forms/types';
import { formManager } from '../../../logic/chronicler/forms/registry';
import { QuestionRenderer } from './QuestionRenderer';

interface FormViewProps {
    initialForm: ChroniclerForm;
    onAction: (actionId: string, finalForm: ChroniclerForm) => void;
}

export const FormView: React.FC<FormViewProps> = ({ initialForm, onAction }) => {
    const [form, setForm] = useState<ChroniclerForm>(initialForm);

    useEffect(() => {
        setForm(initialForm);
    }, [initialForm.id]);

    const handleChange = (questionId: string, val: any) => {
        const next = formManager.updateValue(form, questionId, val);
        setForm(next);
    };

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-10 duration-500">
            {/* Header */}
            <div className="space-y-2 border-b border-white/5 pb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{form.triggerType}</span>
                <h2 className="text-3xl font-display font-black text-white uppercase">{form.title}</h2>
                <p className="text-sm text-text-muted italic">{form.description}</p>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
                {form.sections.map(section => (
                    <div key={section.id} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-white/90">{section.title}</h3>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="space-y-6 pl-4 border-l-2 border-white/5">
                            {section.questions.map(q => (
                                <div key={q.id}>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                                        {q.label} {q.required && <span className="text-amber-500">*</span>}
                                    </label>
                                    <QuestionRenderer
                                        question={q}
                                        value={form.values[q.id]}
                                        onChange={(val) => handleChange(q.id, val)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                {form.actions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.id, form)}
                        disabled={action.disabled || (action.id === 'submit' && !form.isValid)}
                        className={`
                            px-8 py-3 rounded-xl font-bold transition-all
                            ${action.primary
                                ? 'bg-primary text-white shadow-glow hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
                                : 'bg-white/5 text-text-muted hover:bg-white/10'
                            }
                        `}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
