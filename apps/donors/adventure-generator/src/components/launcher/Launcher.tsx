
import React, { FC, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { FileSystemStore } from '../../services/fileSystemStore';
import { useCampaignStore } from '../../stores/campaignStore';

interface LauncherProps {
    onLaunch: () => void;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: var(--bg-dark);
        color: var(--text-light);
        padding: var(--space-xl);
    `,
    title: css`
        font-family: var(--header-font);
        font-size: 3rem;
        margin-bottom: var(--space-l);
        color: var(--dnd-red);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `,
    card: css`
        background: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    buttonGroup: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    recentList: css`
        margin-top: var(--space-l);
        border-top: 1px solid var(--border-light);
        padding-top: var(--space-m);
    `,
    recentItem: css`
        padding: var(--space-s);
        cursor: pointer;
        border-radius: 4px;
        &:hover {
            background-color: rgba(255,255,255,0.05);
        }
        color: var(--medium-brown);
        font-size: 0.9rem;
    `
};

import { OnboardingWizard } from './OnboardingWizard';

export const Launcher: FC<LauncherProps> = ({ onLaunch }) => {
    const setRootPath = useCampaignStore(s => s.setRootPath);
    const [recentPaths, setRecentPaths] = useState<string[]>([]);
    const [showWizard, setShowWizard] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('recentCampaigns');
        if (stored) {
            try {
                setRecentPaths(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent campaigns", e);
            }
        }
    }, []);

    const addToRecents = (path: string) => {
        const updated = [path, ...recentPaths.filter(p => p !== path)].slice(0, 5);
        setRecentPaths(updated);
        localStorage.setItem('recentCampaigns', JSON.stringify(updated));
    };

    const handleOpen = async () => {
        try {
            const path = await FileSystemStore.openCampaignDialog();
            if (path) {
                // Initialize if needed (simple check if campaign.json exists inside loadConfig logic?)
                // Actually, open just sets the root, the generic app loader will handle hydration
                setRootPath(path);
                addToRecents(path);
                onLaunch();
            }
        } catch (e) {
            console.error("Failed to open campaign", e);
            alert("Failed to open folder. Please check permissions.");
        }
    };

    const handleOpenRecent = (path: string) => {
        setRootPath(path);
        onLaunch();
    };

    const handleNew = () => {
        setShowWizard(true);
    };

    const handleWizardComplete = (path: string) => {
        setShowWizard(false);
        setRootPath(path);
        addToRecents(path);
        onLaunch();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Adventure Generator</h1>
            <div className={styles.card}>
                <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--medium-brown)' }}>
                    Select a campaign folder to begin. Durable state will be stored in the canonical world-model bundle.
                </p>
                <div className={styles.buttonGroup}>
                    <button className="primary-button" onClick={handleNew} style={{ padding: '1rem' }}>
                        ✨ Create New Campaign
                    </button>
                    <button className="secondary-button" onClick={handleOpen} style={{ padding: '1rem' }}>
                        📂 Open Existing Campaign
                    </button>
                </div>

                {recentPaths.length > 0 && (
                    <div className={styles.recentList}>
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>Recent Campaigns</h4>
                        {recentPaths.map(path => (
                            <div key={path} className={styles.recentItem} onClick={() => handleOpenRecent(path)}>
                                {path}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showWizard && (
                <OnboardingWizard
                    onComplete={handleWizardComplete}
                    onCancel={() => setShowWizard(false)}
                />
            )}
        </div>
    );
};
