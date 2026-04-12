
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { NavItem } from './NavItem';
import { ActiveView, DrawerType } from '../../stores/campaignStore';

const styles = {
    nav: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        flex-grow: 1;
    `,
};

interface SidebarNavProps {
    activeView: ActiveView;
    onNavigate: (view: ActiveView | DrawerType, isDrawer: boolean) => void;
}

export const SidebarNav: FC<SidebarNavProps> = ({ activeView, onNavigate }) => {
    return (
        <nav className={styles.nav}>
            <NavItem view="adventure" icon="⚔️" label="Adventure" isActive={activeView === 'adventure'} onClick={onNavigate} />
        </nav>
    );
};
