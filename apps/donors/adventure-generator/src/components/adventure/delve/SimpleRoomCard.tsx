
import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { DelveSceneNode } from '../../../types/delve';

const styles = {
    roomCard: css`
        background: var(--parchment-bg);
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: all 0.2s ease;
    `,
    roomHeader: css`
        padding: var(--space-m);
        background-color: rgba(255,255,255,0.5);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s;
        border-bottom: 1px solid transparent;

        &:hover {
            background-color: rgba(255,255,255,0.8);
        }
        
        &.expanded {
             border-bottom-color: var(--light-brown);
             background-color: var(--card-bg);
        }
    `,
    headerTitle: css`
        display: flex;
        flex-direction: column;
        gap: 2px;

        h4 { 
            margin: 0; 
            color: var(--dnd-red); 
            font-size: 1.1rem;
            line-height: 1.2;
        }
    `,
    roomMeta: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);
    `,
    roomIndex: css`
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
        flex-shrink: 0;
    `,
    roomType: css`
        font-size: 0.75rem;
        color: var(--medium-brown);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
    `,
    expandIcon: css`
        font-size: 1.2rem;
        color: var(--medium-brown);
        width: 24px;
        text-align: center;
    `,
    roomContent: css`
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        background-color: var(--parchment-bg);
        animation: fadeIn 0.2s ease-out;
        
        p { margin: 0; font-size: 0.95rem; line-height: 1.5; }
        ul { margin: 0; padding-left: var(--space-l); font-size: 0.9rem; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `,
    sensoryText: css`
        font-style: italic;
        color: var(--medium-brown);
        font-size: 0.9rem;
        border-left: 3px solid var(--light-brown);
        padding-left: 12px;
        margin: 8px 0;
    `,
    grid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        margin-top: var(--space-s);
        padding-top: var(--space-s);
        border-top: 1px dashed var(--light-brown);

        @media (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    `,
    gridItem: css`
        font-size: 0.9rem;
        strong { display: block; color: var(--dark-brown); margin-bottom: 2px; font-size: 0.8rem; text-transform: uppercase; }
    `
};

export const SimpleRoomCard: FC<{ room: DelveSceneNode; index: number }> = ({ room, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { trap } = room.mechanics;

    return (
        <div className={styles.roomCard}>
            <div 
                className={cx(styles.roomHeader, { 'expanded': isExpanded })} 
                onClick={() => setIsExpanded(!isExpanded)}
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(!isExpanded)}
            >
                <div className={styles.roomMeta}>
                    <span className={styles.roomIndex}>{index + 1}</span>
                    <div className={styles.headerTitle}>
                        <span className={styles.roomType}>{room.stage}</span>
                        <h4>{room.title}</h4>
                    </div>
                </div>
                <span className={styles.expandIcon}>{isExpanded ? '−' : '+'}</span>
            </div>
            
            {isExpanded && (
                <div className={styles.roomContent}>
                    <p><em>{room.narrative}</em></p>
                    {room.sensory && <div className={styles.sensoryText}>{room.sensory.sound} {room.sensory.smell}</div>}
                    
                    <div className={styles.grid}>
                        <div className={styles.gridItem}>
                            <strong>Features</strong>
                            {room.features.join(', ')}
                        </div>
                        {room.mechanics.encounter && (
                            <div className={styles.gridItem}>
                                <strong>Encounter</strong>
                                {room.mechanics.encounter.monsters.join(', ')} <span style={{color: 'var(--dnd-red)', fontSize: '0.85em'}}>({room.mechanics.encounter.difficulty})</span>
                            </div>
                        )}
                        {trap && (
                            <div className={styles.gridItem}>
                                <strong>{trap.name} (Save DC {trap.dc})</strong>
                                {trap.trigger} — {trap.effect} <br/>
                                <span style={{fontSize: '0.85em', color: 'var(--medium-brown)'}}>
                                    Spot DC {trap.spotDC} / Disarm DC {trap.disarmDC}
                                </span>
                            </div>
                        )}
                        {room.mechanics.treasure && (
                            <div className={styles.gridItem}>
                                <strong>Treasure</strong>
                                {room.mechanics.treasure.join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
