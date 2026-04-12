
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useLocationStore } from '../../stores/locationStore';
import { MapLayer } from '../../types/location';

const styles = {
    container: css`
        padding: 0 var(--space-m);
        display: flex;
        flex-direction: column;
    `,
    header: css`
        font-family: var(--header-font);
        margin: 0 0 var(--space-s) 0;
        color: var(--dark-brown);
        border-bottom: 1px solid var(--light-brown);
        padding-bottom: var(--space-xs);
    `,
    layerList: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,
    layerItem: css`
        padding: var(--space-s);
        cursor: pointer;
        border-radius: var(--border-radius);
        border: 1px solid transparent;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;
        
        &:hover {
            background-color: var(--parchment-bg);
            border-color: var(--light-brown);
        }
    `,
    activeLayer: css`
        background-color: var(--parchment-bg);
        border-color: var(--dark-brown) !important;
        font-weight: bold;
    `,
    layerName: css`
        flex-grow: 1;
        margin-left: var(--space-s);
    `,
    layerControls: css`
        display: flex;
        gap: var(--space-s);
    `,
    iconButton: css`
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        opacity: 0.6;
        padding: 4px;
        border-radius: 4px;
        &:hover { opacity: 1; background: rgba(0,0,0,0.1); }
    `,
    addControls: css`
        margin-top: var(--space-s);
        display: flex;
        gap: var(--space-s);
    `,
    select: css`
        flex-grow: 1;
        padding: 4px;
        margin-bottom: 0;
    `
};

export const LayerManager: FC = () => {
    const { layerOrder, layers, activeLayerId, setActiveLayerId } = useLocationStore();
    
    const orderedLayers = layerOrder.map(id => layers[id]).filter(Boolean);

    return (
        <div className={styles.container}>
            <h4 className={styles.header}>Layers</h4>
            <div className={styles.layerList}>
                {orderedLayers.map(layer => (
                    <div 
                        key={layer.id} 
                        className={cx(styles.layerItem, { [styles.activeLayer]: layer.id === activeLayerId })}
                        onClick={() => setActiveLayerId(layer.id)}
                    >
                        <span className={styles.layerName}>{layer.name}</span>
                        <div className={styles.layerControls}>
                            <button className={styles.iconButton} title="Toggle Visibility">👁️</button>
                            <button className={styles.iconButton} title="Layer Settings">⚙️</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.addControls}>
                <select className={styles.select}>
                    <option>Add Feywild Layer</option>
                    <option>Add Shadowfell Layer</option>
                    <option>Add Underdark Layer</option>
                    <option>Add Custom Layer</option>
                </select>
                <button className="action-button" style={{padding: '4px 8px'}}>+</button>
            </div>
        </div>
    );
};
