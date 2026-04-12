
import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { TrapTier } from '../../types/trap';
import { TRAP_TAGS } from '../../data/trapRules';

const styles = {
    controlsColumn: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        position: sticky;
        top: var(--space-l);
        height: fit-content;
        text-align: center;
    `,
    title: css`
        font-family: var(--header-font);
        font-size: 1.5rem;
        color: var(--dark-brown);
        margin: 0;
        text-align: center;
        line-height: 1.1;
    `,
    tierSelector: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    `,
    tierLabel: css`
        padding: 8px 12px;
        border: 1px solid var(--light-brown);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: var(--parchment-bg);
        font-family: var(--stat-body-font);
        width: 100%;
        text-align: left;
        font-size: 0.9rem;
        
        padding-left: 36px;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        position: relative;

        .radio-checkmark {
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background-color: #fff;
            border-color: var(--medium-brown);
        }

        &:hover {
            border-color: var(--medium-brown);
            background-color: rgba(255, 255, 255, 0.4);
        }
    `,
    tierSelected: css`
        border: 2px solid var(--dnd-red) !important;
        background-color: var(--card-bg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        font-weight: bold;
        color: var(--dark-brown);
    `,
    tagsContainer: css`
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
    `,
    tag: css`
        font-size: 0.8rem;
        padding: 4px 8px;
        border: 1px solid var(--medium-brown);
        border-radius: 12px;
        cursor: pointer;
        background-color: var(--card-bg);
        color: var(--dark-brown);
        opacity: 0.85;
        transition: all 0.2s;

        &:hover { 
            opacity: 1; 
            border-color: var(--dark-brown);
            background-color: var(--parchment-bg);
        }
        &.selected {
            background-color: var(--dark-brown);
            color: var(--parchment-bg);
            opacity: 1;
            border-color: var(--dark-brown);
        }
    `,
    categoryHeader: css`
        font-family: var(--header-font);
        font-size: 0.9rem;
        color: var(--medium-brown);
        margin-top: var(--space-s);
        margin-bottom: 4px;
        width: 100%;
        text-align: left;
        border-bottom: 1px dashed var(--light-brown);
    `
};

const TIERS: { id: TrapTier, label: string }[] = [
    { id: '1-4', label: 'Levels 1-4' },
    { id: '5-10', label: 'Levels 5-10' },
    { id: '11-16', label: 'Levels 11-16' },
    { id: '17-20', label: 'Levels 17-20' },
];

interface TrapControlsProps {
    tier: TrapTier;
    setTier: (tier: TrapTier) => void;
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
    onGenerate: () => void;
    hasTrap: boolean;
}

export const TrapControls: FC<TrapControlsProps> = ({ tier, setTier, selectedTags, setSelectedTags, onGenerate, hasTrap }) => {
    
    const handleTagToggle = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(t => t !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    // Group tags by category
    const categories = ['Type', 'Damage', 'Mechanism'];
    const tagsByCategory = categories.reduce((acc, cat) => {
        acc[cat] = TRAP_TAGS.filter(t => t.category === cat);
        return acc;
    }, {} as Record<string, typeof TRAP_TAGS>);

    return (
        <div className={styles.controlsColumn}>
            <h1 className={styles.title}>Mechanical Trap Maker</h1>
            
            <div>
                <h4 style={{fontFamily: 'var(--header-font)', marginBottom: 'var(--space-m)', textAlign: 'center'}}>Select Tier</h4>
                <div className={styles.tierSelector}>
                    {TIERS.map(t => (
                        <label key={t.id} className={cx('custom-radio', styles.tierLabel, { [styles.tierSelected]: tier === t.id })}>
                            <input
                                type="radio"
                                name="tier"
                                value={t.id}
                                checked={tier === t.id}
                                onChange={() => setTier(t.id)}
                            />
                            <span className="radio-checkmark"></span>
                            <span>{t.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 style={{fontFamily: 'var(--header-font)', marginBottom: 'var(--space-s)', textAlign: 'center'}}>Tags (Optional)</h4>
                <div className={styles.tagsContainer}>
                    {categories.map(cat => (
                        <React.Fragment key={cat}>
                            <div className={styles.categoryHeader}>{cat}</div>
                            {tagsByCategory[cat].map(tag => (
                                <button
                                    key={tag.id}
                                    className={cx(styles.tag, { selected: selectedTags.includes(tag.id) })}
                                    onClick={() => handleTagToggle(tag.id)}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <button onClick={onGenerate} className="primary-button" style={{width: '100%', marginTop: 'var(--space-m)'}}>
                {hasTrap ? 'Regenerate Trap' : 'Generate Trap'}
            </button>
        </div>
    );
};
