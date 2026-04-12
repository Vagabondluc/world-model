
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
    inputSection: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    resultsGrid: css`
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-l);
        animation: fadeIn 0.5s ease-out;

        @media (min-width: 900px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `,
    outcomeCard: css`
        background-color: var(--parchment-bg);
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        
        h4 {
            margin: 0;
            color: var(--dnd-red);
            font-family: var(--header-font);
            font-size: 1.2rem;
            border-bottom: 1px dashed var(--light-brown);
            padding-bottom: var(--space-s);
        }
    `,
    sectionTitle: css`
        font-weight: bold;
        font-size: 0.85rem;
        text-transform: uppercase;
        color: var(--medium-brown);
        margin-top: var(--space-s);
        margin-bottom: 4px;
    `,
    list: css`
        margin: 0;
        padding-left: var(--space-l);
        font-size: 0.9rem;
        li { margin-bottom: 2px; }
    `,
    loadingState: css`
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        font-style: italic;
    `
};

export const OraclePanel: FC = () => {
    const { apiService } = useAppContext();
    const { oracleOutcomes, aiLoading, error, generateOraclePrediction } = useTavernStore();
    const [situation, setSituation] = useState('');

    const handleConsult = () => {
        if (apiService && situation.trim()) {
            generateOraclePrediction(apiService, situation);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputSection}>
                <label>What is the situation? (e.g., "The players try to intimidate the guard captain")</label>
                <textarea
                    rows={3}
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Describe the player's action or a pivotal moment..."
                    disabled={aiLoading}
                />
                <button
                    className="primary-button"
                    onClick={handleConsult}
                    disabled={aiLoading || !situation.trim()}
                >
                    {aiLoading ? <><span className="loader"></span> Gazing into the future...</> : '🔮 Consult the Oracle'}
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            {aiLoading && !oracleOutcomes && (
                <div className={styles.loadingState}><span className="loader large" style={{margin: '0 auto 20px', display: 'block'}}></span> The oracle ponders your query...</div>
            )}
            
            {oracleOutcomes && (
                <div className={styles.resultsGrid}>
                    {oracleOutcomes.map((outcome, idx) => (
                        <div key={idx} className={styles.outcomeCard}>
                            <h4>{outcome.title}</h4>
                            <div>
                                <div className={styles.sectionTitle}>Result</div>
                                <p style={{margin: 0, fontSize: '0.9rem'}}>{outcome.result}</p>
                            </div>
                            <div>
                                <div className={styles.sectionTitle}>Consequences</div>
                                <ul className={styles.list}>
                                    {outcome.consequences.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
