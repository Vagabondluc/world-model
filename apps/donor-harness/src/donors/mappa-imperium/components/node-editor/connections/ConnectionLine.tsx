/**
 * Connection Line Component
 * Renders a bezier curve between two points.
 */

import React from 'react';

interface ConnectionLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    status?: 'default' | 'valid' | 'invalid' | 'selected';
    type?: 'bezier' | 'straight';
    animated?: boolean;
    strokeWidth?: number;
    onClick?: (e: React.MouseEvent) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
    x1,
    y1,
    x2,
    y2,
    status = 'default',
    type = 'bezier',
    animated = false,
    strokeWidth = 2,
    onClick
}) => {
    // Path Calculation
    let pathData = '';

    if (type === 'straight') {
        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
        // Bezier (default)
        const curvature = 0.5;
        const dist = Math.abs(x2 - x1);
        const controlX1 = x1 + dist * curvature;
        const controlY1 = y1;
        const controlX2 = x2 - dist * curvature;
        const controlY2 = y2;
        pathData = `M ${x1} ${y1} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${x2} ${y2}`;
    }

    // Determine styles based on status
    let strokeColor = '#94a3b8'; // Default slate-400
    let opacity = 0.8;

    switch (status) {
        case 'valid':
            strokeColor = '#22c55e'; // Green-500
            break;
        case 'invalid':
            strokeColor = '#ef4444'; // Red-500
            break;
        case 'selected':
            strokeColor = '#3b82f6'; // Blue-500
            opacity = 1;
            strokeWidth = 3;
            break;
    }

    return (
        <g className="connection-line">
            {/* Background for easier clicking */}
            <path
                d={pathData}
                fill="none"
                stroke="transparent"
                strokeWidth={strokeWidth * 6} // We make the hit area wider
                style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                onClick={onClick}
            />
            {/* Visible Line */}
            <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeDasharray={animated ? '5,5' : 'none'}
                className={animated ? 'animate-flow' : ''}
                style={{ pointerEvents: 'none' }} // Let clicks pass through to background
            />
        </g>
    );
};
