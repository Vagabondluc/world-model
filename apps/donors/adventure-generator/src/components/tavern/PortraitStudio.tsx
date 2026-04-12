
import React, { FC, useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { useTavernStore } from '../../stores/tavernStore';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { useAppContext } from '../../context/AppContext';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    controls: css`
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--space-m);
        align-items: end;

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

const ART_STYLES = ["Realistic Fantasy", "Oil Painting", "Illustrated", "Watercolor", "Anime", "Gritty Charcoal"];

export const PortraitStudio: FC = () => {
    const { apiService } = useAppContext();
    const { activeNpcId, setActiveNpcId, portraitUrl, aiLoading, error, generateNpcPortrait } = useTavernStore();
    const npcs = useCompendiumStore(s => s.compendiumEntries.filter(e => e.category === 'npc'));
    const [style, setStyle] = useState(ART_STYLES[0]);

    const activeNpc = useMemo(() => npcs.find(n => n.id === activeNpcId), [npcs, activeNpcId]);

    const handleGenerate = () => {
        if (apiService && activeNpcId) {
            generateNpcPortrait(apiService, style);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className="form-group" style={{marginBottom: 0}}>
                    <label>Select NPC</label>
                    <select value={activeNpcId || ''} onChange={e => setActiveNpcId(e.target.value || null)}>
                        <option value="">-- Choose an NPC --</option>
                        {npcs.map(npc => (
                            <option key={npc.id} value={npc.id}>{npc.title}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                    <label>Art Style</label>
                    <select value={style} onChange={e => setStyle(e.target.value)}>
                        {ART_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
             <button
                className="primary-button"
                onClick={handleGenerate}
                disabled={aiLoading || !activeNpcId}
            >
                {aiLoading ? <><span className="loader"></span> Painting...</> : '🎨 Generate Portrait'}
            </button>

            {error && <div className="error-message">{error}</div>}

            <div className={styles.resultContainer}>
                {aiLoading ? (
                    <div className="loader large"></div>
                ) : portraitUrl ? (
                    <img src={portraitUrl} alt={activeNpc?.title || 'Generated Portrait'} className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>
                        <p>Select an NPC and click "Generate" to create their portrait.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
