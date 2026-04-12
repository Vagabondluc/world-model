
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { Delve } from '../../../types/delve';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-l);
        padding: var(--space-xl) 0;
        max-width: 600px;
        margin: 0 auto;
    `,
    nodeWrapper: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 100%;
        
        &:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 2px;
            height: var(--space-l);
            background-color: var(--medium-brown);
            transform: translateX(-50%);
        }
    `,
    nodeCard: css`
        background-color: var(--card-bg);
        border: 2px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: var(--space-m);
        width: 100%;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);

        &:hover {
            border-color: var(--dnd-red);
            transform: scale(1.02);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
    `,
    nodeInfo: css`
        display: flex;
        align-items: center;
        gap: var(--space-m);
    `,
    nodeIndex: css`
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-family: var(--header-font);
    `,
    nodeText: css`
        display: flex;
        flex-direction: column;
        
        strong { color: var(--dnd-red); font-size: 1.1rem; }
        span { font-size: 0.85rem; color: var(--medium-brown); text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
    `,
    enterButton: css`
        background: transparent;
        border: 1px solid var(--light-brown);
        color: var(--dark-brown);
        border-radius: 4px;
        padding: 4px 12px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
            background: var(--dnd-red);
            color: white;
            border-color: var(--dnd-red);
        }
    `
};

interface DelveHubProps {
    delve: Delve;
    onSelectRoom: (roomId: string) => void;
}

export const DelveHub: FC<DelveHubProps> = ({ delve, onSelectRoom }) => {
    return (
        <div className={styles.container}>
            {delve.rooms.map((room, index) => (
                <div key={room.id} className={styles.nodeWrapper}>
                    <div className={styles.nodeCard} onClick={() => onSelectRoom(room.id)}>
                        <div className={styles.nodeInfo}>
                            <div className={styles.nodeIndex}>{index + 1}</div>
                            <div className={styles.nodeText}>
                                <span>{room.stage}</span>
                                <strong>{room.title}</strong>
                            </div>
                        </div>
                        <button className={styles.enterButton}>Enter Room →</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
