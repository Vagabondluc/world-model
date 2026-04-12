import React from 'react';
import { FormQuestion, FormValue } from '../../../logic/chronicler/forms/types';

interface QuestionRendererProps {
    question: FormQuestion;
    value: FormValue;
    onChange: (val: FormValue) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, value, onChange }) => {
    // Helpers
    const isSelected = (optionHeading: string) => {
        if (question.type === 'CHECKBOX') {
            return Array.isArray(value) && value.includes(optionHeading);
        }
        return value === optionHeading;
    };

    const handleToggle = (optionVal: string | number | boolean) => {
        if (question.type === 'CHECKBOX') {
            const current = Array.isArray(value) ? [...value] : [];
            const strVal = String(optionVal);
            if (current.includes(strVal)) {
                onChange(current.filter(v => v !== strVal));
            } else {
                onChange([...current, strVal]);
            }
        } else {
            onChange(optionVal);
        }
    };

    // Renderers
    if (question.type === 'RADIO' || question.type === 'CHECKBOX') {
        return (
            <div className="space-y-2">
                {question.options?.map(opt => (
                    <div
                        key={String(opt.value)}
                        onClick={() => handleToggle(opt.value)}
                        className={`
                            p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                            ${isSelected(String(opt.value))
                                ? 'bg-primary/20 border-primary text-white'
                                : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:border-white/20'
                            }
                        `}
                    >
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{opt.label}</span>
                            {opt.description && <span className="text-xs opacity-70">{opt.description}</span>}
                        </div>
                        <div className={`
                            size-4 rounded-full border flex items-center justify-center
                            ${isSelected(String(opt.value)) ? 'border-primary bg-primary' : 'border-white/30'}
                        `}>
                            {isSelected(String(opt.value)) && <div className="size-2 bg-white rounded-full" />}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (question.type === 'TEXT' || question.type === 'TEXTAREA') {
        return (
            <div className="space-y-2">
                {question.type === 'TEXT' ? (
                    <input
                        type="text"
                        value={String(value || '')}
                        onChange={e => onChange(e.target.value)}
                        className="w-full bg-bg-input border-b-2 border-white/10 p-3 text-lg font-bold text-white focus:border-primary focus:outline-none"
                    />
                ) : (
                    <textarea
                        value={String(value || '')}
                        onChange={e => onChange(e.target.value)}
                        className="w-full bg-bg-panel border border-white/5 p-4 rounded-xl text-md text-text-muted focus:border-primary focus:outline-none min-h-[100px]"
                    />
                )}
            </div>
        );
    }

    return <div className="text-red-500">Unsupported Question Type: {question.type}</div>;
};
