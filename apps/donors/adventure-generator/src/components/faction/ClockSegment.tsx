import React, { FC } from 'react';
import { css } from '@emotion/css';

interface ClockSegmentProps {
    index: number;
    totalSegments: number;
    filled: boolean;
    radius?: number;
    strokeWidth?: number;
    filledColor?: string;
    unfilledColor?: string;
    animate?: boolean;
}

/**
 * ClockSegment - Renders a single pie slice/wedge for the faction clock
 * 
 * Uses SVG path with arc commands to create the wedge shape.
 * The segment angle is calculated based on totalSegments.
 */
export const ClockSegment: FC<ClockSegmentProps> = ({
    index,
    totalSegments,
    filled,
    radius = 100,
    strokeWidth = 20,
    filledColor = 'var(--dnd-red)',
    unfilledColor = 'var(--light-brown)',
    animate = false,
}) => {
    const anglePerSegment = 360 / totalSegments;
    const startAngle = index * anglePerSegment;
    const endAngle = (index + 1) * anglePerSegment;

    // Convert polar coordinates to Cartesian for SVG path
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    // Create the arc path
    const createArcPath = (innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
        const center = radius;
        const startOuter = polarToCartesian(center, center, outerRadius, endAngle);
        const endOuter = polarToCartesian(center, center, outerRadius, startAngle);
        const startInner = polarToCartesian(center, center, innerRadius, endAngle);
        const endInner = polarToCartesian(center, center, innerRadius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            'M', startOuter.x.toFixed(2), startOuter.y.toFixed(2),
            'A', outerRadius.toFixed(2), outerRadius.toFixed(2), 0, largeArcFlag, 0, endOuter.x.toFixed(2), endOuter.y.toFixed(2),
            'L', endInner.x.toFixed(2), endInner.y.toFixed(2),
            'A', innerRadius.toFixed(2), innerRadius.toFixed(2), 0, largeArcFlag, 1, startInner.x.toFixed(2), startInner.y.toFixed(2),
            'Z'
        ].join(' ');
    };

    const innerRadius = radius - strokeWidth;
    const pathData = createArcPath(innerRadius, radius, startAngle, endAngle);

    const segmentStyle = css`
        transition: all 0.3s ease;
        cursor: pointer;
        
        &:hover {
            filter: brightness(1.2);
            transform: scale(1.02);
            transform-origin: center;
        }
    `;

    const animationStyle = css`
        @keyframes fillSegment {
            0% {
                opacity: 0;
                transform: scale(0.9);
                transform-origin: center;
            }
            100% {
                opacity: 1;
                transform: scale(1);
                transform-origin: center;
            }
        }
        
        animation: fillSegment 0.4s ease-out forwards;
        animation-delay: ${index * 0.05}s;
    `;

    return (
        <path
            d={pathData}
            fill={filled ? filledColor : unfilledColor}
            className={cx(segmentStyle, animate && animationStyle)}
            data-segment-index={index}
            data-filled={filled}
        />
    );
};

// Helper function for className merging
const cx = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};
