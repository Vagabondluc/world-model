
import React, { FC, memo } from 'react';
import { css, cx } from '@emotion/css';
import { Combatant, Condition, ConditionEnum } from '../../schemas/encounter';

const styles = {
    row: css`
        display: grid;
        grid-template-columns: 50px 2fr 1fr 1fr 2fr 50px;
        align-items: center;
        background: var(--card-bg);
        padding: var(--space-m);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        gap: var(--space-m);
        transition: all 0.2s;
        
        &.active {
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 2px var(--dnd-red);
            transform: scale(1.01);
        }
        &.dead {
            opacity: 0.6;
            background-color: #e0e0e0;
        }
    `,
    input: css`
        width: 100%;
        padding: 4px;
        margin: 0;
    `,
    condBadges: css`
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    `,
    condBadge: css`
        font-size: 0.7rem;
        background: var(--dnd-red);
        color: white;
        padding: 1px 4px;
        border-radius: 4px;
        cursor: pointer;
    `,
};

interface CombatantRowProps {
    combatant: Combatant;
    isActive: boolean;
    onUpdate: (id: string, data: Partial<Combatant>) => void;
    onRemove: (id: string) => void;
    onSetInitiative: (id: string, val: number) => void;
}

const CombatantRowComponent: FC<CombatantRowProps> = ({ combatant, isActive, onUpdate, onRemove, onSetInitiative }) => {
    const c = combatant;
    
    const toggleCondition = (condition: Condition) => {
        const hasCond = c.conditions.includes(condition);
        const newConds = hasCond 
            ? c.conditions.filter(x => x !== condition)
            : [...c.conditions, condition];
        onUpdate(c.id, { conditions: newConds });
    };

    return (
        <div 
            className={cx(styles.row, { 
                active: isActive,
                dead: c.hp <= 0 
            })}
        >
            <input 
                type="number" 
                className={styles.input} 
                value={c.initiative} 
                onChange={e => onSetInitiative(c.id, parseInt(e.target.value)||0)} 
            />
            <strong>{c.name}</strong>
            <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                <input 
                    type="number" 
                    className={styles.input} 
                    value={c.hp} 
                    onChange={e => onUpdate(c.id, { hp: parseInt(e.target.value)||0 })} 
                />
                <span style={{fontSize: '0.8rem', color: '#666'}}>/ {c.maxHp}</span>
            </div>
            <input 
                type="number" 
                className={styles.input} 
                value={c.ac} 
                onChange={e => onUpdate(c.id, { ac: parseInt(e.target.value)||0 })} 
            />
            <div className={styles.condBadges}>
                {c.conditions.map(cond => (
                    <span key={cond} className={styles.condBadge} onClick={() => toggleCondition(cond)}>
                        {cond} ×
                    </span>
                ))}
                <select 
                    style={{fontSize: '0.8rem', padding: '2px', width: 'auto'}}
                    onChange={(e) => {
                        if (e.target.value) toggleCondition(e.target.value as Condition);
                        e.target.value = "";
                    }}
                >
                    <option value="">+ Add...</option>
                    {ConditionEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
            <button 
                style={{background:'transparent', border:'none', cursor:'pointer', color: 'var(--error-red)'}}
                onClick={() => onRemove(c.id)}
            >
                ✖
            </button>
        </div>
    );
};

export const CombatantRow = memo(CombatantRowComponent);
