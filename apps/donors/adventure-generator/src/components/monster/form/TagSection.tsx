
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useMonsterCreatorStore } from '@/stores/monsterCreatorStore';
import { TagSelector } from './TagSelector';
import { GRAMMAR_TAGS } from '../../../data/grammarTags';

const styles = {
    section: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding: var(--space-m);
        background-color: #fff;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    `,
    header: css`
        font-family: var(--header-font);
        font-size: 1.2rem;
        color: var(--dnd-red);
        border-bottom: 2px solid var(--medium-brown);
        padding-bottom: 6px;
        margin: 0 0 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    tagContainer: css`
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-s);
        min-height: 40px;
        align-items: center;
    `,
    tagPill: css`
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        
        button {
            background: transparent;
            border: none;
            color: var(--light-brown);
            cursor: pointer;
            font-size: 1.1rem;
            line-height: 1;
            padding: 0;
            display: flex;
            align-items: center;
            &:hover { color: #fff; }
        }
    `,
    addTagBtn: css`
        background: transparent;
        border: 2px dashed var(--medium-brown);
        color: var(--medium-brown);
        padding: 4px 10px;
        border-radius: 16px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: bold;
        transition: all 0.2s;
        
        &:hover {
            background: var(--parchment-bg);
            border-color: var(--dark-brown);
            color: var(--dark-brown);
        }
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: var(--space-s);
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    textarea: css`
        width: 100%;
        padding: 10px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 0.95rem;
        font-family: var(--body-font);
        color: var(--dark-brown);
        background: #fff;
        resize: vertical;
        min-height: 80px;

        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
    `,
};

export const TagSection: FC = () => {
    const store = useMonsterCreatorStore();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const handleToggleTag = (tagId: string) => {
        if (store.tags.includes(tagId)) {
            store.setTags(store.tags.filter(t => t !== tagId));
        } else {
            store.setTags([...store.tags, tagId]);
        }
    };

    const getTagName = (id: string) => {
        return GRAMMAR_TAGS.find(t => t.id === id)?.name || id;
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <span>2. Tags & Concept</span>
            </div>

            <div className={styles.formControl}>
                <label className={styles.label}>Ability Tags</label>
                <div className={styles.tagContainer}>
                    {store.tags.map(tagId => (
                        <div key={tagId} className={styles.tagPill}>
                            <span>{getTagName(tagId)}</span>
                            <button onClick={() => handleToggleTag(tagId)} aria-label="Remove tag">×</button>
                        </div>
                    ))}
                    <button className={styles.addTagBtn} onClick={() => setIsSelectorOpen(true)}>
                        + Add Tags
                    </button>
                </div>
            </div>

            <div className={styles.formControl}>
                <label className={styles.label}>Concept & Visuals</label>
                <textarea
                    className={styles.textarea}
                    value={store.concept}
                    onChange={e => store.setConcept(e.target.value)}
                    placeholder="Describe the monster's appearance, behavior, or a unique ability..."
                    rows={3}
                />
            </div>

            <TagSelector
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                selectedTags={store.tags}
                onToggleTag={handleToggleTag}
            />
        </div>
    );
};
