
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { DelveSceneNode } from '../../../types/delve';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    section: css`
        h4 {
            font-family: var(--header-font);
            font-size: 1.1rem;
            color: var(--dnd-red);
            margin: 0 0 var(--space-s) 0;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 4px;
        }
    `,
    narrative: css`
        font-style: italic;
        line-height: 1.6;
        font-size: 1.05rem;
    `,
    sensory: css`
        background: rgba(0,0,0,0.03);
        padding: var(--space-s) var(--space-m);
        border-left: 3px solid var(--light-brown);
        font-size: 0.9rem;
        color: var(--medium-brown);
        p { margin: 0 0 4px 0; }
        p:last-child { margin-bottom: 0; }
    `,
    mechanicsGrid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        @media(max-width: 600px) {
            grid-template-columns: 1fr;
        }
    `,
    mechanicBox: css`
        font-size: 0.9rem;
        
        strong {
            display: block;
            font-family: var(--stat-body-font);
            text-transform: uppercase;
            font-size: 0.8rem;
            color: var(--medium-brown);
            margin-bottom: 4px;
        }

        ul {
            padding-left: var(--space-l);
            margin: 4px 0 0 0;
        }
    `,
    trapDetails: css`
        display: flex;
        gap: var(--space-m);
        font-size: 0.8rem;
        color: var(--medium-brown);
        margin-top: 4px;
        
        span {
            background: rgba(0,0,0,0.05);
            padding: 2px 6px;
            border-radius: 4px;
        }
    `
};

interface DelveRoomDetailProps {
    room: DelveSceneNode;
}

export const DelveRoomDetail: FC<DelveRoomDetailProps> = ({ room }) => {
    const { trap } = room.mechanics;

    return (
        <div className={styles.container}>
            <h3 style={{marginTop: 0}}>{room.title}</h3>
            
            <div className={styles.section}>
                <p className={styles.narrative}>{room.narrative}</p>
            </div>
            
            {room.sensory && (
            <div className={styles.sensory}>
                <p><strong>Sound:</strong> {room.sensory.sound}</p>
                <p><strong>Smell:</strong> {room.sensory.smell}</p>
            </div>
            )}

            <div className={styles.section}>
                <h4>Mechanics & Features</h4>
                <div className={styles.mechanicsGrid}>
                    <div className={styles.mechanicBox}>
                        <strong>Features</strong>
                        <p>{room.features.join(', ')}</p>
                    </div>
                    {room.mechanics.encounter && (
                        <div className={styles.mechanicBox}>
                            <strong>Encounter ({room.mechanics.encounter.difficulty})</strong>
                            <ul>{room.mechanics.encounter.monsters.map(m => <li key={m}>{m}</li>)}</ul>
                        </div>
                    )}
                    {trap && (
                         <div className={styles.mechanicBox}>
                            <strong>{trap.name || "Trap"} (Save DC {trap.dc})</strong>
                            <p style={{margin: 0}}>{trap.effect}</p>
                            <div className={styles.trapDetails}>
                                <span>Trigger: {trap.trigger}</span>
                                {trap.spotDC && <span>Spot DC {trap.spotDC}</span>}
                                {trap.disarmDC && <span>Disarm DC {trap.disarmDC}</span>}
                            </div>
                        </div>
                    )}
                     {room.mechanics.puzzle && (
                         <div className={styles.mechanicBox}>
                            <strong>Puzzle</strong>
                            <p>{room.mechanics.puzzle.description}</p>
                        </div>
                    )}
                    {room.mechanics.treasure && (
                         <div className={styles.mechanicBox}>
                            <strong>Treasure</strong>
                            <ul>{room.mechanics.treasure.map(t => <li key={t}>{t}</li>)}</ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
