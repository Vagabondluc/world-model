
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useMonsterCreatorStore, Complexity } from '@/stores/monsterCreatorStore';

const styles = {
    section: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding: var(--space-m);
        background-color: #fff;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    `,
    header: css`
        font-family: var(--header-font);
        font-size: 1.2rem;
        color: var(--dnd-red);
        border-bottom: 2px solid var(--medium-brown);
        padding-bottom: 6px;
        margin: 0 0 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 6px;
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    select: css`
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 0.95rem;
        font-family: var(--body-font);
        color: var(--dark-brown);
        background-color: #fff;
        cursor: pointer;
        
        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
    `,
    sliderRow: css`
        display: grid;
        grid-template-columns: 100px 1fr 40px;
        align-items: center;
        gap: var(--space-m);
        margin-bottom: 4px;
        font-size: 0.9rem;
    `,
    slider: css`
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: var(--light-brown);
        border-radius: 3px;
        outline: none;
        
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--dnd-red);
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
    `,
    expandBtn: css`
        background: transparent;
        border: none;
        color: var(--medium-brown);
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;
        padding: 0;
        align-self: flex-start;
    `
};

export const ProceduralTuning: FC = () => {
    const store = useMonsterCreatorStore();
    const [showAdvanced, setShowAdvanced] = useState(true);

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <span>3. Procedural Tuning</span>
                <button className={styles.expandBtn} onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? 'Hide' : 'Show'}
                </button>
            </div>

            {showAdvanced && (
                <>
                    <div className={styles.formControl} style={{ marginBottom: 'var(--space-m)' }}>
                        <label className={styles.label}>Complexity</label>
                        <select
                            className={styles.select}
                            value={store.complexity}
                            onChange={e => store.setComplexity(e.target.value as Complexity)}
                        >
                            <option value="Simple">Simple (Fewer Traits)</option>
                            <option value="Standard">Standard</option>
                            <option value="Complex">Complex (More Traits/Actions)</option>
                        </select>
                    </div>

                    <label className={styles.label} style={{ marginBottom: 'var(--space-s)' }}>Power Budget Adjustment</label>
                    {(['Offense', 'Defense', 'Control', 'Mobility', 'Utility'] as const).map(axis => (
                        <div key={axis} className={styles.sliderRow}>
                            <span style={{ fontWeight: 600 }}>{axis}</span>
                            <input
                                type="range"
                                className={styles.slider}
                                min="-50"
                                max="50"
                                step="5"
                                value={store.budgetOverrides[axis]}
                                onChange={(e) => store.setBudgetOverride(axis, parseInt(e.target.value))}
                            />
                            <span style={{ textAlign: 'right', color: store.budgetOverrides[axis] !== 0 ? 'var(--dnd-red)' : 'inherit' }}>
                                {store.budgetOverrides[axis] > 0 ? '+' : ''}{store.budgetOverrides[axis]}%
                            </span>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
