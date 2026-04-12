import React from 'react';

export interface LayerIndicatorProps {
    layerType?: string;
    layerName?: string;
}

export const LayerIndicator: React.FC<LayerIndicatorProps> = ({ layerType, layerName }) => {
    if (!layerType) return null;

    const layerColors: Record<string, string> = {
        surface: '#4CAF50',
        underdark: '#1a1a1a',
        feywild: '#10b981',
        shadowfell: '#2d1b2e',
        elemental: '#f59e0b',
        custom: '#6b7280'
    };

    const layerNames: Record<string, string> = {
        surface: 'Surface',
        underdark: 'Underdark',
        feywild: 'Feywild',
        shadowfell: 'Shadowfell',
        elemental: 'Elemental',
        custom: 'Custom'
    };

    const color = layerColors[layerType] || layerColors.custom;
    const name = layerNames[layerType] || layerType;

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }}
        >
            <span
                style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color
                }}
            />
            <span style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
                {name}
            </span>
        </div>
    );
};
