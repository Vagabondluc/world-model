
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { COMBINATION_METHODS } from '../../../../data/plotPatterns';

const styles = {
    optionGroup: css`
        margin-bottom: var(--space-l);
    `,
    gridSelector: css`
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-m);
    `,
    radioCard: css`
        flex: 1 1 200px;
        padding: var(--space-m);
        border: 2px solid var(--light-brown);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: var(--space-s);
        background-color: var(--parchment-bg);

        &:hover {
            border-color: var(--medium-brown);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
    `,
    radioCardSelected: css`
        border-color: var(--dnd-red) !important;
        background-color: var(--card-bg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `,
    cardCheckmark: css`
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--medium-brown);
        flex-shrink: 0;
        position: relative;
        margin-top: 2px;

        &::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--dnd-red);
            opacity: 0;
            transition: opacity 0.2s;
        }
    `,
    cardCheckmarkSelected: css`
        border-color: var(--dnd-red);
        &::after { opacity: 1; }
    `,
};

interface CombinationSelectorProps {
    selectedMethod: string;
    onChange: (method: string) => void;
}

export const CombinationSelector: FC<CombinationSelectorProps> = ({ selectedMethod, onChange }) => {
    const handleChange = (value: string) => {
        if (value === selectedMethod) {
            onChange('');
        } else {
            onChange(value);
        }
    };

    return (
        <div className={styles.optionGroup}>
            <label>Adventure Combination Method (Optional)</label>
            <div className={styles.gridSelector}>
                <label className={cx(styles.radioCard, { [styles.radioCardSelected]: !selectedMethod })}>
                    <input 
                        type="radio" 
                        name="combinationMethod" 
                        value="" 
                        checked={!selectedMethod} 
                        onChange={() => onChange('')} 
                    />
                    <div className={cx(styles.cardCheckmark, { [styles.cardCheckmarkSelected]: !selectedMethod })}></div>
                    <div>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>Single Plot</span>
                        <small style={{ color: 'var(--medium-brown)' }}>A standard adventure built around one core plot.</small>
                    </div>
                </label>
                {COMBINATION_METHODS.map(method => (
                    <label key={method.value} className={cx(styles.radioCard, { [styles.radioCardSelected]: selectedMethod === method.value })}>
                        <input 
                            type="radio" 
                            name="combinationMethod" 
                            value={method.value} 
                            checked={selectedMethod === method.value} 
                            onChange={() => handleChange(method.value)} 
                        />
                        <div className={cx(styles.cardCheckmark, { [styles.cardCheckmarkSelected]: selectedMethod === method.value })}></div>
                        <div>
                            <span style={{ fontWeight: 'bold', display: 'block' }}>{method.name}</span>
                            <small style={{ color: 'var(--medium-brown)' }}>{method.description}</small>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};
