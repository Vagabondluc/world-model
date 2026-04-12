
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { BIOME_CONFIG } from '../../data/constants';
import { ViewSettings } from '../../types/location';

const styles = {
    legend: css`
        position: absolute;
        top: var(--space-m);
        right: var(--space-m);
        background-color: rgba(255, 255, 255, 0.95);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        border: 2px solid var(--medium-brown);
        max-width: 200px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: var(--stat-body-font);
        max-height: 80vh;
        overflow-y: auto;
        z-index: 100; /* Increased z-index to float above canvas */
        pointer-events: auto; /* Ensure it catches clicks */

        h4, h5 { margin: 0 0 var(--space-s) 0; font-size: 0.9rem; color: var(--dark-brown); font-weight: bold; }
        h5 { margin-top: var(--space-m); padding-top: var(--space-s); border-top: 1px solid var(--light-brown); }
    `,
    legendItem: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);
        font-size: 0.8rem;
        margin-bottom: 4px;
        color: var(--dark-brown);
        line-height: 1.2;
    `,
    marker: css`
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid rgba(0,0,0,0.2);
        flex-shrink: 0;
    `,
    biomeList: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: var(--space-s);
        max-height: 300px;
        overflow-y: auto;
        padding-right: 4px;
    `
};

interface HexLegendProps {
    viewSettings: ViewSettings;
}

export const HexLegend: FC<HexLegendProps> = ({ viewSettings }) => {
    return (
        <div className={styles.legend}>
            <h4>Legend</h4>
            <div>
                <div className={styles.legendItem}><div className={styles.marker} style={{ backgroundColor: '#757575' }}></div><span>Undiscovered</span></div>
                <div className={styles.legendItem}><div className={styles.marker} style={{ backgroundColor: '#FF9800' }}></div><span>Rumored</span></div>
                <div className={styles.legendItem}><div className={styles.marker} style={{ backgroundColor: '#4CAF50' }}></div><span>Explored</span></div>
                <div className={styles.legendItem}><div className={styles.marker} style={{ backgroundColor: '#2196F3' }}></div><span>Mapped</span></div>
            </div>
            {viewSettings.showBiomeColors && (
                <>
                    <h5>Biomes</h5>
                    <div className={styles.biomeList}>
                        {Object.entries(BIOME_CONFIG).map(([key, config]) => (
                            <div key={key} className={styles.legendItem} title={config.description}>
                                <div 
                                    className={styles.marker} 
                                    style={{ backgroundColor: config.color, borderRadius: '3px' }} 
                                />
                                <span>{config.name}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
