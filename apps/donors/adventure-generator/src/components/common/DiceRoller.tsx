
import React, { FC, useState, useMemo } from 'react';
import { css, keyframes } from '@emotion/css';
import { DieControl } from './DieControl';

const roll_ani = keyframes`
  0% { transform: scale(1.5); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
`;

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
        font-family: var(--stat-body-font);
    `,
    resultDisplay: css`
        background-color: var(--parchment-bg);
        border: 2px solid var(--dark-brown);
        padding: var(--space-l);
        text-align: center;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
    `,
    total: css`
        font-size: 2.5rem;
        font-weight: bold;
        font-family: var(--header-font);
        animation: ${roll_ani} 0.5s ease-out;
    `,
    breakdown: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        margin-top: var(--space-s);
        word-break: break-all;
    `,
    controlsContainer: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    modifierControl: css`
        display: grid;
        grid-template-columns: 40px 1fr 40px;
        align-items: center;
        text-align: center;
        gap: var(--space-s);
        margin-top: var(--space-m);
        padding-top: var(--space-m);
        border-top: 1px solid var(--border-light);

        label {
             grid-column: 1 / -1;
             text-align: center;
             margin-bottom: var(--space-s);
             font-weight: bold;
             font-family: var(--header-font);
             font-size: 1rem;
        }

        span {
            font-size: 1.5rem;
            font-weight: bold;
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
    specialRolls: css`
        margin-top: var(--space-l);
        padding-top: var(--space-l);
        border-top: 1px solid var(--border-light);
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        
        h4 {
            text-align: center;
            margin-bottom: var(--space-s);
            font-weight: bold;
            font-family: var(--header-font);
            font-size: 1rem;
        }

        button {
            background-color: transparent;
            color: var(--dark-brown);
            border: 1px solid var(--dark-brown);
            font-size: 0.9rem;
            padding: var(--space-s);
            width: 100%;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: var(--header-font);

            &:hover:not(:disabled) {
                background-color: var(--dark-brown);
                color: var(--parchment-bg);
            }
        }
    `,
    actionButtons: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        margin-top: var(--space-m);
    `
};

export const DiceRoller: FC = () => {
    const [formula, setFormula] = useState<Record<string, number>>({});
    const [modifier, setModifier] = useState(0);
    const [result, setResult] = useState<{ id: string; total: number; breakdown: string } | null>(null);

    const handleDieChange = (sides: number, amount: number) => {
        setFormula(prev => {
            const newFormula = { ...prev };
            const currentCount = newFormula[sides] || 0;
            const newCount = Math.max(0, currentCount + amount);
            if (newCount === 0) {
                delete newFormula[sides];
            } else {
                newFormula[sides] = newCount;
            }
            return newFormula;
        });
    };

    const handleRoll = () => {
        let total = modifier;
        const breakdownParts: string[] = [];
        const allRolls: number[] = [];

        Object.entries(formula).forEach(([sidesStr, count]: [string, number]) => {
            const sides = parseInt(sidesStr);
            const rolls = [];
            for (let i = 0; i < count; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push(roll);
                allRolls.push(roll);
            }
            if(rolls.length > 0) {
                breakdownParts.push(`${count}d${sides}: [${rolls.join(', ')}]`);
            }
            total += rolls.reduce((a, b) => a + b, 0);
        });

        if (allRolls.length === 0 && modifier === 0) {
            return;
        }

        const breakdown = `Rolls: ${breakdownParts.join(' | ')}` + 
                          (modifier !== 0 ? ` | Modifier: ${modifier > 0 ? '+' : ''}${modifier}` : '');

        setResult({ id: crypto.randomUUID(), total, breakdown });
    };

    const handleClear = () => {
        setFormula({});
        setModifier(0);
        setResult(null);
    };

    const handleAdvantageDisadvantage = (isAdvantage: boolean) => {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        const total = isAdvantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
        const breakdown = `${isAdvantage ? 'Advantage' : 'Disadvantage'}: [${roll1}, ${roll2}]`;
        
        setResult({ id: crypto.randomUUID(), total, breakdown });
    };

    const handleAbilityScoreRoll = () => {
        const rolls: number[] = [];
        for (let i = 0; i < 4; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        
        const sortedRolls = [...rolls].sort((a, b) => a - b);
        const lowest = sortedRolls[0];
        const keptRolls = sortedRolls.slice(1);
        const total = keptRolls.reduce((sum, val) => sum + val, 0);
        const breakdown = `4d6 drop lowest: [${rolls.join(', ')}] -> Dropped ${lowest}`;

        setResult({ id: crypto.randomUUID(), total, breakdown });
    };

    const formulaString = useMemo(() => {
        const parts = Object.entries(formula)
            .sort((a: [string, number], b: [string, number]) => parseInt(a[0]) - parseInt(b[0]))
            .map(([sides, count]: [string, number]) => `${count}d${sides}`);
        
        if (modifier !== 0) {
            parts.push(modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`);
        }
        
        return parts.join(' + ').replace(/\+ -/g, '-');
    }, [formula, modifier]);


    return (
        <div className={styles.container}>
            <div className={styles.resultDisplay}>
                {result ? (
                    <>
                        <div className={styles.total} key={result.id}>{result.total}</div>
                        <div className={styles.breakdown}>{result.breakdown}</div>
                    </>
                ) : (
                    <span>{formulaString || 'Build your roll!'}</span>
                )}
            </div>

            <div className={styles.controlsContainer}>
                {[4, 6, 8, 10, 12, 20].map(sides => (
                    <DieControl 
                        key={sides}
                        sides={sides}
                        count={formula[sides] || 0}
                        onChange={handleDieChange}
                    />
                ))}
            </div>

            <div className={styles.modifierControl}>
                <label>Modifier</label>
                <button className={styles.controlButton} onClick={() => setModifier(m => m - 1)} aria-label="Decrement modifier">-</button>
                <span>{modifier}</span>
                <button className={styles.controlButton} onClick={() => setModifier(m => m + 1)} aria-label="Increment modifier">+</button>
            </div>

            <div className={styles.specialRolls}>
                <h4>Common Rolls</h4>
                <button onClick={() => handleAdvantageDisadvantage(true)}>d20 with Advantage</button>
                <button onClick={() => handleAdvantageDisadvantage(false)}>d20 with Disadvantage</button>
                <button onClick={handleAbilityScoreRoll}>Ability Score (4d6, drop lowest)</button>
            </div>
            
            <div className={styles.actionButtons}>
                <button className="secondary-button" onClick={handleClear}>Clear</button>
                <button className="primary-button" onClick={handleRoll}>Roll</button>
            </div>
        </div>
    );
};
