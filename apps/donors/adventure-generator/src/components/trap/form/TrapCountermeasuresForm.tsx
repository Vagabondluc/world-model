
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { GeneratedTrap } from '../../../types/trap';

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
    formGrid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-l);
        margin-bottom: var(--space-m);

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 12px; /* Increased from var(--space-s) */
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
    input: css`
        width: 100%;
        /* Global styles in index.css */
    `,
    sectionTitle: css`
        font-family: var(--header-font);
        font-size: 1.1rem;
        color: var(--dnd-red);
        margin-top: 0;
        margin-bottom: var(--space-m);
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 4px;
    `,
    subSection: css`
        margin-bottom: var(--space-xl);
        &:last-child { margin-bottom: 0; }
    `
};


interface TrapCountermeasuresFormProps {
    countermeasures: GeneratedTrap['countermeasures'];
    onChange: <K extends keyof GeneratedTrap['countermeasures']['detection']>(
        type: 'detection' | 'disarm',
        field: K,
        value: GeneratedTrap['countermeasures']['detection'][K]
    ) => void;
}

export const TrapCountermeasuresForm: FC<TrapCountermeasuresFormProps> = ({ countermeasures, onChange }) => {
    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>🧩 Countermeasures</legend>
             
            <div className={styles.subSection}>
                <h4 className={styles.sectionTitle}>Detection</h4>
                <div className={styles.formGrid}>
                    <div className={styles.formControl}>
                        <label className={styles.label}>Required Skill</label>
                        <input className={styles.input} type="text" value={countermeasures.detection.skill} onChange={e => onChange('detection', 'skill', e.target.value)} />
                    </div>
                    <div className={styles.formControl}>
                        <label className={styles.label}>Check DC</label>
                        <input className={styles.input} type="number" value={countermeasures.detection.dc} onChange={e => onChange('detection', 'dc', parseInt(e.target.value, 10) || 0)} />
                    </div>
                </div>
                <div className={styles.formControl}>
                    <label className={styles.label}>Detection Details</label>
                    <input className={styles.input} type="text" value={countermeasures.detection.details} onChange={e => onChange('detection', 'details', e.target.value)} />
                </div>
            </div>
            
            <div className={styles.subSection}>
                <h4 className={styles.sectionTitle}>Disarmament</h4>
                <div className={styles.formGrid}>
                     <div className={styles.formControl}>
                        <label className={styles.label}>Required Skill</label>
                        <input className={styles.input} type="text" value={countermeasures.disarm.skill} onChange={e => onChange('disarm', 'skill', e.target.value)} />
                    </div>
                     <div className={styles.formControl}>
                        <label className={styles.label}>Disarm DC</label>
                        <input className={styles.input} type="number" value={countermeasures.disarm.dc} onChange={e => onChange('disarm', 'dc', parseInt(e.target.value, 10) || 0)} />
                    </div>
                </div>
                <div className={styles.formControl}>
                    <label className={styles.label}>Disarm Details</label>
                    <input className={styles.input} type="text" value={countermeasures.disarm.details} onChange={e => onChange('disarm', 'details', e.target.value)} />
                </div>
            </div>
        </fieldset>
    );
};
