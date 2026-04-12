
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { TrapRule } from '../../../types/trap';

const DAMAGE_TYPES = ['slashing', 'bludgeoning', 'piercing', 'fire', 'cold', 'lightning', 'poison', 'acid', 'thunder', 'force', 'radiant', 'necrotic', 'psychic'];

const styles = {
    formGrid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-l);
        margin-top: var(--space-m);
        padding-top: var(--space-m);
        border-top: 1px dashed var(--light-brown);

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 12px;
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
    `,
    select: css`
        width: 100%;
        cursor: pointer;
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-m);
    `,
    title: css`
        font-family: var(--header-font);
        font-size: 1.1rem;
        color: var(--dark-brown);
        margin: 0;
    `,
};

interface EffectRowProps {
    index: number;
    effect: TrapRule;
    onEffectChange: <K extends keyof TrapRule>(index: number, field: K, value: TrapRule[K]) => void;
    removeEffect: (index: number) => void;
    isOnlyEffect: boolean;
}

export const EffectRow: FC<EffectRowProps> = ({ index, effect, onEffectChange, removeEffect, isOnlyEffect }) => {
    const damageString = effect.damage || '';
    const parts = damageString.split(' ');
    let damageType = '';
    let dice = '';

    if (parts.length > 0 && parts[0] !== '') {
        const lastPart = parts[parts.length - 1].toLowerCase();
        if (DAMAGE_TYPES.includes(lastPart)) {
            damageType = lastPart;
            dice = parts.slice(0, -1).join(' ');
        } else {
            dice = damageString;
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <h4 className={styles.title}>Effect #{index + 1}</h4>
                <button type="button" className="secondary-button" style={{fontSize: '0.9rem', padding: '6px 12px'}} onClick={() => removeEffect(index)} disabled={isOnlyEffect}>🗑️ Remove</button>
            </div>
            <div className={styles.formGrid}>
                <div className={styles.formControl}>
                    <label className={styles.label}>Type</label>
                    <select className={styles.select} value={effect.type} onChange={e => onEffectChange(index, 'type', e.target.value as TrapRule['type'])}>
                        <option>Saving Throw</option>
                        <option>Attack Roll</option>
                    </select>
                </div>

                {effect.type === 'Saving Throw' ? (
                    <div className={styles.formControl}>
                        <label className={styles.label}>Save DC</label>
                        <input className={styles.input} type="number" value={effect.dc || ''} onChange={e => onEffectChange(index, 'dc', parseInt(e.target.value, 10) || undefined)} />
                    </div>
                ) : (
                    <div className={styles.formControl}>
                        <label className={styles.label}>Attack Bonus</label>
                        <input className={styles.input} type="number" value={effect.attackBonus || ''} onChange={e => onEffectChange(index, 'attackBonus', parseInt(e.target.value, 10) || undefined)} />
                    </div>
                )}

                {effect.type === 'Saving Throw' && (
                    <div className={styles.formControl}>
                        <label className={styles.label}>Save Stat</label>
                        <select className={styles.select} value={effect.stat} onChange={e => onEffectChange(index, 'stat', e.target.value as TrapRule['stat'])}>
                            <option>Strength</option><option>Dexterity</option><option>Constitution</option><option>Wisdom</option>
                        </select>
                    </div>
                )}

                <div className={styles.formControl}>
                    <label className={styles.label}>Damage Dice</label>
                    <input 
                        className={styles.input}
                        type="text" 
                        value={dice} 
                        onChange={e => {
                            const newDamageString = `${e.target.value} ${damageType}`.trim();
                            onEffectChange(index, 'damage', newDamageString);
                        }} 
                        placeholder="e.g., 2d10" 
                    />
                </div>

                <div className={styles.formControl}>
                    <label className={styles.label}>Damage Type</label>
                    <select 
                        className={styles.select}
                        value={damageType} 
                        onChange={e => {
                            const newDamageString = `${dice} ${e.target.value}`.trim();
                            onEffectChange(index, 'damage', newDamageString);
                        }}
                    >
                        <option value="">None</option>
                        {DAMAGE_TYPES.map(type => 
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        )}
                    </select>
                </div>

                <div className={styles.formControl}>
                    <label className={styles.label}>Condition</label>
                    <input className={styles.input} type="text" value={effect.condition || ''} onChange={e => onEffectChange(index, 'condition', e.target.value)} placeholder="e.g., Frightened" />
                </div>

                <div className={styles.formControl}>
                    <label className={styles.label}>Area of Effect</label>
                    <input className={styles.input} type="text" value={effect.area || ''} onChange={e => onEffectChange(index, 'area', e.target.value)} placeholder="e.g., 10-foot radius" />
                </div>
            </div>
        </div>
    );
};
