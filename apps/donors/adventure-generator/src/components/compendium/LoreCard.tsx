
import React, { FC, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { LoreEntry } from '../../types/compendium';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { tokenizeText } from '../../utils/textLinker';
import { CompendiumLink } from '../common/CompendiumLink';
import { Card } from '../common/Card';

const styles = {
    selectedCard: css`
        border-color: var(--dnd-red) !important;
        background-color: #fff !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        transform: translateY(-3px);
    `,
    headerIcon: css`
        font-size: 1.5rem;
    `,
    badges: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        align-items: flex-end;
    `,
    badge: css`
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.7rem;
        font-weight: bold;
        color: var(--parchment-bg);
    `,
    preview: css`
        color: var(--medium-brown);
        margin-bottom: var(--space-m);
        line-height: 1.4;
        font-size: 0.95rem;
    `,
    meta: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 0.8rem;
        color: var(--medium-brown);
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

interface LoreCardProps {
    entry: LoreEntry;
    isSelected: boolean;
    onClick: (entry: LoreEntry) => void;
}

export const LoreCard: FC<LoreCardProps> = ({ entry, isSelected, onClick }) => {
    const { loreEntries, compendiumEntries } = useCompendiumStore(s => ({
        loreEntries: s.loreEntries,
        compendiumEntries: s.compendiumEntries
    }));

    const allEntities = useMemo(() => {
        return [
            ...loreEntries.map(e => ({ id: e.id, title: e.title })),
            ...compendiumEntries.map(e => ({ id: e.id, title: e.title }))
        ];
    }, [loreEntries, compendiumEntries]);

    const previewTokens = useMemo(() => {
        const rawPreview = entry.content.length > 150 ? entry.content.substring(0, 150) + '...' : entry.content;
        return tokenizeText(rawPreview, allEntities);
    }, [entry.content, allEntities]);

    const handleNavigate = (id: string) => {
        const target = loreEntries.find(e => e.id === id);
        if (target) {
            onClick(target);
        }
    };

    const loreType = loreTypes.find(t => t.value === entry.type);

    return (
        <Card
            variant="interactive"
            className={cx({ [styles.selectedCard]: isSelected })}
            onClick={() => onClick(entry)}
        >
            <Card.Header>
                <span className={styles.headerIcon}>{loreType?.icon || '📝'}</span>
                <h4>{entry.title}</h4>
                <div className={styles.badges}>
                    {!entry.isPublicKnowledge && <span className={styles.badge} style={{ backgroundColor: 'var(--error-red)' }}>🔒 Secret</span>}
                    <span className={styles.badge} style={{ backgroundColor: 'var(--medium-brown)' }}>{loreType?.label || 'Custom'}</span>
                </div>
            </Card.Header>
            <Card.Body>
                <p className={styles.preview}>
                    {previewTokens.map((token, i) =>
                        token.type === 'text' ? (
                            <span key={i}>{token.content}</span>
                        ) : (
                            <CompendiumLink
                                key={i}
                                entityId={token.id}
                                name={token.text}
                                onNavigate={handleNavigate}
                            />
                        )
                    )}
                </p>
                <div className={styles.meta}>
                    {entry.tags.length > 0 && (<div className={styles.tags}>{entry.tags.slice(0, 3).map(tag => (<span key={tag} className={styles.tag}>{tag}</span>))}{entry.tags.length > 3 && (<span className={styles.tag}>+{entry.tags.length - 3} more</span>)}</div>)}
                    {(entry.relatedLocationIds.length + entry.relatedNpcIds.length + entry.relatedFactionsIds.length) > 0 && (<span>🔗 {entry.relatedLocationIds.length + entry.relatedNpcIds.length + entry.relatedFactionsIds.length}</span>)}
                </div>
            </Card.Body>
        </Card>
    );
};
