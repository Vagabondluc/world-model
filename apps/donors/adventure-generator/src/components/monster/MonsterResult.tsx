import React, { FC, useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { marked } from 'marked';
import { SavedMonster } from '../../types/npc';
import { Statblock } from '../common/Statblock';
import { renderMonsterStatblock } from '../../utils/statblockRenderer';
import { calculateCR } from '../../utils/crCalculator';
import { scaleMonsterToCR } from '../../utils/monsterScaler';
import { getMonsterCR } from '../../utils/monsterHelpers';
import { useCampaignStore } from '../../stores/campaignStore';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

const styles = {
    stepContainer: css`
        background-color: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        border: var(--border-main);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: var(--space-l);
    `,
    resultHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-m);
        padding-bottom: var(--space-m);
        border-bottom: var(--border-main);
        h3 { margin: 0; font-size: 1.6rem; }
    `,
    description: css`
        font-style: italic;
        color: var(--medium-brown);
        margin: var(--space-s) 0 0 0;
        font-size: 1.05rem;
    `,
    resultActions: css`
        display: flex;
        gap: var(--space-s);
        flex-shrink: 0;
    `,
    detailSection: css`
        margin-top: var(--space-l);
        h4 {
            font-family: var(--header-font);
            color: var(--dark-brown);
            border-bottom: 1px solid var(--light-brown);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-s);
        }
    `,
    detailTable: css`
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
        td { padding: var(--space-s); border-bottom: 1px solid var(--border-light); }
        td:first-child { font-weight: bold; color: var(--dark-brown); width: 40%; background-color: rgba(0,0,0,0.02); }
    `,
    crAudit: css`
        margin-top: var(--space-m);
        padding: var(--space-m);
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        border: 1px dashed var(--medium-brown);
    `,
    auditHeader: css`
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-s);
        color: var(--dark-brown);
        border-bottom: 1px dotted var(--medium-brown);
        padding-bottom: 4px;
    `,
    auditDetails: css`
        font-size: 0.85rem;
        color: var(--medium-brown);
        ul { margin: 0; padding-left: 1.2rem; }
        li { margin-bottom: 2px; }
    `,
    warning: css`
        color: var(--error-red);
        font-weight: bold;
        margin-top: var(--space-s);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    fixBtn: css`
        background-color: var(--dnd-red);
        color: #fff;
        border: none;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        cursor: pointer;
        margin-left: 8px;
        &:hover { background-color: #701a1a; }
    `
};

interface MonsterResultProps {
    monster: SavedMonster;
    onSave: (monster: SavedMonster) => void;
    onUpdate?: (monster: SavedMonster) => void;
}

export const MonsterResult: FC<MonsterResultProps> = ({ monster, onSave, onUpdate }) => {
    const crMethod = useCampaignStore(s => s.config.crCalculationMethod || 'dmg');
    
    // Optimization: Memoize analysis and markdown parsing
    const crAnalysis = useMemo(() => calculateCR(monster.profile, crMethod), [monster.profile, crMethod]);
    const traitsHtml = useMemo(() => {
        const raw = marked.parse(monster.profile.abilitiesAndTraits);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [monster.profile.abilitiesAndTraits]);
    const actionsHtml = useMemo(() => {
        const raw = marked.parse(monster.profile.actions);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [monster.profile.actions]);
    const legendaryActionsHtml = useMemo(() => {
        if (!monster.profile.legendaryActions) return null;
        const raw = marked.parse(monster.profile.legendaryActions);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [monster.profile.legendaryActions]);
    const statblockHtml = useMemo(() => renderMonsterStatblock(monster), [monster]);

    const [isFixing, setIsFixing] = useState(false);

    const handleAutoScale = () => {
        if (!onUpdate) return;
        setIsFixing(true);
        setTimeout(() => {
            const targetCR = getMonsterCR(monster);
            const scaled = scaleMonsterToCR(monster, targetCR, crMethod);
            onUpdate(scaled);
            setIsFixing(false);
        }, 100);
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.resultHeader}>
                <div>
                    <h3>{monster.name}</h3>
                    {monster.description && <p className={styles.description}>{monster.description}</p>}
                </div>
                <div className={styles.resultActions}>
                    <button className="action-button" onClick={() => onSave(monster)}>Save to Bestiary</button>
                </div>
            </div>

            <div className={styles.crAudit}>
                <div className={styles.auditHeader}>
                    <span>Target CR: {monster.profile.table.challengeRating}</span>
                    <span>Calculated CR: {crAnalysis.finalCR <= 0 ? '< 1/8' : crAnalysis.finalCR < 1 ? `1/${Math.round(1/crAnalysis.finalCR)}` : crAnalysis.finalCR}</span>
                </div>
                <div className={styles.auditDetails}>
                    <ul>
                        {crAnalysis.breakdown.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                    {crAnalysis.warnings.length > 0 && (
                        <div className={styles.warning}>
                            <div>
                                {crAnalysis.warnings.map((w, i) => <div key={i}>⚠ {w}</div>)}
                            </div>
                            {onUpdate && (
                                <button className={styles.fixBtn} onClick={handleAutoScale} disabled={isFixing}>
                                    {isFixing ? 'Adjusting...' : '⚡ Auto-Scale Stats'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.detailSection}>
                <h4>Reference Table</h4>
                <table className={styles.detailTable}><tbody>{Object.entries(monster.profile.table).map(([key, value]) => (<tr key={key}><td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td><td>{String(value)}</td></tr>))}</tbody></table>
            </div>
            <div className={styles.detailSection}><h4>Abilities & Traits</h4><div dangerouslySetInnerHTML={{ __html: traitsHtml }}></div></div>
            <div className={styles.detailSection}><h4>Actions</h4><div dangerouslySetInnerHTML={{ __html: actionsHtml }}></div></div>
            {legendaryActionsHtml && <div className={styles.detailSection}><h4>Legendary Actions</h4><div dangerouslySetInnerHTML={{ __html: legendaryActionsHtml }}></div></div>}
            <div className={styles.detailSection}><h4>Roleplaying & Tactics</h4><p>{monster.profile.roleplayingAndTactics}</p></div>
            
            <div className={styles.detailSection}>
                <h4>Statblock</h4>
                <Statblock html={statblockHtml} />
            </div>
        </div>
    );
};
