import React, { FC, useState, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { useEncounterStore } from '../../stores/encounterStore';
import { XP_THRESHOLDS_BY_LEVEL, getEncounterMultiplier } from '../../data/encounterRules';

const styles = {
    container: css`
        margin-top: var(--space-l);
        padding: var(--space-l);
        border: 2px solid var(--medium-brown);
        border-radius: var(--border-radius);
        background-color: var(--card-bg);
    `,
    header: css`
        font-family: var(--header-font);
        font-size: 1.5rem;
        margin: 0 0 var(--space-l) 0;
        color: var(--dark-brown);
    `,
    grid: css`
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--space-l);
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,
    partyConfig: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        .form-group {
            margin-bottom: 0;
            label { font-size: 0.9rem; }
        }
    `,
    results: css`
        background-color: rgba(0,0,0,0.03);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
    `,
    resultRow: css`
        display: flex;
        justify-content: space-between;
        padding: var(--space-s) 0;
        border-bottom: 1px dashed var(--light-brown);
        &:last-child { border-bottom: none; }
    `,
    difficultyDisplay: css`
        font-size: 1.5rem;
        font-weight: bold;
        font-family: var(--header-font);
        padding: var(--space-s);
        border-radius: 4px;
        text-align: center;
    `,
    trivial: css` color: #666; `,
    easy: css` color: #4CAF50; `,
    medium: css` color: #FFC107; `,
    hard: css` color: #FF9800; `,
    deadly: css` color: #F44336; `,
};

const DIFFICULTY_STYLES: Record<string, string> = {
    Trivial: styles.trivial,
    Easy: styles.easy,
    Medium: styles.medium,
    Hard: styles.hard,
    Deadly: styles.deadly,
};

export const EncounterBalancer: FC = () => {
    const combatants = useEncounterStore(s => s.combatants);
    const [playerCount, setPlayerCount] = useState(4);
    const [playerLevel, setPlayerLevel] = useState(5);

    const { thresholds, totalXp, monsterCount, multiplier, adjustedXp, difficulty } = useMemo(() => {
        const levelThresholds = XP_THRESHOLDS_BY_LEVEL[playerLevel] || XP_THRESHOLDS_BY_LEVEL[1];
        const thresholds = {
            easy: levelThresholds.easy * playerCount,
            medium: levelThresholds.medium * playerCount,
            hard: levelThresholds.hard * playerCount,
            deadly: levelThresholds.deadly * playerCount,
        };

        const npcCombatants = combatants.filter(c => c.type === 'npc');
        const monsterCount = npcCombatants.length;
        const totalXp = npcCombatants.reduce((sum, c) => sum + (c.xp || 0), 0);
        
        const multiplier = getEncounterMultiplier(monsterCount);
        const adjustedXp = Math.floor(totalXp * multiplier);

        let difficulty = 'Trivial';
        if (adjustedXp >= thresholds.deadly) difficulty = 'Deadly';
        else if (adjustedXp >= thresholds.hard) difficulty = 'Hard';
        else if (adjustedXp >= thresholds.medium) difficulty = 'Medium';
        else if (adjustedXp >= thresholds.easy) difficulty = 'Easy';

        return { thresholds, totalXp, monsterCount, multiplier, adjustedXp, difficulty };
    }, [combatants, playerCount, playerLevel]);

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>Encounter Balancer</h3>
            <div className={styles.grid}>
                <div className={styles.partyConfig}>
                    <div className="form-group">
                        <label>Number of Players</label>
                        <input type="number" value={playerCount} onChange={e => setPlayerCount(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
                    </div>
                    <div className="form-group">
                        <label>Average Player Level</label>
                        <input type="number" value={playerLevel} onChange={e => setPlayerLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} min="1" max="20" />
                    </div>
                </div>
                <div className={styles.results}>
                    <div className={styles.resultRow}>
                        <span>XP Thresholds</span>
                        <small>E:{thresholds.easy} / M:{thresholds.medium} / H:{thresholds.hard} / D:{thresholds.deadly}</small>
                    </div>
                    <div className={styles.resultRow}>
                        <span>Total Monster XP</span>
                        <span>{totalXp}</span>
                    </div>
                    <div className={styles.resultRow}>
                        <span>Multiplier (x{monsterCount} monsters)</span>
                        <span>x{multiplier}</span>
                    </div>
                    <div className={styles.resultRow} style={{fontWeight: 'bold'}}>
                        <span>Adjusted XP</span>
                        <span>{adjustedXp}</span>
                    </div>
                </div>
            </div>
            <div className={cx(styles.difficultyDisplay, DIFFICULTY_STYLES[difficulty])}>
                Difficulty: {difficulty}
            </div>
        </div>
    );
};