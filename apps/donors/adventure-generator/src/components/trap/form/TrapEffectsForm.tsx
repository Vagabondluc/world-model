
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { TrapRule } from '../../../types/trap';
import { EffectRow } from './EffectRow';

const styles = {
    fieldset: css`
        border: none;
        border-top: 2px solid var(--medium-brown);
        padding: var(--space-l) var(--space-m);
        margin-bottom: var(--space-l);
        background: rgba(0,0,0,0.02);
        border-radius: var(--border-radius);
    `,
    legend: css`
        font-family: var(--header-font);
        font-size: 1.4rem;
        color: var(--dark-brown);
        padding: 0 var(--space-m);
        margin-left: -8px;
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: var(--space-m);
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    textarea: css`
        width: 100%;
        min-height: 60px;
        resize: vertical;
    `,
    effectsContainer: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `
};

interface TrapEffectsFormProps {
    effectDescription: string;
    effects: Array<TrapRule>;
    onEffectDescriptionChange: (value: string) => void;
    onEffectChange: <K extends keyof TrapRule>(index: number, field: K, value: TrapRule[K]) => void;
    addEffect: () => void;
    removeEffect: (index: number) => void;
}

export const TrapEffectsForm: FC<TrapEffectsFormProps> = ({ 
    effectDescription,
    effects,
    onEffectDescriptionChange,
    onEffectChange,
    addEffect,
    removeEffect,
}) => {
    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>🔥 Effect & Mechanics</legend>
            
            <div className={styles.formControl}>
                <label className={styles.label}>Effect Description</label>
                <textarea 
                    className={styles.textarea}
                    value={effectDescription} 
                    onChange={e => onEffectDescriptionChange(e.target.value)} 
                    rows={3}
                />
            </div>
            
            <div className={styles.effectsContainer}>
                {effects.map((effect, index) => (
                    <EffectRow
                        key={index}
                        index={index}
                        effect={effect}
                        onEffectChange={onEffectChange}
                        removeEffect={removeEffect}
                        isOnlyEffect={effects.length <= 1}
                    />
                ))}
            </div>

            <div style={{marginTop: 'var(--space-l)', display: 'flex', justifyContent: 'flex-end'}}>
                <button type="button" className="action-button" style={{fontSize: '0.9rem', padding: '6px 12px'}} onClick={addEffect}>➕ Add Effect</button>
            </div>
        </fieldset>
    );
};
