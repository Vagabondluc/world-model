import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useTavernStore, TavernPanel } from '../../stores/tavernStore';
import { JobBoardPanel } from './JobBoardPanel';
import { NpcChatPanel } from './NpcChatPanel';
import { OraclePanel } from './OraclePanel';
import { ReadAloudPanel } from './ReadAloudPanel';
import { PortraitStudio } from './PortraitStudio';
import { SceneGenerator } from './SceneGenerator';

const styles = {
    container: css`
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        view-transition-name: spatial-anchor;
        h2 { margin-top: 0; }
    `,
    tabs: css`
        display: flex;
        border-bottom: 2px solid var(--medium-brown);
        margin-bottom: var(--space-l);
        overflow-x: auto;
        flex-shrink: 0;
    `,
    tabButton: css`
        padding: var(--space-m);
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: var(--header-font);
        font-size: 1.1rem;
        color: var(--medium-brown);
        border-bottom: 3px solid transparent;
        white-space: nowrap;
        transition: all 0.2s;

        &:hover {
            color: var(--dark-brown);
            background-color: rgba(0,0,0,0.05);
        }
    `,
    activeTab: css`
        color: var(--dark-brown) !important;
        border-bottom-color: var(--dnd-red) !important;
    `,
    tabContent: css`
        padding: var(--space-l);
        background: var(--card-bg);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        flex: 1;
        overflow-y: auto;
    `
};

const TAVERN_PANELS: { id: TavernPanel, label: string, icon: string }[] = [
    { id: 'job-board', label: 'Job Board', icon: '📌' },
    { id: 'npc-chat', label: 'NPC Chat', icon: '💬' },
    { id: 'oracle', label: 'Oracle', icon: '🔮' },
    { id: 'boxed-text', label: 'Read-Aloud Text', icon: '📜' },
    { id: 'portrait', label: 'Portrait Studio', icon: '🎨' },
    { id: 'scene', label: 'Scene Generator', icon: '🏞️' },
];

interface TavernViewProps {
    onBack?: () => void;
}

export const TavernView: FC<TavernViewProps> = () => {
    const { activePanel, setActivePanel } = useTavernStore();

    const renderPanel = () => {
        switch (activePanel) {
            case 'job-board':
                return <JobBoardPanel />;
            case 'npc-chat':
                return <NpcChatPanel />;
            case 'oracle':
                return <OraclePanel />;
            case 'boxed-text':
                return <ReadAloudPanel />;
            case 'portrait':
                return <PortraitStudio />;
            case 'scene':
                return <SceneGenerator />;
            default:
                return (
                    <>
                        <h3>{TAVERN_PANELS.find(p => p.id === activePanel)?.label}</h3>
                        <p>This panel is under construction. Functionality will be added in a future task.</p>
                    </>
                );
        }
    };

    return (
        <div className={styles.container}>
            <h2>🍻 The Tavern</h2>
            <p style={{ marginBottom: 'var(--space-m)' }}>A central hub for all your narrative generation needs.</p>

            <div className={styles.tabs}>
                {TAVERN_PANELS.map(panel => (
                    <button
                        key={panel.id}
                        className={cx(styles.tabButton, { [styles.activeTab]: activePanel === panel.id })}
                        onClick={() => setActivePanel(panel.id)}
                    >
                        {panel.icon} {panel.label}
                    </button>
                ))}
            </div>

            <div className={styles.tabContent}>
                {renderPanel()}
            </div>
        </div>
    );
}
