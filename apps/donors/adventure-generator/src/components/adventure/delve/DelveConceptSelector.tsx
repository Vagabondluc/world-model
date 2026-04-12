
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { DelveConcept } from '../../../types/delve';
import { Badge } from '../../common/Badge';

const styles = {
    container: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-l);
        margin-top: var(--space-m);
    `,
    card: css`
        background-color: var(--card-bg);
        border: 2px solid var(--light-brown);
        border-radius: var(--border-radius);
        padding: var(--space-l);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        height: 100%;

        &:hover {
            border-color: var(--dnd-red);
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    `,
    header: css`
        margin-bottom: var(--space-m);
        h3 { margin: 0 0 var(--space-xs) 0; font-size: 1.3rem; color: var(--dnd-red); line-height: 1.2; }
    `,
    description: css`
        font-style: italic;
        color: var(--dark-brown);
        margin-bottom: var(--space-m);
        font-size: 0.95rem;
    `,
    visuals: css`
        background: rgba(0,0,0,0.03);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        margin-bottom: var(--space-m);
        font-size: 0.9rem;
        color: var(--medium-brown);
        border-left: 3px solid var(--medium-brown);
    `,
    tags: css`
        margin-top: auto;
        display: flex;
        gap: var(--space-s);
        flex-wrap: wrap;
    `,
    selectButton: css`
        margin-top: var(--space-m);
        width: 100%;
    `
};

interface DelveConceptSelectorProps {
    concepts: DelveConcept[];
    onSelect: (concept: DelveConcept) => void;
}

export const DelveConceptSelector: FC<DelveConceptSelectorProps> = ({ concepts, onSelect }) => {
    return (
        <div className={styles.container}>
            {concepts.map(concept => (
                <div key={concept.id} className={styles.card} onClick={() => onSelect(concept)}>
                    <div className={styles.header}>
                        <h3>{concept.title}</h3>
                    </div>
                    <p className={styles.description}>{concept.description}</p>
                    <div className={styles.visuals}>
                        <strong>👁️ Visuals:</strong> {concept.visuals}
                    </div>
                    <div className={styles.tags}>
                        {concept.tags.map(tag => (
                            <Badge key={tag} color="var(--dark-brown)">{tag}</Badge>
                        ))}
                    </div>
                    <button className="primary-button" style={{marginTop: 'var(--space-m)', fontSize: '1rem', padding: '8px'}}>
                        Select Concept
                    </button>
                </div>
            ))}
        </div>
    );
};
