
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { CampaignConfiguration, CampaignConfigUpdater } from '../../../types/campaign';

type ThemeOption = 'parchment' | 'dark' | 'high-contrast';

const THEME_DATA: Record<ThemeOption, { name: string, colors: string[] }> = {
    parchment: { name: 'Parchment', colors: ['#f5e8c3', '#faf0d7', '#3a2d1d', '#6f4e37', '#922610'] },
    dark: { name: 'Dark Mode', colors: ['#1e1e1e', '#2a2a2a', '#e0e0e0', '#a0a0a0', '#d9573a'] },
    'high-contrast': { name: 'High Contrast', colors: ['#ffffff', '#f5f5f5', '#000000', '#222222', '#c00000'] }
};

const styles = {
    description: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        margin-bottom: var(--space-s);
        font-style: italic;
    `,
    themeSelector: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--space-m);
        margin-top: var(--space-l);
    `,
    themePreview: css`
        border: 2px solid var(--light-brown);
        border-radius: var(--border-radius);
        cursor: pointer;
        padding: var(--space-m);
        text-align: center;
        transition: all 0.2s ease-in-out;
        background-color: var(--parchment-bg);

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h4 { margin: 0; font-size: 1rem; }
    `,
    themeSelected: css`
        border-color: var(--dnd-red);
        box-shadow: 0 0 0 2px var(--card-bg), 0 0 0 4px var(--dnd-red);
    `,
    themeColors: css`
        display: flex;
        justify-content: center;
        gap: 2px;
        height: 30px;
        margin-bottom: var(--space-s);
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.1);
    `,
    colorSwatch: css`
        flex: 1;
        height: 100%;
    `,
};


interface ThemeTabProps {
    config: CampaignConfiguration;
    onConfigChange: CampaignConfigUpdater;
}

export const ThemeTab: FC<ThemeTabProps> = ({ config, onConfigChange }) => (
    <div>
        <p className={styles.description}>Choose a visual theme for the application interface.</p>
        <div className={styles.themeSelector}>
            {(Object.keys(THEME_DATA) as ThemeOption[]).map(themeKey => (
                <div
                    key={themeKey}
                    className={cx(styles.themePreview, { [styles.themeSelected]: config.theme === themeKey })}
                    onClick={() => onConfigChange('theme', themeKey)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onConfigChange('theme', themeKey)}
                >
                    <div className={styles.themeColors}>
                        {THEME_DATA[themeKey].colors.map((color, i) => (
                            <div key={i} className={styles.colorSwatch} style={{ backgroundColor: color }}></div>
                        ))}
                    </div>
                    <h4>{THEME_DATA[themeKey].name}</h4>
                </div>
            ))}
        </div>
    </div>
);
