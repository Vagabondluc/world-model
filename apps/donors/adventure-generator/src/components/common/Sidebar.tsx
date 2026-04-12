import React, { FC, useCallback } from 'react';
import { css } from '@emotion/css';
import { useCampaignStore, ActiveView, DrawerType } from '../../stores/campaignStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import { useViewTransition } from '../../hooks/useViewTransition';

const sidebarTextureUrl = new URL('../../assets/textures/sidebar-texture.png', import.meta.url).toString();

// --- CSS-in-JS Styles ---
const styles = {
    sidebar: css`
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        padding: var(--space-l);
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
        position: relative;
        isolation: isolate;
        z-index: 10;
        overflow-y: auto;
        min-width: 280px;
        height: 100vh;
        border-right: 2px solid var(--medium-brown);

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${sidebarTextureUrl}');
            opacity: 0.2;
            z-index: -1;
            pointer-events: none;
            filter: invert(1);
        }

        @media (max-width: 900px) {
            width: 100%;
            height: auto;
            max-height: none;
            overflow-y: visible;
            border-right: none;
            border-bottom: 2px solid var(--medium-brown);
        }
    `,
};

export const Sidebar: FC = () => {
    const { activeView, activeDrawer, openDrawer, config } = useCampaignStore(s => ({
        activeView: s.activeView,
        activeDrawer: s.activeDrawer,
        openDrawer: s.openDrawer,
        config: s.config
    }));

    const { pushView } = useNavigationStore();
    const viewTransition = useViewTransition();

    const handleNavigate = useCallback((view: ActiveView | DrawerType, isDrawer: boolean) => {
        viewTransition(() => {
            if (isDrawer) {
                openDrawer(view as DrawerType);
            } else {
                pushView(view as ActiveView);
            }
        });
    }, [openDrawer, pushView, viewTransition]);

    return (
        <aside className={styles.sidebar}>
            <SidebarHeader config={config} />
            <SidebarNav
                activeView={activeView}
                onNavigate={handleNavigate}
            />
            <SidebarFooter
                activeDrawer={activeDrawer}
                onNavigate={handleNavigate}
            />
        </aside>
    );
};
