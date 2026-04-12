
import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { LoreEntry } from '../../types/compendium';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { tokenizeText } from '../../utils/textLinker';
import { CompendiumLink } from '../common/CompendiumLink';
import { HistoryControls } from '../common/HistoryControls';
import { OriginContext } from '../../schemas/common';
import { useContextualNavigation } from '../../hooks/useContextualNavigation';

// Styles from CompendiumManager
const styles = {
    detailPanel: css`
        background-color: var(--card-bg);
        border-left: var(--border-main);
        padding: var(--space-l);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        height: 100%;

        @media (max-width: 1200px) {
            border-left: none;
            border-top: var(--border-main);
            max-height: 50vh;
        }
    `,
    detailHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-l);
        padding-bottom: var(--space-m);
        border-bottom: var(--border-light);
        h3 { margin: 0; flex: 1; }
    `,
    headerControls: css`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--space-s);
    `,
    metadata: css`
        margin-bottom: var(--space-l);
        font-size: 0.9rem;
    `,
    metadataRow: css`
        display: flex;
        margin-bottom: var(--space-s);
        strong { min-width: 100px; color: var(--dark-brown); }
    `,
    contentSection: css`
        margin-bottom: var(--space-l);
        h4 { border-bottom: 1px solid var(--light-brown); padding-bottom: 4px; margin-bottom: var(--space-s); }
    `,
    contentText: css`
        line-height: 1.6;
        white-space: pre-wrap;
    `,
    connectionGroup: css`
        margin-bottom: var(--space-s);
        padding: var(--space-s);
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        font-size: 0.9rem;
    `,
    tags: css`
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    `,
    tag: css`
        background-color: var(--light-brown);
        color: var(--dark-brown);
        padding: 1px 5px;
        border-radius: 3px;
        font-size: 0.7rem;
    `,
};

const loreTypes = [
    { value: 'legend', label: 'Legend', icon: '📜' },
    { value: 'history', label: 'History', icon: '📚' },
    { value: 'culture', label: 'Culture', icon: '🎭' },
    { value: 'religion', label: 'Religion', icon: '⛪' },
    { value: 'organization', label: 'Organization', icon: '🏛️' },
    { value: 'custom', label: 'Custom', icon: '📝' }
];

interface LoreDetailPanelProps {
    entry: LoreEntry;
    onClose: () => void;
    onEdit: (entry: LoreEntry) => void;
    onNavigate: (id: string) => void;
}

export const LoreDetailPanel: FC<LoreDetailPanelProps> = ({ entry, onClose, onEdit, onNavigate }) => {
    const { loreEntries, compendiumEntries } = useCompendiumStore(s => ({
        loreEntries: s.loreEntries,
        compendiumEntries: s.compendiumEntries
    }));
    
    const { returnToSource } = useContextualNavigation();

    const allEntities = useMemo(() => {
        return [
            ...loreEntries.map(e => ({ id: e.id, title: e.title })),
            ...compendiumEntries.map(e => ({ id: e.id, title: e.title }))
        ];
    }, [loreEntries, compendiumEntries]);

    const contentTokens = useMemo(() => 
        tokenizeText(entry.content, allEntities), 
    [entry.content, allEntities]);

    const showReturnButton = entry.origin?.type === 'generator' && !!entry.origin.historyStateId;

    return (
        <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
                <h3>{entry.title}</h3>
                <div className={styles.headerControls}>
                    <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                        {showReturnButton && (
                             <button className="secondary-button" style={{fontSize: '0.85rem', padding: '4px 8px'}} onClick={() => returnToSource(entry.origin)}>
                                ⚙️ Generator
                            </button>
                        )}
                        <button className="action-button" onClick={() => onEdit(entry)}>Edit</button>
                        <button className="secondary-button" onClick={onClose}>Close</button>
                    </div>
                    <HistoryControls />
                </div>
            </div>
            <div>
                <div className={styles.metadata}>
                    <div className={styles.metadataRow}><strong>Type:</strong><span>{loreTypes.find(t => t.value === entry.type)?.label || 'Custom'}</span></div>
                    <div className={styles.metadataRow}><strong>Visibility:</strong><span>{entry.isPublicKnowledge ? 'Public' : 'Secret (GM Only)'}</span></div>
                    {entry.sources.length > 0 && (<div className={styles.metadataRow}><strong>Sources:</strong><span>{entry.sources.join(', ')}</span></div>)}
                    <div className={styles.metadataRow}><strong>Created:</strong><span>{new Date(entry.createdAt).toLocaleDateString()}</span></div>
                </div>
                <div className={styles.contentSection}>
                    <h4>Content</h4>
                    <div className={styles.contentText}>
                        {contentTokens.map((token, i) => 
                            token.type === 'text' ? (
                                <span key={i}>{token.content}</span>
                            ) : (
                                <CompendiumLink 
                                    key={i} 
                                    entityId={token.id} 
                                    name={token.text} 
                                    onNavigate={onNavigate} 
                                />
                            )
                        )}
                    </div>
                </div>
                {entry.tags.length > 0 && (<div className={styles.contentSection}><h4>Tags</h4><div className={styles.tags}>{entry.tags.map(tag => (<span key={tag} className={styles.tag}>{tag}</span>))}</div></div>)}
                <div className={styles.contentSection}>
                    <h4>Connections</h4>
                    {entry.relatedLocationIds.length > 0 && (<div className={styles.connectionGroup}><strong>🗺️ Locations:</strong> {entry.relatedLocationIds.length} connected</div>)}
                    {entry.relatedNpcIds.length > 0 && (<div className={styles.connectionGroup}><strong>👥 NPCs:</strong> {entry.relatedNpcIds.length} connected</div>)}
                    {entry.relatedFactionsIds.length > 0 && (<div className={styles.connectionGroup}><strong>🏛️ Factions:</strong> {entry.relatedFactionsIds.length} connected</div>)}
                    {entry.relatedLocationIds.length === 0 && entry.relatedNpcIds.length === 0 && entry.relatedFactionsIds.length === 0 && <p style={{ fontStyle: 'italic', color: 'var(--medium-brown)' }}>No connections yet.</p>}
                </div>
            </div>
        </div>
    );
};
