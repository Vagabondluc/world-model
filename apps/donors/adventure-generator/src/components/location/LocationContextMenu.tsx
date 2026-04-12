import React, { FC, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { useLocationStore } from '../../stores/locationStore';
import { BiomeType, Region, HexCoordinate } from '../../types/location';
import { BIOME_CONFIG } from '../../data/constants';

interface LocationContextMenuProps {
    onFinishRegion: (region: Partial<Region>) => void;
}

const styles = {
    container: css`
        position: absolute;
        top: 80px;
        left: var(--space-m);
        z-index: 19;
        background-color: var(--card-bg);
        padding: var(--space-s) var(--space-m);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        border: 2px solid var(--border-main);
        display: flex;
        align-items: center;
        gap: var(--space-m);
        font-family: var(--stat-body-font);
        font-size: 0.9rem;
        min-height: 40px;
        animation: fadeIn 0.2s ease-out;
        max-width: 90%;
        flex-wrap: wrap;
    `,
    infoText: css`
        color: var(--dark-brown);
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: var(--space-s);
        white-space: nowrap;
    `,
    controls: css`
        display: flex;
        gap: var(--space-s);
        align-items: center;
    `,
    biomeSelect: css`
        padding: 4px 8px;
        margin-bottom: 0;
        font-size: 0.9rem;
        min-width: 120px;
    `,
    colorSwatch: css`
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,0.2);
    `,
    toggleGroup: css`
        display: flex;
        border: 1px solid var(--medium-brown);
        border-radius: 4px;
        overflow: hidden;
        
        button {
            border: none;
            padding: 4px 10px;
            cursor: pointer;
            font-size: 0.9rem;
            background: var(--parchment-bg);
            color: var(--medium-brown);
            transition: all 0.2s;
            
            &:hover {
                background: rgba(0,0,0,0.05);
            }
            
            &.active {
                background: var(--medium-brown);
                color: var(--parchment-bg);
            }
        }
    `,
    opacityControl: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);
        
        label {
            font-size: 0.9rem;
            color: var(--dark-brown);
        }
        
        input[type="range"] {
            width: 80px;
        }
    `
};

export const LocationContextMenu: FC<LocationContextMenuProps> = ({ onFinishRegion }) => {
    const interactionMode = useLocationStore(s => s.interactionMode);
    const selectedPaintBiome = useLocationStore(s => s.selectedPaintBiome);
    const draftRegionHexes = useLocationStore(s => s.draftRegionHexes);
    const editingRegionId = useLocationStore(s => s.editingRegionId);
    const fogToolMode = useLocationStore(s => s.fogToolMode);
    const viewSettings = useLocationStore(s => s.getViewSettings());
    
    const setInteractionMode = useLocationStore(s => s.setInteractionMode);
    const setSelectedPaintBiome = useLocationStore(s => s.setSelectedPaintBiome);
    const clearDraftHexes = useLocationStore(s => s.clearDraftHexes);
    const updateViewSettings = useLocationStore(s => s.updateViewSettings);
    const setFogToolMode = useLocationStore(s => s.setFogToolMode);
    const setEditingRegionId = useLocationStore(s => s.setEditingRegionId);

    const handleFinishRegion = useCallback(() => {
        if (draftRegionHexes.length === 0) {
            setInteractionMode('inspect');
            return;
        }
        const qs = draftRegionHexes.map(h => h.q);
        const rs = draftRegionHexes.map(h => h.r);
        const boundingBox = {
            minQ: Math.min(...qs),
            maxQ: Math.max(...qs),
            minR: Math.min(...rs),
            maxR: Math.max(...rs)
        };
        
        onFinishRegion({ boundingBox, hexes: draftRegionHexes });
        clearDraftHexes();
        setEditingRegionId(null);
        setInteractionMode('inspect');
    }, [draftRegionHexes, onFinishRegion, clearDraftHexes, setInteractionMode, setEditingRegionId]);

    switch (interactionMode) {
        case 'biome_paint':
            return (
                <div className={styles.container}>
                    <span className={styles.infoText}>🖌️ Paint Biome:</span>
                    <div className={styles.controls}>
                        <div 
                            className={styles.colorSwatch} 
                            style={{ backgroundColor: BIOME_CONFIG[selectedPaintBiome].color }}
                            title={`Current Color: ${BIOME_CONFIG[selectedPaintBiome].name}`}
                        ></div>
                        <select 
                            className={styles.biomeSelect}
                            value={selectedPaintBiome} 
                            onChange={(e) => setSelectedPaintBiome(e.target.value as BiomeType)}
                        >
                            {Object.entries(BIOME_CONFIG).map(([key, config]) => (
                                <option key={key} value={key}>{config.name}</option>
                            ))}
                        </select>
                        <button className="secondary-button" style={{padding: '4px 8px', fontSize: '0.9rem'}} onClick={() => setInteractionMode('inspect')}>Done</button>
                    </div>
                    <label className="custom-checkbox" style={{marginBottom: 0, fontSize: '0.9rem', marginLeft: 'var(--space-s)'}}>
                        <input type="checkbox" checked={viewSettings.showBiomeColors} onChange={e => updateViewSettings({ showBiomeColors: e.target.checked })} />
                        <span className="checkmark" style={{width:'18px', height:'18px', top:'1px'}}></span>Show Colors
                    </label>
                </div>
            );
        case 'region_draft':
            return (
                <div className={styles.container}>
                    <span className={styles.infoText}>
                        {editingRegionId ? '✏️ Editing Region:' : '🗺️ Region Draft:'} {draftRegionHexes.length} hexes
                    </span>
                    <div className={styles.controls}>
                         <button className="primary-button" style={{padding: '4px 12px', fontSize: '0.9rem'}} onClick={handleFinishRegion} disabled={draftRegionHexes.length === 0}>
                             {editingRegionId ? 'Save Changes' : 'Create Region'}
                         </button>
                         <button 
                            className="secondary-button" 
                            style={{padding: '4px 8px', fontSize: '0.9rem'}} 
                            onClick={() => { 
                                clearDraftHexes(); 
                                setEditingRegionId(null);
                                setInteractionMode('inspect'); 
                            }}
                        >
                             Cancel
                         </button>
                    </div>
                </div>
            );
        case 'location_place':
            return (
                <div className={styles.container}>
                    <span className={styles.infoText}>📍 Place Location: Click any hex on the map.</span>
                    <div className={styles.controls}>
                        <button className="secondary-button" style={{padding: '4px 8px', fontSize: '0.9rem'}} onClick={() => setInteractionMode('inspect')}>Cancel</button>
                    </div>
                </div>
            );
        case 'fog_paint':
            return (
                <div className={styles.container}>
                    <span className={styles.infoText}>☁️ Fog of War:</span>
                    <div className={styles.controls}>
                        <div className={styles.toggleGroup}>
                             <button 
                                className={cx({ 'active': fogToolMode === 'reveal' })} 
                                onClick={() => setFogToolMode('reveal')}
                             >
                                 Reveal
                             </button>
                             <button 
                                className={cx({ 'active': fogToolMode === 'hide' })} 
                                onClick={() => setFogToolMode('hide')}
                             >
                                 Hide
                             </button>
                        </div>
                    </div>
                    <label className="custom-checkbox" style={{marginBottom: 0, fontSize: '0.9rem', marginLeft: 'var(--space-s)'}}>
                        <input type="checkbox" checked={viewSettings.enableFog} onChange={e => updateViewSettings({ enableFog: e.target.checked })} />
                        <span className="checkmark" style={{width:'18px', height:'18px', top:'1px'}}></span>Enable Fog
                    </label>
                    <div className={styles.opacityControl}>
                        <label htmlFor="fog-opacity">Opacity:</label>
                        <input 
                            id="fog-opacity"
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.1" 
                            value={viewSettings.fogOpacity} 
                            onChange={(e) => updateViewSettings({ fogOpacity: parseFloat(e.target.value) })}
                        />
                    </div>
                    <button className="secondary-button" style={{padding: '4px 8px', fontSize: '0.9rem'}} onClick={() => setInteractionMode('inspect')}>Done</button>
                </div>
            );
        case 'inspect':
        default:
            return null;
    }
};