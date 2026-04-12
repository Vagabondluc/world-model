
import React, { FC, useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GeneratedTrap, TrapRule } from '../../types/trap';
import { TrapOverviewForm } from './form/TrapOverviewForm';
import { TrapEffectsForm } from './form/TrapEffectsForm';
import { TrapCountermeasuresForm } from './form/TrapCountermeasuresForm';
import { TrapSummary } from './form/TrapSummary';

interface TrapEditFormProps {
    trap: GeneratedTrap;
    onSave: (updatedTrap: GeneratedTrap) => void;
}

const styles = {
    workspace: css`
        width: 100%;
        text-align: left;
    `,
    formActions: css`
        display: flex;
        justify-content: flex-end;
        gap: var(--space-m);
        margin-top: var(--space-l);
        padding-top: var(--space-l);
        border-top: 1px solid var(--border-light);
    `,
};

export const TrapEditForm: FC<TrapEditFormProps> = ({ trap, onSave }) => {
    const [formData, setFormData] = useState<GeneratedTrap>(trap);

    useEffect(() => {
        setFormData(trap);
    }, [trap]);

    const handleFieldChange = <K extends keyof GeneratedTrap>(field: K, value: GeneratedTrap[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEffectChange = <K extends keyof TrapRule>(index: number, field: K, value: TrapRule[K]) => {
        setFormData(prev => {
            const newRules = [...prev.rules];
            newRules[index] = { ...newRules[index], [field]: value };
            return { ...prev, rules: newRules };
        });
    };

    const handleCountermeasureChange = <K extends keyof GeneratedTrap['countermeasures']['detection']>(
        type: 'detection' | 'disarm',
        field: K,
        value: GeneratedTrap['countermeasures']['detection'][K]
    ) => {
        setFormData(prev => ({
            ...prev,
            countermeasures: {
                ...prev.countermeasures,
                [type]: { ...prev.countermeasures[type], [field]: value }
            }
        }));
    };

    const addEffect = () => {
        const newRule: TrapRule = { type: 'Saving Throw', damage: '1d6' };
        setFormData(prev => ({
            ...prev,
            rules: [...prev.rules, newRule]
        }));
    };

    const removeEffect = (index: number) => {
        setFormData(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.workspace}>
            <TrapOverviewForm
                name={formData.name}
                description={formData.description}
                onChange={handleFieldChange}
            />

            <TrapEffectsForm
                effectDescription={formData.effect}
                effects={formData.rules}
                onEffectDescriptionChange={(value) => handleFieldChange('effect', value)}
                onEffectChange={handleEffectChange}
                addEffect={addEffect}
                removeEffect={removeEffect}
            />

            <TrapCountermeasuresForm
                countermeasures={formData.countermeasures}
                onChange={handleCountermeasureChange}
            />
            
            <TrapSummary trapData={formData} />

            <div className={styles.formActions}>
                <button type="button" className="secondary-button" onClick={() => alert('Coming Soon!')}>📋 Copy Markdown</button>
                <button type="submit" className="primary-button">Save Changes</button>
            </div>
        </form>
    );
};
