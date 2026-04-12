import React, { FC } from 'react';
import { css } from '@emotion/css';
import { EncounterSceneNode } from '../../../schemas';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    narrative: css`
        font-style: italic;
        line-height: 1.5;
    `,
    section: css`
        h4 {
            font-size: 1rem;
            color: var(--dnd-red);
            margin: 0 0 var(--space-xs) 0;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 4px;
            font-family: var(--header-font);
        }
    `,
    sensoryBlock: css`
        background: rgba(0,0,0,0.03);
        padding: var(--space-s) var(--space-m);
        border-left: 3px solid var(--light-brown);
        font-size: 0.9rem;
        color: var(--medium-brown);
        p { margin: 0 0 4px 0; }
        p:last-child { margin-bottom: 0; }
    `
};

interface EncounterNodeDetailProps {
    node: EncounterSceneNode;
}

export const EncounterNodeDetail: FC<EncounterNodeDetailProps> = ({ node }) => {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h4>Narrative Summary</h4>
                <p className={styles.narrative}>{node.narrative}</p>
            </div>
            {node.sensory && (
                <div className={styles.section}>
                    <h4>Sensory Details</h4>
                    <div className={styles.sensoryBlock}>
                        <p><strong>Sound:</strong> {node.sensory.sound}</p>
                        <p><strong>Smell:</strong> {node.sensory.smell}</p>
                        <p><strong>Feel:</strong> {node.sensory.feel}</p>
                    </div>
                </div>
            )}
            {node.mechanics && (
                <div className={styles.section}>
                    <h4>Mechanics &amp; Features</h4>
                    {node.mechanics.environment && <p>{node.mechanics.environment}</p>}
                </div>
            )}
        </div>
    );
};