
import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { marked } from 'marked';
import { SavedMonster } from '../../types/npc';
import { renderMonsterStatblock } from '../../utils/statblockRenderer';
import { Statblock } from '../common/Statblock';
import { SessionManager } from '../../services/sessionManager';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

const styles = {
    detailView: css`
        background-color: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        border: var(--border-main);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: var(--space-l);
        overflow-y: auto;
        max-height: calc(100% - 2 * var(--space-l));

        h3 { font-size: 2rem; margin-top: 0; margin-bottom: var(--space-s); color: var(--dnd-red); }
    `,
    detailHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-l);
        padding-bottom: var(--space-m);
        border-bottom: 1px solid var(--border-main);
    `,
    description: css`
        font-style: italic;
        color: var(--medium-brown);
        margin-bottom: var(--space-l);
        font-size: 1.1rem;
    `,
    detailSection: css`
        margin-top: var(--space-l);
        h4 {
            font-family: var(--header-font);
            color: var(--dark-brown);
            border-bottom: 1px solid var(--light-brown);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-s);
            font-size: 1.2rem;
        }
    `,
    detailTable: css`
        width: 100%;
        border-collapse: collapse;
        td { padding: var(--space-s); border-bottom: 1px solid var(--border-light); }
        td:first-child { font-weight: bold; width: 30%; background-color: rgba(0,0,0,0.03); }
    `,
};

interface BestiaryDetailProps {
    monster: SavedMonster;
    onClose: () => void;
}

export const BestiaryDetail: FC<BestiaryDetailProps> = ({ monster, onClose }) => {
    const abilitiesHtml = useMemo(() => {
        const raw = marked.parse(monster.profile.abilitiesAndTraits);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [monster.profile.abilitiesAndTraits]);
    const actionsHtml = useMemo(() => {
        const raw = marked.parse(monster.profile.actions);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [monster.profile.actions]);
    const legendaryActionsHtml = useMemo(() => {
        if (!monster.profile.legendaryActions) return '';
        const raw = marked.parse(monster.profile.legendaryActions);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [monster.profile.legendaryActions]);

    const handleSaveMarkdown = () => {
        const statblockHtml = renderMonsterStatblock(monster);
        const statblockText = new DOMParser().parseFromString(statblockHtml, 'text/html').body.innerText;
        
        let markdown = `# ${monster.name}\n\n`;
        if (monster.description) {
            markdown += `> ${monster.description}\n\n`;
        }
        markdown += `## Profile\n\n${JSON.stringify(monster.profile, null, 2)}\n\n`;
        markdown += `## Statblock\n\n${statblockText}`;
        SessionManager.saveMarkdownFile(markdown, `${monster.name.toLowerCase().replace(/\s/g, '_')}.md`);
    };

    return (
        <div className={styles.detailView}>
             <div className={styles.detailHeader}>
                <button className="primary-button" onClick={onClose}>← Back to Bestiary</button>
                <div><button className="secondary-button" onClick={handleSaveMarkdown}>Save as Markdown</button></div>
            </div>
            <h3>{monster.name} {monster.id.startsWith('srd-') && <span style={{fontSize: '1rem', color: 'var(--medium-brown)'}}>(SRD)</span>}</h3>
            {monster.description && (<p className={styles.description}>{monster.description}</p>)}
            <div className={styles.detailSection}>
                <h4>Reference Table</h4>
                <table className={styles.detailTable}><tbody>{Object.entries(monster.profile.table).map(([key, value]) => (<tr key={key}><td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td><td>{String(value)}</td></tr>))}</tbody></table>
            </div>
            <div className={styles.detailSection}><h4>Abilities & Traits</h4><div dangerouslySetInnerHTML={{ __html: abilitiesHtml }}></div></div>
            <div className={styles.detailSection}><h4>Actions</h4><div dangerouslySetInnerHTML={{ __html: actionsHtml }}></div></div>
            {monster.profile.legendaryActions && (<div className={styles.detailSection}><h4>Legendary Actions</h4><div dangerouslySetInnerHTML={{ __html: legendaryActionsHtml }}></div></div>)}
            <div className={styles.detailSection}><h4>Roleplaying & Tactics</h4><p>{monster.profile.roleplayingAndTactics}</p></div>
            <Statblock html={renderMonsterStatblock(monster)} />
        </div>
    );
};
