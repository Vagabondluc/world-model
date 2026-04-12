
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CampaignConfiguration, CampaignConfigUpdater } from '../../../types/campaign';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    infoSection: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        h3 { 
            font-size: 1.1rem; 
            margin: 0; 
            color: var(--dnd-red); 
            font-family: var(--header-font);
            border-bottom: 1px solid var(--light-brown);
            padding-bottom: 4px;
        }
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 6px;
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    description: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        font-style: italic;
        margin-bottom: 4px;
    `,
    input: css`
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 1rem;
        font-family: var(--body-font);
        background-color: #fff;
        color: var(--dark-brown);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        transition: all 0.2s ease;

        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
        &::placeholder {
            color: #999;
            font-style: italic;
        }
    `,
    textarea: css`
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 1rem;
        font-family: var(--body-font);
        background-color: #fff;
        color: var(--dark-brown);
        resize: vertical;
        min-height: 100px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        transition: all 0.2s ease;

        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
        &::placeholder {
            color: #999;
            font-style: italic;
        }
    `
};

interface CampaignInfoTabProps {
    config: CampaignConfiguration;
    onConfigChange: CampaignConfigUpdater;
}

export const CampaignInfoTab: FC<CampaignInfoTabProps> = ({ config, onConfigChange }) => (
    <div className={styles.container}>
        <div className={styles.formControl}>
            <label className={styles.label} htmlFor="worldName">Campaign/World Name</label>
            <input
                id="worldName"
                type="text"
                className={styles.input}
                value={config.worldName || ''}
                onChange={(e) => onConfigChange('worldName', e.target.value)}
                placeholder="e.g., The Ashen Concord"
            />
        </div>
        
        <div className={styles.infoSection}>
            <h3>🌍 World & Setting Information</h3>
            <div className={styles.formControl}>
                <div className={styles.description}>Used when generating locations and establishing context.</div>
                <textarea 
                    className={styles.textarea}
                    placeholder="Describe your campaign world..." 
                    value={config.worldInformation} 
                    onChange={(e) => onConfigChange('worldInformation', e.target.value)} 
                    rows={4} 
                />
            </div>
        </div>

        <div className={styles.infoSection}>
            <h3>👥 Player Character Information</h3>
            <div className={styles.formControl}>
                <div className={styles.description}>Used for creating hooks and tailoring encounters.</div>
                <textarea 
                    className={styles.textarea}
                    placeholder="Describe the player characters..." 
                    value={config.playerInformation} 
                    onChange={(e) => onConfigChange('playerInformation', e.target.value)} 
                    rows={4} 
                />
            </div>
        </div>

        <div className={styles.infoSection}>
            <h3>🎭 Existing NPC Information</h3>
            <div className={styles.formControl}>
                <div className={styles.description}>Referenced to ensure consistency with established characters.</div>
                <textarea 
                    className={styles.textarea}
                    placeholder="List important NPCs in your campaign..." 
                    value={config.npcInformation} 
                    onChange={(e) => onConfigChange('npcInformation', e.target.value)} 
                    rows={4} 
                />
            </div>
        </div>
    </div>
);
