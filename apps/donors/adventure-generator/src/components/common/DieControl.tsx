
import React, { FC } from 'react';
import { css } from '@emotion/css';

const styles = {
    dieControl: css`
        display: grid;
        grid-template-columns: 40px 1fr 40px;
        align-items: center;
        text-align: center;
        gap: var(--space-s);
        
        span {
            font-weight: bold;
            font-size: 1.1rem;
        }
    `,
    controlButton: css`
        padding: var(--space-xs);
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--dark-brown);
        background-color: var(--card-bg);
        border: 1px solid var(--medium-brown);
        border-radius: 50%;
        cursor: pointer;
        width: 40px;
        height: 40px;
        line-height: 1;

        &:hover { background-color: var(--light-brown); }
    `,
};

interface DieControlProps {
    sides: number;
    count: number;
    onChange: (sides: number, amount: number) => void;
}

export const DieControl: FC<DieControlProps> = ({ sides, count, onChange }) => (
    <div className={styles.dieControl}>
        <button className={styles.controlButton} onClick={() => onChange(sides, -1)} aria-label={`Remove one d${sides}`}>-</button>
        <span>{count}d{sides}</span>
        <button className={styles.controlButton} onClick={() => onChange(sides, 1)} aria-label={`Add one d${sides}`}>+</button>
    </div>
);
