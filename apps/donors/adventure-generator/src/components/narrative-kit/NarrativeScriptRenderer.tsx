import React, { FC, useState, useMemo, useEffect } from 'react';
import { NarrativeCard } from './NarrativeCard';
import { NarrativeHeader } from './NarrativeHeader';
import { NarrativeGrid } from './NarrativeGrid';
import { NarrativeTextarea } from './NarrativeTextarea';
import { TacticalList } from './TacticalList';
import { UITacticalItem as TacticalItem } from '../../types/narrative-kit';
import { NarrativeFooter } from './NarrativeFooter';
import { css } from '@emotion/css';
import { NarrativeScriptDefinition, NarrativeSlot } from '../../services/markdownNarrativeService';
import { AiNarrativeService } from '../../services/aiNarrativeService';
import { theme } from '../../styles/theme';
import { z } from 'zod';

import { aiManager } from '../../services/ai/aiManager';

interface NarrativeScriptRendererProps {
    definition: NarrativeScriptDefinition;
    onBack?: () => void;
    onSave?: (data: Record<string, string>) => void;
}

export const NarrativeScriptRenderer: FC<NarrativeScriptRendererProps> = ({
    definition,
    onBack,
    onSave
}) => {
    // State to hold all slot values
    const [values, setValues] = useState<Record<string, string>>({});
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Initialize values from definition
    useEffect(() => {
        const initialValues: Record<string, string> = {};
        definition.sections.forEach(section => {
            section.slots.forEach(slot => {
                initialValues[slot.id] = slot.value;
            });
        });
        setValues(initialValues);
    }, [definition]);

    const handleValueChange = (id: string, value: string) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleFastFill = async () => {
        setIsAiLoading(true);
        try {
            // Build a prompt based on current values
            const context = Object.entries(values)
                .map(([id, val]) => {
                    const slot = definition.sections.flatMap(s => s.slots).find(s => s.id === id);
                    return slot?.label ? `${slot.label}: ${val}` : val;
                })
                .join('\n');

            const prompt = `
                Flesh out this narrative script based on these values:
                ${context}
                
                Keep the same structure but provide rich, creative D&D details.
                Return a JSON object where keys are the specific IDs provided (like name, quirk, etc).
            `;

            const result = await aiManager.generateStructured(
                prompt,
                z.record(z.string())
            );

            setValues(prev => ({ ...prev, ...result }));

        } catch (error) {
            console.error("Fast-Fill Failed", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const renderSlot = (slot: NarrativeSlot) => {
        const value = values[slot.id] || slot.value;

        if (slot.type === 'checkbox') {
            return (
                <div key={slot.id} className={css`display: flex; align-items: center; gap: 8px; margin: 4px 0;`}>
                    <input
                        type="checkbox"
                        checked={value === 'true'}
                        onChange={(e) => handleValueChange(slot.id, e.target.checked ? 'true' : 'false')}
                    />
                    {slot.label && <span className={css`font-size: 0.9rem;`}>{slot.label}</span>}
                </div>
            );
        }

        if (slot.type === 'button') {
            return (
                <button
                    key={slot.id}
                    className={css`
                        padding: 4px 12px;
                        border: 1px solid ${theme.borders.light};
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.85rem;
                        &:hover { background: #f9f9f9; }
                    `}
                    onClick={() => console.log('Button Clicked', slot.value)}
                >
                    {slot.value}
                </button>
            );
        }

        // Default to a NarrativeTextarea if it looks like a big block or has multiple shots in a row
        return (
            <NarrativeTextarea
                key={slot.id}
                label={slot.label || undefined}
                value={value}
                onChange={(v) => handleValueChange(slot.id, v)}
            />
        );
    };

    return (
        <NarrativeCard variant="default">
            <NarrativeHeader
                title={definition.title}
                onBack={onBack}
                onAiFastFill={handleFastFill}
                isLoading={isAiLoading}
            />

            <div className={css`display: flex; flex-direction: column; gap: 16px; margin: 20px 0;`}>
                {definition.sections.map((section, idx) => (
                    <div key={section.id} className={css`border-top: ${idx > 0 ? `1px solid ${theme.borders.light}` : 'none'}; padding-top: 16px;`}>
                        {section.title && <h4 className={css`margin: 0 0 12px 0; font-family: ${theme.fonts.header}; text-transform: uppercase; color: ${theme.colors.textMuted}; font-size: 0.8rem;`}>{section.title}</h4>}

                        <div className={css`display: flex; flex-direction: column; gap: 8px;`}>
                            {section.slots.map(slot => renderSlot(slot))}
                        </div>
                    </div>
                ))}
            </div>

            <NarrativeFooter
                leftActions={<button onClick={() => onSave?.(values)}>Save Script</button>}
                rightActions={<button style={{ fontWeight: 'bold' }}>Done</button>}
            />
        </NarrativeCard>
    );
};
