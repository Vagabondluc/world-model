
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useAppContext } from '../../context/AppContext';
import { useCampaignStore } from '../../stores/campaignStore';

interface ReadAloudBlockProps {
    context: string;
    title?: string;
}

const styles = {
    container: css`
        background-color: #f4f4f4;
        border: 2px solid var(--medium-brown);
        border-radius: 4px;
        padding: var(--space-m);
        margin: var(--space-m) 0;
        font-family: 'Lora', serif;
        font-style: italic;
        color: #2c2c2c;
        position: relative;
        min-height: 80px;
        
        &::before {
            content: '👁️ Read Aloud';
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
    emptyState: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: var(--space-s);
    `,
    text: css`
        white-space: pre-wrap;
        line-height: 1.6;
    `,
    actions: css`
        margin-top: var(--space-s);
        display: flex;
        justify-content: flex-end;
    `
};

export const ReadAloudBlock: FC<ReadAloudBlockProps> = ({ context, title }) => {
    const { apiService } = useAppContext();
    const { config } = useCampaignStore();
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!apiService) return;
        setLoading(true);
        try {
            const prompt = `Write a short, immersive "read-aloud" boxed text description (3-5 sentences) for a D&D session.
            Focus on sensory details (sight, sound, smell).
            Subject: ${title || 'Scene'}
            Context: ${context}`;
            
            const result = await apiService.generateTextContent(prompt, config.aiModel || 'gemini-2.5-flash');
            setText(result);
        } catch (e) {
            console.error(e);
            setText("Failed to conjure the scene.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {loading ? (
                 <div className={styles.emptyState}><div className="loader"></div></div>
            ) : text ? (
                <>
                    <div className={styles.text}>{text}</div>
                    <div className={styles.actions}>
                        <button className="secondary-button" style={{fontSize: '0.8rem', padding: '2px 8px'}} onClick={handleGenerate}>↻ Regenerate</button>
                    </div>
                </>
            ) : (
                <div className={styles.emptyState}>
                    <span>No description generated yet.</span>
                    <button className="action-button" style={{fontSize: '0.9rem', padding: '4px 12px'}} onClick={handleGenerate}>Generate Description</button>
                </div>
            )}
        </div>
    );
};
