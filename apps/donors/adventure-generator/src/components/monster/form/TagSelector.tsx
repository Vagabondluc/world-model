
import React, { FC, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { GRAMMAR_TAGS } from '../../../data/grammarTags';
import { Modal } from '../../common/Modal';
import { GrammarTag } from '../../../types/monsterGrammar';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    categorySection: css`
        border-bottom: 1px solid var(--border-light);
        padding-bottom: var(--space-m);
        &:last-child { border-bottom: none; }
    `,
    categoryTitle: css`
        font-family: var(--header-font);
        color: var(--dnd-red);
        margin: 0 0 var(--space-s) 0;
        font-size: 1.1rem;
    `,
    tagGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--space-s);
    `,
    tagButton: css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: var(--space-s);
        background: var(--card-bg);
        border: 1px solid var(--medium-brown);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.1s;
        text-align: left;
        
        &:hover {
            background: var(--parchment-bg);
            transform: translateY(-1px);
        }
        
        strong {
            display: block;
            font-size: 0.9rem;
            color: var(--dark-brown);
        }
        small {
            font-size: 0.75rem;
            color: var(--medium-brown);
            line-height: 1.2;
        }
    `,
    tagSelected: css`
        background: var(--dark-brown) !important;
        border-color: var(--dark-brown) !important;
        
        strong, small {
            color: var(--parchment-bg) !important;
        }
    `,
    actions: css`
        display: flex;
        justify-content: flex-end;
        gap: var(--space-m);
        margin-top: var(--space-m);
        padding-top: var(--space-m);
        border-top: 2px solid var(--border-main);
    `
};

interface TagSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTags: string[];
    onToggleTag: (tagId: string) => void;
}

export const TagSelector: FC<TagSelectorProps> = ({ isOpen, onClose, selectedTags, onToggleTag }) => {
    const groupedTags = useMemo(() => {
        const groups: Record<string, GrammarTag[]> = {};
        GRAMMAR_TAGS.forEach(tag => {
            if (!groups[tag.category]) groups[tag.category] = [];
            groups[tag.category].push(tag);
        });
        return groups;
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Ability Tags" size="large">
            <div className={styles.container}>
                <p style={{margin: 0, fontStyle: 'italic', color: 'var(--medium-brown)'}}>
                    Combine tags to unlock special abilities. For example, selecting <strong>Fire</strong> and <strong>Earth</strong> may unlock <strong>Magma</strong> powers.
                </p>
                
                {Object.entries(groupedTags).map(([category, tags]: [string, GrammarTag[]]) => (
                    <div key={category} className={styles.categorySection}>
                        <h4 className={styles.categoryTitle}>{category}</h4>
                        <div className={styles.tagGrid}>
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={cx(styles.tagButton, { [styles.tagSelected]: selectedTags.includes(tag.id) })}
                                    onClick={() => onToggleTag(tag.id)}
                                >
                                    <strong>{tag.name}</strong>
                                    <small>{tag.description}</small>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className={styles.actions}>
                    <button className="primary-button" onClick={onClose}>Done</button>
                </div>
            </div>
        </Modal>
    );
};
