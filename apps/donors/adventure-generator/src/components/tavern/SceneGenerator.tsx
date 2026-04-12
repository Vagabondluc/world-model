
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useTavernStore } from '../../stores/tavernStore';
import { useAppContext } from '../../context/AppContext';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    controls: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    grid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        @media (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    `,
    resultContainer: css`
        background-color: var(--parchment-bg);
        border: 2px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: var(--space-l);
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    image: css`
        max-width: 100%;
        max-height: 500px;
        height: auto;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `,
    placeholder: css`
        text-align: center;
        color: var(--medium-brown);
        font-style: italic;
    `
};

const TIMES_OF_DAY = ["Day", "Night", "Dawn", "Dusk", "Twilight"];
const WEATHERS = ["Clear", "Rainy", "Stormy", "Foggy", "Snowy", "Overcast"];

export const SceneGenerator: FC = () => {
    const { apiService } = useAppContext();
    const { sceneImageUrl, aiLoading, error, generateSceneImage } = useTavernStore();

    const [description, setDescription] = useState('');
    const [time, setTime] = useState(TIMES_OF_DAY[0]);
    const [weather, setWeather] = useState(WEATHERS[0]);

    const handleGenerate = () => {
        if (apiService && description.trim()) {
            generateSceneImage(apiService, description, time, weather);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div>
                    <label>Scene Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., A moss-covered elven ruin in a misty forest..."
                        disabled={aiLoading}
                    />
                </div>
                <div className={styles.grid}>
                    <div>
                        <label>Time of Day</label>
                        <select value={time} onChange={e => setTime(e.target.value)} disabled={aiLoading}>
                            {TIMES_OF_DAY.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Weather</label>
                        <select value={weather} onChange={e => setWeather(e.target.value)} disabled={aiLoading}>
                            {WEATHERS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    className="primary-button"
                    onClick={handleGenerate}
                    disabled={aiLoading || !description.trim()}
                >
                    {aiLoading ? <><span className="loader"></span> Painting...</> : '🏞️ Generate Scene'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className={styles.resultContainer}>
                {aiLoading ? (
                    <div className="loader large"></div>
                ) : sceneImageUrl ? (
                    <img src={sceneImageUrl} alt={description || 'Generated Scene'} className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>
                        <p>Describe a scene and click "Generate" to create an illustration.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
