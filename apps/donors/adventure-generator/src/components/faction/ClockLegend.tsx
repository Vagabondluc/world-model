import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { ResolutionMethod } from '../../types/faction';

interface ClockLegendProps {
    resolutionMethod: ResolutionMethod;
    pcImpact: boolean;
    allies: string[];
    enemies: string[];
    difficultyDC?: number | null;
    filledColor?: string;
    unfilledColor?: string;
    className?: string;
}

/**
 * ClockLegend - Displays legend information for a faction clock
 * 
 * Shows:
 * - Color legend (filled vs unfilled)
 * - Resolution method indicator
 * - PC impact indicator
 * - Ally/enemy faction badges
 * - Difficulty DC (if set)
 */
export const ClockLegend: FC<ClockLegendProps> = ({
    resolutionMethod,
    pcImpact,
    allies,
    enemies,
    difficultyDC,
    filledColor = 'var(--dnd-red)',
    unfilledColor = 'var(--light-brown)',
    className,
}) => {
    const legendStyle = css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-family: var(--stat-body-font);
        font-size: 0.85rem;
        color: var(--dark-brown);
    `;

    const legendRowStyle = css`
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    `;

    const colorIndicatorStyle = css`
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid var(--medium-brown);
    `;

    const labelStyle = css`
        font-weight: 500;
    `;

    const badgeStyle = css`
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `;

    const allyBadgeStyle = css`
        background-color: var(--success-green);
        color: white;
    `;

    const enemyBadgeStyle = css`
        background-color: var(--dnd-red);
        color: white;
    `;

    const pcImpactStyle = css`
        background-color: var(--dnd-red);
        color: white;
    `;

    const dcBadgeStyle = css`
        background-color: var(--medium-brown);
        color: var(--parchment-bg);
    `;

    const resolutionMethodLabels: Record<ResolutionMethod, string> = {
        simple: 'Simple',
        complex: 'Complex',
        blended: 'Blended',
    };

    return (
        <div className={cx(legendStyle, className)}>
            {/* Color Legend */}
            <div className={legendRowStyle}>
                <div className={colorIndicatorStyle} style={{ backgroundColor: filledColor }} />
                <span className={labelStyle}>Filled</span>
                <div className={colorIndicatorStyle} style={{ backgroundColor: unfilledColor }} />
                <span className={labelStyle}>Unfilled</span>
            </div>

            {/* Resolution Method */}
            <div className={legendRowStyle}>
                <span className={labelStyle}>Resolution:</span>
                <span className={badgeStyle} style={{ backgroundColor: 'var(--medium-brown)', color: 'var(--parchment-bg)' }}>
                    {resolutionMethodLabels[resolutionMethod]}
                </span>
            </div>

            {/* PC Impact */}
            {pcImpact && (
                <div className={legendRowStyle}>
                    <span className={cx(badgeStyle, pcImpactStyle)}>⚡ PC Impact</span>
                </div>
            )}

            {/* Difficulty DC */}
            {difficultyDC !== null && difficultyDC !== undefined && (
                <div className={legendRowStyle}>
                    <span className={cx(badgeStyle, dcBadgeStyle)}>DC {difficultyDC}</span>
                </div>
            )}

            {/* Allies */}
            {allies.length > 0 && (
                <div className={legendRowStyle}>
                    <span className={labelStyle}>Allies:</span>
                    {allies.map((ally, index) => (
                        <span key={index} className={cx(badgeStyle, allyBadgeStyle)}>
                            {ally}
                        </span>
                    ))}
                </div>
            )}

            {/* Enemies */}
            {enemies.length > 0 && (
                <div className={legendRowStyle}>
                    <span className={labelStyle}>Enemies:</span>
                    {enemies.map((enemy, index) => (
                        <span key={index} className={cx(badgeStyle, enemyBadgeStyle)}>
                            {enemy}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
