import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { FactionClock as FactionClockType } from '../../types/faction';
import { ClockSegment } from './ClockSegment';
import { ClockLegend } from './ClockLegend';

interface FactionClockProps {
    clock: FactionClockType;
    size?: number;
    strokeWidth?: number;
    filledColor?: string;
    unfilledColor?: string;
    onClick?: () => void;
    showLegend?: boolean;
    className?: string;
}

/**
 * FactionClock - Main clock display component
 * 
 * Renders a circular clock with segmented slices representing faction progress.
 * Supports 4, 6, 8, or 12 segments.
 * 
 * Features:
 * - Visual representation of filled vs unfilled segments
 * - Hover state showing clock details
 * - Click to edit (when onClick is provided)
 * - Optional legend display
 */
export const FactionClock: FC<FactionClockProps> = ({
    clock,
    size = 200,
    strokeWidth = 25,
    filledColor = 'var(--dnd-red)',
    unfilledColor = 'var(--light-brown)',
    onClick,
    showLegend = true,
    className,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const { objective, segments, progress, resolutionMethod, allies, enemies, pcImpact, difficultyDC } = clock;

    const containerStyle = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
    `;

    const clockWrapperStyle = css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        ${onClick ? 'cursor: pointer;' : ''}
        transition: transform 0.2s ease;
        
        ${onClick ? css`
            &:hover {
                transform: scale(1.02);
            }
        ` : ''}
    `;

    const svgStyle = css`
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    `;

    const centerTextStyle = css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        pointer-events: none;
    `;

    const progressTextStyle = css`
        font-size: ${size * 0.15}px;
        font-weight: 700;
        color: var(--dark-brown);
        line-height: 1;
    `;

    const totalTextStyle = css`
        font-size: ${size * 0.1}px;
        font-weight: 500;
        color: var(--medium-brown);
    `;

    const objectiveStyle = css`
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-brown);
        text-align: center;
        max-width: ${size + 40}px;
        line-height: 1.3;
        margin-bottom: 4px;
    `;

    const progressLabelStyle = css`
        font-size: 0.85rem;
        color: var(--medium-brown);
        text-align: center;
    `;

    const hoverTooltipStyle = css`
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        padding: 12px;
        border-radius: var(--border-radius);
        font-size: 0.85rem;
        min-width: 200px;
        z-index: 100;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    const showTooltipStyle = css`
        opacity: 1;
        visibility: visible;
    `;

    const tooltipRowStyle = css`
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 4px;
        
        &:last-child {
            margin-bottom: 0;
        }
    `;

    const tooltipLabelStyle = css`
        font-weight: 600;
        color: var(--light-brown);
    `;

    const tooltipValueStyle = css`
        text-align: right;
    `;

    const legendContainerStyle = css`
        margin-top: 8px;
    `;

    const centerRadius = size / 2;

    return (
        <div className={cx(containerStyle, className)}>
            <div
                className={clockWrapperStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                {/* SVG Clock */}
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className={svgStyle}
                >
                    {/* Render all segments */}
                    {Array.from({ length: segments }, (_, index) => (
                        <ClockSegment
                            key={index}
                            index={index}
                            totalSegments={segments}
                            filled={index < progress}
                            radius={centerRadius}
                            strokeWidth={strokeWidth}
                            filledColor={filledColor}
                            unfilledColor={unfilledColor}
                            animate={false}
                        />
                    ))}
                </svg>

                {/* Center text showing progress */}
                <div className={centerTextStyle}>
                    <div className={progressTextStyle}>{progress}</div>
                    <div className={totalTextStyle}>/ {segments}</div>
                </div>

                {/* Hover Tooltip */}
                <div className={cx(hoverTooltipStyle, isHovered && showTooltipStyle)}>
                    <div className={tooltipRowStyle}>
                        <span className={tooltipLabelStyle}>Resolution:</span>
                        <span className={tooltipValueStyle}>
                            {resolutionMethod === 'simple' && 'Simple'}
                            {resolutionMethod === 'complex' && 'Complex'}
                            {resolutionMethod === 'blended' && 'Blended'}
                        </span>
                    </div>
                    {difficultyDC && (
                        <div className={tooltipRowStyle}>
                            <span className={tooltipLabelStyle}>Difficulty:</span>
                            <span className={tooltipValueStyle}>DC {difficultyDC}</span>
                        </div>
                    )}
                    {pcImpact && (
                        <div className={tooltipRowStyle}>
                            <span className={tooltipLabelStyle}>PC Impact:</span>
                            <span className={tooltipValueStyle}>⚡ Yes</span>
                        </div>
                    )}
                    {allies.length > 0 && (
                        <div className={tooltipRowStyle}>
                            <span className={tooltipLabelStyle}>Allies:</span>
                            <span className={tooltipValueStyle}>{allies.join(', ')}</span>
                        </div>
                    )}
                    {enemies.length > 0 && (
                        <div className={tooltipRowStyle}>
                            <span className={tooltipLabelStyle}>Enemies:</span>
                            <span className={tooltipValueStyle}>{enemies.join(', ')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Objective Name */}
            <div className={objectiveStyle}>{objective}</div>

            {/* Progress Label */}
            <div className={progressLabelStyle}>
                {progress === segments ? 'Complete!' : `${progress} of ${segments} segments filled`}
            </div>

            {/* Legend */}
            {showLegend && (
                <div className={legendContainerStyle}>
                    <ClockLegend
                        resolutionMethod={resolutionMethod}
                        pcImpact={pcImpact}
                        allies={allies}
                        enemies={enemies}
                        difficultyDC={difficultyDC}
                        filledColor={filledColor}
                        unfilledColor={unfilledColor}
                    />
                </div>
            )}
        </div>
    );
};
