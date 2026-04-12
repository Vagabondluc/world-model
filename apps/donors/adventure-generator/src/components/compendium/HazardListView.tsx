import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CompendiumEntry } from '../../types/compendium';
import { useCompendiumStore } from '../../stores/compendiumStore';

const styles = {
    container: css`
        padding: var(--space-l);
        overflow-y: auto;
        height: 100%;
    `,
    list: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-l);
    `,
    card: css`
        background: var(--card-bg);
        border: var(--border-main);
        padding: var(--space-l);
        border-radius: var(--border-radius);
        position: relative;
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-2px);
            border-color: var(--dnd-red);
        }
    `,
    title: css`
        margin: 0 0 var(--space-s) 0;
        font-family: var(--header-font);
        color: var(--dark-brown);
    `,
    summary: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        font-style: italic;
    `,
    tags: css`
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs);
        margin-top: var(--space-m);
    `,
    tag: css`
        font-size: 0.75rem;
        padding: 2px 8px;
        background: var(--light-brown);
        border: 1px solid var(--medium-brown);
        border-radius: 4px;
        color: var(--dark-brown);
    `,
    placeholder: css`
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        font-style: italic;
    `
};

interface HazardListViewProps {
    hazards: CompendiumEntry[];
}

export const HazardListView: FC<HazardListViewProps> = ({ hazards }) => {
    if (hazards.length === 0) {
        return (
            <div className={styles.placeholder}>
                <p>No hazards saved yet. Go to Trap Generator to create some!</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {hazards.map(hazard => (
                    <div key={hazard.id} className={styles.card}>
                        <h3 className={styles.title}>{hazard.title}</h3>
                        <p className={styles.summary}>{hazard.summary}</p>
                        <div className={styles.tags}>
                            {hazard.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
