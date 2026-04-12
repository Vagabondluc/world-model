import React, { FC } from 'react';
import { GeneratorControls } from '../../../adventure/framework/GeneratorControls';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { useAppContext } from '../../../../context/AppContext';

const styles = {
    formControl: {
        marginBottom: 'var(--space-l)',
    },
    label: {
        display: 'block',
        marginBottom: 'var(--space-s)',
        fontWeight: 'bold',
    },
};

interface EncounterStageSimpleControlsProps {
    stage: string;
    label: string;
    options: Record<string, { description: string }>;
    selectedValue: string;
    onValueChange: (value: string) => void;
    onGenerate: () => void;
}

export const EncounterStageSimpleControls: FC<EncounterStageSimpleControlsProps> = ({
    stage,
    label,
    options,
    selectedValue,
    onValueChange,
    onGenerate
}) => {
    const { apiService } = useAppContext();
    const { nodes, generateAIDraftAction, aiLoadingStage } = useEncounterWizardStore();

    // Normalize stage string to match EncounterStageEnum (e.g. 'twist' -> 'Twist')
    const stageKey = stage.charAt(0).toUpperCase() + stage.slice(1);
    const node = nodes.find(n => n.stage === stageKey);
    const isAiLoading = aiLoadingStage === stageKey;

    const handleGenerateAI = () => {
        if (apiService && node) {
            generateAIDraftAction(apiService, node.id);
        }
    };

    return (
        <GeneratorControls>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor={`${stage}-type`}>{label}</label>
                    <select
                        id={`${stage}-type`}
                        value={selectedValue}
                        onChange={(e) => onValueChange(e.target.value)}
                    >
                        <option value="">-- Select a {label.toLowerCase().replace(' type', '')} --</option>
                        {Object.entries(options).map(([type, data]) => (
                            <option key={type} value={type}>{type} - {(data as { description: string }).description}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-l)', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-m)' }}>
                        <button
                            className="primary-button"
                            onClick={onGenerate}
                            disabled={!selectedValue}
                        >
                            Generate Draft
                        </button>
                        <button
                            className="secondary-button"
                            onClick={handleGenerateAI}
                            disabled={!node || isAiLoading}
                        >
                            {isAiLoading ? <><span className="loader"></span> Enhancing...</> : '✨ Enhance with AI'}
                        </button>
                    </div>
                </div>
            </div>
        </GeneratorControls>
    );
};