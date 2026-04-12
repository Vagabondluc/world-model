
import React, { FC, useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useAppContext } from '../../context/AppContext';
import { useCampaignStore } from '../../stores/campaignStore';
import { CONFIG } from '../../data/constants';
import { Modal } from '../common/Modal';
import { z } from 'zod';

interface OracleOverlayProps {
    context: string;
    title?: string;
    onClose: () => void;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        min-height: 200px;
    `,
    predictionCard: css`
        background: var(--parchment-bg);
        border: 1px solid var(--medium-brown);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        animation: fadeIn 0.3s ease-out;

        strong { color: var(--dnd-red); display: block; margin-bottom: 4px; }
    `,
    loading: css`
        text-align: center;
        color: var(--medium-brown);
        font-style: italic;
        padding: var(--space-xl);
    `
};

const PredictionSchema = z.array(z.object({
    outcome: z.string(),
    likelihood: z.string(),
    consequence: z.string()
}));

export const OracleOverlay: FC<OracleOverlayProps> = ({ context, title, onClose }) => {
    const { apiService } = useAppContext();
    const { config } = useCampaignStore();
    const [predictions, setPredictions] = useState<z.infer<typeof PredictionSchema> | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            if (!apiService) return;
            try {
                const prompt = `Based on the following scene context, predict 3 likely immediate outcomes or consequences if the players take action (or inaction).
                
Context: ${context}

Return an array of 3 objects with:
- outcome: A brief title of the event.
- likelihood: Low, Medium, or High.
- consequence: A short description of what happens.`;

                const result = await apiService.generateStructuredContent(
                    prompt,
                    PredictionSchema,
                    config.aiModel || CONFIG.AI_MODEL
                );
                setPredictions(result);
            } catch (err) {
                console.error("Oracle error:", err);
                setError("The mists are too thick to see the future clearly right now.");
            }
        };

        fetchPredictions();
    }, [apiService, config.aiModel, context]);

    return (
        <Modal isOpen={true} onClose={onClose} title={title || "Oracle's Vision"}>
            <div className={styles.container}>
                {error && <div className="error-message">{error}</div>}
                
                {!predictions && !error && (
                    <div className={styles.loading}>
                        Gazing into the threads of fate...
                    </div>
                )}

                {predictions && predictions.map((pred, i) => (
                    <div key={i} className={styles.predictionCard}>
                        <strong>{pred.outcome} ({pred.likelihood})</strong>
                        <p style={{margin: 0, fontSize: '0.95rem'}}>{pred.consequence}</p>
                    </div>
                ))}
                
                {predictions && (
                    <div style={{textAlign: 'right', marginTop: 'var(--space-s)'}}>
                        <button className="secondary-button" onClick={onClose}>Close Vision</button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
