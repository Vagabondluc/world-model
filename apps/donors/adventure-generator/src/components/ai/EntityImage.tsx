
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useAppContext } from '../../context/AppContext';

interface EntityImageProps {
    entityName: string;
    description: string;
    type: 'npc' | 'location';
    initialImageUrl?: string;
    onImageGenerated?: (imageUrl: string) => void;
}

const styles = {
    container: css`
        margin-bottom: var(--space-m);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        padding: var(--space-m);
        border: 1px solid var(--border-light);
    `,
    imageFrame: css`
        width: 100%;
        max-width: 400px;
        min-height: 200px;
        border: 4px solid var(--medium-brown);
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--parchment-bg);
        margin-bottom: var(--space-s);
        position: relative;
        
        img {
            width: 100%;
            height: auto;
            display: block;
        }
    `,
    placeholder: css`
        color: var(--medium-brown);
        font-style: italic;
        padding: var(--space-m);
        text-align: center;
    `,
    actions: css`
        display: flex;
        gap: var(--space-s);
    `,
    error: css`
        color: var(--error-red);
        font-size: 0.9rem;
        margin-bottom: var(--space-s);
        text-align: center;
    `
};

export const EntityImage: FC<EntityImageProps> = ({ entityName, description, type, initialImageUrl, onImageGenerated }) => {
    const { apiService } = useAppContext();
    const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!apiService) return;
        setLoading(true);
        setError(null);

        try {
            const prompt = `Fantasy ${type === 'npc' ? 'portrait' : 'landscape painting'} of ${entityName}: ${description}`;
            const result = await apiService.generateImage(prompt);
            
            if (result) {
                setImageUrl(result);
                if (onImageGenerated) onImageGenerated(result);
            } else {
                setError("Failed to generate image.");
            }
        } catch (err) {
            console.error(err);
            setError("Error connecting to image service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageFrame}>
                {loading ? (
                    <div className="loader"></div>
                ) : imageUrl ? (
                    <img src={imageUrl} alt={entityName} />
                ) : (
                    <div className={styles.placeholder}>
                        {type === 'npc' ? '👤 No Portrait' : '🖼️ No Scene Image'}
                    </div>
                )}
            </div>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.actions}>
                <button 
                    className="secondary-button" 
                    onClick={handleGenerate} 
                    disabled={loading}
                    style={{fontSize: '0.9rem', padding: '6px 12px'}}
                >
                    {imageUrl ? '🎨 Regenerate Art' : '🎨 Generate Art'}
                </button>
            </div>
        </div>
    );
};
