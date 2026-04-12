/**
 * Compass Overlay Component
 * 
 * Main container for the dual-indicator compass UI overlay.
 * Displays geographic and magnetic needles with configurable display modes.
 */

import React from 'react';
import { useCompassStore } from '../../store/compassStore';
import './CompassOverlay.css';

export interface CompassOverlayProps {
    className?: string;
}

export const CompassOverlay: React.FC<CompassOverlayProps> = ({ className }) => {
    const {
        geographicHeading,
        magneticHeading,
        declinationAngle,
        displayMode,
        toggleDisplayMode,
    } = useCompassStore();

    // Handle click to toggle display mode
    const handleClick = () => {
        toggleDisplayMode();
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDisplayMode();
        } else if (event.key === 'Escape') {
            (event.currentTarget as HTMLElement).blur();
        }
    };

    // Determine visibility of needles
    const showGeographic = displayMode === 'BOTH' || displayMode === 'GEOGRAPHIC_ONLY';
    const showMagnetic = displayMode === 'BOTH' || displayMode === 'MAGNETIC_ONLY';
    const showDeclinationArc = displayMode === 'BOTH' && Math.abs(declinationAngle) > 1;

    // Format ARIA label
    const ariaLabel = `Compass showing ${displayMode.toLowerCase().replace(/_/g, ' ')}. ` +
        `Geographic heading: ${Math.round(geographicHeading)} degrees. ` +
        `Magnetic heading: ${Math.round(magneticHeading)} degrees. ` +
        `Declination: ${Math.round(declinationAngle)} degrees. ` +
        `Click to toggle mode.`;

    return (
        <div
            className={`compass-overlay ${className || ''}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-describedby="compass-description"
        >
            <div className="compass-container">
                {/* Background circle with glassmorphism */}
                <div className="compass-background" />

                {/* Compass rose (cardinal directions) */}
                <div className="compass-rose">
                    <div className="cardinal north">N</div>
                    <div className="cardinal east">E</div>
                    <div className="cardinal south">S</div>
                    <div className="cardinal west">W</div>
                </div>

                {/* Declination arc (only visible in BOTH mode) */}
                {showDeclinationArc && (
                    <svg className="declination-arc" viewBox="0 0 100 100">
                        <DeclinationArc
                            geographicHeading={geographicHeading}
                            magneticHeading={magneticHeading}
                            declinationAngle={declinationAngle}
                        />
                    </svg>
                )}

                {/* Needles */}
                <svg className="compass-needles" viewBox="0 0 100 100">
                    {showGeographic && (
                        <GeographicNeedle heading={geographicHeading} />
                    )}
                    {showMagnetic && (
                        <MagneticNeedle heading={magneticHeading} />
                    )}
                    {/* Center dot */}
                    <circle cx="50" cy="50" r="2" fill="#ffffff" opacity="0.9" />
                </svg>

                {/* Mode indicator (optional) */}
                {displayMode === 'MAGNETIC_ONLY' && (
                    <div className="mode-indicator">M</div>
                )}
            </div>

            {/* Screen reader description */}
            <div id="compass-description" className="sr-only">
                Dual-indicator compass showing geographic and magnetic north.
                Geographic needle is metallic silver, magnetic needle is red.
                Declination angle is {Math.round(declinationAngle)} degrees.
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface NeedleProps {
    heading: number;
}

const GeographicNeedle: React.FC<NeedleProps> = ({ heading }) => {
    return (
        <g
            className="geographic-needle"
            transform={`rotate(${heading} 50 50)`}
            style={{ transformOrigin: '50% 50%' }}
        >
            {/* Needle body */}
            <path
                d="M50 15 L52 48 L50 50 L48 48 Z"
                fill="url(#geographic-gradient)"
                stroke="#A0A0A0"
                strokeWidth="0.5"
                filter="url(#needle-shadow)"
            />
            {/* Needle tail */}
            <path
                d="M50 52 L51 65 L50 66 L49 65 Z"
                fill="#A0A0A0"
                opacity="0.8"
            />
            {/* Gradient definition */}
            <defs>
                <linearGradient id="geographic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E8E8E8" />
                    <stop offset="100%" stopColor="#A0A0A0" />
                </linearGradient>
                <filter id="needle-shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
                </filter>
            </defs>
        </g>
    );
};

const MagneticNeedle: React.FC<NeedleProps> = ({ heading }) => {
    return (
        <g
            className="magnetic-needle"
            transform={`rotate(${heading} 50 50)`}
            style={{ transformOrigin: '50% 50%' }}
        >
            {/* Needle body */}
            <path
                d="M50 15 L52 48 L50 50 L48 48 Z"
                fill="url(#magnetic-gradient)"
                stroke="#CC0000"
                strokeWidth="0.5"
                filter="url(#needle-glow)"
            />
            {/* Needle tail */}
            <path
                d="M50 52 L51 65 L50 66 L49 65 Z"
                fill="#CC0000"
                opacity="0.8"
            />
            {/* Gradient definition */}
            <defs>
                <linearGradient id="magnetic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6666" />
                    <stop offset="100%" stopColor="#CC0000" />
                </linearGradient>
                <filter id="needle-glow">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#FF0000" floodOpacity="0.4" />
                </filter>
            </defs>
        </g>
    );
};

interface DeclinationArcProps {
    geographicHeading: number;
    magneticHeading: number;
    declinationAngle: number;
}

const DeclinationArc: React.FC<DeclinationArcProps> = ({
    geographicHeading,
    magneticHeading,
    declinationAngle,
}) => {
    const radius = 30;
    const startAngle = geographicHeading - 90; // SVG rotation starts from top
    const endAngle = magneticHeading - 90;

    // Calculate arc path
    const largeArcFlag = Math.abs(declinationAngle) > 180 ? 1 : 0;
    const sweepFlag = declinationAngle > 0 ? 1 : 0;

    const startX = 50 + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = 50 + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = 50 + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = 50 + radius * Math.sin((endAngle * Math.PI) / 180);

    const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

    return (
        <path
            d={pathData}
            fill="none"
            stroke="#FFAA00"
            strokeWidth="1.5"
            opacity="0.6"
        />
    );
};
