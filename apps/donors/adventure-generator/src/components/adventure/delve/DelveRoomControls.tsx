
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { DelveSceneNode } from '../../../types/delve';
import { GeneratorControls } from '../framework/GeneratorControls';

const styles = {
    // container style is now handled by GeneratorControls wrapper
    section: css`
        h4 {
            margin-top: 0;
            margin-bottom: var(--space-s);
            font-size: 1rem;
            color: var(--dark-brown);
        }
        p {
            font-size: 0.9rem;
            color: var(--medium-brown);
            margin: 0;
        }
    `,
    actions: css`
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding-top: var(--space-l);
        border-top: 1px solid var(--border-light);
    `
};

interface DelveRoomControlsProps {
    room: DelveSceneNode;
    onRegenerate: () => void;
}

export const DelveRoomControls: FC<DelveRoomControlsProps> = ({ room, onRegenerate }) => {
    return (
        <GeneratorControls>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)', height: '100%' }}>
                <div className={styles.section}>
                    <h4>Current Stage</h4>
                    <p><strong>{room.stage.toUpperCase()}</strong></p>
                </div>
                <div className={styles.section}>
                    <h4>Tags</h4>
                    <p>{room.thematicTags.join(', ')}</p>
                </div>
                
                <div className={styles.actions}>
                    <button className="secondary-button" onClick={onRegenerate}>
                        ↻ Regenerate Room
                    </button>
                    <button className="action-button" disabled>
                        Fine-Tune Mechanics...
                    </button>
                </div>
            </div>
        </GeneratorControls>
    );
};
