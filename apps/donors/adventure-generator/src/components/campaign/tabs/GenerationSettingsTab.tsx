import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CampaignConfiguration, CampaignConfigUpdater } from '../../../types/campaign';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
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
    select: css`
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 1rem;
        font-family: var(--body-font);
        background-color: #fff;
        color: var(--dark-brown);
        transition: all 0.2s ease;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233a2d1d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 12px top 50%;
        background-size: 10px auto;
        padding-right: 30px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);

        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
    `,
    description: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        font-style: italic;
        margin-top: 4px;
    `,
};

interface GenerationSettingsTabProps {
    config: CampaignConfiguration;
    onConfigChange: CampaignConfigUpdater;
}

export const GenerationSettingsTab: FC<GenerationSettingsTabProps> = ({ config, onConfigChange }) => (
    <div className={styles.container}>
        <div className={styles.formControl}>
            <label className={styles.label} htmlFor="language">Content Generation Language</label>
            <select 
                id="language" 
                className={styles.select}
                value={config.language} 
                onChange={(e) => onConfigChange('language', e.target.value)}
            >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
            </select>
            <p className={styles.description}>
                Determines the language for all AI-generated content.
            </p>
        </div>
        
        <div className={styles.formControl}>
            <label className={styles.label} htmlFor="genre">Primary Genre Preference</label>
            <select 
                id="genre" 
                className={styles.select}
                value={config.genre} 
                onChange={(e) => onConfigChange('genre', e.target.value)}
            >
                <option value="">None (Default Fantasy)</option>
                <option value="dark-fantasy">Dark Fantasy</option>
                <option value="high-fantasy">High Fantasy</option>
                <option value="horror">Horror</option>
                <option value="mystery">Mystery</option>
            </select>
        </div>
        
        <div className={styles.formControl}>
            <label className={styles.label} htmlFor="tone">Default Tone</label>
            <select 
                id="tone" 
                className={styles.select}
                value={config.tone} 
                onChange={(e) => onConfigChange('tone', e.target.value)}
            >
                <option value="">Neutral</option>
                <option value="serious">Serious & Gritty</option>
                <option value="heroic">Heroic & Epic</option>
                <option value="lighthearted">Lighthearted</option>
            </select>
        </div>

        <div className={styles.formControl}>
            <label className={styles.label}>CR Calculation Method</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)'}}>
                <label className="custom-radio">
                    <input
                        type="radio"
                        name="crMethod"
                        value="dmg"
                        checked={!config.crCalculationMethod || config.crCalculationMethod === 'dmg'}
                        onChange={(e) => onConfigChange('crCalculationMethod', e.target.value === 'alternate' ? 'alternate' : 'dmg')}
                    />
                    <span className="radio-checkmark"></span>
                    <div>
                        <strong style={{fontSize: '1rem'}}>DMG Standard</strong>
                        <div style={{fontSize: '0.9rem', color: 'var(--medium-brown)'}}>The official calculation method from the Dungeon Master's Guide.</div>
                    </div>
                </label>
                <label className="custom-radio">
                    <input
                        type="radio"
                        name="crMethod"
                        value="alternate"
                        checked={config.crCalculationMethod === 'alternate'}
                        onChange={(e) => onConfigChange('crCalculationMethod', e.target.value === 'alternate' ? 'alternate' : 'dmg')}
                    />
                    <span className="radio-checkmark"></span>
                    <div>
                        <strong style={{fontSize: '1rem'}}>Alternate Method</strong>
                        <div style={{fontSize: '0.9rem', color: 'var(--medium-brown)'}}>An experimental method with more granular adjustments for special monster features.</div>
                    </div>
                </label>
            </div>
             <p className={styles.description}>
                Choose the method for calculating a monster's final Challenge Rating in the Monster Creator.
            </p>
        </div>
    </div>
);
