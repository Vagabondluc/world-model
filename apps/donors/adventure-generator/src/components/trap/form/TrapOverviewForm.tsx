
import React, { FC } from 'react';
import { css } from '@emotion/css';

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
        gap: 12px; /* Increased from var(--space-s) for better visual separation */
        margin-bottom: var(--space-l);
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    input: css`
        width: 100%;
        /* Global styles in index.css handle appearance */
    `,
    textarea: css`
        width: 100%;
        min-height: 80px;
        resize: vertical;
        /* Global styles in index.css handle appearance */
    `,
};

interface TrapOverviewFormProps {
    name: string;
    description: string;
    onChange: (field: 'name' | 'description', value: string) => void;
}

export const TrapOverviewForm: FC<TrapOverviewFormProps> = ({ name, description, onChange }) => {
    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>📘 Overview</legend>
            <div className={styles.formControl}>
                <label className={styles.label}>Trap Name</label>
                <input 
                    className={styles.input}
                    type="text" 
                    value={name} 
                    onChange={e => onChange('name', e.target.value)} 
                />
            </div>
            <div className={styles.formControl}>
                <label className={styles.label}>Description</label>
                <textarea 
                    className={styles.textarea}
                    value={description} 
                    onChange={e => onChange('description', e.target.value)} 
                    rows={3}
                />
            </div>
        </fieldset>
    );
};
