
import React, { FC, ReactNode } from 'react';
import { css, cx } from '@emotion/css';

interface BadgeProps {
    children: ReactNode;
    entityType?: 'location' | 'npc' | 'faction';
    subType?: string;
    color?: string; // Explicit override
    className?: string;
    style?: React.CSSProperties;
}

const baseStyle = css`
    color: var(--parchment-bg);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-family: var(--stat-body-font);
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    line-height: 1.2;
    white-space: nowrap;
`;

// Mappings match original CSS variables
const locationColors: Record<string, string> = {
    dungeon: 'var(--dungeon-color)',
    battlemap: 'var(--battlemap-color)',
    settlement: 'var(--settlement-color)',
    'special location': 'var(--special-color)',
    'special-location': 'var(--special-color)'
};

const npcColors: Record<string, string> = {
    minor: 'var(--minor-npc)',
    major: 'var(--major-npc)',
    antagonist: 'var(--antagonist-npc)',
    creature: 'var(--creature-npc)'
};

const factionColors: Record<string, string> = {
    'government & authority': 'var(--faction-government-authority)',
    'religious organizations': 'var(--faction-religious-organizations)',
    'criminal enterprises': 'var(--faction-criminal-enterprises)',
    'economic & trade': 'var(--faction-economic-trade)',
    'arcane & scholarly': 'var(--faction-arcane-scholarly)',
    'adventuring & mercenary': 'var(--faction-adventuring-mercenary)',
    'racial & cultural': 'var(--faction-racial-cultural)',
    'ideological & revolutionary': 'var(--faction-ideological-revolutionary)',
    'secret & shadow': 'var(--faction-secret-shadow)',
    'planar & extraplanar': 'var(--faction-planar-extraplanar)',
    'environmental & territorial': 'var(--faction-environmental-territorial)'
};

const getBgColor = (entityType?: string, subType?: string): string | undefined => {
    if (!entityType || !subType) return undefined;
    const normalizedSubType = subType.toLowerCase();
    switch (entityType) {
        case 'location': return locationColors[normalizedSubType] || locationColors[normalizedSubType.replace(' ', '-')];
        case 'npc': return npcColors[normalizedSubType];
        case 'faction': return factionColors[normalizedSubType];
        default: return undefined;
    }
};

export const Badge: FC<BadgeProps> = ({ children, entityType, subType, color, className, style }) => {
    const bgColor = color || getBgColor(entityType, subType) || 'var(--medium-brown)';
    
    // Special case for bright yellow faction background needing dark text
    const needsDarkText = entityType === 'faction' && subType?.toLowerCase() === 'religious organizations';

    return (
        <span 
            className={cx(baseStyle, className)}
            style={{ 
                backgroundColor: bgColor,
                color: needsDarkText ? 'var(--dark-brown)' : 'var(--parchment-bg)',
                ...style
             }}
        >
            {children}
        </span>
    );
};
