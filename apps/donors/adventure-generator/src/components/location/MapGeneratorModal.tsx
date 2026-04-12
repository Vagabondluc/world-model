
import React, { FC, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { Modal } from '../common/Modal';
import { GenerationSettings, GenerationTheme, generateProceduralMapData } from '../../utils/mapGenerationUtils';
import { useLocationStore } from '../../stores/locationStore';
import { renderPreview } from '../../utils/hexGridRenderer';
import { useDebounce } from '../../hooks/useDebounce';

const styles = {
    form: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    row: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
    `,
    control: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        
        label {
            font-size: 0.9rem;
            font-weight: bold;
            color: var(--dark-brown);
        }
        input[type="range"] { width: 100%; }
        select { width: 100%; }
    `,
    valueDisplay: css`
        font-size: 0.85rem;
        color: var(--medium-brown);
        float: right;
    `,
    actions: css`
        display: flex;
        justify-content: flex-end;
        gap: var(--space-m);
        margin-top: var(--space-m);
        padding-top: var(--space-m);
        border-top: var(--border-light);
    `,
    canvasContainer: css`
        width: 100%;
        height: 200px;
        border: 2px solid var(--medium-brown);
        border-radius: var(--border-radius);
        overflow: hidden;
        background: #333;
    `
};

interface MapGeneratorModalProps {
    onGenerate: (settings: GenerationSettings) => void;
    onClose: () => void;
}

const THEMES: { id: GenerationTheme, label: string }[] = [
    { id: 'surface', label: 'Surface (Standard)' },
    { id: 'feywild', label: 'Feywild (Vibrant/Chaotic)' },
    { id: 'shadowfell', label: 'Shadowfell (Gloomy/Desolate)' },
    { id: 'underdark', label: 'Underdark (Cavernous)' },
    { id: 'elemental_fire', label: 'Plane of Fire (Volcanic)' },
];

export const MapGeneratorModal: FC<MapGeneratorModalProps> = ({ onGenerate, onClose }) => {
    const { layers, activeLayerId } = useLocationStore();
    const activeLayer = activeLayerId ? layers[activeLayerId] : null;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [radius, setRadius] = useState(15);
    const [scale, setScale] = useState(10);
    const [waterLevel, setWaterLevel] = useState(-0.2);
    const [moistureOffset, setMoistureOffset] = useState(0);
    const [numRegions, setNumRegions] = useState(5);
    const [locationDensity, setLocationDensity] = useState(1.0);
    const [settlementDensity, setSettlementDensity] = useState(1.0);
    const [seed, setSeed] = useState(Math.random().toString(36).substring(7));
    const [theme, setTheme] = useState<GenerationTheme>('surface');

    // Auto-set theme based on active layer type on mount
    useEffect(() => {
        if (activeLayer) {
            if (activeLayer.type === 'feywild') setTheme('feywild');
            else if (activeLayer.type === 'shadowfell') setTheme('shadowfell');
            else if (activeLayer.type === 'underdark') setTheme('underdark');
            else setTheme('surface');
        }
    }, [activeLayer]);

    const settings = { radius, scale, waterLevel, moistureOffset, seed, numRegions, theme, locationDensity, settlementDensity };
    const debouncedSettings = useDebounce(settings, 300);

    useEffect(() => {
        if (canvasRef.current) {
            // Lightweight generation for preview (no locations/regions needed really, just biomes)
            const { hexBiomes } = generateProceduralMapData(debouncedSettings, 'preview');
            renderPreview(canvasRef.current, hexBiomes, debouncedSettings.radius);
        }
    }, [debouncedSettings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(settings);
    };

    const getDensityLabel = (val: number) => {
        if (val === 0) return 'None';
        if (val < 1) return 'Sparse';
        if (val === 1) return 'Normal';
        if (val < 2) return 'High';
        return 'Crowded';
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Procedural Map Generator">
            <form onSubmit={handleSubmit} className={styles.form}>
                <p style={{ fontSize: '0.9rem', color: 'var(--medium-brown)', margin: 0 }}>
                    Generates biomes and regions for the current layer ({activeLayer?.name || 'Surface'}) using Perlin noise.
                </p>

                <div className={styles.canvasContainer}>
                    <canvas ref={canvasRef} width={600} height={200} style={{ width: '100%', height: '100%' }} />
                </div>

                <div className={styles.row}>
                    <div className={styles.control} style={{ gridColumn: '1 / -1' }}>
                        <label>Generation Style</label>
                        <select value={theme} onChange={e => setTheme(e.target.value as GenerationTheme)}>
                            {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.control}>
                        <label>Map Radius <span className={styles.valueDisplay}>{radius} hexes</span></label>
                        <input type="range" min="5" max="50" value={radius} onChange={e => setRadius(parseInt(e.target.value))} />
                    </div>
                    <div className={styles.control}>
                        <label>Noise Scale <span className={styles.valueDisplay}>{scale}</span></label>
                        <input type="range" min="2" max="30" value={scale} onChange={e => setScale(parseInt(e.target.value))} title="Lower = Choppier, Higher = Larger Continents" />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.control}>
                        <label>Water Level <span className={styles.valueDisplay}>{waterLevel}</span></label>
                        <input type="range" min="-1" max="1" step="0.1" value={waterLevel} onChange={e => setWaterLevel(parseFloat(e.target.value))} />
                    </div>
                    <div className={styles.control}>
                        <label>Global Moisture <span className={styles.valueDisplay}>{moistureOffset}</span></label>
                        <input type="range" min="-1" max="1" step="0.1" value={moistureOffset} onChange={e => setMoistureOffset(parseFloat(e.target.value))} title="Higher = Jungle/Swamp, Lower = Desert" />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.control}>
                        <label>Approx. Regions <span className={styles.valueDisplay}>{numRegions}</span></label>
                        <input type="range" min="1" max="20" value={numRegions} onChange={e => setNumRegions(parseInt(e.target.value))} />
                    </div>
                    <div className={styles.control}>
                        <label>Location Density <span className={styles.valueDisplay}>{getDensityLabel(locationDensity)}</span></label>
                        <input type="range" min="0" max="3" step="0.5" value={locationDensity} onChange={e => setLocationDensity(parseFloat(e.target.value))} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.control}>
                        <label>Civ Level (Hierarchy) <span className={styles.valueDisplay}>{settlementDensity.toFixed(1)}</span></label>
                        <input type="range" min="0" max="2" step="0.1" value={settlementDensity} onChange={e => setSettlementDensity(parseFloat(e.target.value))} title="Controls Capital/City/Village distribution" />
                    </div>
                </div>

                <div className={styles.control}>
                    <label>Seed</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <input type="text" value={seed} onChange={e => setSeed(e.target.value)} style={{ flex: 1 }} />
                        <button type="button" className="secondary-button" style={{ padding: '2px 8px' }} onClick={() => setSeed(Math.random().toString(36).substring(7))}>🎲</button>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
                    <button type="submit" className="primary-button">Generate Map</button>
                </div>
            </form>
        </Modal>
    );
};
