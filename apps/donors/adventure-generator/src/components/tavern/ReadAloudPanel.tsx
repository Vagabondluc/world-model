
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
        background-color: #f4f4f4;
        border: 2px solid var(--medium-brown);
        border-radius: 4px;
        padding: var(--space-m);
        margin-top: var(--space-l);
        font-family: 'Lora', serif;
        font-style: italic;
        color: #2c2c2c;
        position: relative;
        min-height: 150px;
        
        &::before {
            content: '📜 Read Aloud Text';
            display: block;
            font-family: var(--stat-body-font);
            font-weight: bold;
            font-style: normal;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--medium-brown);
            margin-bottom: var(--space-s);
        }
    `,
    text: css`
        white-space: pre-wrap;
        line-height: 1.6;
    `,
    placeholder: css`
        text-align: center;
        color: var(--medium-brown);
        padding: var(--space-xl);
    `,
    loadingContainer: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-xl);
        color: var(--medium-brown);
    `
};

const TONES = ['Neutral', 'Mysterious', 'Grim', 'Epic', 'Whimsical', 'Tense', 'Serene'];
const LENGTHS = ['Short', 'Medium', 'Long'];

export const ReadAloudPanel: FC = () => {
    const { apiService } = useAppContext();
    const { readAloudText, aiLoading, error, generateReadAloudText } = useTavernStore();

    const [context, setContext] = useState('');
    const [length, setLength] = useState('Medium');
    const [tone, setTone] = useState('Neutral');

    const handleGenerate = () => {
        if (apiService && context.trim()) {
            generateReadAloudText(apiService, context, length, tone);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div>
                    <label>Scene Context</label>
                    <textarea
                        rows={4}
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="e.g., A crumbling wizard's tower on a cliffside during a thunderstorm. The party just opened the main door."
                        disabled={aiLoading}
                    />
                </div>
                <div className={styles.grid}>
                    <div>
                        <label>Length</label>
                        <select value={length} onChange={e => setLength(e.target.value)} disabled={aiLoading}>
                            {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Tone</label>
                        <select value={tone} onChange={e => setTone(e.target.value)} disabled={aiLoading}>
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    className="primary-button"
                    onClick={handleGenerate}
                    disabled={aiLoading || !context.trim()}
                >
                    {aiLoading ? <><span className="loader"></span> Writing...</> : '✍️ Generate Description'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className={styles.resultContainer}>
                {aiLoading && !readAloudText && (
                     <div className={styles.loadingContainer}>
                         <span className="loader large" style={{marginBottom: '16px'}}></span> 
                         The muse is gathering inspiration...
                     </div>
                )}
                
                {readAloudText !== null ? (
                    <div className={styles.text}>
                        {readAloudText}
                        {aiLoading && <span className="loader" style={{marginLeft:'8px', verticalAlign: 'middle'}}></span>}
                    </div>
                ) : (
                     !aiLoading && <p className={styles.placeholder}>Your generated description will appear here.</p>
                )}
            </div>
        </div>
    );
};
