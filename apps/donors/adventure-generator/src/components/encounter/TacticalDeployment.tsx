import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../styles/theme';
import { Move, User, AlertTriangle } from 'lucide-react';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(8, 1fr);
        gap: 2px;
        background: #ddd;
        border: 2px solid ${theme.borders.light};
        border-radius: 4px;
        aspect-ratio: 10 / 8;
        width: 100%;
    `,
    cell: css`
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background 0.2s;
        &:hover { background: #f0f0f0; }
        position: relative;
    `,
    deploymentTools: css`
        display: flex;
        gap: 12px;
        padding: 12px;
        background: white;
        border-radius: 8px;
        border: 1px solid ${theme.borders.light};
    `,
    token: (type: 'enemy' | 'hazard' | 'ally') => css`
        width: 80%;
        height: 80%;
        border-radius: 50%;
        background: ${type === 'enemy' ? '#ff4444' : type === 'hazard' ? '#ffaa00' : '#44aaff'};
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `
};

export const TacticalDeployment: FC = () => {
    const [tokens, setTokens] = useState<Record<string, 'enemy' | 'hazard' | 'ally'>>({
        '2-2': 'enemy',
        '2-3': 'enemy',
        '3-2': 'enemy',
        '7-5': 'hazard'
    });

    const handleCellClick = (x: number, y: number) => {
        const key = `${x}-${y}`;
        setTokens(prev => {
            const next = { ...prev };
            if (next[key]) delete next[key];
            else next[key] = 'enemy';
            return next;
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.deploymentTools}>
                <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={14} /> Add Unit
                </button>
                <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={14} /> Add Hazard
                </button>
                <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Move size={14} /> Auto-Deploy
                </button>
            </div>

            <div className={styles.grid}>
                {Array.from({ length: 8 }).map((_, y) =>
                    Array.from({ length: 10 }).map((_, x) => {
                        const key = `${x}-${y}`;
                        const token = tokens[key];
                        return (
                            <div
                                key={key}
                                className={styles.cell}
                                onClick={() => handleCellClick(x, y)}
                            >
                                {token && (
                                    <div className={styles.token(token)}>
                                        {token === 'enemy' ? 'E' : token === 'hazard' ? 'H' : 'A'}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className={css`font-size: 0.8rem; color: ${theme.colors.textMuted}; font-style: italic;`}>
                Click cells to toggle enemy deployment. Uses the 10x8 Tactical Preview.
            </div>
        </div>
    );
};
