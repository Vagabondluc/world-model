import React, { useState, FC, ReactNode } from 'react';
import { css, cx } from '@emotion/css';
import { useUserStore, UserRole } from '../../stores/userStore';
import { theme } from '../../styles/theme';
import { NarrativeCard } from '../narrative-kit/NarrativeCard';

// Tab definition type
interface TabDefinition {
    id: string;
    label: string;
    icon: string;
    minRole?: UserRole; // Minimum role required to see this tab
}

const TABS: TabDefinition[] = [
    { id: 'campaign', label: 'Campaign Info', icon: '🏰' },
    { id: 'generation', label: 'Generation', icon: '⚙️' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'ai', label: 'AI Provider', icon: '🤖', minRole: 'Designer' },
    { id: 'data', label: 'Data Sources', icon: '📚' },
    { id: 'rag', label: 'Knowledge Base', icon: '🧠', minRole: 'Designer' },
    { id: 'session', label: 'Session', icon: '💾' },
    { id: 'system', label: 'System', icon: '🛠️', minRole: 'Admin' },
];

const ROLE_LEVELS: Record<UserRole, number> = {
    'GM': 0,
    'Designer': 1,
    'Admin': 2,
};

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: ${theme.colors.bg};
        color: ${theme.colors.text};
    `,
    header: css`
        padding: ${theme.spacing.l};
        padding-bottom: ${theme.spacing.m};
        border-bottom: ${theme.borders.light};
        flex-shrink: 0;
    `,
    title: css`
        font-family: ${theme.fonts.header};
        font-size: 1.75rem;
        color: ${theme.colors.accent};
        margin: 0 0 ${theme.spacing.xs} 0;
    `,
    subtitle: css`
        font-size: 0.9rem;
        color: ${theme.colors.textMuted};
        margin: 0;
    `,
    roleSelector: css`
        display: flex;
        gap: 8px;
        padding: 4px;
        background: ${theme.colors.card};
        border: ${theme.borders.light};
        border-radius: ${theme.borders.radius};
        width: fit-content;
    `,
    roleButton: css`
        padding: 6px 14px;
        border: none;
        border-radius: ${theme.borders.radius};
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        background: transparent;
        color: ${theme.colors.textMuted};
        font-family: ${theme.fonts.body};

        &:hover {
            color: ${theme.colors.text};
            background: ${theme.colors.bg};
        }
    `,
    roleButtonActive: css`
        background: ${theme.colors.accent} !important;
        color: white !important;
    `,
    headerRow: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: ${theme.spacing.l};
    `,
    tabBar: css`
        display: flex;
        gap: 4px;
        padding: 0 ${theme.spacing.l};
        background: ${theme.colors.card};
        border-bottom: ${theme.borders.light};
        overflow-x: auto;
        flex-shrink: 0;

        &::-webkit-scrollbar {
            height: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background: ${theme.colors.textLight};
            border-radius: 2px;
        }
    `,
    tab: css`
        padding: 12px 18px;
        border: none;
        background: transparent;
        color: ${theme.colors.textMuted};
        font-size: 0.9rem;
        font-weight: 500;
        font-family: ${theme.fonts.body};
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
        margin-bottom: -1px;

        &:hover {
            color: ${theme.colors.text};
            background: ${theme.colors.bg};
        }
    `,
    tabActive: css`
        color: ${theme.colors.accent} !important;
        border-bottom-color: ${theme.colors.accent} !important;
        font-weight: 700;
    `,
    tabIcon: css`
        font-size: 1.1rem;
    `,
    content: css`
        flex: 1;
        overflow-y: auto;
        padding: ${theme.spacing.l};

        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: ${theme.colors.bg};
        }
        &::-webkit-scrollbar-thumb {
            background: ${theme.colors.textLight};
            border-radius: 4px;
        }
    `,
    contentPanel: css`
        max-width: 900px;
        animation: fadeIn 0.2s ease-out;

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `,
};

export type SettingsTab = 'campaign' | 'generation' | 'theme' | 'ai' | 'data' | 'rag' | 'session' | 'system';

interface SettingsLayoutProps {
    children: (activeTab: SettingsTab) => ReactNode;
}

export const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('campaign');
    const { userRole, setUserRole } = useUserStore();

    const userRoleLevel = ROLE_LEVELS[userRole];

    const visibleTabs = TABS.filter(tab => {
        if (!tab.minRole) return true;
        return userRoleLevel >= ROLE_LEVELS[tab.minRole];
    });

    // If current tab becomes hidden due to role change, reset to first visible
    React.useEffect(() => {
        const currentTabVisible = visibleTabs.some(t => t.id === activeTab);
        if (!currentTabVisible && visibleTabs.length > 0) {
            setActiveTab(visibleTabs[0].id as SettingsTab);
        }
    }, [userRole, activeTab, visibleTabs]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div>
                        <h1 className={styles.title}>Settings</h1>
                        <p className={styles.subtitle}>Configure your campaign, AI, and application preferences.</p>
                    </div>
                    <div className={styles.roleSelector}>
                        {(['GM', 'Designer', 'Admin'] as const).map(role => (
                            <button
                                key={role}
                                className={cx(styles.roleButton, userRole === role && styles.roleButtonActive)}
                                onClick={() => setUserRole(role)}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.tabBar}>
                {visibleTabs.map(tab => (
                    <button
                        key={tab.id}
                        className={cx(styles.tab, activeTab === tab.id && styles.tabActive)}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                    >
                        <span className={styles.tabIcon}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                <NarrativeCard variant="parchment" className={styles.contentPanel}>
                    {children(activeTab)}
                </NarrativeCard>
            </div>
        </div>
    );
};
