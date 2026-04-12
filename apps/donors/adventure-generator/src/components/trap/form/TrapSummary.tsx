
import React, { FC, useMemo } from 'react';
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
        margin-left: -8px; /* Counteract padding */
    `,
    summaryBox: css`
        background-color: var(--parchment-bg);
        border-left: 4px solid var(--dnd-red);
        padding: var(--space-m);
        font-family: var(--stat-body-font);
        font-size: 0.95rem;
        color: var(--dark-brown);
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        p {
            margin: 0;
        }
    `,
};

interface TrapSummaryProps {
    trapData: GeneratedTrap;
}

export const TrapSummary: FC<TrapSummaryProps> = ({ trapData }) => {
    const summaryText = useMemo(() => {
        const parts = trapData.rules.map(effect => {
            let effectSummary = '';
            if (effect.type === 'Saving Throw') {
                effectSummary += `Save: DC ${effect.dc || '?'} ${effect.stat || ''}`;
            } else {
                effectSummary += `Attack: +${effect.attackBonus || '?'}`;
            }
            effectSummary += `, Damage: ${effect.damage || 'None'}`;
            if (effect.condition) effectSummary += `, Condition: ${effect.condition}`;
            if (effect.area) effectSummary += `, Area: ${effect.area}`;
            return effectSummary;
        });

        return `Trigger: ${trapData.trigger} | ${parts.join('; ')} | Detection DC: ${trapData.countermeasures.detection.dc} | Disarm DC: ${trapData.countermeasures.disarm.dc}`;
    }, [trapData]);

    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>📜 Trap Summary</legend>
            <div className={styles.summaryBox}>
                <p>{summaryText}</p>
            </div>
        </fieldset>
    );
};
