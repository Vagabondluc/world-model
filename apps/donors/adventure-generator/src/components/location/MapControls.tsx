
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { ViewSettings } from '../../types/location';

const styles = {
    mapControls: css`
        padding: var(--space-s) var(--space-m);
        background-color: var(--card-bg);
        border-top: var(--border-light);
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-m);
        align-items: center;
        justify-content: space-between;
        font-family: var(--stat-body-font);
        font-size: 0.9rem;
        z-index: 5;
    `,
    bgControls: css`
        display: flex;
        gap: var(--space-s);
        align-items: center;
        flex: 1;
        min-width: 200px;
        justify-content: flex-end;
        
        input[type="text"] { flex: 0 1 150px; margin-bottom: 0; padding: 2px 6px; font-size: 0.85rem; }
        select { margin-bottom: 0; padding: 2px 6px; font-size: 0.85rem; }
        input[type="range"] { width: 60px; }
    `,
};

interface MapControlsProps {
    viewSettings: ViewSettings;
    onUpdateView: (settings: Partial<ViewSettings>) => void;
    onBgChange: (prop: 'url' | 'scale' | 'opacity', value: string | number) => void;
}

export const MapControls: FC<MapControlsProps> = ({ viewSettings, onUpdateView, onBgChange }) => {
    return (
        <div className={styles.mapControls}>
            <div style={{display: 'flex', gap: 'var(--space-m)', alignItems: 'center'}}>
                <label className="custom-checkbox" style={{marginBottom:0}}><input type="checkbox" checked={viewSettings.showHexGrid} onChange={e => onUpdateView({ showHexGrid: e.target.checked })} /><span className="checkmark" style={{top:'1px'}}></span>Grid</label>
                <label className="custom-checkbox" style={{marginBottom:0}}><input type="checkbox" checked={viewSettings.showRegionBorders} onChange={e => onUpdateView({ showRegionBorders: e.target.checked })} /><span className="checkmark" style={{top:'1px'}}></span>Regions</label>
                <label className="custom-checkbox" style={{marginBottom:0}}><input type="checkbox" checked={viewSettings.ghostModeEnabled ?? true} onChange={e => onUpdateView({ ghostModeEnabled: e.target.checked })} /><span className="checkmark" style={{top:'1px'}}></span>Ghost Surface</label>
            </div>
            <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                 <button className="secondary-button" style={{padding: '2px 8px', fontSize: '0.8rem'}} onClick={() => onUpdateView({ zoomLevel: Math.max(0.1, viewSettings.zoomLevel - 0.1) })}>-</button>
                 <span style={{fontSize: '0.9rem'}}>{(viewSettings.zoomLevel * 100).toFixed(0)}%</span>
                 <button className="secondary-button" style={{padding: '2px 8px', fontSize: '0.8rem'}} onClick={() => onUpdateView({ zoomLevel: Math.min(5, viewSettings.zoomLevel + 0.1) })}>+</button>
            </div>
            <div className={styles.bgControls}>
                <input type="text" placeholder="Bg Image URL..." value={viewSettings.backgroundImage?.url || ''} onChange={(e) => onBgChange('url', e.target.value)} />
                {viewSettings.backgroundImage && (
                    <>
                        <select value={viewSettings.backgroundImage.scale} onChange={(e) => onBgChange('scale', e.target.value)}>
                            <option value="cover">Cover</option><option value="fit">Fit</option><option value="none">None</option>
                        </select>
                        <input type="range" min="0.1" max="1" step="0.1" value={viewSettings.backgroundImage.opacity} onChange={(e) => onBgChange('opacity', parseFloat(e.target.value))} title="Opacity" />
                    </>
                )}
            </div>
        </div>
    );
};
